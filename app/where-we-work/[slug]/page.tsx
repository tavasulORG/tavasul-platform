"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { regionsData } from "@/data/regions";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { MapPin, Globe2, CheckCircle2, Heart, ArrowRight } from "lucide-react";

export default function CountryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language } = useLanguage();
  const { projects, openQuickDonate } = useDonation();

  const region = regionsData.find((r) => r.slug === slug);
  if (!region) {
    return notFound();
  }

  const countryProjects = projects.filter((p) => p.countrySlug === region.slug);

  return (
    <div className="space-y-16 pb-20">
      {/* Country Hero Banner */}
      <section className="relative h-80 sm:h-96 w-full overflow-hidden bg-slate-900 flex items-center">
        <img
          src={region.coverImage}
          alt={region.name.ar}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-white space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-5xl">{region.flag}</span>
            <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
              نطاق العمل الميداني
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            {region.name[language] || region.name.ar}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl font-medium leading-relaxed">
            {region.headline[language] || region.headline.ar}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => openQuickDonate(undefined, 75)}
              className="px-6 py-3 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-lg shadow-primary-500/25 flex items-center gap-2 transition"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>تبرع لإغاثة {region.name[language] || region.name.ar}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Narrative & Interventions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">نظرة عامة على الواقع الميداني</h2>
              <p className="text-sm sm:text-base text-slate-700 leading-loose text-justify">
                {region.overview[language] || region.overview.ar}
              </p>
            </div>

            {/* Key Interventions */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">أبرز مجالات التدخل الميداني:</h3>
              <div className="space-y-3">
                {region.keyInterventions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                      {item[language] || item.ar}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-xl">
              <h3 className="text-base font-bold border-b border-slate-800 pb-3">مؤشرات الأثر</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">إجمالي المستفيدين:</span>
                  <strong className="text-primary-400 font-bold text-sm">
                    +{region.beneficiariesCount.toLocaleString()}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">المشاريع الجارية:</span>
                  <strong className="text-white font-bold text-sm">
                    {region.activeProjectsCount} مشاريع
                  </strong>
                </div>
              </div>

              <button
                onClick={() => openQuickDonate()}
                className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 mt-4"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>تبرع عاجل الآن</span>
              </button>
            </div>

            {/* Other countries navigation */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <h4 className="font-bold text-xs text-slate-800">دول ومناطق أخرى</h4>
              <div className="space-y-1.5">
                {regionsData
                  .filter((r) => r.slug !== region.slug)
                  .map((r) => (
                    <Link
                      key={r.id}
                      href={`/where-we-work/${r.slug}`}
                      className="flex items-center gap-2 p-2 rounded-xl text-xs text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition font-medium"
                    >
                      <span>{r.flag}</span>
                      <span>{r.name[language] || r.name.ar}</span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects belonging to this country */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              المشاريع الإنسانية في {region.name[language] || region.name.ar}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              مشاريع وحملات جارية تستقبل تبرعاتكم لدعم أهالي المنطقة
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

        {countryProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-500 text-xs">
            لا توجد مشاريع مخصصة نشطة حالياً لهذه المنطقة. يمكنك التوجيه عبر صندوق الإغاثة العامة.
          </div>
        )}
      </section>
    </div>
  );
}

