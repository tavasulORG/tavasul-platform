"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types";
import { useContent } from "@/context/ContentContext";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import {
  Heart,
  MapPin,
  CheckCircle,
  Flame,
  Users,
  GraduationCap,
  HeartPulse,
  AlertTriangle,
  TrendingUp,
  Droplets,
  Home as HomeIcon,
  Layers,
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { language, t } = useLanguage();
  const { openQuickDonate } = useDonation();

  const title = project.title[language] || project.title.ar;
  const summary = project.summary[language] || project.summary.ar;
  const country = project.countryName[language] || project.countryName.ar;

  const { sectors } = useContent();
  const sector = sectors.find((s) => s.slug === project.sectorSlug);
  const sectorTitle = sector
    ? sector.title[language] || sector.title.ar
    : null;

  const getSectorSmallIcon = (slug: string) => {
    switch (slug) {
      case "education":
        return <GraduationCap className="w-3.5 h-3.5 text-[#00A3E0]" />;
      case "health":
        return <HeartPulse className="w-3.5 h-3.5 text-[#00A3E0]" />;
      case "emergency-relief":
        return <AlertTriangle className="w-3.5 h-3.5 text-[#00A3E0]" />;
      case "economic-empowerment":
        return <TrendingUp className="w-3.5 h-3.5 text-[#00A3E0]" />;
      case "child-women":
        return <Users className="w-3.5 h-3.5 text-[#00A3E0]" />;
      case "wash":
        return <Droplets className="w-3.5 h-3.5 text-[#00A3E0]" />;
      case "shelter":
        return <HomeIcon className="w-3.5 h-3.5 text-[#00A3E0]" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-[#00A3E0]" />;
    }
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* Cover Image & Badges */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-100">
          <Image
            src={project.coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-2">
            {project.status === "urgent" && (
              <span className="flex items-center gap-1 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                <Flame className="w-3.5 h-3.5" />
                <span>{t("urgentBadge")}</span>
              </span>
            )}
            {project.status === "completed" && (
              <span className="flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{t("completedBadge")}</span>
              </span>
            )}
          </div>

          {/* Country Badge */}
          <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1 bg-black/55 text-white text-xs px-2.5 py-1 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-sky-300" />
            <span>{country}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5">
          <Link href={`/projects/${project.slug}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
              {title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {summary}
          </p>

          {/* Sector & Target Groups Pills (Replaces Financial Progress Bar) */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {sectorTitle && (
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50/90 text-[#0B5377] border border-sky-100 text-[11px] font-bold">
                  {getSectorSmallIcon(project.sectorSlug)}
                  <span>{sectorTitle}</span>
                </span>
              </div>
            )}

            {project.targetGroups && project.targetGroups.length > 0 && (
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-muted me-0.5">
                  <Users className="w-3.5 h-3.5 text-brand-muted" />
                  <span>{t("targetGroup")}:</span>
                </span>
                {project.targetGroups.slice(0, 3).map((grp, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-600 text-[11px] font-medium"
                  >
                    {grp[language] || grp.ar}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={() => openQuickDonate(project.id)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition shadow-sm"
        >
          <Heart className="w-3.5 h-3.5 fill-white" />
          <span>{t("donateNow")}</span>
        </button>
        <Link
          href={`/projects/${project.slug}`}
          className="flex items-center justify-center py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition border border-slate-200/80 text-center"
        >
          <span>{t("learnMore")}</span>
        </Link>
      </div>
    </div>
  );
}
