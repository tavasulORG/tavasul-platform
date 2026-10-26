import {
  Building2,
  FolderHeart,
  HandCoins,
  History,
  Home,
  Images,
  Inbox,
  Landmark,
  Languages,
  LayoutDashboard,
  Layers,
  MapPin,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { AdminRole } from "@/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  minRole: AdminRole;
  group: string;
  /** Short description shown on the dashboard's quick-access cards. */
  hint: string;
}

/** Sidebar of the admin panel. Editors see the content sections; admins see everything. */
export const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "لوحة المعلومات", icon: LayoutDashboard, minRole: "editor", group: "عام", hint: "نظرة عامة وأرقام سريعة" },
  { href: "/admin/texts", label: "نصوص الموقع", icon: Languages, minRole: "editor", group: "المحتوى", hint: "كل عبارات الموقع بالعربية والتركية والإنجليزية" },
  { href: "/admin/home", label: "الصفحة الرئيسية", icon: Home, minRole: "editor", group: "المحتوى", hint: "الفيديو الافتتاحي وقصص الأثر" },
  { href: "/admin/about", label: "عن تواصل", icon: Building2, minRole: "editor", group: "المحتوى", hint: "القصة والرؤية والقيم ومجلس الإدارة والشركاء" },
  { href: "/admin/sectors", label: "مجالات العمل", icon: Layers, minRole: "editor", group: "المحتوى", hint: "القطاعات وأهدافها وأرقامها" },
  { href: "/admin/regions", label: "أين نعمل", icon: MapPin, minRole: "editor", group: "المحتوى", hint: "الدول والمناطق وتدخلاتها" },
  { href: "/admin/projects", label: "المشاريع", icon: FolderHeart, minRole: "editor", group: "المحتوى", hint: "المشاريع والحملات والتحديثات الميدانية" },
  { href: "/admin/banks", label: "الحسابات البنكية", icon: Landmark, minRole: "editor", group: "المحتوى", hint: "حسابات التبرع الرسمية" },
  { href: "/admin/media", label: "مكتبة الوسائط", icon: Images, minRole: "editor", group: "الوسائط", hint: "الصور والمستندات والفيديو المرفوعة" },
  { href: "/admin/messages", label: "الرسائل الواردة", icon: Inbox, minRole: "editor", group: "التفاعل", hint: "رسائل صفحة تواصل معنا" },
  { href: "/admin/donations", label: "التبرعات", icon: HandCoins, minRole: "editor", group: "التفاعل", hint: "سجل التبرعات والإيصالات" },
  { href: "/admin/settings", label: "إعدادات الموقع", icon: Settings, minRole: "admin", group: "الإدارة", hint: "بيانات التواصل والشعار ووضع الدفع" },
  { href: "/admin/users", label: "المستخدمون والصلاحيات", icon: Users, minRole: "admin", group: "الإدارة", hint: "حسابات الدخول وأدوارها" },
  { href: "/admin/activity", label: "سجل النشاط", icon: History, minRole: "editor", group: "الإدارة", hint: "من عدّل ماذا ومتى" },
];

export function navItemFor(pathname: string): NavItem | undefined {
  const exact = ADMIN_NAV.find((item) => item.href === pathname);
  if (exact) return exact;
  return [...ADMIN_NAV]
    .filter((item) => item.href !== "/admin")
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname.startsWith(item.href));
}
