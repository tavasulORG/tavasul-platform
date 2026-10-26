"use client";

import type { ComponentType } from "react";
import { motion } from "framer-motion";
import type { LucideProps } from "lucide-react";
import { ArrowRight, FolderKanban, HeartHandshake, Megaphone, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ContactHeading, fadeUp, requestTopic, stagger, viewportOnce, type Topic, type TranslationKey } from "./shared";

interface Department {
  icon: ComponentType<LucideProps>;
  title: TranslationKey;
  desc: TranslationKey;
  /** The form topic this department's button preselects. */
  topic: Topic;
}

const DEPARTMENTS: Department[] = [
  { icon: HeartHandshake, title: "contactDeptDonorsTitle", desc: "contactDeptDonorsDesc", topic: "donation" },
  { icon: FolderKanban, title: "contactDeptProjectsTitle", desc: "contactDeptProjectsDesc", topic: "project" },
  { icon: Users, title: "contactDeptVolunteerTitle", desc: "contactDeptVolunteerDesc", topic: "volunteer" },
  { icon: Megaphone, title: "contactDeptMediaTitle", desc: "contactDeptMediaDesc", topic: "media" },
];

/** Four departments; each button fills in the form's topic and scrolls back up to it. */
export function ContactDepartments() {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
          <ContactHeading align="center" eyebrow={t("contactDeptEyebrow")} title={t("contactDeptTitle")} description={t("contactDeptDesc")} />
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {DEPARTMENTS.map(({ icon: Icon, title, desc, topic }) => (
            <motion.li key={title} variants={fadeUp} className="flex flex-col rounded-2xl bg-slate-50 p-6 transition-colors hover:bg-primary-50">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-brand text-lg font-extrabold text-slate-900">{t(title)}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{t(desc)}</p>
              <button
                type="button"
                onClick={() => requestTopic(topic)}
                className="mt-6 inline-flex items-center gap-2 self-start text-sm font-bold text-primary-700 transition-colors hover:text-primary-900"
              >
                {t("contactDeptAction")}
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
