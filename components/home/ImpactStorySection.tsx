"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useContent } from "@/context/ContentContext";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Baby,
  Droplets,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Home,
  Stethoscope,
  Tent,
  TrendingUp,
  Users,
  Wheat,
  LucideIcon,
} from "lucide-react";

/** Icons available for a story's iconName (chosen in the admin). */
const STORY_ICONS: Record<string, LucideIcon> = {
  Droplets,
  GraduationCap,
  HeartPulse,
  Users,
  Tent,
  Home,
  TrendingUp,
  AlertTriangle,
  HandHeart,
  Stethoscope,
  Wheat,
  Baby,
};

const AUTO_ADVANCE_MS = 5500; // 5.5 seconds per story

export function ImpactStorySection() {
  const { language, dir, t } = useLanguage();
  const { home } = useContent();
  const stories = home.impactStories;
  const storyCount = stories.length;
  const [activeIndex, setActiveIndex] = useState(0);
  // Bumped whenever the auto-advance cycle (re)starts so the CSS ring animation restarts from zero.
  const [cycle, setCycle] = useState(0);

  const isRtl = dir === "rtl";

  const goToSlide = useCallback((nextIdx: number) => {
    setActiveIndex(nextIdx);
    setCycle((c) => c + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? storyCount - 1 : prev - 1));
    setCycle((c) => c + 1);
  }, [storyCount]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === storyCount - 1 ? 0 : prev + 1));
    setCycle((c) => c + 1);
  }, [storyCount]);

  // One timer per story. The progress ring is a CSS animation (see .impact-ring-fill in globals.css),
  // so nothing re-renders between advances.
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % Math.max(storyCount, 1));
      setCycle((c) => c + 1);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, cycle, storyCount]);

  // Stories edited in the admin may shrink the list while a later index is active.
  const safeIndex = Math.min(activeIndex, Math.max(storyCount - 1, 0));

  const sectionHeadline = home.impactHeadline;

  // Semi-circle arc geometry (R = 44, π * 44 ≈ 138.2)
  const ARC_LENGTH = 138.2;
  // Circular ring circumference for the floating arrow timer (r = 19 => 2 * π * 19 ≈ 119.38)
  const RING_CIRCUMFERENCE = 119.38;

  return (
    <section className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Minimal Container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0, y: 36 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.12,
              },
            },
          }}
          className="bg-white rounded-3xl border border-slate-200/70 shadow-xs p-6 sm:p-9 lg:p-11 space-y-7"
        >
          {/* ============================================================== */}
          {/* 1. MINIMAL HEADER: Small Eyebrow + 2-Line Headline + Arrows    */}
          {/* ============================================================== */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-5"
          >
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#00A3E0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A3E0]" />
                <span>{t("storyBadge")}</span>
              </div>

              <h2 className="text-lg sm:text-xl lg:text-[23px] font-brand font-bold text-brand-ink leading-[1.55]">
                {sectionHeadline[language]}
              </h2>
            </div>

            {/* Static Navigation Arrow Buttons in Header */}
            <div className="flex items-center gap-2.5 shrink-0 self-end">
              {/* Previous Button */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous story"
                className="w-11 h-11 rounded-full bg-slate-100/90 hover:bg-primary-600 text-slate-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                {isRtl ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ArrowLeft className="w-4 h-4" />
                )}
              </button>

              {/* Static Next Button */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next story"
                className="w-11 h-11 rounded-full bg-slate-100/90 hover:bg-[#00A3E0] text-slate-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>

          {/* ============================================================== */}
          {/* 2. CLEAN 4-CARD ACCORDION WITH AUTO-FILLING ARROW ON IMAGE     */}
          {/* ============================================================== */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="flex flex-col lg:flex-row gap-3 sm:gap-3.5 lg:h-[440px]"
          >
            {stories.map((card, idx) => {
              const isActive = idx === safeIndex;
              const Icon = STORY_ICONS[card.iconName] ?? Users;
              const dashOffset = ARC_LENGTH * (1 - card.gaugeProgress);

              return (
                <motion.div
                  key={card.id}
                  variants={{
                    hidden: { opacity: 0, y: 28, scale: 0.98 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  onClick={() => {
                    if (!isActive) goToSlide(idx);
                  }}
                  role={isActive ? "region" : "button"}
                  tabIndex={isActive ? -1 : 0}
                  onKeyDown={(e) => {
                    if (!isActive && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      goToSlide(idx);
                    }
                  }}
                  style={{
                    transition: "flex 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  className={`group relative rounded-2xl overflow-hidden select-none ${
                    isActive
                      ? "lg:flex-[4.4] min-h-[360px] sm:min-h-[400px] lg:min-h-0 cursor-default"
                      : "lg:flex-[1] min-h-[110px] sm:min-h-[130px] lg:min-h-0 cursor-pointer"
                  }`}
                >
                  {/* Full-Bleed Photograph */}
                  <Image
                    src={card.image}
                    alt={card.title[language]}
                    fill
                    priority={idx === 0}
                    sizes={
                      isActive
                        ? "(max-width: 1024px) 100vw, 58vw"
                        : "(max-width: 1024px) 100vw, 14vw"
                    }
                    className={`object-cover object-center transition-transform duration-700 ease-out ${
                      isActive ? "scale-100" : "group-hover:scale-105"
                    }`}
                  />

                  {/* Subtle Bottom-Only Gradient */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isActive
                        ? "bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent"
                        : "bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent group-hover:from-slate-950/90"
                    }`}
                  />

                  {/* ======================================================== */}
                  {/* ACTIVE CARD: Minimal Bottom Text + Compact Frosted Gauge */}
                  {/* ======================================================== */}
                  {isActive ? (
                    <div className="relative z-10 h-full w-full p-5 sm:p-6 flex flex-col justify-between">
                      {/* Top-End Floating Arrow with #00A3E0 Circular Progress Ring */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                          }}
                          aria-label="Next story"
                          className="relative w-11 h-11 rounded-full bg-white hover:bg-white text-brand-ink flex items-center justify-center cursor-pointer transition-colors shadow-md group/arrow"
                        >
                          {/* SVG Circular Progress Ring matching top style */}
                          <svg
                            viewBox="0 0 44 44"
                            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                          >
                            <circle
                              cx="22"
                              cy="22"
                              r="19"
                              fill="none"
                              stroke="rgba(15, 41, 66, 0.14)"
                              strokeWidth="2"
                            />
                            <circle
                              key={`${activeIndex}-${cycle}`}
                              cx="22"
                              cy="22"
                              r="19"
                              fill="none"
                              stroke="#00A3E0"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeDasharray={RING_CIRCUMFERENCE}
                              strokeDashoffset={RING_CIRCUMFERENCE}
                              className="impact-ring-fill"
                              style={{ animationDuration: `${AUTO_ADVANCE_MS}ms` }}
                            />
                          </svg>

                          {/* Arrow Icon */}
                          {isRtl ? (
                            <ArrowLeft className="relative z-10 w-4 h-4 text-brand-ink transition-transform group-hover/arrow:-translate-x-0.5" />
                          ) : (
                            <ArrowRight className="relative z-10 w-4 h-4 text-brand-ink transition-transform group-hover/arrow:translate-x-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Bottom Content Row */}
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        {/* Bottom-Start: Bare Icon + 1-Line Title + 2-Line Description */}
                        <Link
                          href={`/projects/${card.projectSlug}`}
                          className="space-y-1.5 max-w-sm group/link block"
                        >
                          <Icon
                            className="w-4 h-4 text-sky-300 mb-2"
                            strokeWidth={1.75}
                          />
                          <h3 className="text-base sm:text-lg font-brand font-bold text-white group-hover/link:text-sky-200 transition-colors">
                            {card.title[language]}
                          </h3>
                          <p className="text-xs text-white/85 leading-relaxed line-clamp-2">
                            {card.description[language]}
                          </p>
                        </Link>

                        {/* Bottom-End: Compact Translucent Glass Gauge Box */}
                        <div className="w-[175px] sm:w-[185px] shrink-0 rounded-2xl bg-slate-950/35 backdrop-blur-md border border-white/15 p-3.5 text-white">
                          <div className="text-[10px] text-white/75 font-medium mb-1 text-start">
                            {card.gaugeHeader[language]}
                          </div>

                          {/* Semi-Circular Arc Gauge */}
                          <div className="relative w-[124px] mx-auto flex flex-col items-center">
                            <svg
                              viewBox="0 0 108 60"
                              className="w-full overflow-visible"
                            >
                              <path
                                d="M 10 54 A 44 44 0 0 1 98 54"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.22)"
                                strokeWidth="3.2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M 10 54 A 44 44 0 0 1 98 54"
                                fill="none"
                                stroke="#FFFFFF"
                                strokeWidth="3.2"
                                strokeLinecap="round"
                                strokeDasharray={ARC_LENGTH}
                                strokeDashoffset={dashOffset}
                                style={{
                                  transition:
                                    "stroke-dashoffset 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                                }}
                              />
                            </svg>

                            <div className="-mt-7 text-center">
                              <div
                                dir="ltr"
                                className="text-xl sm:text-2xl font-brand font-semibold text-white tracking-tight leading-none"
                              >
                                {card.gaugeValue[language]}
                              </div>
                              <div className="text-[9.5px] text-white/70 mt-1">
                                {card.gaugeSub[language]}
                              </div>
                            </div>
                          </div>

                          <p className="text-[9.5px] text-white/75 leading-normal mt-2.5 pt-2 border-t border-white/10 text-start line-clamp-2">
                            {card.gaugeFootnote[language]}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ======================================================== */
                    /* COLLAPSED STRIP: Bare Icon + Clean 2-Line Title Only     */
                    /* ======================================================== */
                    <div className="relative z-10 h-full w-full p-4 flex flex-col justify-end">
                      <div className="space-y-1.5">
                        <Icon
                          className="w-4 h-4 text-white/85 group-hover:text-sky-300 transition-colors"
                          strokeWidth={1.75}
                        />
                        <h3 className="font-brand font-semibold text-xs sm:text-[13px] text-white leading-snug">
                          {card.title[language]}
                        </h3>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
