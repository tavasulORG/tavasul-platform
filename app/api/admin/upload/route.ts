import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { AdminError, errorResponse, logAudit, requireAdmin } from "@/lib/adminAuth";
import { FOLDER_RULES, MEDIA_BUCKET, ensureMediaBucket, isMediaFolder, publicUrl, safeFileName } from "@/lib/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** multipart/form-data: file (required), folder (images | documents | videos). */
export async function POST(request: Request) {
  try {
    const actor = await requireAdmin(request, "editor");
    const form = await request.formData();
    const file = form.get("file");
    const folder = form.get("folder");

    if (!(file instanceof File)) throw new AdminError(400, "لم يتم اختيار ملف");
    if (!isMediaFolder(folder)) throw new AdminError(400, "مجلد غير معروف");

    const rule = FOLDER_RULES[folder];
    const type = file.type || "application/octet-stream";
    if (!rule.types.test(type)) throw new AdminError(415, `نوع الملف غير مدعوم كـ${rule.label}: ${type}`);
    if (file.size > rule.maxBytes) {
      throw new AdminError(413, `حجم الملف يتجاوز الحد المسموح (${Math.round(rule.maxBytes / 1024 / 1024)} م.ب)`);
    }

    await ensureMediaBucket();

    const path = `${folder}/${Date.now()}-${safeFileName(file.name)}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).upload(path, bytes, {
      contentType: type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) throw new AdminError(500, `فشل الرفع: ${error.message}`);

    await logAudit(actor, { action: "upload", table: "storage", recordId: path, summary: `رفع ${file.name}` });

    return Response.json({
      path,
      url: publicUrl(path),
      name: file.name,
      size: file.size,
      mimeType: type,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
