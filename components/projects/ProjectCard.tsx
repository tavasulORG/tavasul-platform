"use client";

import React from "react";
import Link from "next/link";
import { Project } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { Heart, Users, MapPin, CheckCircle, Flame } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { language, t } = useLanguage();
  const { formatAmount, openQuickDonate } = useDonation();

  const title = project.title[language] || project.title.ar;
  const summary = project.summary[language] || project.summary.ar;
  const country = project.countryName[language] || project.countryName.ar;

  const percent = Math.min(100, Math.round((project.raisedAmount / project.goalAmount) * 100));

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* Cover Image & Badges */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-100">
          <img
            src={project.coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-2">
            {project.status === "urgent" && (
              <span className="flex items-center gap-1 bg-red-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                <Flame className="w-3.5 h-3.5" />
                <span>{t("urgentBadge")}</span>
              </span>
            )}
            {project.status === "completed" && (
              <span className="flex items-center gap-1 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{t("completedBadge")}</span>
              </span>
            )}
          </div>

          {/* Country Badge */}
          <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1 bg-black/40 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-sky-300" />
            <span>{country}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <Link href={`/projects/${project.slug}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
              {title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {summary}
          </p>

          {/* Progress Bar & Financial stats */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">{t("raised")}: <strong className="text-primary-600">{formatAmount(project.raisedAmount)}</strong></span>
              <span className="text-slate-400">{t("goal")}: {formatAmount(project.goalAmount)}</span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  percent >= 100
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-primary-500 to-sky-400"
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>

            {/* Percentage & Donors */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span className="font-bold text-slate-700">{percent}% منجز</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                <span>{project.donorsCount} {t("donors")}</span>
              </span>
            </div>
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

