"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { sectorsData } from "@/data/sectors";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { ProjectCard } from "@/components/projects/ProjectCard";
import {
  GraduationCap,
  HeartPulse,
  AlertTriangle,
  TrendingUp,
  Users,
  Droplets,
  Home as HomeIcon,
  CheckCircle2,
  Heart,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function SectorDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language, t } = useLanguage();
  const { projects, openQuickDonate } = useDonation();

  const sector = sectorsData.find((s) => s.slug === slug);
  if (!sector) {
    return notFound();
  }

  const sectorProjects = projects.filter((p) => p.sectorSlug === sector.slug);

  const getSectorIcon = (slug: string) => {
    switch (slug) {
      case "education":
        return <GraduationCap className="w-10 h-10" />;
      case "health":
        return <HeartPulse className="w-10 h-10" />;
      case "emergency-relief":
        return <AlertTriangle className="w-10 h-10" />;
      case "economic-empowerment":
        return <TrendingUp className="w-10 h-10" />;
      case "child-women":
        return <Users className="w-10 h-10" />;
      case "wash":
        return <Droplets className="w-10 h-10" />;
      case "shelter":
        return <HomeIcon className="w-10 h-10" />;
      default:
        return <Sparkles className="w-10 h-10" />;
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Sector Hero Banner */}
      <section className="relative h-80 sm:h-96 w-full overflow-hidden bg-slate-900 flex items-center">
        <img
          src={sector.coverImage}
          alt={sector.title.ar}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-white space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-600/90 text-white flex items-center justify-center shadow-lg backdrop-blur-md">
            {getSectorIcon(sector.slug)}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            {sector.title[language] || sector.title.ar}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl font-medium leading-relaxed">
            {sector.subtitle[language] || sector.subtitle.ar}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => openQuickDonate(undefined, 100)}
              className="px-6 py-3 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-lg shadow-primary-500/25 flex items-center gap-2 transition"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>تبرع لصالح هذا المجال</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Sector Content & Objectives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Detailed Narrative */}
          <div className="lg:col-span-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">نطاق التدخل وأهمية القطاع</h2>
              <p className="text-sm sm:text-base text-slate-700 leading-loose text-justify">
                {sector.description[language] || sector.description.ar}
              </p>
            </div>

            {/* Strategic Objectives */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">الأهداف الاستراتيجية للقطاع:</h3>
              <div className="space-y-3">
                {sector.objectives.map((obj, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                      {obj[language] || obj.ar}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats & Quick Actions Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-xl">
              <h3 className="text-base font-bold border-b border-slate-800 pb-3">إحصائيات القطاع</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">إجمالي المستفيدين:</span>
                  <strong className="text-primary-400 font-bold text-sm">
                    +{sector.stats.beneficiariesCount.toLocaleString()}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">المشاريع المنفذة:</span>
                  <strong className="text-white font-bold text-sm">
                    {sector.stats.projectsCount} مشروع
                  </strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">المشاريع المكتملة:</span>
                  <strong className="text-emerald-400 font-bold text-sm">
                    {sector.stats.completedProjects} مكتمل بنجاح
                  </strong>
                </div>
              </div>

              <button
                onClick={() => openQuickDonate()}
                className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 mt-4"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>دعم مشاريع القطاع الآن</span>
              </button>
            </div>

            {/* Other sectors quick links */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <h4 className="font-bold text-xs text-slate-800">قطاعات عمل أخرى</h4>
              <div className="space-y-1.5">
                {sectorsData
                  .filter((s) => s.slug !== sector.slug)
                  .slice(0, 4)
                  .map((s) => (
                    <Link
                      key={s.id}
                      href={`/sectors/${s.slug}`}
                      className="block p-2 rounded-xl text-xs text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition truncate font-medium"
                    >
                      • {s.title[language] || s.title.ar}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects belonging to this sector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              مشاريع وحملات {sector.title[language] || sector.title.ar}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ساهم مباشرة في تمويل مشاريع هذا المجال
            </p>
          </div>

          <Link
            href="/projects"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>جميع المشاريع</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>

        {sectorProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectorProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-500 text-xs">
            لا توجد مشاريع نشطة حالياً في هذا المجال. يمكنك التبرع للصندوق العام لدعم التدخلات الطارئة.
          </div>
        )}
      </section>
    </div>
  );
}

