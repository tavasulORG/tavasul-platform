import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { AdminError, errorResponse, logAudit, requireAdmin } from "@/lib/adminAuth";
import { MEDIA_BUCKET, ensureMediaBucket, isMediaFolder, publicUrl } from "@/lib/media";
import type { MediaItem } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET ?folder=images|documents|videos -> files in that folder, newest first. */
export async function GET(request: Request) {
  try {
    await requireAdmin(request, "editor");
    const folder = new URL(request.url).searchParams.get("folder");
    if (!isMediaFolder(folder)) throw new AdminError(400, "مجلد غير معروف");

    await ensureMediaBucket();
    const { data, error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).list(folder, {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) throw new AdminError(500, error.message);

    const items: MediaItem[] = (data ?? [])
      .filter((entry) => entry.id && entry.name !== ".emptyFolderPlaceholder")
      .map((entry) => {
        const path = `${folder}/${entry.name}`;
        return {
          path,
          name: entry.name,
          url: publicUrl(path),
          size: Number(entry.metadata?.size ?? 0),
          mimeType: String(entry.metadata?.mimetype ?? ""),
          createdAt: entry.created_at ?? "",
        };
      });

    return Response.json({ data: items });
  } catch (err) {
    return errorResponse(err);
  }
}

/** DELETE { paths: string[] } */
export async function DELETE(request: Request) {
  try {
    const actor = await requireAdmin(request, "editor");
    const body = (await request.json()) as { paths?: unknown };
    const paths = Array.isArray(body.paths) ? body.paths.filter((p): p is string => typeof p === "string") : [];
    if (paths.length === 0) throw new AdminError(400, "لم يتم تحديد ملفات");
    if (paths.some((p) => p.includes("..") || !isMediaFolder(p.split("/")[0]))) throw new AdminError(400, "مسار غير صالح");

    const { error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).remove(paths);
    if (error) throw new AdminError(500, error.message);

    await logAudit(actor, {
      action: "delete",
      table: "storage",
      recordId: paths.length === 1 ? paths[0] : null,
      summary: `حذف ${paths.length === 1 ? paths[0] : `${paths.length} ملفات`}`,
    });
    return Response.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
