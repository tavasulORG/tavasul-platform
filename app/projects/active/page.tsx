"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Clock, ArrowRight } from "lucide-react";

export default function ActiveProjectsPage() {
  const { projects } = useDonation();
  const activeProjects = projects.filter((p) => p.status === "active" || p.status === "urgent");

  return (
    <div className="py-12 sm:py-20 space-y-12">
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <Clock className="w-4 h-4" />
          <span>حملات قيد التنفيذ والتبرع</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          المشاريع الإنسانية الحالية
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          مشاريع مفتوحة للتبرع والمساهمة المباشرة لتلبية الاحتياجات العاجلة والمستمرة في الميدان
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

