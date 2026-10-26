"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { useContent } from "@/context/ContentContext";
import type { Project } from "@/types";
import { WhereHeading, fadeUp, stagger, viewportOnce } from "./shared";

const STATUS_ORDER: Record<Project["status"], number> = { urgent: 0, active: 1, completed: 2 };

/** The template's events strip: photo cards in a scroll-snap row with round arrows at both edges. */
export function WhereProjects() {
  const { language, dir, t } = useLanguage();
  const { projects } = useDonation();
  const { sectors: sectorsData } = useContent();
  const listRef = useRef<HTMLUListElement>(null);

  const sorted = [...projects].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  /** Scrolls most of a viewport in the given physical direction. */
  const scroll = (sign: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    list.scrollBy({ left: sign * list.clientWidth * 0.8, behavior: "smooth" });
  };

  const statusLabel = (status: Project["status"]) =>
    status === "urgent" ? t("urgentBadge") : status === "completed" ? t("completedBadge") : t("whereStatusActive");

  // The arrows sit at fixed physical sides; which one means "next" depends on the page direction.
  const leftLabel = dir === "rtl" ? t("whereNext") : t("wherePrev");
  const rightLabel = dir === "rtl" ? t("wherePrev") : t("whereNext");

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <WhereHeading title={t("whereProjectsTitle")} eyebrow={t("whereProjectsEyebrow")} />
          <Link
            href="/projects"
            className="inline-flex items-center bg-primary-700 text-white px-5 py-3 text-xs font-bold hover:bg-primary-600 transition-colors"
          >
            {t("viewAllProjects")}
          </Link>
        </motion.div>

        <div className="relative">
          <motion.ul
            ref={listRef}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sorted.map((project) => {
              const sector = sectorsData.find((s) => s.slug === project.sectorSlug);
              return (
                <motion.li key={project.id} variants={fadeUp} className="snap-start shrink-0 w-[260px] sm:w-[300px]">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group relative block aspect-[4/5] overflow-hidden bg-slate-900 text-white"
                  >
                    <Image
                      src={project.coverImage}
                      alt=""
                      fill
                      sizes="300px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-slate-950/10" />

                    <span
                      className={clsx(
                        "absolute top-4 start-4 rounded-full px-3 py-1 text-[10px] font-bold",
                        project.status === "urgent"
                          ? "bg-primary-500 text-white"
                          : project.status === "completed"
                            ? "bg-slate-900/80 text-white"
                            : "bg-white/90 text-slate-900"
                      )}
                    >
                      {statusLabel(project.status)}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-5 space-y-2">
                      <span className="block text-xs font-bold text-primary-200">{project.countryName[language]}</span>
                      <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-2">{project.title[language]}</h3>
                      {sector && (
                        <span className="flex items-center gap-1.5 text-[11px] text-white/85">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{sector.title[language]}</span>
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>

          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={leftLabel}
            className="absolute top-1/2 -translate-y-1/2 left-0 sm:-left-5 w-11 h-11 rounded-full bg-white text-primary-700 shadow-lg shadow-slate-900/15 flex items-center justify-center hover:bg-primary-700 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={rightLabel}
            className="absolute top-1/2 -translate-y-1/2 right-0 sm:-right-5 w-11 h-11 rounded-full bg-white text-primary-700 shadow-lg shadow-slate-900/15 flex items-center justify-center hover:bg-primary-700 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
