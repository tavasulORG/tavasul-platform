"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { sectorsData } from "@/data/sectors";
import { regionsData } from "@/data/regions";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { TrustJourney } from "@/components/home/TrustJourney";
import { ImpactStorySection } from "@/components/home/ImpactStorySection";
import { bankAccountsData } from "@/data/bankAccounts";
import {
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Users,
  GraduationCap,
  HeartPulse,
  AlertTriangle,
  Droplets,
  Home as HomeIcon,
  Copy,
  Check,
  Flame,
  Globe2,
  Building,
  Award,
  Scale,
  Quote,
  BookOpen,
} from "lucide-react";

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASE_OUT_EXPO,
    },
  },
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: EASE_OUT_EXPO,
    },
  },
};

export default function HomePage() {
  const { language, t } = useLanguage();
  const {
    openQuickDonate,
    projects,
    recentDonations,
    formatAmount,
  } = useDonation();

  const [copiedIbanId, setCopiedIbanId] = useState<string | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    let playPending = false;

    const resumePlayback = () => {
      if (document.hidden || playPending || !video.paused) return;

      video.muted = true;
      if (video.ended) video.currentTime = 0;
      playPending = true;
      void video.play().catch(() => {
        // Retry on readiness, page return, or a user gesture if autoplay is blocked.
      }).finally(() => {
        playPending = false;
      });
    };

    const scheduleResume = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(resumePlayback, 500);
    };

    video.defaultMuted = true;
    video.addEventListener("canplay", resumePlayback);
    video.addEventListener("pause", scheduleResume);
    video.addEventListener("ended", resumePlayback);
    document.addEventListener("visibilitychange", resumePlayback);
    document.addEventListener("pointerdown", resumePlayback);
    document.addEventListener("keydown", resumePlayback);
    window.addEventListener("pageshow", resumePlayback);
    resumePlayback();

    return () => {
      clearTimeout(resumeTimer);
      video.removeEventListener("canplay", resumePlayback);
      video.removeEventListener("pause", scheduleResume);
      video.removeEventListener("ended", resumePlayback);
      document.removeEventListener("visibilitychange", resumePlayback);
      document.removeEventListener("pointerdown", resumePlayback);
      document.removeEventListener("keydown", resumePlayback);
      window.removeEventListener("pageshow", resumePlayback);
    };
  }, []);

  const urgentProjects = projects.filter((p) => p.status === "urgent" || p.featured).slice(0, 3);
  const donationMinutes: Record<string, number> = { "don-1": 3, "don-2": 11, "don-3": 25, "don-4": 42 };
  const relativeTime = new Intl.RelativeTimeFormat(language === "ar" ? "ar" : language === "tr" ? "tr" : "en", {
    numeric: "auto",
  });

  const getSectorIcon = (slug: string) => {
    switch (slug) {
      case "education":
        return <GraduationCap className="w-6 h-6" />;
      case "health":
        return <HeartPulse className="w-6 h-6" />;
      case "emergency-relief":
        return <AlertTriangle className="w-6 h-6" />;
      case "economic-empowerment":
        return <TrendingUp className="w-6 h-6" />;
      case "child-women":
        return <Users className="w-6 h-6" />;
      case "wash":
        return <Droplets className="w-6 h-6" />;
      case "shelter":
        return <HomeIcon className="w-6 h-6" />;
      default:
        return <Heart className="w-6 h-6" />;
    }
  };

  const handleCopyIban = (id: string, iban: string) => {
    navigator.clipboard.writeText(iban);
    setCopiedIbanId(id);
    setTimeout(() => setCopiedIbanId(null), 2000);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section - Modern Charity & Donation-First Experience */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Background Humanitarian Hero Video & Atmospheric Overlays */}
        <motion.div
          initial={{ scale: 1.06, opacity: 0.85 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
          className="absolute inset-0 z-0"
        >
          <video
            ref={heroVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          >
            <source src="/videos/hero-tawasul.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlay keeps the hero text readable over the video. */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent md:bg-gradient-to-r md:from-slate-950/80 md:via-slate-950/40 md:to-transparent rtl:md:bg-gradient-to-l rtl:md:from-slate-950/80 rtl:md:via-slate-950/40 rtl:md:to-transparent" />
        </motion.div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pb-16 lg:pb-20 min-h-[580px] lg:min-h-[660px] flex items-end">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end w-full">
            
            {/* Right Column (in RTL): Placed in lower arm area */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.15,
                  },
                },
              }}
              className="lg:col-span-7 space-y-3.5 max-w-xl pb-2"
            >
              {/* Main Headline - Single Line, Clean Size */}
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
                  },
                }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-[2.25rem] font-brand font-black tracking-tight leading-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] whitespace-nowrap"
              >
                {t("heroTitle")}
              </motion.h1>

              {/* Short Mission Description */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.75, ease: EASE_OUT_EXPO },
                  },
                }}
                className="text-slate-100 text-sm sm:text-base leading-relaxed drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)] font-medium max-w-lg"
              >
                {t("heroDescription")}
              </motion.p>

              {/* Single Clean Secondary CTA: Explore Projects */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
                  },
                }}
                className="pt-1"
              >
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm border border-white/35 backdrop-blur-md transition-all shadow-md hover:border-white/55 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  <span>{t("exploreProjects")}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. Why Tawasul? Strategic Trust Journey (Wave Timeline) */}
      <TrustJourney />

      {/* 3. Priority Humanitarian Projects (Top 3 Cards) */}
      <section className="!mt-10 sm:!mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUpVariants}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>{t("urgentFieldResponse")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-brand">
              {t("urgentProjectsTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              {t("urgentProjectsSubtitle")}
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00A3E0] hover:text-[#0284c7] transition"
          >
            <span>{t("viewAllProjects")}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {urgentProjects.map((project) => (
            <motion.div key={project.id} variants={cardItemVariants} className="h-full flex flex-col">
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. Editorial Impact Story (Editorial Photo & Verified Field Transformation) */}
      <ImpactStorySection />

      {/* 5. The Seven Core Sectors - Non-traditional Photo Mosaic Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUpVariants}
          className="text-center space-y-2 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-brand">
            {t("sectorsTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {t("sectorsSubtitle")}
          </p>
        </motion.div>

        {/* Mosaic Layout: Dynamic Heights and Rich Photo Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.09,
                delayChildren: 0.05,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5"
        >
          {sectorsData.map((sec, idx) => {
            // First 2 sectors take 6 columns each, others take 4 columns for organic asymmetric mosaic
            const colSpan = idx === 0 || idx === 1 ? "lg:col-span-6 h-80" : "lg:col-span-4 h-72";
            return (
              <motion.div
                key={sec.id}
                variants={cardItemVariants}
                className={colSpan}
              >
                <Link
                  href={`/sectors/${sec.slug}`}
                  className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block w-full h-full"
                >
                  <Image
                    src={sec.coverImage}
                    alt={sec.title.ar}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent transition-opacity duration-300 group-hover:from-slate-950" />

                  <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between text-white z-10">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-[#00A3E0] group-hover:border-[#00A3E0] transition-colors">
                      {getSectorIcon(sec.slug)}
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-bold text-lg sm:text-xl text-white group-hover:text-sky-300 transition">
                        {sec.title[language] || sec.title.ar}
                      </h3>
                      <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed opacity-90">
                        {sec.subtitle[language] || sec.subtitle.ar}
                      </p>
                      <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-sky-300">
                        <span>{t("exploreProjects")}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 6. Where We Work - Geographic Field Presence */}
      <section className="bg-slate-100/70 border-y border-slate-200/60 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariants}
            className="text-center space-y-2 max-w-2xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-brand">
              {t("regionsTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {t("regionsSubtitle")}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.05,
                },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
          >
            {regionsData.map((reg) => (
              <motion.div key={reg.id} variants={cardItemVariants}>
                <Link
                  href={`/where-we-work/${reg.slug}`}
                  className="group relative h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
                >
                  <Image
                    src={reg.coverImage}
                    alt={reg.name.ar}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

                  <div className="absolute inset-0 p-5 flex flex-col justify-end text-white space-y-1.5 z-10">
                    <span className="text-3xl">{reg.flag}</span>
                    <h3 className="font-bold text-base sm:text-lg group-hover:text-sky-300 transition whitespace-nowrap">
                      {reg.name[language] || reg.name.ar}
                    </h3>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {reg.headline[language] || reg.headline.ar}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. Official Bank Accounts & Accredited Partnerships */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Bank Accounts IBAN Box */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariants}
          className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 space-y-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-sky-400 text-xs font-bold block mb-1">
                {t("directFinancialDonation")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-brand">
                {t("officialBankAccounts")}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {t("officialAccountName")}: <strong className="text-white">TAVASUL YARDIM VE KALKINMA DERNEĞİ</strong>
              </p>
            </div>

            <Link
              href="/bank-accounts"
              className="py-2.5 px-5 rounded-xl bg-[#00A3E0] hover:bg-[#0284c7] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#00A3E0]/20"
            >
              <span>{t("viewAllInternationalAccounts")}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {bankAccountsData.slice(0, 3).map((acc) => (
              <motion.div
                key={acc.id}
                variants={cardItemVariants}
                className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{acc.bankName}</span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-bold">
                    {acc.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 font-mono text-[11px]">
                  <span className="truncate text-slate-200">{acc.iban}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyIban(acc.id, acc.iban)}
                    className="shrink-0 ms-2 p-1 text-sky-400 hover:text-white transition"
                    title={t("copyIban")}
                  >
                    {copiedIbanId === acc.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Governance & Verified Partners Badge */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUpVariants}
          className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00A3E0] bg-sky-50 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4 text-[#00A3E0]" />
              <span>{t("officialLicenseBadge")}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-brand">
              {t("transparencyTitle")}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              {t("transparencySubtitle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/governance"
              className="py-3 px-6 rounded-2xl bg-[#00A3E0] hover:bg-[#0284c7] text-white font-bold text-xs shadow-md transition text-center"
            >
              {t("financialAuditReports")}
            </Link>
            <Link
              href="/partners"
              className="py-3 px-6 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition text-center"
            >
              {t("partnersCta")}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 8. Final Compelling Call to Action (Donate & Volunteer) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: { opacity: 0, y: 36, scale: 0.98 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.75,
                ease: EASE_OUT_EXPO,
                staggerChildren: 0.14,
                delayChildren: 0.1,
              },
            },
          }}
          className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 rounded-3xl p-10 sm:p-16 text-center text-white space-y-6 shadow-2xl border border-slate-800"
        >
          <motion.div
            variants={fadeUpVariants}
            className="max-w-2xl mx-auto space-y-3"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-brand leading-tight">
              {t("finalCtaTitle")}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t("finalCtaDesc")}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <button
              type="button"
              onClick={() => openQuickDonate()}
              className="px-8 py-4 rounded-2xl bg-[#00A3E0] hover:bg-[#0284c7] text-white font-black text-sm sm:text-base shadow-xl shadow-[#00A3E0]/30 hover:shadow-[#00A3E0]/40 flex items-center gap-2.5 transition transform hover:-translate-y-0.5"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>{t("donateNow")}</span>
            </button>

            <Link
              href="/volunteer"
              className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-md transition flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>{t("joinAsVolunteer")}</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

