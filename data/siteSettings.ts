import type { SiteSettings } from "@/types";

/**
 * Default site settings. The admin edits them under site_settings (key = "general");
 * this object is the fallback while the database is empty and fills in any missing field.
 */
export const defaultSiteSettings: SiteSettings = {
  logo: "/images/logo.jpg",
  heroVideo: "/videos/hero-tawasul.mp4",
  heroPoster: "/images/hero-poster.jpg",
  aboutHeroImage: "/images/about-hero.jpg",
  sectorsHeroImage: "/images/sectors-hero.jpg",
  sectorsIndexImage: "/images/syria-housing-village.jpg",
  whereHeroImage: "/images/where-we-work-hero.jpg",
  projectsHeroImage: "/images/projects-hero.jpg",
  phone: "+90 534 000 0000",
  whatsapp: "+90 534 000 0000",
  email: "info@tawasul-tr.org",
  mapsQuery: "Fatih, İstanbul, Türkiye",
  socials: {
    facebook: "",
    instagram: "",
    x: "",
    youtube: "",
    linkedin: "",
  },
  demoPaymentMode: true,
};
