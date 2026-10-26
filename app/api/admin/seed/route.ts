import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { AdminError, SCHEMA_MISSING_MESSAGE, errorResponse, isMissingTable, logAudit, requireAdmin } from "@/lib/adminAuth";
import { aboutToRows, bankAccountToRow, projectToRow, regionToRow, sectorToRow } from "@/lib/contentMappers";
import { translations } from "@/data/translations";
import { aboutData } from "@/data/about";
import { sectorsData } from "@/data/sectors";
import { regionsData } from "@/data/regions";
import { initialProjects } from "@/data/projects";
import { bankAccountsData } from "@/data/bankAccounts";
import { defaultSiteSettings } from "@/data/siteSettings";
import { defaultHomeContent } from "@/data/homeContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

interface SeedTable {
  table: string;
  pk: string;
  rows: Row[];
}

function seedTables(): SeedTable[] {
  return [
    { table: "translations", pk: "id", rows: [{ id: "main", ar: translations.ar, tr: translations.tr, en: translations.en }] },
    { table: "organization_info", pk: "key", rows: aboutToRows(aboutData) },
    { table: "sectors", pk: "id", rows: sectorsData.map((s, i) => sectorToRow(s, i + 1)) },
    { table: "regions", pk: "id", rows: regionsData.map((r, i) => regionToRow(r, i + 1)) },
    { table: "projects", pk: "id", rows: initialProjects.map((p, i) => projectToRow({ ...p, sortOrder: i + 1 })) },
    { table: "bank_accounts", pk: "id", rows: bankAccountsData.map((b, i) => bankAccountToRow(b, i + 1)) },
    {
      table: "site_settings",
      pk: "key",
      rows: [
        { key: "general", data: defaultSiteSettings },
        { key: "home", data: defaultHomeContent },
      ],
    },
  ];
}

/**
 * POST { overwrite?: boolean } -> fills the tables from the data/*.ts defaults.
 * Without overwrite, rows that already exist are left untouched.
 */
export async function POST(request: Request) {
  try {
    const actor = await requireAdmin(request, "admin");
    const body = (await request.json().catch(() => ({}))) as { overwrite?: unknown };
    const overwrite = body.overwrite === true;

    const result: Record<string, { written: number; skipped: number }> = {};

    for (const seed of seedTables()) {
      let rows = seed.rows;
      if (!overwrite) {
        const { data, error } = await supabaseAdmin.from(seed.table).select(seed.pk);
        if (error) {
          if (isMissingTable(error)) throw new AdminError(503, SCHEMA_MISSING_MESSAGE);
          throw new AdminError(500, `${seed.table}: ${error.message}`);
        }
        const existing = new Set((data ?? []).map((r: Row) => String(r[seed.pk])));
        rows = rows.filter((r) => !existing.has(String(r[seed.pk])));
      }
      if (rows.length > 0) {
        const { error } = await supabaseAdmin.from(seed.table).upsert(rows, { onConflict: seed.pk });
        if (error) {
          if (isMissingTable(error)) throw new AdminError(503, SCHEMA_MISSING_MESSAGE);
          throw new AdminError(500, `${seed.table}: ${error.message}`);
        }
      }
      result[seed.table] = { written: rows.length, skipped: seed.rows.length - rows.length };
    }

    await logAudit(actor, {
      action: "seed",
      table: "*",
      summary: overwrite ? "استيراد المحتوى الافتراضي مع الاستبدال" : "استيراد المحتوى الافتراضي (السجلات الجديدة فقط)",
    });

    return Response.json({ data: result });
  } catch (err) {
    return errorResponse(err);
  }
}
