"use client";

import { supabase } from "@/lib/supabase";
import type { AdminRole, AdminUser, MediaItem } from "@/types";

/**
 * Browser-side client of the admin API. Every call carries the Supabase session's
 * access token; the routes verify it and the role server-side.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

export type MediaFolder = "images" | "documents" | "videos";

export class AdminApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? "";
}

interface FetchInit {
  method?: string;
  json?: unknown;
  form?: FormData;
}

export async function adminFetch<T>(path: string, init: FetchInit = {}): Promise<T> {
  const token = await getAccessToken();
  const headers: Record<string, string> = {};
  if (token) headers.authorization = `Bearer ${token}`;
  if (init.json !== undefined) headers["content-type"] = "application/json";

  const response = await fetch(path, {
    method: init.method ?? (init.json !== undefined || init.form ? "POST" : "GET"),
    headers,
    body: init.form ?? (init.json !== undefined ? JSON.stringify(init.json) : undefined),
  });

  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }
  if (!response.ok) {
    const message = (payload as { error?: string } | null)?.error ?? `خطأ ${response.status}`;
    throw new AdminApiError(response.status, message);
  }
  return payload as T;
}

export interface ListOptions {
  select?: string;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
  filters?: { column: string; op: "eq" | "neq" | "ilike" | "in" | "gte" | "lte"; value: unknown }[];
  search?: { columns: string[]; query: string };
}

export interface UploadResult {
  path: string;
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface SetupStatus {
  tablesReady: boolean;
  bucketReady: boolean;
  hasAdmin: boolean;
  contentSeeded: boolean;
  sqlEditorUrl: string;
}

export interface DashboardStats {
  tablesReady: boolean;
  projects: { total: number; urgent: number; active: number; completed: number; featured: number; goal: number; raised: number };
  donations: { count: number; totalUsd: number; last30Count: number; last30Usd: number; recent: Row[] };
  messages: { total: number; unread: number; recent: Row[] };
  counts: { sectors: number; regions: number; bankAccounts: number };
  activity: Row[];
}

function data<T>(table: string, body: Row) {
  return adminFetch<T>("/api/admin/data", { json: { table, ...body } });
}

export const adminApi = {
  list<T = Row>(table: string, options: ListOptions = {}) {
    return data<{ data: T[]; count: number | null }>(table, { action: "list", ...options });
  },
  get<T = Row>(table: string, id: string) {
    return data<{ data: T | null }>(table, { action: "get", id });
  },
  upsert<T = Row>(table: string, row: Row, summary?: string) {
    return data<{ data: T[] }>(table, { action: "upsert", row, summary });
  },
  upsertMany<T = Row>(table: string, rows: Row[], summary?: string) {
    return data<{ data: T[] }>(table, { action: "upsertMany", rows, summary });
  },
  update<T = Row>(table: string, id: string, patch: Row, summary?: string) {
    return data<{ data: T | null }>(table, { action: "update", id, patch, summary });
  },
  remove(table: string, id: string, summary?: string) {
    return data<{ ok: true }>(table, { action: "delete", id, summary });
  },
  removeMany(table: string, ids: string[], summary?: string) {
    return data<{ ok: true }>(table, { action: "deleteMany", ids, summary });
  },

  /** Uploads with progress through XMLHttpRequest (fetch cannot report upload progress). */
  async upload(file: File, folder: MediaFolder, onProgress?: (fraction: number) => void): Promise<UploadResult> {
    const token = await getAccessToken();
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);

    return new Promise<UploadResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/admin/upload");
      if (token) xhr.setRequestHeader("authorization", `Bearer ${token}`);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) onProgress(event.loaded / event.total);
      };
      xhr.onerror = () => reject(new AdminApiError(0, "تعذر الاتصال بالخادم"));
      xhr.onload = () => {
        let payload: Row = {};
        try {
          payload = JSON.parse(xhr.responseText || "{}");
        } catch {
          payload = {};
        }
        if (xhr.status >= 200 && xhr.status < 300) resolve(payload as UploadResult);
        else reject(new AdminApiError(xhr.status, payload.error ?? `خطأ ${xhr.status}`));
      };
      xhr.send(form);
    });
  },

  media: {
    list(folder: MediaFolder) {
      return adminFetch<{ data: MediaItem[] }>(`/api/admin/media?folder=${folder}`);
    },
    remove(paths: string[]) {
      return adminFetch<{ ok: true }>("/api/admin/media", { method: "DELETE", json: { paths } });
    },
  },

  users: {
    list() {
      return adminFetch<{ data: AdminUser[] }>("/api/admin/users");
    },
    create(email: string, password: string, role: AdminRole) {
      return adminFetch<{ data: AdminUser }>("/api/admin/users", { json: { email, password, role } });
    },
    update(id: string, patch: { role?: AdminRole; password?: string }) {
      return adminFetch<{ data: AdminUser }>("/api/admin/users", { method: "PATCH", json: { id, ...patch } });
    },
    remove(id: string) {
      return adminFetch<{ ok: true }>("/api/admin/users", { method: "DELETE", json: { id } });
    },
  },

  stats() {
    return adminFetch<DashboardStats>("/api/admin/stats");
  },

  async setupStatus(): Promise<SetupStatus> {
    const response = await fetch("/api/admin/bootstrap", { cache: "no-store" });
    if (!response.ok) throw new AdminApiError(response.status, "تعذر قراءة حالة الإعداد");
    return (await response.json()) as SetupStatus;
  },

  async setupSql(): Promise<string> {
    const response = await fetch("/api/admin/bootstrap?sql=1", { cache: "no-store" });
    if (!response.ok) throw new AdminApiError(response.status, "تعذر قراءة ملف SQL");
    return response.text();
  },

  async bootstrap(email: string, password: string): Promise<void> {
    const response = await fetch("/api/admin/bootstrap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) throw new AdminApiError(response.status, payload.error ?? `خطأ ${response.status}`);
  },

  seed(overwrite: boolean) {
    return adminFetch<{ data: Record<string, { written: number; skipped: number }> }>("/api/admin/seed", {
      json: { overwrite },
    });
  },
};

/** Stable id for new records: "proj-2026-10-27-k3x9". */
export function newId(prefix: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const tail = Math.random().toString(36).slice(2, 6);
  return `${prefix}-${date}-${tail}`;
}

/** "Education and awareness" -> "education-and-awareness"; Arabic falls back to the given prefix. */
export function slugify(text: string, fallback = "item"): string {
  const slug = text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || `${fallback}-${Math.random().toString(36).slice(2, 6)}`;
}
