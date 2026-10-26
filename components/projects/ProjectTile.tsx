"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MapPin, Users } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { useContent } from "@/context/ContentContext";
import type { Project } from "@/types";
import { STATUS_TAG, SectorIcon, fadeUp, numberFormat, statusLabel } from "./shared";

interface ProjectTileProps {
  project: Project;
  /** Compact tiles drop the summary and the donate button (related projects on the detail page). */
  compact?: boolean;
}

/** Photo-topped project card: status tag and country on the photo, sector, title, target groups and beneficiaries below. */
export function ProjectTile({ project, compact = false }: ProjectTileProps) {
  const { language, t } = useLanguage();
  const { openQuickDonate } = useDonation();
  const { sectors } = useContent();
  const sector = sectors.find((s) => s.slug === project.sectorSlug);
  const href = `/projects/${project.slug}`;

  return (
    <motion.article
      variants={fadeUp}
      className="group h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-primary-300 hover:shadow-brand-soft transition-[border-color,box-shadow]"
    >
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-slate-900">
        <Image
          src={project.coverImage}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
        <span className={clsx("absolute top-3 start-3 rounded-full px-3 py-1 text-[10px] font-bold", STATUS_TAG[project.status])}>
          {statusLabel(project.status, t)}
        </span>
        <span className="absolute bottom-3 start-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white">
          <MapPin className="w-3.5 h-3.5 text-primary-300" />
          {project.countryName[language]}
        </span>
      </Link>

      <div className="flex-1 p-5 space-y-3">
        {sector && (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary-700">
            <SectorIcon name={sector.iconName} className="w-3.5 h-3.5" />
            {sector.title[language]}
          </span>
        )}
        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
          <Link href={href} className="hover:text-primary-700 transition-colors">
            {project.title[language]}
          </Link>
        </h3>
        {!compact && <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{project.summary[language]}</p>}
        {!compact && project.targetGroups.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 pt-1">
            {project.targetGroups.slice(0, 3).map((group, i) => (
              <li key={i} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                {group[language]}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* On narrow cards the buttons drop to their own line, at the end side. */}
      <div className="px-5 pb-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-x-3 gap-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap">
          <Users className="w-4 h-4 text-primary-500" />
          <bdi dir="ltr" className="font-latin font-bold text-slate-900">
            {numberFormat.format(project.beneficiariesCount)}
          </bdi>
          {t("beneficiary")}
        </span>
        {compact ? (
          <Link href={href} className="ms-auto text-xs font-bold text-primary-700 hover:text-primary-800 whitespace-nowrap">
            {t("projectsCardDetails")}
          </Link>
        ) : (
          <div className="ms-auto flex items-center gap-3">
            <Link href={href} className="text-xs font-bold text-slate-600 hover:text-primary-700 transition-colors whitespace-nowrap">
              {t("projectsCardDetails")}
            </Link>
            <button
              type="button"
              onClick={() => openQuickDonate(project.id)}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-500 text-white px-4 py-2 text-xs font-black hover:bg-primary-600 transition-colors whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              {t("donateNow")}
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}
