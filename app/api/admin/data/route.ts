import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  AdminError,
  SCHEMA_MISSING_MESSAGE,
  errorResponse,
  hasRole,
  isMissingTable,
  logAudit,
  requireAdmin,
} from "@/lib/adminAuth";
import { tableConfig } from "@/lib/adminTables";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

interface Filter {
  column: string;
  op: "eq" | "neq" | "ilike" | "in" | "gte" | "lte";
  value: unknown;
}

interface DataRequest {
  action: "list" | "get" | "upsert" | "upsertMany" | "update" | "delete" | "deleteMany";
  table: string;
  id?: string;
  ids?: string[];
  row?: Row;
  rows?: Row[];
  patch?: Row;
  select?: string;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
  filters?: Filter[];
  search?: { columns: string[]; query: string };
  /** Short text stored in the activity log. */
  summary?: string;
}

const COLUMN = /^[a-z_][a-z0-9_]*$/;

function assertColumn(name: string) {
  if (!COLUMN.test(name)) throw new AdminError(400, `اسم عمود غير صالح: ${name}`);
}

function throwDb(error: { code?: string; message: string }): never {
  if (isMissingTable(error)) throw new AdminError(503, SCHEMA_MISSING_MESSAGE);
  throw new AdminError(400, error.message);
}

/**
 * One endpoint for every table the admin edits. Reads and writes use the service role
 * (RLS does not apply), so the table allowlist and the role check are the boundary.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DataRequest;
    const actor = await requireAdmin(request, "editor");
    const table = tableConfig(body.table);
    if (!hasRole(actor.role, table.minRole)) throw new AdminError(403, "هذه العملية تتطلب صلاحية مدير");
    const client = supabaseAdmin.from(table.name);

    switch (body.action) {
      case "list": {
        let query = client.select(body.select ?? "*", { count: "exact" });
        for (const filter of body.filters ?? []) {
          assertColumn(filter.column);
          if (filter.op === "eq") query = query.eq(filter.column, filter.value as string);
          else if (filter.op === "neq") query = query.neq(filter.column, filter.value as string);
          else if (filter.op === "ilike") query = query.ilike(filter.column, `%${String(filter.value)}%`);
          else if (filter.op === "in") query = query.in(filter.column, filter.value as string[]);
          else if (filter.op === "gte") query = query.gte(filter.column, filter.value as string);
          else if (filter.op === "lte") query = query.lte(filter.column, filter.value as string);
        }
        if (body.search?.query && body.search.columns.length > 0) {
          const needle = body.search.query.replace(/[%,()]/g, " ").trim();
          if (needle) {
            body.search.columns.forEach(assertColumn);
            query = query.or(body.search.columns.map((c) => `${c}.ilike.%${needle}%`).join(","));
          }
        }
        const order = body.order ?? table.order;
        assertColumn(order.column);
        query = query.order(order.column, { ascending: order.ascending ?? true });
        const limit = Math.min(Math.max(body.limit ?? 500, 1), 2000);
        const offset = Math.max(body.offset ?? 0, 0);
        query = query.range(offset, offset + limit - 1);
        const { data, error, count } = await query;
        if (error) throwDb(error);
        return Response.json({ data, count });
      }

      case "get": {
        if (!body.id) throw new AdminError(400, "المعرّف مطلوب");
        const { data, error } = await client.select("*").eq(table.pk, body.id).maybeSingle();
        if (error) throwDb(error);
        return Response.json({ data });
      }

      case "upsert":
      case "upsertMany": {
        if (table.readOnly || table.editableColumns) throw new AdminError(403, "هذا الجدول لا يقبل الحفظ الكامل");
        const candidates = body.action === "upsert" ? [body.row] : body.rows ?? [];
        const rows: Row[] = candidates.filter((r): r is Row => Boolean(r) && typeof r === "object");
        if (rows.length === 0 || rows.length !== candidates.length) throw new AdminError(400, "لا توجد بيانات للحفظ");
        for (const row of rows) {
          if (row[table.pk] === undefined || row[table.pk] === "") throw new AdminError(400, `الحقل ${table.pk} مطلوب`);
          Object.keys(row).forEach(assertColumn);
        }
        const { data, error } = await client.upsert(rows as Row[], { onConflict: table.pk }).select();
        if (error) throwDb(error);
        await logAudit(actor, {
          action: "update",
          table: table.name,
          recordId: rows.length === 1 ? String(rows[0]![table.pk]) : null,
          summary: body.summary ?? (rows.length === 1 ? `حفظ ${table.name}` : `حفظ ${rows.length} سجلات في ${table.name}`),
        });
        return Response.json({ data });
      }

      case "update": {
        if (table.readOnly) throw new AdminError(403, "هذا الجدول للقراءة فقط");
        if (!body.id || !body.patch) throw new AdminError(400, "المعرّف والتعديل مطلوبان");
        const patch: Row = {};
        for (const [key, value] of Object.entries(body.patch)) {
          assertColumn(key);
          if (table.editableColumns && !table.editableColumns.includes(key)) continue;
          if (key === table.pk) continue;
          patch[key] = value;
        }
        if (Object.keys(patch).length === 0) throw new AdminError(400, "لا توجد حقول قابلة للتعديل");
        const { data, error } = await client.update(patch).eq(table.pk, body.id).select().maybeSingle();
        if (error) throwDb(error);
        await logAudit(actor, {
          action: "update",
          table: table.name,
          recordId: body.id,
          summary: body.summary ?? `تعديل ${Object.keys(patch).join("، ")}`,
        });
        return Response.json({ data });
      }

      case "delete":
      case "deleteMany": {
        if (table.readOnly || (table.editableColumns && !table.deletable)) throw new AdminError(403, "هذا الجدول لا يقبل الحذف");
        const ids = body.action === "delete" ? (body.id ? [body.id] : []) : body.ids ?? [];
        if (ids.length === 0) throw new AdminError(400, "المعرّف مطلوب");
        const { error } = await client.delete().in(table.pk, ids);
        if (error) throwDb(error);
        await logAudit(actor, {
          action: "delete",
          table: table.name,
          recordId: ids.length === 1 ? ids[0] : null,
          summary: body.summary ?? `حذف ${ids.length === 1 ? ids[0] : `${ids.length} سجلات`}`,
        });
        return Response.json({ ok: true });
      }

      default:
        throw new AdminError(400, "عملية غير معروفة");
    }
  } catch (err) {
    return errorResponse(err);
  }
}
