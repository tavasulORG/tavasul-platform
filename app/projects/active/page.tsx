"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Clock, ArrowRight } from "lucide-react";

export default function ActiveProjectsPage() {
  const { language } = useLanguage();
  const { projects } = useDonation();
  const copy = {
    ar: ["حملات قيد التنفيذ والتبرع", "المشاريع الإنسانية الحالية", "مشاريع مفتوحة للتبرع والمساهمة المباشرة لتلبية الاحتياجات العاجلة والمستمرة في الميدان"],
    tr: ["Devam eden bağış kampanyaları", "Güncel insani yardım projeleri", "Sahadaki acil ve devam eden ihtiyaçları karşılamak için doğrudan desteğe açık projeler"],
    en: ["Active fundraising campaigns", "Current humanitarian projects", "Projects open for direct support to meet urgent and ongoing needs in the field"],
  }[language];
  const activeProjects = projects.filter((p) => p.status === "active" || p.status === "urgent");

  return (
    <div className="py-12 sm:py-20 space-y-12">
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <Clock className="w-4 h-4" />
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
          {activeProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}

