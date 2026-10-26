"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ExternalLink, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { ADMIN_NAV, navItemFor } from "./nav";
import { hasRole, useAdminSession, type AdminSession } from "./useAdminSession";
import { Badge, Button, Loading, cn } from "./ui";
import { ROLE_LABEL } from "@/lib/adminShared";
import { useContent } from "@/context/ContentContext";

/* ----------------------------------------------------------------------------
 * Shell of every admin page: signed-in guard, sidebar, top bar and the
 * "unsaved changes" state editors register so navigation can warn.
 * ------------------------------------------------------------------------- */

interface ShellContextValue {
  session: AdminSession;
  dirty: boolean;
  setDirty: (dirty: boolean) => void;
}

const ShellContext = createContext<ShellContextValue | undefined>(undefined);

export function useAdminShell(): ShellContextValue {
  const context = useContext(ShellContext);
  if (!context) throw new Error("useAdminShell must be used inside AdminShell");
  return context;
}

export function AdminShell({ children }: { children: ReactNode }) {
  const session = useAdminSession();
  const router = useRouter();
  const pathname = usePathname() ?? "/admin";
  const { settings } = useContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (session.status === "signed-out") router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }, [session.status, router, pathname]);

  useEffect(() => setMenuOpen(false), [pathname]);

  // Warn before the tab closes with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const current = navItemFor(pathname);
  const visibleNav = useMemo(() => ADMIN_NAV.filter((item) => hasRole(session.role, item.minRole)), [session.role]);
  const groups = useMemo(() => {
    const map = new Map<string, typeof visibleNav>();
    visibleNav.forEach((item) => map.set(item.group, [...(map.get(item.group) ?? []), item]));
    return Array.from(map.entries());
  }, [visibleNav]);

  const value = useMemo(() => ({ session, dirty, setDirty }), [session, dirty]);

  if (session.status === "loading" || session.status === "signed-out") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Loading label="جارٍ التحقق من الجلسة..." />
      </div>
    );
  }

  if (session.status === "forbidden") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldCheck className="w-7 h-7" />
          </span>
          <h1 className="mt-4 text-lg font-black text-slate-900">لا تملك صلاحية الدخول</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            الحساب <bdi dir="ltr" className="font-latin">{session.email}</bdi> مسجّل لكنه غير مضاف إلى لوحة التحكم. اطلب من المدير إضافتك من صفحة المستخدمين.
          </p>
          <Button className="mt-6" variant="outline" icon={LogOut} onClick={() => session.signOut()}>
            تسجيل الخروج
          </Button>
        </div>
      </div>
    );
  }

  const guardedNavigate = (href: string) => (event: React.MouseEvent) => {
    if (dirty && !window.confirm("لديك تعديلات غير محفوظة. هل تريد المغادرة دون حفظ؟")) {
      event.preventDefault();
      return;
    }
    setDirty(false);
  };

  const sidebar = (
    <nav className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <img src={settings.logo} alt="" className="h-9 w-auto max-w-[96px] rounded-lg bg-white p-1 object-contain" />
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-white leading-tight">لوحة التحكم</div>
          <div className="text-[11px] text-slate-400">إدارة محتوى الموقع</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map(([group, items]) => (
          <div key={group}>
            <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wide text-slate-500">{group}</div>
            <ul className="space-y-0.5">
              {items.map((item) => {
                const active = current?.href === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={guardedNavigate(item.href)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold transition-colors",
                        active ? "bg-primary-500 text-white shadow-md shadow-primary-500/25" : "text-slate-300 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="w-4 h-4" />
          عرض الموقع
        </a>
      </div>
    </nav>
  );

  return (
    <ShellContext.Provider value={value}>
      <div className="min-h-screen bg-slate-50 lg:flex" dir="rtl">
        {/* Sidebar: fixed on desktop, drawer on mobile. */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0">
          <div className="fixed inset-y-0 start-0 w-64 bg-brand-ink text-white">{sidebar}</div>
        </aside>
        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" aria-label="إغلاق القائمة" className="absolute inset-0 bg-slate-900/60" onClick={() => setMenuOpen(false)} />
            <div className="absolute inset-y-0 start-0 w-72 max-w-[85vw] bg-brand-ink text-white shadow-2xl animate-fadeIn">
              <button type="button" onClick={() => setMenuOpen(false)} className="absolute top-4 end-4 rounded-lg p-1.5 text-slate-300 hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
              {sidebar}
            </div>
          </div>
        )}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
            <button type="button" onClick={() => setMenuOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-extrabold text-slate-900 truncate">{current?.label ?? "لوحة التحكم"}</div>
              {dirty && <div className="text-[11px] font-bold text-amber-600">تعديلات غير محفوظة</div>}
            </div>
            <UserMenu session={session} />
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1400px]">{children}</div>
          </main>
        </div>
      </div>
    </ShellContext.Provider>
  );
}

function UserMenu({ session }: { session: AdminSession }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs hover:border-primary-300"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-white font-latin font-bold">
          {session.email.charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:block max-w-[160px] truncate font-latin text-slate-700" dir="ltr">
          {session.email}
        </span>
        {session.role && <Badge tone={session.role === "admin" ? "cyan" : "slate"}>{ROLE_LABEL[session.role]}</Badge>}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>
      {open && (
        <>
          <button type="button" aria-label="إغلاق" className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute end-0 z-20 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-fadeIn">
            <div className="px-3 py-2 text-[11px] text-slate-500">
              مسجّل الدخول بـ
              <bdi dir="ltr" className="block font-latin text-xs font-bold text-slate-800 truncate">
                {session.email}
              </bdi>
            </div>
            <button
              type="button"
              onClick={() => session.signOut()}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
        </>
      )}
    </div>
  );
}
