"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { CircleCheck, LoaderCircle, Mail, Send, TriangleAlert } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/context/LanguageContext";
import {
  ContactHeading,
  FORM_ID,
  SignalArcs,
  TOPICS,
  TOPIC_EVENT,
  TOPIC_LABEL,
  fadeUp,
  isTopic,
  mailtoHref,
  makeReference,
  pad,
  sendContactMessage,
  viewportOnce,
  type Topic,
  type TranslationKey,
} from "./shared";

interface Fields {
  name: string;
  email: string;
  phone: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof Fields, TranslationKey>>;

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; reference: string } | { kind: "failed" };

const EMPTY: Fields = { name: "", email: "", phone: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: Fields): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.name.trim()) errors.name = "contactErrorName";
  if (!EMAIL_RE.test(fields.email.trim())) errors.email = "contactErrorEmail";
  if (fields.message.trim().length < 10) errors.message = "contactErrorMessage";
  return errors;
}

const INPUT =
  "mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-100";

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

function Field({ label, hint, error, children }: FieldProps) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-3 text-xs font-bold text-slate-700">
        {label}
        {hint && <span className="font-medium text-slate-400">{hint}</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1.5 block text-xs font-semibold text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

const STEPS: { title: TranslationKey; desc: TranslationKey }[] = [
  { title: "contactAfterStep1Title", desc: "contactAfterStep1Desc" },
  { title: "contactAfterStep2Title", desc: "contactAfterStep2Desc" },
  { title: "contactAfterStep3Title", desc: "contactAfterStep3Desc" },
];

/** The message form (#form) beside a brand panel that says what happens after sending. */
export function ContactForm() {
  const { t, language } = useLanguage();
  const [topic, setTopic] = useState<Topic>("donation");
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [trap, setTrap] = useState("");

  // Preselect the topic from ?topic= (deep links) and from the department cards (custom event).
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("topic");
    if (isTopic(fromUrl)) setTopic(fromUrl);
    const onTopic = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      if (isTopic(detail)) setTopic(detail);
    };
    window.addEventListener(TOPIC_EVENT, onTopic);
    return () => window.removeEventListener(TOPIC_EVENT, onTopic);
  }, []);

  const update = (key: keyof Fields) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending") return;
    // A filled honeypot means a bot: pretend it worked and store nothing.
    if (trap) {
      setStatus({ kind: "sent", reference: makeReference() });
      return;
    }
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus({ kind: "sending" });
    const result = await sendContactMessage({ ...fields, topic, language });
    setStatus(result.ok ? { kind: "sent", reference: result.reference } : { kind: "failed" });
  }

  function reset() {
    setFields(EMPTY);
    setErrors({});
    setStatus({ kind: "idle" });
  }

  const sending = status.kind === "sending";
  const fallbackHref = mailtoHref(
    t("email"),
    `[${t(TOPIC_LABEL[topic])}] ${fields.name.trim()}`,
    `${fields.message.trim()}\n\n${fields.name.trim()}\n${fields.email.trim()}\n${fields.phone.trim()}`
  );

  return (
    <section id={FORM_ID} className="scroll-mt-28 bg-slate-50 pb-16 pt-28 sm:pb-24 sm:pt-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp} className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
            {status.kind === "sent" ? (
              <div className="py-10 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CircleCheck className="h-8 w-8" />
                </span>
                <h3 className="mt-6 font-brand text-2xl font-extrabold text-slate-900">{t("contactSuccessTitle")}</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">{t("contactSuccessDesc")}</p>
                <dl className="mx-auto mt-6 inline-flex items-center gap-3 rounded-full border border-dashed border-slate-300 px-5 py-2.5 text-sm">
                  <dt className="text-slate-500">{t("contactSuccessRef")}</dt>
                  <dd className="font-latin font-bold text-slate-900">
                    <bdi dir="ltr">{status.reference}</bdi>
                  </dd>
                </dl>
                <div>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-8 inline-flex items-center rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-800 transition-colors hover:border-primary-400 hover:text-primary-700"
                  >
                    {t("contactSuccessAgain")}
                  </button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit} className="space-y-7">
                <ContactHeading eyebrow={t("contactFormEyebrow")} title={t("contactFormTitle")} description={t("contactFormDesc")} />

                <fieldset>
                  <legend className="text-xs font-bold text-slate-700">{t("contactFieldTopic")}</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TOPICS.map((item) => (
                      <label key={item} className="cursor-pointer">
                        <input
                          type="radio"
                          name="topic"
                          value={item}
                          checked={topic === item}
                          onChange={() => setTopic(item)}
                          className="peer sr-only"
                        />
                        <span
                          className={clsx(
                            "inline-block rounded-full border px-4 py-2 text-xs font-bold transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-primary-100",
                            topic === item
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:text-primary-700"
                          )}
                        >
                          {t(TOPIC_LABEL[item])}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("contactFieldName")} error={errors.name && t(errors.name)}>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={fields.name}
                      onChange={update("name")}
                      placeholder={t("contactFieldNamePlaceholder")}
                      aria-invalid={Boolean(errors.name)}
                      className={clsx(INPUT, errors.name ? "border-red-300" : "border-slate-200")}
                    />
                  </Field>
                  <Field label={t("contactFieldEmail")} error={errors.email && t(errors.email)}>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      dir="ltr"
                      value={fields.email}
                      onChange={update("email")}
                      placeholder="name@example.com"
                      aria-invalid={Boolean(errors.email)}
                      className={clsx(INPUT, "text-start", errors.email ? "border-red-300" : "border-slate-200")}
                    />
                  </Field>
                </div>

                <Field label={t("contactFieldPhone")} hint={t("contactOptional")}>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    dir="ltr"
                    value={fields.phone}
                    onChange={update("phone")}
                    placeholder="+90 5xx xxx xx xx"
                    className={clsx(INPUT, "border-slate-200 text-start")}
                  />
                </Field>

                <Field label={t("contactFieldMessage")} error={errors.message && t(errors.message)}>
                  <textarea
                    name="message"
                    rows={5}
                    value={fields.message}
                    onChange={update("message")}
                    placeholder={t("contactFieldMessagePlaceholder")}
                    aria-invalid={Boolean(errors.message)}
                    className={clsx(INPUT, "resize-y", errors.message ? "border-red-300" : "border-slate-200")}
                  />
                </Field>

                {/* Honeypot: hidden from people, filled in by bots. */}
                <div aria-hidden="true" className="sr-only">
                  <label>
                    Company
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
                  </label>
                </div>

                {status.kind === "failed" && (
                  <div role="alert" className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-start">
                    <TriangleAlert className="h-5 w-5 shrink-0 text-red-600" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-bold text-red-800">{t("contactFailTitle")}</p>
                      <p className="text-xs leading-relaxed text-red-700">{t("contactFailDesc")}</p>
                    </div>
                    <a
                      href={fallbackHref}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-red-700 ring-1 ring-red-200 transition-colors hover:bg-red-100"
                    >
                      <Mail className="h-4 w-4" />
                      {t("contactFailMailto")}
                    </a>
                  </div>
                )}

                <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-sm text-[11px] leading-relaxed text-slate-500">{t("contactConsent")}</p>
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-black text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
                  >
                    {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 rtl:-scale-x-100" />}
                    {sending ? t("contactSending") : status.kind === "failed" ? t("contactRetry") : t("contactSubmit")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>

        {/* What happens next: three numbered steps on a brand panel. */}
        <motion.aside initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp} className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-3xl bg-primary-600 p-8 text-white sm:p-10 lg:sticky lg:top-28">
            <SignalArcs corner="bottom-end" className="-bottom-10 -end-10 h-64 w-64 text-white/15" />
            <div className="relative">
              <ContactHeading tone="light" eyebrow={t("contactAfterEyebrow")} title={t("contactAfterTitle")} />
              <ol className="mt-8 border-s-2 border-white/25 ps-7">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="relative pb-7 last:pb-0">
                    <span
                      aria-hidden
                      className="absolute -start-[45px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white font-latin text-xs font-bold text-primary-700"
                    >
                      {pad(i)}
                    </span>
                    <h3 className="font-bold leading-8">{t(step.title)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/85">{t(step.desc)}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-8 rounded-2xl bg-white/10 p-4 text-xs leading-relaxed text-white/90">{t("contactAfterNote")}</p>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
