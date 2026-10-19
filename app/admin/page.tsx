"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { sectorsData } from "@/data/sectors";
import { regionsData } from "@/data/regions";
import { Project, SectorSlug, CountrySlug } from "@/types";
import {
  LayoutDashboard,
  FolderKanban,
  ReceiptText,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  Eye,
  Globe,
  Save,
  X,
  Heart,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { language, setLanguage, t } = useLanguage();
  const { projects, recentDonations, formatAmount } = useDonation();

  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "donations">("overview");

  // New Project Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitleAr, setNewTitleAr] = useState("");
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newSector, setNewSector] = useState<SectorSlug>("emergency-relief");
  const [newCountry, setNewCountry] = useState<CountrySlug>("palestine");
  const [newGoal, setNewGoal] = useState<number>(50000);
  const [newBeneficiaries, setNewBeneficiaries] = useState<number>(5000);
  const [newStatus, setNewStatus] = useState<"urgent" | "active" | "completed">("active");
  const [newImageUrl, setNewImageUrl] = useState("https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80");

  const [localProjects, setLocalProjects] = useState<Project[]>(projects);

  const totalRaisedUSD = localProjects.reduce((acc, p) => acc + p.raisedAmount, 0);
  const totalGoalUSD = localProjects.reduce((acc, p) => acc + p.goalAmount, 0);
  const totalDonors = localProjects.reduce((acc, p) => acc + p.donorsCount, 0);
  const totalBeneficiaries = localProjects.reduce((acc, p) => acc + p.beneficiariesCount, 0);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleAr) return;

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      slug: `custom-${Date.now()}`,
      title: {
        ar: newTitleAr,
        tr: newTitleAr,
        en: newTitleEn || newTitleAr,
      },
      summary: {
        ar: "مشروع إنساني جديد تمت إضافته من لوحة التحكم.",
        tr: "Yönetim panelinden yeni eklenen insani yardım projesi.",
        en: "New humanitarian project added via the admin dashboard.",
      },
      description: {
        ar: "وصف تفصيلي للمشروع الإنساني وأهدافه ومراحله التنفيذية.",
        tr: "Projenin detaylı açıklaması ve uygulama hedefleri.",
        en: "Detailed description of the humanitarian project and objectives.",
      },
      sectorSlug: newSector,
      countrySlug: newCountry,
      countryName: {
        ar: newCountry === "turkey" ? "تركيا" : newCountry === "yemen" ? "اليمن" : newCountry === "palestine" ? "فلسطين" : "سوريا",
        tr: newCountry,
        en: newCountry,
      },
      targetGroups: [{ ar: "الفئات الأشد حاجة", tr: "İhtiyaç sahipleri", en: "Vulnerable groups" }],
      beneficiariesCount: Number(newBeneficiaries),
      goalAmount: Number(newGoal),
      raisedAmount: 0,
      donorsCount: 0,
      status: newStatus,
      featured: false,
      coverImage: newImageUrl,
      gallery: [],
      updates: [],
      createdAt: new Date().toISOString().split("T")[0],
    };

    setLocalProjects([newProj, ...localProjects]);
    setIsAddModalOpen(false);
    setNewTitleAr("");
    setNewTitleEn("");

    // Persist to Supabase
    import("@/lib/supabase").then(({ supabase }) => {
      supabase.from("projects").insert({
        id: newProj.id,
        slug: newProj.slug,
        title: newProj.title,
        summary: newProj.summary,
        description: newProj.description,
        sector_slug: newProj.sectorSlug,
        country_slug: newProj.countrySlug,
        country_name: newProj.countryName,
        target_groups: newProj.targetGroups,
        beneficiaries_count: newProj.beneficiariesCount,
        goal_amount: newProj.goalAmount,
        raised_amount: 0,
        donors_count: 0,
        status: newProj.status,
        featured: newProj.featured,
        cover_image: newProj.coverImage,
        gallery: newProj.gallery,
        updates: newProj.updates,
        created_at: new Date().toISOString(),
      }).then(({ error }) => {
        if (error) console.warn("Supabase sync warning:", error.message);
      });
    });

    alert("تمت إضافة المشروع الجديد بنجاح إلى قاعدة البيانات!");
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("هل أنت متأكد من رغبتك بحذف هذا المشروع؟")) {
      setLocalProjects(localProjects.filter((p) => p.id !== id));
      import("@/lib/supabase").then(({ supabase }) => {
        supabase.from("projects").delete().eq("id", id).then(({ error }) => {
          if (error) console.warn("Supabase delete warning:", error.message);
        });
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Top Dashboard Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-bold shadow-md shadow-primary-500/20">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  لوحة تحكم جمعية تواصل (Admin CMS)
                </h1>
                <span className="text-[10px] bg-primary-50 text-primary-700 font-bold px-2 py-0.5 rounded-full border border-primary-200">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                إدارة المشاريع، متابعة حصيلة التبرعات، والتحكم بالمحتوى ثلاثي اللغات
              </p>
            </div>
          </div>

          {/* Quick Language Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
            <Globe className="w-4 h-4 text-slate-500 ms-2" />
            <button
              onClick={() => setLanguage("ar")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                language === "ar" ? "bg-white text-primary-700 shadow-sm" : "text-slate-600"
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => setLanguage("tr")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                language === "tr" ? "bg-white text-primary-700 shadow-sm" : "text-slate-600"
              }`}
            >
              Türkçe
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                language === "en" ? "bg-white text-primary-700 shadow-sm" : "text-slate-600"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "overview"
                ? "bg-primary-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>نظرة عامة والإحصائيات</span>
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "projects"
                ? "bg-primary-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>إدارة المشاريع ({localProjects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("donations")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === "donations"
                ? "bg-primary-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-white"
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            <span>سجل التبرعات الحية</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>إجمالي المحصل</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">${totalRaisedUSD.toLocaleString()} USD</div>
                <span className="text-[11px] text-emerald-600 font-semibold">من أصل ${totalGoalUSD.toLocaleString()}</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>إجمالي المتبرعين</span>
                  <Users className="w-4 h-4 text-primary-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{totalDonors.toLocaleString()} مساهم</div>
                <span className="text-[11px] text-slate-400">عبر البطاقات والتحويلات</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>المستفيدون المقدرون</span>
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-2xl font-black text-slate-900">+{totalBeneficiaries.toLocaleString()}</div>
                <span className="text-[11px] text-slate-400">في 5 أقاليم</span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>المشاريع المنجزة</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {localProjects.filter((p) => p.status === "completed").length} مشروع
                </div>
                <span className="text-[11px] text-emerald-600">تم إغلاقها وتوثيقها بالكامل</span>
              </div>
            </div>

            {/* Recent Campaigns Progress Quick Preview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">حالة الحملات النشطة ونسب الإنجاز</h3>
              <div className="space-y-4">
                {localProjects.slice(0, 4).map((p) => {
                  const pct = Math.min(100, Math.round((p.raisedAmount / p.goalAmount) * 100));
                  return (
                    <div key={p.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{p.title.ar}</span>
                        <span className="font-mono text-slate-500 font-bold">
                          ${p.raisedAmount.toLocaleString()} / ${p.goalAmount.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-primary-600 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS MANAGEMENT */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">قائمة المشاريع الإنسانية</h2>
                <p className="text-xs text-slate-500">إضافة وتعديل الأهداف المالية والمجالات والدول</p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مشروع جديد</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4 text-start">المشروع</th>
                      <th className="p-4 text-start">القطاع</th>
                      <th className="p-4 text-start">الدولة</th>
                      <th className="p-4 text-start">الهدف المالي</th>
                      <th className="p-4 text-start">المحصل</th>
                      <th className="p-4 text-start">الحالة</th>
                      <th className="p-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {localProjects.map((proj) => {
                      const pct = Math.min(100, Math.round((proj.raisedAmount / proj.goalAmount) * 100));
                      return (
                        <tr key={proj.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-4 font-bold text-slate-900 max-w-xs truncate">
                            {proj.title.ar}
                          </td>
                          <td className="p-4 text-slate-600">{proj.sectorSlug}</td>
                          <td className="p-4 text-slate-600 font-medium">{proj.countryName.ar}</td>
                          <td className="p-4 font-mono font-bold text-slate-800">
                            ${proj.goalAmount.toLocaleString()}
                          </td>
                          <td className="p-4 font-mono font-bold text-primary-600">
                            ${proj.raisedAmount.toLocaleString()} ({pct}%)
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                proj.status === "urgent"
                                  ? "bg-red-100 text-red-700"
                                  : proj.status === "completed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-sky-100 text-sky-700"
                              }`}
                            >
                              {proj.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <a
                                href={`/projects/${proj.slug}`}
                                target="_blank"
                                className="p-1.5 text-slate-400 hover:text-primary-600 transition"
                                title="معاينة"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleDeleteProject(proj.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 transition"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DONATIONS LEDGER */}
        {activeTab === "donations" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">سجل التبرعات والمعاملات المسجلة</h2>
              <p className="text-xs text-slate-500">متابعة الحوالات والبطاقات وحالة الإيصالات الصادرة</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4 text-start">رقم الإيصال</th>
                      <th className="p-4 text-start">المتبرع</th>
                      <th className="p-4 text-start">المبلغ المسجل</th>
                      <th className="p-4 text-start">المشروع / الغاية</th>
                      <th className="p-4 text-start">وسيلة الدفع</th>
                      <th className="p-4 text-start">الحالة</th>
                      <th className="p-4 text-start">التوقيت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentDonations.map((don) => (
                      <tr key={don.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-4 font-mono font-bold text-slate-700">{don.receiptNumber}</td>
                        <td className="p-4 font-bold text-slate-900">{don.donorName}</td>
                        <td className="p-4 font-extrabold text-primary-600 font-mono">
                          {don.amount.toLocaleString()} {don.currency}
                        </td>
                        <td className="p-4 text-slate-600 max-w-xs truncate">{don.projectTitle}</td>
                        <td className="p-4 text-slate-500">
                          {don.paymentMethod === "card" ? "بطاقة بنكية" : "حوالة مصرفية"}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            ناجحة وموثقة
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">{don.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD NEW PROJECT */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">إضافة مشروع جديد إلى المنصة</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProject} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">عنوان المشروع (بالعربية) *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: حفر بئر ارتوازي في قرية كذا..."
                    value={newTitleAr}
                    onChange={(e) => setNewTitleAr(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">عنوان المشروع (بالإنجليزية) - اختياري</label>
                  <input
                    type="text"
                    placeholder="Project title in English..."
                    value={newTitleEn}
                    onChange={(e) => setNewTitleEn(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">مجال العمل (القطاع)</label>
                    <select
                      value={newSector}
                      onChange={(e) => setNewSector(e.target.value as SectorSlug)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white"
                    >
                      {sectorsData.map((s) => (
                        <option key={s.id} value={s.slug}>{s.title.ar}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">الدولة / النطاق الجغرافي</label>
                    <select
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value as CountrySlug)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white"
                    >
                      {regionsData.map((r) => (
                        <option key={r.id} value={r.slug}>{r.name.ar}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">الهدف المالي ($ USD)</label>
                    <input
                      type="number"
                      required
                      value={newGoal}
                      onChange={(e) => setNewGoal(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">عدد المستفيدين</label>
                    <input
                      type="number"
                      value={newBeneficiaries}
                      onChange={(e) => setNewBeneficiaries(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">حالة المشروع</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="urgent">عاجل جداً 🔥</option>
                      <option value="active">نشط ومستمر ⏳</option>
                      <option value="completed">مكتمل ✅</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">رابط صورة الغلاف (URL)</label>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 font-mono text-[11px]"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold transition flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ ونشر المشروع</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
