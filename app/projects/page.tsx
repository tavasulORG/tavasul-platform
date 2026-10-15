"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useDonation } from "@/context/DonationContext";
import { sectorsData } from "@/data/sectors";
import { regionsData } from "@/data/regions";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Search, Filter, Layers, MapPin, Heart } from "lucide-react";

export default function AllProjectsPage() {
  const { language, t } = useLanguage();
  const { projects } = useDonation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.summary.ar.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector = selectedSector === "all" || project.sectorSlug === selectedSector;
    const matchesCountry = selectedCountry === "all" || project.countrySlug === selectedCountry;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "urgent" && project.status === "urgent") ||
      (selectedStatus === "active" && project.status === "active") ||
      (selectedStatus === "completed" && project.status === "completed");

    return matchesSearch && matchesSector && matchesCountry && matchesStatus;
  });

  return (
    <div className="py-12 sm:py-20 space-y-12">
      {/* Hero Header */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full text-xs font-bold border border-primary-100">
          <Heart className="w-4 h-4 fill-primary-600" />
          <span>مشاريع الأثر الميداني</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          دليل المشاريع والحملات الإنسانية
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          اختر المشروع الذي يلامس قلبك، وساهم في إنقاذ الأرواح وبناء الاستقرار لملايين المحتاجين
        </p>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute top-3.5 start-3.5" />
              <input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-10 pe-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            {/* Sector Filter */}
            <div>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full py-2.5 px-3 rounded-2xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="all">جميع القطاعات ({t("all")})</option>
                {sectorsData.map((sec) => (
                  <option key={sec.id} value={sec.slug}>
                    {sec.title[language] || sec.title.ar}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full py-2.5 px-3 rounded-2xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="all">جميع الدول والمناطق</option>
                {regionsData.map((reg) => (
                  <option key={reg.id} value={reg.slug}>
                    {reg.flag} {reg.name[language] || reg.name.ar}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full py-2.5 px-3 rounded-2xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="all">جميع الحالات</option>
                <option value="urgent">عاجل جداً 🔥</option>
                <option value="active">مشاريع جارية ⏳</option>
                <option value="completed">مشاريع مكتملة ✅</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between pb-6">
          <span className="text-xs font-bold text-slate-500">
            تم العثور على <strong className="text-slate-900">{filteredProjects.length}</strong> مشروع
          </span>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 border border-slate-100 text-center space-y-3">
            <p className="text-slate-500 text-sm font-medium">
              لم يتم العثور على مشاريع مطابقة لبحثك.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSector("all");
                setSelectedCountry("all");
                setSelectedStatus("all");
              }}
              className="text-xs font-bold text-primary-600 hover:underline"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

