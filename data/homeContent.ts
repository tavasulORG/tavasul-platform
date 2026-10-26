import type { HomeContent } from "@/types";

/**
 * Default content of the home page's impact-story section. The admin edits it under
 * site_settings (key = "home"); this file is the fallback while the database is empty.
 */
export const defaultHomeContent: HomeContent = {
  impactHeadline: {
    ar: "مشاريع ميدانية بإشراف هندسي وإنساني متكامل. نرصد الاحتياج الفعلي، ونتتبّع جودة التنفيذ، ونصنع أثراً مستداماً يغيّر حياة المجتمعات.",
    tr: "Uzman saha ekiplerimizle tasarlanan kalıcı çözümler. İhtiyaçları tespit ediyor, süreci şeffaflıkla takip ediyor ve sürdürülebilir etki üretiyoruz.",
    en: "Designed by frontline humanitarian specialists. We screen critical field needs, track impact over time, and build sustainable community lifelines.",
  },
  impactStories: [
  {
    id: "story-wash",
    projectSlug: "yemen-solar-water-wells",
    iconName: "Droplets",
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
    iconName: "GraduationCap",
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
    iconName: "HeartPulse",
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
    iconName: "Users",
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
  ],
};
