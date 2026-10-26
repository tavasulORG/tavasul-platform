"use client";

import clsx from "clsx";
import type { Language } from "@/types";
import type { translations } from "@/data/translations";
import { supabase } from "@/lib/supabase";

export { EASE, fadeUp, stagger, viewportOnce } from "@/components/about/shared";
export { pad } from "@/components/sectors/shared";

export type TranslationKey = keyof typeof translations.ar;
export type Translate = (key: TranslationKey) => string;

/** Anchor of the form section; the hero button and the department cards scroll to it. */
export const FORM_ID = "form";

export const TOPICS = ["donation", "project", "partnership", "volunteer", "media", "other"] as const;
export type Topic = (typeof TOPICS)[number];

export const TOPIC_LABEL: Record<Topic, TranslationKey> = {
  donation: "contactTopicDonation",
  project: "contactTopicProject",
  partnership: "contactTopicPartnership",
  volunteer: "contactTopicVolunteer",
  media: "contactTopicMedia",
  other: "contactTopicOther",
};

export function isTopic(value: unknown): value is Topic {
  return typeof value === "string" && (TOPICS as readonly string[]).includes(value);
}

/** Fired by the department cards; the form listens and preselects the topic. */
export const TOPIC_EVENT = "tawasul:contact-topic";

/** Preselect a topic in the form, mirror it in the URL (?topic=) and scroll the form into view. */
export function requestTopic(topic: Topic) {
  window.dispatchEvent(new CustomEvent<Topic>(TOPIC_EVENT, { detail: topic }));
  const url = new URL(window.location.href);
  url.searchParams.set("topic", topic);
  url.hash = FORM_ID;
  window.history.replaceState(window.history.state, "", url);
  document.getElementById(FORM_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* Link helpers built from the `phone`, `email` and `address` translation keys. */

const digits = (phone: string) => phone.replace(/\D/g, "");

export const whatsappHref = (phone: string) => `https://wa.me/${digits(phone)}`;
export const telHref = (phone: string) => `tel:+${digits(phone)}`;
export const mapsHref = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export function mailtoHref(email: string, subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString().replace(/\+/g, "%20");
  return qs ? `mailto:${email}?${qs}` : `mailto:${email}`;
}

/* Sending */

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  topic: Topic;
  message: string;
  language: Language;
}

export type SendResult = { ok: true; reference: string } | { ok: false; reason: string };

/** "CM-20261027-4F7K": the sender's local date plus four random base-36 characters, quoted back to them. */
export function makeReference(now = new Date()) {
  const ymd = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, "0")).join("");
  const tail = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "0");
  return `CM-${ymd}-${tail}`;
}

/** Stores the message in the contact_messages table (supabase/schema.sql). Never throws. */
export async function sendContactMessage(payload: ContactPayload): Promise<SendResult> {
  const reference = makeReference();
  try {
    const { error } = await supabase.from("contact_messages").insert({
      reference,
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim() || null,
      topic: payload.topic,
      message: payload.message.trim(),
      language: payload.language,
    });
    if (error) return { ok: false, reason: error.message };
    return { ok: true, reference };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}

/* Decoration and heading */

type Corner = "top-end" | "bottom-end" | "top-start" | "bottom-start";

const CORNER_CENTER: Record<Corner, [number, number]> = {
  "top-end": [200, 0],
  "bottom-end": [200, 200],
  "top-start": [0, 0],
  "bottom-start": [0, 200],
};

interface SignalArcsProps {
  /** Which corner of the box the arcs radiate from; end/start follow the text direction. */
  corner?: Corner;
  className?: string;
}

/** Concentric arcs around one corner: the page's "signal" motif. Position the box with absolute utilities. */
export function SignalArcs({ corner = "top-end", className }: SignalArcsProps) {
  const [cx, cy] = CORNER_CENTER[corner];
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      fill="none"
      className={clsx("pointer-events-none absolute rtl:-scale-x-100", className)}
    >
      {[36, 68, 100, 132, 164, 196].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth="1.25" />
      ))}
    </svg>
  );
}

interface HeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  tone?: "dark" | "light";
}

/** A square dot and a short eyebrow over the title, like a form's section label. */
export function ContactHeading({ eyebrow, title, description, align = "start", tone = "dark" }: HeadingProps) {
  const centered = align === "center";
  const dark = tone === "dark";

  return (
    <div className={clsx("space-y-3", centered && "mx-auto max-w-2xl text-center")}>
      {eyebrow && (
        <span className={clsx("inline-flex items-center gap-2 text-xs font-bold", dark ? "text-primary-600" : "text-primary-100")}>
          <span aria-hidden className={clsx("h-2 w-2 rounded-sm", dark ? "bg-primary-500" : "bg-primary-200")} />
          {eyebrow}
        </span>
      )}
      <h2
        className={clsx(
          "font-brand text-2xl font-extrabold leading-tight sm:text-3xl lg:text-[2.125rem]",
          dark ? "text-slate-900" : "text-white"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={clsx("text-sm leading-relaxed sm:text-base", dark ? "text-slate-500" : "text-white/80")}>{description}</p>
      )}
    </div>
  );
}
