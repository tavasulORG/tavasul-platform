"use client";

import { useState } from "react";
import { Check, Copy, Database, ExternalLink, RefreshCw } from "lucide-react";
import { adminApi } from "@/lib/adminClient";
import { Alert, Button, LinkButton, errorMessage } from "./ui";

interface SchemaSetupProps {
  sqlEditorUrl: string;
  onRecheck: () => void;
  checking?: boolean;
  /** Smaller variant inside a card or alert. */
  compact?: boolean;
}

/** The one-time instructions for creating the database tables (supabase/schema.sql). */
export function SchemaSetup({ sqlEditorUrl, onRecheck, checking, compact }: SchemaSetupProps) {
  const [copied, setCopied] = useState(false);
  const [loadingSql, setLoadingSql] = useState(false);
  const [error, setError] = useState("");

  const copySql = async () => {
    setLoadingSql(true);
    setError("");
    try {
      const sql = await adminApi.setupSql();
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoadingSql(false);
    }
  };

  const steps = (
    <ol className="space-y-3 text-sm text-slate-700">
      <li className="flex gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white text-xs font-bold font-latin">1</span>
        <div className="space-y-2 flex-1">
          <span>انسخ محتوى ملف SQL:</span>
          <Button variant="outline" size="sm" icon={copied ? Check : Copy} onClick={copySql} loading={loadingSql}>
            {copied ? "تم النسخ" : "نسخ SQL"}
          </Button>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white text-xs font-bold font-latin">2</span>
        <div className="space-y-2 flex-1">
          <span>افتح محرر SQL في Supabase، الصق المحتوى واضغط Run:</span>
          <LinkButton href={sqlEditorUrl} external size="sm" icon={ExternalLink}>
            فتح محرر SQL
          </LinkButton>
        </div>
      </li>
      <li className="flex gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white text-xs font-bold font-latin">3</span>
        <div className="space-y-2 flex-1">
          <span>ارجع هنا وأعد الفحص:</span>
          <Button size="sm" icon={RefreshCw} onClick={onRecheck} loading={checking}>
            إعادة الفحص
          </Button>
        </div>
      </li>
    </ol>
  );

  if (compact) {
    return (
      <div className="space-y-3">
        {steps}
        {error && <Alert tone="error">{error}</Alert>}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <Database className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-base font-extrabold text-slate-900">إعداد قاعدة البيانات (مرة واحدة)</h2>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            جداول Supabase غير موجودة بعد. شغّل ملف <bdi dir="ltr" className="font-latin">supabase/schema.sql</bdi> في محرر SQL ثم أعد الفحص. يمكنك تسجيل الدخول في الأثناء؛ الحفظ يعمل بعد إنشاء الجداول.
          </p>
        </div>
      </div>
      {steps}
      {error && <Alert tone="error">{error}</Alert>}
    </div>
  );
}
