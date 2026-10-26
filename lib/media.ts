import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { AdminError } from "@/lib/adminAuth";

/** Server-side helpers for the public "media" storage bucket the admin uploads into. */

export const MEDIA_BUCKET = "media";

export type MediaFolder = "images" | "documents" | "videos";

export const MEDIA_FOLDERS: MediaFolder[] = ["images", "documents", "videos"];

export const FOLDER_RULES: Record<MediaFolder, { maxBytes: number; types: RegExp; label: string }> = {
  images: { maxBytes: 10 * 1024 * 1024, types: /^image\/(jpeg|png|webp|gif|svg\+xml|avif)$/, label: "صورة" },
  documents: {
    maxBytes: 25 * 1024 * 1024,
    types: /^(application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet|presentationml\.presentation)|application\/vnd\.ms-excel)$/,
    label: "مستند",
  },
  videos: { maxBytes: 50 * 1024 * 1024, types: /^video\/(mp4|webm)$/, label: "فيديو" },
};

export function isMediaFolder(value: unknown): value is MediaFolder {
  return value === "images" || value === "documents" || value === "videos";
}

/** Creates the public media bucket on first use so no manual setup is needed. */
export async function ensureMediaBucket(): Promise<void> {
  const { data } = await supabaseAdmin.storage.getBucket(MEDIA_BUCKET);
  if (data) return;
  const { error } = await supabaseAdmin.storage.createBucket(MEDIA_BUCKET, {
    public: true,
    fileSizeLimit: 50 * 1024 * 1024,
  });
  if (error && !/already exists/i.test(error.message)) {
    throw new AdminError(500, `تعذر إنشاء مخزن الملفات: ${error.message}`);
  }
}

/** "My Photo (1).JPG" -> "my-photo-1.jpg", keeping Arabic letters readable in the URL. */
export function safeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
  const cleaned = base
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60);
  return `${cleaned || "file"}${ext ? `.${ext}` : ""}`;
}

export function publicUrl(path: string): string {
  return supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
