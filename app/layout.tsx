import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { DonationProvider } from "@/context/DonationContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QuickDonateDrawer } from "@/components/donation/QuickDonateDrawer";
import { DonationReceiptModal } from "@/components/donation/DonationReceiptModal";

export const metadata: Metadata = {
  title: "جمعية تواصل للإغاثة والتنمية | Tavasul Derneği",
  description: "المنصة الرسمية لجمعية تواصل للإغاثة والتنمية - إسطنبول، تركيا - ترخيص رقم: 34-292-049. برامج إغاثية وتنموية ومشاريع مستدامة في تركيا واليمن وسوريا وفلسطين وأفريقيا.",
  keywords: "تواصل للإغاثة والتنمية, تبرع, كفالة أيتام, مشاريع إنسانية, غزة, اليمن, تركيا, Tavasul Derneği",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800;900&family=Cinzel:wght@400;500;600;700;800;900&family=Noto+Kufi+Arabic:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col justify-between selection:bg-primary-500 selection:text-white">
        <LanguageProvider>
          <DonationProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <QuickDonateDrawer />
            <DonationReceiptModal />
          </DonationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

