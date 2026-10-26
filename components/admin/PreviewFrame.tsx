"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Monitor, RefreshCw, Smartphone, Tablet } from "lucide-react";
import type { Language } from "@/types";
import { PREVIEW_READY, postPreview, previewUrl, type PreviewOverrides } from "@/lib/previewBridge";
import { Spinner, cn } from "./ui";

/* ----------------------------------------------------------------------------
 * Live preview of a site page with the unsaved draft applied. The page runs in
 * an iframe in preview mode and receives the draft through postMessage; see
 * lib/previewBridge.ts for the receiving side.
 * ------------------------------------------------------------------------- */

type Device = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTH: Record<Device, string> = { desktop: "100%", tablet: "820px", mobile: "390px" };

const LANGUAGES: { id: Language; label: string }[] = [
  { id: "ar", label: "عربي" },
  { id: "tr", label: "TR" },
  { id: "en", label: "EN" },
];

export interface PreviewTarget {
  /** Site path, with an optional #section to scroll to. */
  path: string;
  overrides: PreviewOverrides;
}

interface PreviewFrameProps {
  target: PreviewTarget;
  className?: string;
  /** Height class of the frame area. */
  heightClassName?: string;
}

export function PreviewFrame({ target, className, heightClassName = "h-[70vh]" }: PreviewFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [language, setLanguage] = useState<Language>("ar");
  const [ready, setReady] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [pathOnly, hash] = useMemo(() => {
    const [p, h] = target.path.split("#");
    return [p, h ?? ""];
  }, [target.path]);

  const src = useMemo(() => previewUrl(pathOnly), [pathOnly]);

  // The page says hello once its providers are listening; only then is a draft delivered.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type === PREVIEW_READY) setReady(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => setReady(false), [src, reloadKey]);

  // Push the draft (debounced) whenever it or the language changes.
  const overridesRef = useRef(target.overrides);
  overridesRef.current = target.overrides;
  const lastHash = useRef<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    const scrollTo = hash && lastHash.current !== hash ? hash : undefined;
    const timer = setTimeout(() => {
      postPreview(frameRef.current, { overrides: overridesRef.current, language, scrollTo });
      if (scrollTo) lastHash.current = scrollTo;
    }, 150);
    return () => clearTimeout(timer);
  }, [ready, target.overrides, language, hash]);

  // Re-scroll when the section changes within the same page.
  useEffect(() => {
    lastHash.current = null;
  }, [hash]);

  return (
    <div className={cn("flex flex-col rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden", className)}>
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
        <span className="text-xs font-extrabold text-slate-700 me-auto flex items-center gap-2">
          معاينة حية
          {!ready && <Spinner className="w-3.5 h-3.5" />}
        </span>

        <div className="flex rounded-lg bg-slate-100 p-0.5">
          {LANGUAGES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLanguage(item.id)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors",
                language === item.id ? "bg-white text-primary-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex rounded-lg bg-slate-100 p-0.5">
          {(
            [
              { id: "desktop", icon: Monitor, label: "حاسوب" },
              { id: "tablet", icon: Tablet, label: "لوحي" },
              { id: "mobile", icon: Smartphone, label: "جوال" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              title={item.label}
              onClick={() => setDevice(item.id)}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                device === item.id ? "bg-white text-primary-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
              )}
            >
              <item.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <button
          type="button"
          title="إعادة التحميل"
          onClick={() => setReloadKey((k) => k + 1)}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <a
          href={target.path}
          target="_blank"
          rel="noreferrer"
          title="فتح الصفحة المنشورة"
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className={cn("relative overflow-auto p-3", heightClassName)}>
        <div
          className="mx-auto h-full overflow-hidden rounded-xl bg-white shadow-md transition-[max-width] duration-300"
          style={{ maxWidth: DEVICE_WIDTH[device] }}
        >
          <iframe
            key={reloadKey}
            ref={frameRef}
            src={src}
            title="معاينة الموقع"
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
