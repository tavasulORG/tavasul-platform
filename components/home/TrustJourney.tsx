"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  ShieldCheck,
  Award,
  Handshake,
  Scale,
  Sprout,
  LucideIcon,
} from "lucide-react";

interface TrustNode {
  id: string;
  stepNumber: number; // 1 to 5
  icon: LucideIcon;
  titleKey:
    | "trustItem1Title"
    | "trustItem2Title"
    | "trustItem3Title"
    | "trustItem4Title"
    | "trustItem5Title";
  descKey:
    | "trustItem1Desc"
    | "trustItem2Desc"
    | "trustItem3Desc"
    | "trustItem4Desc"
    | "trustItem5Desc";
  arcPosition: "bottom" | "top";
  color: string;
  cx: number; // X center in 1100x390 SVG coordinate space
  cy: number; // Y center in 1100x390 SVG coordinate space
  arcPath: string;
}

/**
 * Compact tangent geometry in a 1100 x 390 coordinate system:
 * - Circle centers X: 130, 340, 550, 760, 970 (ΔX = 210)
 * - High centers Y (Nodes 1, 3, 5): 183
 * - Low centers Y (Nodes 2, 4): 209.7 (ΔY = 26.7)
 * - Thick arc radius R = 88, angle α = 41°
 */
const TRUST_NODES: TrustNode[] = [
  {
    id: "node-1",
    stepNumber: 1,
    icon: ShieldCheck,
    titleKey: "trustItem1Title",
    descKey: "trustItem1Desc",
    arcPosition: "bottom",
    color: "#0369A1", // Brand Deep Cyan
    cx: 130,
    cy: 183,
    arcPath: "M 63.59 240.73 A 88 88 0 0 0 196.41 240.73",
  },
  {
    id: "node-2",
    stepNumber: 2,
    icon: Award,
    titleKey: "trustItem2Title",
    descKey: "trustItem2Desc",
    arcPosition: "top",
    color: "#0277B1", // Brand Mid Cyan
    cx: 340,
    cy: 209.7,
    arcPath: "M 273.59 151.97 A 88 88 0 0 1 406.41 151.97",
  },
  {
    id: "node-3",
    stepNumber: 3,
    icon: Handshake,
    titleKey: "trustItem3Title",
    descKey: "trustItem3Desc",
    arcPosition: "bottom",
    color: "#0284C7", // Brand Ocean Cyan
    cx: 550,
    cy: 183,
    arcPath: "M 483.59 240.73 A 88 88 0 0 0 616.41 240.73",
  },
  {
    id: "node-4",
    stepNumber: 4,
    icon: Scale,
    titleKey: "trustItem4Title",
    descKey: "trustItem4Desc",
    arcPosition: "top",
    color: "#0194D0", // Brand Bright Cyan
    cx: 760,
    cy: 209.7,
    arcPath: "M 693.59 151.97 A 88 88 0 0 1 826.41 151.97",
  },
  {
    id: "node-5",
    stepNumber: 5,
    icon: Sprout,
    titleKey: "trustItem5Title",
    descKey: "trustItem5Desc",
    arcPosition: "bottom",
    color: "#00A3E0", // Tawasul Brand Cyan
    cx: 970,
    cy: 183,
    arcPath: "M 903.59 240.73 A 88 88 0 0 0 1036.41 240.73",
  },
];

const DASHED_CONNECTORS = [
  {
    id: "conn-1",
    afterStep: 1, // Draws after Node 1 appears, leading into Node 2
    d: "M 196.41 240.73 L 273.59 151.97",
    color: "#0277B1",
  },
  {
    id: "conn-2",
    afterStep: 2, // Draws after Node 2 appears, leading into Node 3
    d: "M 406.41 151.97 L 483.59 240.73",
    color: "#0284C7",
  },
  {
    id: "conn-3",
    afterStep: 3, // Draws after Node 3 appears, leading into Node 4
    d: "M 616.41 240.73 L 693.59 151.97",
    color: "#0194D0",
  },
  {
    id: "conn-4",
    afterStep: 4, // Draws after Node 4 appears, leading into Node 5
    d: "M 826.41 151.97 L 903.59 240.73",
    color: "#00A3E0",
  },
];

export function TrustJourney() {
  const { t, dir } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  // activeStep controls the sequential reveal: 0 (none) -> 1 -> 2 -> 3 -> 4 -> 5
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.38,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Step-by-step sequential timer: reveals Node 1, then Node 2, then Node 3, then Node 4, then Node 5
  useEffect(() => {
    if (!hasTriggered) return;

    const STEP_INTERVAL_MS = 650; // Clear 650ms pause between each node
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let step = 1; step <= 5; step++) {
      const timer = setTimeout(() => {
        setActiveStep(step);
      }, (step - 1) * STEP_INTERVAL_MS + 150);
      timers.push(timer);
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [hasTriggered]);

  const isRtl = dir === "rtl";

  return (
    <section
      ref={sectionRef}
      className="!mt-0 relative overflow-hidden py-7 sm:py-9 border-b border-slate-200/60"
      style={{
        background: isRtl
          ? "linear-gradient(135deg, #E2F1F8 0%, #EFF7FB 38%, #F8FAFC 72%, #FDFCFB 100%)"
          : "linear-gradient(225deg, #E2F1F8 0%, #EFF7FB 38%, #F8FAFC 72%, #FDFCFB 100%)",
      }}
    >
      {/* Top-End Dense Topographic / Ribbon Wave Lines */}
      <div className="absolute -top-6 end-0 w-72 sm:w-96 h-56 sm:h-64 pointer-events-none opacity-45">
        <svg
          viewBox="0 0 400 320"
          className={`w-full h-full text-[#8BB4C9] ${isRtl ? "-scale-x-100" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          {Array.from({ length: 18 }).map((_, i) => {
            const offset = i * 6;
            return (
              <path
                key={i}
                d={`M ${120 + offset * 0.8},0 C ${155 + offset},${95 + offset * 0.5} ${245 + offset * 0.6},${175 - offset * 0.4} 400,${140 - offset * 2.5}`}
                opacity={0.85 - i * 0.035}
              />
            );
          })}
        </svg>
      </div>

      {/* Middle-Start Concentric Ribbon Wave Lines */}
      <div className="absolute top-1/2 -translate-y-1/2 start-0 w-24 sm:w-32 h-60 sm:h-72 pointer-events-none opacity-40">
        <svg
          viewBox="0 0 140 360"
          className={`w-full h-full text-[#8BB4C9] ${isRtl ? "-scale-x-100" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          {Array.from({ length: 14 }).map((_, i) => {
            const r = i * 4.5;
            return (
              <path
                key={i}
                d={`M 0,${40 + r * 1.4} C ${82 - r * 1.1},${15 + r * 1.2} ${68 - r * 0.9},${180} 0,${310 - r * 2}`}
                opacity={0.8 - i * 0.04}
              />
            );
          })}
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title — Appears first when section triggers */}
        <div
          className={`mb-2 lg:mb-0 transition-all duration-500 ${
            hasTriggered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black font-brand text-brand-ink tracking-tight text-start">
            {t("whyTawasulTitle")}
          </h2>
        </div>

        {/* ================================================================ */}
        {/* DESKTOP & TABLET GEOMETRIC WAVE TIMELINE (md and above)          */}
        {/* Sequential Step-by-Step Reveal: Node 1 -> 2 -> 3 -> 4 -> 5       */}
        {/* ================================================================ */}
        <div className="hidden md:block relative w-full max-w-6xl mx-auto aspect-[1100/390] select-none">
          {/* Layer 1: SVG Thick Arcs + Progressive Dashed Tangent Connectors */}
          <svg
            viewBox="0 0 1100 390"
            className={`absolute inset-0 w-full h-full pointer-events-none ${
              isRtl ? "-scale-x-100" : ""
            }`}
          >
            <defs>
              {/* Animated stroke masks so each dashed connector draws progressively */}
              {DASHED_CONNECTORS.map((conn) => {
                const isConnActive = activeStep >= conn.afterStep;
                return (
                  <mask id={`mask-${conn.id}`} key={`mask-${conn.id}`}>
                    <path
                      d={conn.d}
                      fill="none"
                      stroke="white"
                      strokeWidth="8"
                      strokeDasharray="130"
                      strokeDashoffset={isConnActive ? "0" : "130"}
                      style={{
                        transition: isConnActive
                          ? "stroke-dashoffset 380ms ease-in-out 260ms"
                          : "none",
                      }}
                    />
                  </mask>
                );
              })}
            </defs>

            {/* 4 Dashed Diagonal Connectors revealed dash-by-dash via mask */}
            {DASHED_CONNECTORS.map((conn) => (
              <path
                key={conn.id}
                d={conn.d}
                fill="none"
                stroke={conn.color}
                strokeWidth="2.8"
                strokeDasharray="6 5"
                mask={`url(#mask-${conn.id})`}
              />
            ))}

            {/* 5 Thick Semi-Circular Arcs cradling each white circle */}
            {TRUST_NODES.map((node) => {
              const isNodeActive = activeStep >= node.stepNumber;
              return (
                <path
                  key={`arc-${node.id}`}
                  d={node.arcPath}
                  fill="none"
                  stroke={node.color}
                  strokeWidth="17"
                  strokeLinecap="butt"
                  strokeDasharray="200"
                  strokeDashoffset={isNodeActive ? "0" : "200"}
                  style={{
                    transition: isNodeActive
                      ? "stroke-dashoffset 520ms cubic-bezier(0.22, 1, 0.36, 1)"
                      : "none",
                  }}
                />
              );
            })}
          </svg>

          {/* Layer 2: 5 Pure White Floating Circles + Tightly Positioned Text Blocks */}
          {TRUST_NODES.map((node) => {
            const Icon = node.icon;
            const isNodeActive = activeStep >= node.stepNumber;

            // Percentage coordinates inside the 1100x390 aspect box
            const posPercentX = (node.cx / 1100) * 100; // 11.82%, 30.91%, 50%, 69.09%, 88.18%
            const posPercentY = (node.cy / 390) * 100; // 46.92% (high) or 53.77% (low)

            const circleTransform = isRtl
              ? `translate(50%, -50%) scale(${isNodeActive ? 1 : 0.45})`
              : `translate(-50%, -50%) scale(${isNodeActive ? 1 : 0.45})`;

            const horizontalPos = isRtl
              ? { right: `${posPercentX}%` }
              : { left: `${posPercentX}%` };

            const textHorizontalStyle = isRtl
              ? { right: `${posPercentX - 6}%` }
              : { left: `${posPercentX - 6}%` };

            return (
              <React.Fragment key={node.id}>
                {/* Pure White Circle with Spring Pop-in Animation */}
                <div
                  className="group absolute w-[12%] aspect-square rounded-full bg-white flex items-center justify-center shadow-[0_14px_34px_-4px_rgba(15,45,74,0.16),0_4px_12px_-2px_rgba(15,45,74,0.08)] hover:shadow-[0_20px_42px_-4px_rgba(0,163,224,0.25)] cursor-default z-10"
                  style={{
                    top: `${posPercentY}%`,
                    ...horizontalPos,
                    opacity: isNodeActive ? 1 : 0,
                    transform: circleTransform,
                    transition:
                      "opacity 420ms ease-out, transform 520ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 300ms ease",
                  }}
                >
                  <Icon
                    className="w-[42%] h-[42%] transition-transform duration-300 group-hover:scale-110"
                    style={{ color: node.color }}
                    strokeWidth={1.65}
                  />
                </div>

                {/* Alternating Text Label — Appears right as its Circle & Arc finish */}
                <div
                  className="absolute w-[17.5%] text-start z-20"
                  style={{
                    ...textHorizontalStyle,
                    ...(node.arcPosition === "top"
                      ? { bottom: "73.2%" }
                      : { top: "73.8%" }),
                    opacity: isNodeActive ? 1 : 0,
                    transform: isNodeActive
                      ? "translateY(0)"
                      : node.arcPosition === "top"
                      ? "translateY(12px)"
                      : "translateY(-12px)",
                    transition:
                      "opacity 450ms ease-out 120ms, transform 450ms cubic-bezier(0.22, 1, 0.36, 1) 120ms",
                  }}
                >
                  <h3 className="font-extrabold text-[13px] lg:text-[15px] text-brand-ink leading-snug mb-1">
                    {t(node.titleKey)}
                  </h3>
                  <p className="text-[11px] lg:text-[12.5px] text-slate-600 leading-relaxed">
                    {t(node.descKey)}
                  </p>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* ================================================================ */}
        {/* MOBILE VERTICAL TIMELINE (Phones < 768px)                        */}
        {/* Sequential Step-by-Step Reveal: Node 1 -> 2 -> 3 -> 4 -> 5       */}
        {/* ================================================================ */}
        <div className="md:hidden relative mt-5 space-y-4 ps-2">
          <div
            className="absolute top-8 bottom-8 start-[38px] w-0.5 border-s-2 border-dashed border-[#2B6999]/50 origin-top"
            style={{
              opacity: activeStep >= 1 ? 1 : 0,
              transform: `scaleY(${Math.min(activeStep / 5, 1)})`,
              transition: "transform 600ms ease-out, opacity 400ms ease-out",
            }}
          />

          {TRUST_NODES.map((node) => {
            const Icon = node.icon;
            const isNodeActive = activeStep >= node.stepNumber;

            return (
              <div
                key={`mob-${node.id}`}
                className="relative flex items-center gap-4"
                style={{
                  opacity: isNodeActive ? 1 : 0,
                  transform: isNodeActive ? "translateY(0)" : "translateY(14px)",
                  transition:
                    "opacity 450ms ease-out, transform 450ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <div className="relative w-[68px] h-[68px] shrink-0 flex items-center justify-center">
                  <svg
                    viewBox="0 0 80 80"
                    className={`absolute inset-0 w-full h-full ${
                      isRtl ? "" : "-scale-x-100"
                    }`}
                  >
                    <path
                      d="M 40 4 A 36 36 0 0 1 40 76"
                      fill="none"
                      stroke={node.color}
                      strokeWidth="6"
                      strokeLinecap="butt"
                      strokeDasharray="120"
                      strokeDashoffset={isNodeActive ? "0" : "120"}
                      style={{
                        transition: isNodeActive
                          ? "stroke-dashoffset 500ms ease-out"
                          : "none",
                      }}
                    />
                  </svg>
                  <div className="relative z-10 w-13 h-13 rounded-full bg-white shadow-[0_8px_20px_-2px_rgba(15,45,74,0.16)] flex items-center justify-center p-3">
                    <Icon
                      className="w-6 h-6"
                      style={{ color: node.color }}
                      strokeWidth={1.75}
                    />
                  </div>
                </div>

                <div className="flex-1 py-1 text-start">
                  <h3 className="font-extrabold text-sm text-brand-ink mb-0.5">
                    {t(node.titleKey)}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t(node.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
