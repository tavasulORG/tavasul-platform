import { readFile } from "node:fs/promises";
import path from "node:path";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { AdminError, errorResponse, isMissingTable, roleOf } from "@/lib/adminAuth";
import { MEDIA_BUCKET } from "@/lib/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://auxdpgqqlcrpmdzjgnky.supabase.co";

function projectRef(): string {
  return new URL(SUPABASE_URL).hostname.split(".")[0];
}

export interface SetupStatus {
  tablesReady: boolean;
  bucketReady: boolean;
  hasAdmin: boolean;
  contentSeeded: boolean;
  sqlEditorUrl: string;
}

async function status(): Promise<SetupStatus> {
  const [translations, bucket, users] = await Promise.all([
    supabaseAdmin.from("translations").select("id").limit(1),
    supabaseAdmin.storage.getBucket(MEDIA_BUCKET),
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 }),
  ]);

  const tablesReady = !isMissingTable(translations.error);
  const hasAdmin = (users.data?.users ?? []).some((u) => roleOf(u) === "admin");
  const contentSeeded = tablesReady && (translations.data?.length ?? 0) > 0;

  return {
    tablesReady,
    bucketReady: Boolean(bucket.data),
    hasAdmin,
    contentSeeded,
    sqlEditorUrl: `https://supabase.com/dashboard/project/${projectRef()}/sql/new`,
  };
}

/**
 * GET            -> setup status (no auth: the login page shows what is still missing)
 * GET ?sql=1     -> the contents of supabase/schema.sql, to copy into the SQL editor
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    if (url.searchParams.get("sql") === "1") {
      const sql = await readFile(path.join(process.cwd(), "supabase", "schema.sql"), "utf8");
      return new Response(sql, { headers: { "content-type": "text/plain; charset=utf-8" } });
    }
    return Response.json(await status());
  } catch (err) {
    return errorResponse(err);
  }
}

/** POST { email, password } -> creates the first admin. Refused once any admin exists. */
export async function POST(request: Request) {
  try {
    const current = await status();
    if (current.hasAdmin) throw new AdminError(409, "يوجد مدير بالفعل؛ سجّل الدخول أو اطلب من المدير إضافة حسابك");

    const body = (await request.json()) as { email?: unknown; password?: unknown };
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AdminError(400, "البريد الإلكتروني غير صالح");
    if (password.length < 8) throw new AdminError(400, "كلمة المرور يجب ألا تقل عن 8 أحرف");

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: "admin" },
    });
    if (error) throw new AdminError(400, error.message);

    return Response.json({ ok: true, id: data.user.id });
  } catch (err) {
    return errorResponse(err);
  }
}
