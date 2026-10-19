"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  ArrowLeft,
  ArrowRight,
  Droplets,
  GraduationCap,
  HeartPulse,
  Users,
  LucideIcon,
} from "lucide-react";

interface LocalizedText {
  ar: string;
  tr: string;
  en: string;
}

interface ImpactAccordionCard {
  id: string;
  projectSlug: string;
  icon: LucideIcon;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  gaugeHeader: LocalizedText;
  gaugeValue: LocalizedText;
  gaugeSub: LocalizedText;
  gaugeProgress: number;
  gaugeFootnote: LocalizedText;
}

const ACCORDION_STORIES: ImpactAccordionCard[] = [
  {
    id: "story-wash",
    projectSlug: "yemen-solar-water-wells",
    icon: Droplets,
    title: {
      ar: "سقيا الأمل بالطاقة الشمسية",
      tr: "Güneş Enerjili Su Kuyuları",
      en: "Solar Water Boreholes",
    },
    description: {
      ar: "حفر وتشغيل محطات الآبار الارتوازية بالطاقة الشمسية النظيفة لتأمين مياه شرب نقية ومستمرة لقرى اليمن.",
      tr: "Kurak köylerde güneş enerjili derin su kuyuları açarak binlerce çocuğa kesintisiz temiz içme suyu sağlıyoruz.",
      en: "Operating solar-powered deep artesian wells across drought-stricken villages to deliver pure drinking water.",
    },
    image: "/images/impact-solar-water.jpg",
    gaugeHeader: {
      ar: "مؤشر الأثر والاستدامة",
      tr: "Sürdürülebilirlik Skoru",
      en: "Sustainability Index",
    },
    gaugeValue: {
      ar: "+32K",
      tr: "+32B",
      en: "32K+",
    },
    gaugeSub: {
      ar: "مستفيد يومياً",
      tr: "Günlük faydalanıcı",
      en: "Daily beneficiaries",
    },
    gaugeProgress: 0.85,
    gaugeFootnote: {
      ar: "مياه نقية مستمرة بالطاقة الشمسية 100% وبإشراف أهالي القرية.",
      tr: "Yerel köy komitelerinin denetiminde %100 güneş enerjisiyle çalışır.",
      en: "100% solar-powered operation managed by local village committees.",
    },
  },
  {
    id: "story-education",
    projectSlug: "turkey-hatay-orphan-sponsorship",
    icon: GraduationCap,
    title: {
      ar: "تعليم وكفالة الأيتام",
      tr: "Yetim Eğitim ve Hamiliği",
      en: "Orphan Care & Schooling",
    },
    description: {
      ar: "رعاية تعليمية ومعيشية شاملة تضمن عودة الأطفال الأيتام إلى مقاعد الدراسة وبناء مستقبلهم بأمان.",
      tr: "Yetim çocukların eğitim hayatından kopmaması için düzenli burs, kırtasiye ve sosyal destek sağlıyoruz.",
      en: "Holistic educational and living sponsorships keeping orphaned children thriving in safe classrooms.",
    },
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    gaugeHeader: {
      ar: "مؤشر الاستمرار التعليمي",
      tr: "Eğitime Devam Oranı",
      en: "School Retention Score",
    },
    gaugeValue: {
      ar: "98%",
      tr: "%98",
      en: "98%",
    },
    gaugeSub: {
      ar: "انتظام دراسي",
      tr: "Okula devamlılık",
      en: "Student retention",
    },
    gaugeProgress: 0.92,
    gaugeFootnote: {
      ar: "كفالة شهرية تغطي الرسوم الدراسية والغذاء والدعم النفسي.",
      tr: "Eğitim, beslenme ve psikososyal desteği kapsayan düzenli hamilik.",
      en: "Monthly support covering tuition, nutrition, and psychosocial care.",
    },
  },
  {
    id: "story-health",
    projectSlug: "africa-cataract-sight-surgery",
    icon: HeartPulse,
    title: {
      ar: "مخيمات النور الطبية",
      tr: "Gezici Sağlık Kampları",
      en: "Mobile Surgical Camps",
    },
    description: {
      ar: "قوافل جراحية متخصصة لإجراء عمليات العيون وإزالة المياه البيضاء وتوفير الدواء مجاناً في المناطق النائية.",
      tr: "Kırsal bölgelerde ücretsiz katarakt ameliyatları ve sağlık taramaları gerçekleştirerek hastaları ışığa kavuşturuyoruz.",
      en: "Specialist mobile surgeons performing free cataract operations and medical care in remote villages.",
    },
    image:
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    gaugeHeader: {
      ar: "مؤشر التدخل الجراحي",
      tr: "Cerrahi Başarı Skoru",
      en: "Surgical Impact Score",
    },
    gaugeValue: {
      ar: "1,000",
      tr: "1.000",
      en: "1,000",
    },
    gaugeSub: {
      ar: "عملية استعادة بصر",
      tr: "Başarılı ameliyat",
      en: "Sight surgeries",
    },
    gaugeProgress: 0.9,
    gaugeFootnote: {
      ar: "فحوصات، عمليات جراحية، وزراعة عدسات مجانية بالكامل.",
      tr: "Muayene, ameliyat ve mercek nakli tamamen ücretsiz sağlanır.",
      en: "Full screening, lens surgery, and post-op medication free of charge.",
    },
  },
  {
    id: "story-relief",
    projectSlug: "gaza-urgent-warmth-food",
    icon: Users,
    title: {
      ar: "الإغاثة والأمن الغذائي",
      tr: "Acil İnsani Yardım",
      en: "Frontline Food Relief",
    },
    description: {
      ar: "استجابة ميدانية فورية لتأمين الوجبات الساخنة والسلال الغذائية ومستلزمات الإيواء للأسر النازحة.",
      tr: "Kriz bölgelerindeki ailelere günlük sıcak yemek, gıda kolileri ve acil barınma desteği ulaştırıyoruz.",
      en: "Rapid frontline response delivering daily hot meals, food parcels, and shelter kits to displaced families.",
    },
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    gaugeHeader: {
      ar: "مؤشر الوصول الميداني",
      tr: "Sahaya Ulaşım Oranı",
      en: "Direct Field Reach",
    },
    gaugeValue: {
      ar: "+45K",
      tr: "+45B",
      en: "45K+",
    },
    gaugeSub: {
      ar: "مستفيد مباشر",
      tr: "Doğrudan faydalanıcı",
      en: "Direct beneficiaries",
    },
    gaugeProgress: 0.88,
    gaugeFootnote: {
      ar: "توزيع ميداني مباشر يضمن وصول الدعم لمستحقيه بأمان.",
      tr: "Yardımların ihtiyaç sahiplerine doğrudan ve güvenle teslimi.",
      en: "Verified frontline distribution reaching vulnerable families directly.",
    },
  },
];

const AUTO_ADVANCE_MS = 5500; // 5.5 seconds per story

export function ImpactStorySection() {
  const { language, dir, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  // fillProgress: 0 to 100 representing the arrow fill percentage
  const [fillProgress, setFillProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const isRtl = dir === "rtl";

  const goToSlide = useCallback((nextIdx: number) => {
    setActiveIndex(nextIdx);
    setFillProgress(0);
    startTimeRef.current = performance.now();
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) =>
      prev === 0 ? ACCORDION_STORIES.length - 1 : prev - 1
    );
    setFillProgress(0);
    startTimeRef.current = performance.now();
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) =>
      prev === ACCORDION_STORIES.length - 1 ? 0 : prev + 1
    );
    setFillProgress(0);
    startTimeRef.current = performance.now();
  }, []);

  // Smooth 60fps auto-advance timer that fills the arrow from 0% to 100%
  useEffect(() => {
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }
      const elapsed = now - startTimeRef.current;
      const pct = Math.min((elapsed / AUTO_ADVANCE_MS) * 100, 100);
      setFillProgress(pct);

      if (elapsed >= AUTO_ADVANCE_MS) {
        setActiveIndex((prev) => (prev + 1) % ACCORDION_STORIES.length);
        startTimeRef.current = now;
        setFillProgress(0);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [activeIndex]);

  const sectionHeadline = {
    ar: "مشاريع ميدانية بإشراف هندسي وإنساني متكامل. نرصد الاحتياج الفعلي، ونتتبّع جودة التنفيذ، ونصنع أثراً مستداماً يغيّر حياة المجتمعات.",
    tr: "Uzman saha ekiplerimizle tasarlanan kalıcı çözümler. İhtiyaçları tespit ediyor, süreci şeffaflıkla takip ediyor ve sürdürülebilir etki üretiyoruz.",
    en: "Designed by frontline humanitarian specialists. We screen critical field needs, track impact over time, and build sustainable community lifelines.",
  };

  // Semi-circle arc geometry (R = 44, π * 44 ≈ 138.2)
  const ARC_LENGTH = 138.2;
  // Circular ring circumference for the floating arrow timer (r = 19 => 2 * π * 19 ≈ 119.38)
  const RING_CIRCUMFERENCE = 119.38;
  const ringDashOffset =
    RING_CIRCUMFERENCE * (1 - Math.min(fillProgress, 100) / 100);

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

              <h2 className="text-lg sm:text-xl lg:text-[23px] font-brand font-bold text-[#0F2942] leading-[1.55]">
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
                className="w-11 h-11 rounded-full bg-slate-100/90 hover:bg-[#0F2942] text-slate-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
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
            {ACCORDION_STORIES.map((card, idx) => {
              const isActive = idx === activeIndex;
              const Icon = card.icon;
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
                          className="relative w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#0F2942] backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors shadow-md group/arrow"
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
                              cx="22"
                              cy="22"
                              r="19"
                              fill="none"
                              stroke="#00A3E0"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeDasharray={RING_CIRCUMFERENCE}
                              strokeDashoffset={ringDashOffset}
                            />
                          </svg>

                          {/* Arrow Icon */}
                          {isRtl ? (
                            <ArrowLeft className="relative z-10 w-4 h-4 text-[#0F2942] transition-transform group-hover/arrow:-translate-x-0.5" />
                          ) : (
                            <ArrowRight className="relative z-10 w-4 h-4 text-[#0F2942] transition-transform group-hover/arrow:translate-x-0.5" />
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
