"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function CompletedProjectsPage() {
  const { language } = useLanguage();
  const { projects } = useDonation();
  const copy = {
    ar: ["أثر تحقق بفضل الله ثم عطائكم", "المشاريع المكتملة وقصص النجاح", "أرشيف إنجازات جمعية تواصل: مشاريع تم تمويلها وتنفيذها بالكامل وتسليمها للمستفيدين وفق أعلى معايير الجودة والشفافية"],
    tr: ["Desteğinizle gerçeğe dönüşen etki", "Tamamlanan projeler ve başarı hikâyeleri", "Tawasul'un en yüksek kalite ve şeffaflık standartlarıyla finanse edip tamamladığı projelerin başarı arşivi"],
    en: ["Impact made possible by your generosity", "Completed projects and success stories", "An archive of Tawasul projects fully funded and delivered to beneficiaries under the highest standards of quality and transparency"],
  }[language];
  const completedProjects = projects.filter((p) => p.status === "completed");

  return (
    <div className="py-12 sm:py-20 space-y-12">
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
          <CheckCircle2 className="w-4 h-4" />
          <span>{copy[0]}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {copy[1]}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {copy[2]}
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {completedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}

