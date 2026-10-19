import { CountryRegion } from "@/types";

export const regionsData: CountryRegion[] = [
  {
    id: "reg-tr",
    slug: "turkey",
    flag: "🇹🇷",
    coverImage: "/images/turkey-historic-galata.jpg",
    name: {
      ar: "تركيا",
      tr: "Türkiye",
      en: "Turkey",
    },
    headline: {
      ar: "مقر الانطلاق، والاستجابة لكوارث الزلازل، ودعم الفئات الأكثر احتياجاً",
      tr: "Genel merkez, deprem bölgesi müdahaleleri ve yerel ihtiyaç sahiplerine destek",
      en: "Headquarters, earthquake recovery interventions, and vulnerable community assistance",
    },
    overview: {
      ar: "تحتضن مدينة إسطنبول المقر الرئيسي للجمعية، حيث تنطلق فرقنا التنسيقية والميدانية للإشراف على البرامج الإنسانية في ولايات الجنوب التركي المتضررة من زلزال كهرمان مرعش، إلى جانب برامج كفالة الأيتام والطلاب والتمكين المجتمعي.",
      tr: "Derneğimizin genel merkezi İstanbul'da yer almakta olup, ekiplerimiz 6 Şubat depreminden etkilenen güney illerimizde kalıcı konut, eğitim ve yetim destek projelerini yürütmektedir.",
      en: "Istanbul serves as our headquarters, steering field coordination across quake-affected southern provinces, alongside urban orphan care, student scholarships, and social integration initiatives.",
    },
    beneficiariesCount: 85000,
    activeProjectsCount: 8,
    keyInterventions: [
      {
        ar: "ترميم المنازل وتأمين الدعم الشتوي في مناطق الزلازل (هاتاي، كهرمان مرعش، غازي عنتاب).",
        tr: "Deprem bölgelerinde konut onarımı ve kışlık yardım dağıtımı.",
        en: "Home restoration and winter survival kits in earthquake zones.",
      },
      {
        ar: "كفالات الطلاب الجامعيين والتأهيل المهني للشباب.",
        tr: "Üniversite öğrenci bursları ve mesleki eğitim kursları.",
        en: "University scholarships and youth vocational certifications.",
      },
      {
        ar: "رعاية أسر الأيتام وتقديم الطرود الغذائية والصحية الشهرية.",
        tr: "Yetim ailelerine düzenli aylık gıda ve hijyen paketleri temini.",
        en: "Monthly orphan family sponsorships and essential sustenance.",
      },
    ],
  },
  {
    id: "reg-ye",
    slug: "yemen",
    flag: "🇾🇪",
    coverImage: "/images/yemen-historic-sanaa.jpg",
    name: {
      ar: "اليمن",
      tr: "Yemen",
      en: "Yemen",
    },
    headline: {
      ar: "أكثر من 30 عاماً من الجذور الميدانية الراسخة في إغاثة وتنمية المجتمع اليمني",
      tr: "30 yılı aşkın köklü saha tecrübesiyle Yemen halkına kesintisiz insani destek",
      en: "Over 30 years of deep-rooted field presence serving vulnerable Yemeni communities",
    },
    overview: {
      ar: "تعد اليمن المنطلق التاريخي لخبرات كوادرنا الميدانية الممتدة لأكثر من ثلاثة عقود. تتوزع مشاريعنا في محافظات تعز، مأرب، عدن، والحديدة، وتركز على حفر آبار المياه بالطاقة الشمسية، وإنقاذ الأطفال من سوء التغذية، ومراكز التدريب المهني للأسر المنتجة.",
      tr: "Yemen, kadromuzun 30 yıllık saha birikiminin doğduğu topraklardır. Taiz, Marib, Aden ve Hudeyde'de güneş enerjili su kuyuları, beslenme klinikleri ve meslek edindirme atölyeleri işletiyoruz.",
      en: "Yemen is the historical crucible of our team's 30+ year experience. Interventions across Taiz, Marib, Aden, and Hodeidah focus on solar water installations, therapeutic child feeding, and women craft workshops.",
    },
    beneficiariesCount: 240000,
    activeProjectsCount: 14,
    keyInterventions: [
      {
        ar: "حفر وتشغيل عشرات الآبار الارتوازية ومحطات تنقية المياه بالطاقة الشمسية.",
        tr: "Güneş enerjisiyle çalışan onlarca derin su kuyusu ve arıtma tesisi.",
        en: "Drilling and operating dozens of deep solar-powered artesian wells.",
      },
      {
        ar: "دعم مستشفيات الأمومة والطفولة ومراكز معالجة سوء التغذية الحاد.",
        tr: "Anne-çocuk sağlığı hastaneleri ve yetersiz beslenme tedavi merkezleri desteği.",
        en: "Supporting maternal-child hospitals and malnutrition stabilization units.",
      },
      {
        ar: "مشاريع التمكين الاقتصادي للأسر النازحة ومكافحة الفقر.",
        tr: "Yerinden edilmiş ailelere yönelik gelir getirici mikro projeler.",
        en: "Livelihood seed funding and sustainable poverty alleviation initiatives.",
      },
    ],
  },
  {
    id: "reg-sy",
    slug: "syria",
    flag: "🇸🇾",
    coverImage: "/images/syria-historic-aleppo.jpg",
    name: {
      ar: "سوريا",
      tr: "Suriye",
      en: "Syria",
    },
    headline: {
      ar: "استجابة إنسانية متواصلة لحماية وإيواء النازحين في الشمال السوري",
      tr: "Kuzey Suriye kamplarında yerinden edilmiş mazlumlara kesintisiz insani destek",
      en: "Continuous humanitarian lifeline safeguarding displaced populations in Northern Syria",
    },
    overview: {
      ar: "نعمل في مخيمات إدلب وريف حلب وريف اللاذقية لتأمين الاحتياجات الأساسية لملايين المهجرين قسراً. نركز على استبدال الخيام بوحدات سكنية كريمة ومجمعات سكنية متكاملة، إلى جانب محطات توزيع المياه والمدارس الميدانية والتدفئة في الشتاء القارس.",
      tr: "İdlib ve Halep kırsalındaki mülteci kamplarında çadır yerine briket evler inşa ediyor, temiz su tankerleri, sahra okulları ve kışlık yakacak desteği ulaştırıyoruz.",
      en: "Operating across Idlib and Aleppo camps, we replace weathered tents with dignified brick housing units, distribute clean drinking water, run mobile classrooms, and provide winter stoves and fuel.",
    },
    beneficiariesCount: 180000,
    activeProjectsCount: 11,
    keyInterventions: [
      {
        ar: "بناء الوحدات السكنية الكريمة (قرى إنسانية) بديلاً للخيام المهترئة.",
        tr: "Çadırların yerine kalıcı briket konut köyleri inşası.",
        en: "Constructing dignified permanent housing villages replacing worn canvas tents.",
      },
      {
        ar: "حملات التدفئة الشتوية والملابس والوقود للأطفال في برد الشتاء.",
        tr: "Kış mevsiminde yakacak, soba ve mont bot dağıtımları.",
        en: "Winter survival campaigns supplying heating stoves, fuel, and jackets.",
      },
      {
        ar: "تشغيل النقاط الطبية الميدانية وسيارات الإسعاف.",
        tr: "Sahra sağlık ocakları ve ambulans servislerinin işletilmesi.",
        en: "Operating mobile healthcare clinics and emergency patient transfers.",
      },
    ],
  },
  {
    id: "reg-ps",
    slug: "palestine",
    flag: "🇵🇸",
    coverImage: "/images/palestine-historic-jerusalem.jpg",
    name: {
      ar: "فلسطين",
      tr: "Filistin",
      en: "Palestine",
    },
    headline: {
      ar: "إغاثة طارئة عاجلة لقطاع غزة، وإطعام النازحين، وتوفير الرعاية الطبية الفورية",
      tr: "Gazze Şeridi'ne acil insani yardım, sıcak yemek ve acil tıbbi malzeme desteği",
      en: "Urgent emergency relief for Gaza, hot meals, drinking water, and trauma medical supplies",
    },
    overview: {
      ar: "أمام الكارثة الإنسانية غير المسبوقة في غزة، تعمل جمعية تواصل عبر شركائها الميدانيين لتوفير الإغاثة الطارئة: الوجبات الساخنة يومياً، وصهاريج مياه الشرب الصالحة، والمستلزمات الطبية للجرحى، والطرود الغذائية وحليب الأطفال ومخيمات الإيواء المؤقتة.",
      tr: "Gazze'deki insani felakete karşı yerel ortaklarımız aracılığıyla günlük sıcak yemek dağıtımı, temiz içme suyu tankerleri, yaralılar için tıbbi malzeme ve acil çadır temini sağlıyoruz.",
      en: "In response to the unprecedented catastrophe in Gaza, Tawasul coordinates with trusted frontline partners to provide thousands of daily hot meals, fresh water trucks, critical surgical supplies, baby milk, and emergency shelters.",
    },
    beneficiariesCount: 310000,
    activeProjectsCount: 9,
    keyInterventions: [
      {
        ar: "المطابخ الإنسانية وتوزيع آلاف الوجبات الساخنة يومياً للنازحين في غزة.",
        tr: "Gazze'de günlük binlerce kişilik sıcak yemek dağıtan aşevleri.",
        en: "Daily community kitchens distributing thousands of hot meals in Gaza shelters.",
      },
      {
        ar: "تسيير صهاريج مياه الشرب المعقمة ونقاط التحلية الميدانية.",
        tr: "Mültecilerin yoğun olduğu bölgelere temiz içme suyu tankerleri sevkiyatı.",
        en: "Dispatching fresh sanitized water trucks to overcrowded refuge areas.",
      },
      {
        ar: "توفير الأدوية الجراحية والمستهلكات الطبية للمستشفيات والعيادات الميدانية.",
        tr: "Hastanelere ve acil servis birimlerine cerrahi ve tıbbi malzeme temini.",
        en: "Supplying surgical drugs and trauma equipment to frontline medics.",
      },
    ],
  },
  {
    id: "reg-af",
    slug: "africa",
    flag: "🌍",
    coverImage: "/images/africa-historic-landmark.jpg",
    name: {
      ar: "دول أفريقيا المنكوبة",
      tr: "Afrika Kriz Bölgeleri",
      en: "African Crisis Zones",
    },
    headline: {
      ar: "مكافحة الجفاف والمجاعة، وحفر الآبار الارتوازية، ومكافحة العمى في أشد بلدان أفريقيا فقراً",
      tr: "Kuraklık ve açlıkla mücadele, derin su kuyuları ve katarakt operasyonları",
      en: "Combating drought and famine, drilling artesian wells, and reversing blindness across Africa",
    },
    overview: {
      ar: "تمتد أيادي تواصل إلى أشد المجتمعات عزلة وجفافاً في قارة أفريقيا (مثل تشاد، النيجر، الصومال، وموريتانيا) لحفر آبار المياه الصالحة للشرب، وتوزيع الأضاحي والسلال الغذائية، وتسيير مخيمات جراحة العيون (المياه البيضاء) لإعادة النور للمحرومين.",
      tr: "Çad, Nijer, Somali ve Moritanya gibi kuraklıktan etkilenen Afrika ülkelerinde derin su kuyuları açıyor, katarakt ameliyatlarıyla görme yetisini kazandırıyor ve gıda yardımları ulaştırıyoruz.",
      en: "Reaching the most isolated arid communities across Chad, Niger, Somalia, and Mauritania, we drill life-saving wells, conduct sight-restoring cataract surgeries, and deliver drought food relief.",
    },
    beneficiariesCount: 165000,
    activeProjectsCount: 7,
    keyInterventions: [
      {
        ar: "حفر الآبار الارتوازية العميقة وتجهيزها بمضخات لخدمة قرى كاملة.",
        tr: "Köylerin su ihtiyacını kalıcı olarak karşılayan derin sondaj su kuyuları.",
        en: "Deep artesian borehole wells serving entire rural villages perpetually.",
      },
      {
        ar: "مخيمات النور لجراحة المياه البيضاء (الكاتاراكت) وإعادة البصر لآلاف المرضى.",
        tr: "Binlerce kişiye ışık olan katarakt cerrahisi kampları.",
        en: "Sight-restoring cataract surgical camps curing preventable blindness.",
      },
      {
        ar: "توزيع السلال الغذائية وكفالات المساجد والمدارس القرآنية والمراكز.",
        tr: "Gıda kolisi dağıtımları ve eğitim kurumları desteği.",
        en: "Emergency nutrition parcels and rural community school support.",
      },
    ],
  },
];

