import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/admin/ui";

export const metadata: Metadata = {
  title: "لوحة تحكم تواصل",
  robots: { index: false, follow: false },
};

/**
 * Root of the admin panel. The public header/footer hide themselves on /admin routes
 * (see components/layout/Navbar.tsx and Footer.tsx). The panel is Arabic and right to
 * left regardless of the visitor language, and always uses the Arabic UI font.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: "var(--font-arabic)" }}>
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
