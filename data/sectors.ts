import { Sector } from "@/types";

export const sectorsData: Sector[] = [
  {
    id: "sec-1",
    slug: "education",
    iconName: "GraduationCap",
    coverImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    title: {
      ar: "التعليم والتوعية المجتمعية",
      tr: "Eğitim ve Toplumsal Bilinçlendirme",
      en: "Education and Community Awareness",
    },
    subtitle: {
      ar: "بناء العقول وتأهيل أجيال المستقبل المعرفية والمهنية",
      tr: "Gelecek nesillerin bilgi ve meslek donanımıyla inşası",
      en: "Nurturing minds and empowering future generations with knowledge",
    },
    description: {
      ar: "يعد التعليم حجر الزاوية في كسر دائرة الفقر والجهل. نعمل على تشييد وترميم المدارس، وتوفير الحقائب المدرسية والزي الرسمي، وكفالة المعلمين والطلاب، وتجهيز معامل الحاسوب ومراكز التدريب المهني في المجتمعات المنكوبة ومخيمات النزوح.",
      tr: "Eğitim, yoksulluk döngüsünü kırmanın temel taşıdır. Kriz bölgelerinde okulların inşası ve onarımı, kırtasiye desteği, öğretmen ve öğrenci bursları ve mesleki eğitim merkezlerinin kurulması için çalışıyoruz.",
      en: "Education is the cornerstone of breaking poverty cycles. We build and rehabilitate schools, supply student kits, sponsor educators and students, and equip vocational labs across crisis-affected regions.",
    },
    objectives: [
      {
        ar: "تأمين بيئة تعليمية آمنة ومجهزة للأطفال في مخيمات النزوح والمناطق النائية.",
        tr: "Mülteci kamplarında ve kırsal alanlarda çocuklar için güvenli eğitim ortamı sağlamak.",
        en: "Provide safe and fully equipped educational environments in refugee camps and rural hubs.",
      },
      {
        ar: "كفالة الطلاب المتفوقين ودعم التعليم الجامعي والمهني.",
        tr: "Başarılı öğrencilere burs sağlamak ve mesleki eğitimi desteklemek.",
        en: "Sponsor outstanding students and facilitate university and vocational paths.",
      },
      {
        ar: "إطلاق حملات التوعية المجتمعية وحماية الطفل ومحو الأمية.",
        tr: "Toplumsal bilinçlendirme, çocuk koruma ve okuryazarlık kampanyaları düzenlemek.",
        en: "Launch community awareness, child protection, and literacy campaigns.",
      },
    ],
    stats: {
      projectsCount: 14,
      beneficiariesCount: 42500,
      completedProjects: 11,
    },
  },
  {
    id: "sec-2",
    slug: "health",
    iconName: "HeartPulse",
    coverImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    title: {
      ar: "الصحة والتغذية",
      tr: "Sağlık ve Beslenme",
      en: "Health and Nutrition",
    },
    subtitle: {
      ar: "إنقاذ الأرواح وتوفير الرعاية الطبية والدواء للمحتاجين",
      tr: "Hayat kurtaran sağlık hizmetleri ve temel beslenme desteği",
      en: "Saving lives and delivering vital healthcare and nutrition",
    },
    description: {
      ar: "ندعم المنظومات الصحية المتداعية عبر تسيير القوافل الطبية الجراحية، ودعم مراكز غسيل الكلى، وإجراء عمليات العيون وإزالة المياه البيضاء، وتأمين الأدوية للمصابين بالأمراض المزمنة، بالإضافة لبرامج مكافحة سوء التغذية الحاد للأمهات والأطفال.",
      tr: "Gezici sağlık klinikleri, cerrahi operasyonlar, diyaliz merkezleri desteği ve yetersiz beslenmeyle mücadele programlarıyla kriz bölgelerindeki kırılgan sağlık sistemlerini destekliyoruz.",
      en: "We support vulnerable healthcare systems via mobile surgical clinics, dialysis support, cataract surgeries, essential pharmaceuticals, and targeted maternal/child nutrition programs.",
    },
    objectives: [
      {
        ar: "إجراء العمليات الجراحية العاجلة ومكافحة أمراض العيون والعمى.",
        tr: "Acil cerrahi operasyonlar ve katarakt ameliyatları gerçekleştirmek.",
        en: "Perform urgent surgeries and eliminate preventable blindness through cataract campaigns.",
      },
      {
        ar: "توفير أجهزة ومستلزمات المستشفيات ومراكز الرعاية الأولية.",
        tr: "Hastanelere ve birinci basamak sağlık merkezlerine tıbbi cihaz temin etmek.",
        en: "Equip rural hospitals and primary care clinics with life-saving equipment.",
      },
      {
        ar: "مكافحة سوء التغذية وتقديم المكملات الغذائية للأطفال والحوامل.",
        tr: "Çocuklarda ve hamile kadınlarda yetersiz beslenmeyi önleyici gıda takviyeleri sağlamak.",
        en: "Combat severe acute malnutrition and deliver therapeutic feeding supplements.",
      },
    ],
    stats: {
      projectsCount: 22,
      beneficiariesCount: 88400,
      completedProjects: 18,
    },
  },
  {
    id: "sec-3",
    slug: "emergency-relief",
    iconName: "AlertTriangle",
    coverImage: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
    title: {
      ar: "الإغاثة الطارئة والاستجابة الإنسانية",
      tr: "Acil Yardım ve İnsani Müdahale",
      en: "Emergency Relief and Humanitarian Response",
    },
    subtitle: {
      ar: "استجابة فورية ميدانية في الخطوط الأمامية للكوارث والأزمات",
      tr: "Kriz ve afet anlarında ilk saatlerde sahada hızlı müdahale",
      en: "Rapid frontline response in times of acute disasters and conflicts",
    },
    description: {
      ar: "نمتلك فرق تدخل سريع جاهزة للانتشار فور وقوع الزلازل والسيول والصراعات. نقوم بتوزيع الطرود الغذائية الطارئة، والوجبات الساخنة، والبطانيات ووسائل التدفئة، وتأمين الاحتياجات الحيوية التي تحفظ الكرامة وتنقذ الأرواح في الساعات الأولى للأزمة.",
      tr: "Deprem, sel ve çatışma gibi afet durumlarında ilk saatlerde harekete geçen acil müdahale ekiplerimizle gıda paketleri, sıcak yemek, kışlık giysi ve çadır desteği sağlıyoruz.",
      en: "Our rapid intervention teams mobilize immediately upon earthquakes, floods, and armed crises, providing survival food parcels, hot meals, heating, and emergency dignity kits.",
    },
    objectives: [
      {
        ar: "سرعة التدخل الميداني خلال 24-48 ساعة من وقوع الكوارث.",
        tr: "Afet sonrasında 24-48 saat içinde ilk insani yardımı ulaştırmak.",
        en: "Execute on-the-ground emergency relief within 24-48 hours of crisis onset.",
      },
      {
        ar: "تأمين السلال الغذائية المتكاملة ووسائل التدفئة والوقود شتاءً.",
        tr: "Kapsamlı gıda kolileri, kışlık yakıt ve ısıtma araçları dağıtmak.",
        en: "Distribute comprehensive nutritional food baskets and winter heating supplies.",
      },
      {
        ar: "إغاثة مناطق الحصار والنزوح القسري في فلسطين واليمن وسوريا.",
        tr: "Filistin, Yemen ve Suriye'deki abluka ve göç bölgelerine acil yardım sağlamak.",
        en: "Provide life-saving assistance in blockaded and forced displacement zones.",
      },
    ],
    stats: {
      projectsCount: 38,
      beneficiariesCount: 195000,
      completedProjects: 34,
    },
  },
  {
    id: "sec-4",
    slug: "economic-empowerment",
    iconName: "TrendingUp",
    coverImage: "https://images.unsplash.com/photo-1534951009808-766178b47a4f?auto=format&fit=crop&w=1200&q=80",
    title: {
      ar: "التمكين الاقتصادي والتنمية المستدامة",
      tr: "Ekonomik Güçlendirme ve Sürdürülebilir Kalkınma",
      en: "Economic Empowerment and Sustainable Development",
    },
    subtitle: {
      ar: "تحويل الأسر المستهلكة إلى أسر منتجة ذات اكتفاء ذاتي كريم",
      tr: "Tüketen aileleri üreten ve kendi kendine yeten bağımsız ailelere dönüştürmek",
      en: "Transforming dependent households into self-reliant productive producers",
    },
    description: {
      ar: "نؤمن بأن الكرامة الإنسانية تتحقق بتمكين الإنسان من كسب عيشه بيده. نمنح القروض الحسنة والمنح التأسيسية للمشاريع متناهية الصغر، ونوفر ماكينات الخياطة، ورؤوس الماشية، ومناحل العسل، والتدريب الحرفي للشباب وأرباب الأسر.",
      tr: "İnsan onurunun kendi emeğiyle geçinmekten geçtiğine inanıyoruz. Küçük işletme hibeleri, dikiş atölyeleri, hayvancılık ve arıcılık projeleriyle ailelerin gelir elde etmesini sağlıyoruz.",
      en: "We believe human dignity flourishes through self-reliance. We furnish micro-enterprise seed grants, sewing units, livestock, beekeeping, and artisan vocational training for breadwinners.",
    },
    objectives: [
      {
        ar: "تمويل وتأسيس المشاريع الصغيرة للأسر الأشد فقراً والأرامل.",
        tr: "Yoksul ailelere ve dul annelere mikro girişim finansmanı sağlamak.",
        en: "Fund and launch micro-businesses for destitute households and widowed mothers.",
      },
      {
        ar: "تأهيل الشباب لسوق العمل بدورات مهنية متخصصة.",
        tr: "Gençleri istihdama kazandıracak mesleki eğitim kursları düzenlemek.",
        en: "Equip youth with specialized market-driven vocational certifications.",
      },
      {
        ar: "دعم سلاسل الإنتاج الزراعي والحيواني في الأرياف.",
        tr: "Kırsal kesimde tarımsal ve hayvansal üretim zincirlerini desteklemek.",
        en: "Support sustainable agricultural and livestock value chains in rural communities.",
      },
    ],
    stats: {
      projectsCount: 19,
      beneficiariesCount: 16800,
      completedProjects: 15,
    },
  },
  {
    id: "sec-5",
    slug: "child-women",
    iconName: "Users",
    coverImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    title: {
      ar: "رعاية الطفل وتمكين المرأة",
      tr: "Çocuk Koruma ve Kadının Güçlendirilmesi",
      en: "Child Protection and Women Empowerment",
    },
    subtitle: {
      ar: "حماية الطفولة ورعاية الأيتام وبناء قدرات المرأة المعيلة",
      tr: "Çocukların korunması, yetim hamiliği ve kadınların sosyal güçlenmesi",
      en: "Safeguarding childhood, sponsoring orphans, and empowering female heads of households",
    },
    description: {
      ar: "نخصص برامج نوعية لحماية الطفل وكفالة الأيتام الشاملة (معيشياً، وتعليمياً، ونفسياً)، ومراكز الدعم النفسي والاجتماعي للأطفال ضحايا الحروب، إلى جانب تأهيل الأمهات والمعيلات بمهارات قيادية وحرفية تؤمّن مستقبلاً آمناً لأسرهن.",
      tr: "Yetim sponsorluğu, çocuk koruma merkezleri, savaş mağduru çocuklara psikososyal destek ve kadınlara yönelik rehberlik ve meslek edindirme programları sunuyoruz.",
      en: "We deliver holistic orphan sponsorships (covering livelihood, schooling, and health), child psychosocial recovery hubs, and leadership/artisan empowerment programs for widowed mothers.",
    },
    objectives: [
      {
        ar: "الكفالة الشاملة للأيتام وضمان استمرارهم في التعليم.",
        tr: "Yetimlerin eğitim, gıda ve sağlık ihtiyaçlarını karşılayan düzenli hamiliğin sağlanması.",
        en: "Deliver comprehensive orphan sponsorships ensuring unhindered school retention.",
      },
      {
        ar: "تأسيس مراكز رعاية وتأهيل نفسي للأطفال المتأثرين بالنزاعات.",
        tr: "Savaş travması yaşayan çocuklar için psikososyal destek merkezleri kurmak.",
        en: "Establish psychological rehabilitation centers for war-affected traumatized children.",
      },
      {
        ar: "مشاريع الدخل التنموي للنساء الأرامل وربات البيوت.",
        tr: "Dul ve dar gelirli kadınlar için gelir getirici üretim projeleri başlatmak.",
        en: "Launch sustainable income generation projects for female-led households.",
      },
    ],
    stats: {
      projectsCount: 26,
      beneficiariesCount: 34200,
      completedProjects: 22,
    },
  },
  {
    id: "sec-6",
    slug: "wash",
    iconName: "Droplets",
    coverImage: "/images/impact-solar-water.jpg",
    title: {
      ar: "المياه والإصحاح البيئي (WASH)",
      tr: "Su ve Çevre Sağlığı (WASH)",
      en: "Water, Sanitation and Hygiene (WASH)",
    },
    subtitle: {
      ar: "سقيا الماء الصالح للشرب وتشييد شبكات الصرف الصحي المستدامة",
      tr: "Temiz içme suyuna erişim ve sürdürülebilir hijyen altyapısı",
      en: "Delivering clean potable water and sustainable sanitation systems",
    },
    description: {
      ar: "الماء شريان الحياة. نقوم بحفر الآبار الارتوازية والسطحية المزودة بالطاقة الشمسية، ومد شبكات المياه النظيفة للقرى المحرومة، وتركيب محطات تحلية المياه، وتوزيع مياه الشرب عبر الصهاريج في مخيمات النازحين للوقاية من الأوبئة.",
      tr: "Güneş enerjili derin su kuyuları açıyor, köylere içme suyu şebekeleri çekiyor, su arıtma tesisleri kuruyor ve kamplara tankerlerle temiz su temin ediyoruz.",
      en: "Water is life. We construct solar-powered deep artesian wells, install water distribution networks in dry villages, build filtration plants, and run emergency water trucking in refugee encampments.",
    },
    objectives: [
      {
        ar: "حفر الآبار الارتوازية وتجهيزها بمنظومات ضخ شمسية مستدامة.",
        tr: "Güneş enerjili derin su kuyuları açarak köylere temiz su sağlamak.",
        en: "Drill deep artesian wells powered by reliable eco-friendly solar systems.",
      },
      {
        ar: "توفير مياه الشرب النقية للمخيمات والمدارس والمراكز الصحية.",
        tr: "Kamplara, okullara ve sağlık merkezlerine temiz içme suyu ulaştırmak.",
        en: "Supply clean potable water to camps, schools, and medical clinics.",
      },
      {
        ar: "مشاريع الإصحاح البيئي للحد من انتشار الأوبئة والكوليرا.",
        tr: "Kolera ve salgın hastalıkları önleyici hijyen ve sanitasyon projeleri yürütmek.",
        en: "Implement sanitation and waste containment projects to halt waterborne epidemics.",
      },
    ],
    stats: {
      projectsCount: 31,
      beneficiariesCount: 145000,
      completedProjects: 28,
    },
  },
  {
    id: "sec-7",
    slug: "shelter",
    iconName: "Home",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    title: {
      ar: "الإيواء والاحتياجات الأساسية",
      tr: "Barınma ve Temel İhtiyaçlar",
      en: "Shelter and Essential Non-Food Items",
    },
    subtitle: {
      ar: "سكن كريم يحفظ الخصوصية والأمان للعائلات المهجرة والمنكوبة",
      tr: "Yerinden edilmiş ve afetzede ailelere onurlu ve güvenli barınma",
      en: "Dignified, safe shelter protecting families displaced by wars and disasters",
    },
    description: {
      ar: "استبدال الخيام المتهالكة بوحدات سكنية كريمة ومجمعات إيوائية متكاملة الخدمات، وترميم المنازل المتضررة من الزلازل والحروب، مع توفير مستلزمات الإيواء الأساسية من فرش وأوانٍ ومدافئ تضمن الدفء والحماية في فصول الشتاء القاسية.",
      tr: "Yıpranmış çadırların yerine briket evler ve konteyner kentler inşa ediyor, hasarlı konutları onarıyor ve temel yaşam malzemeleri ulaştırıyoruz.",
      en: "Replacing worn-out tents with durable modular housing units, rehabilitating homes damaged by quakes and conflict, and providing bedding, cooking kits, and winterization insulation.",
    },
    objectives: [
      {
        ar: "بناء الوحدات السكنية والقرى الإنسانية النموذجية للنازحين.",
        tr: "Mülteciler için kalıcı ve model insani konut köyleri inşa etmek.",
        en: "Construct model humanitarian village communities replacing fragile tents.",
      },
      {
        ar: "ترميم المنازل المتصدعة والمتضررة من الكوارث الطبيعية.",
        tr: "Deprem ve savaşta hasar görmüş konutların yapısal onarımını yapmak.",
        en: "Rehabilitate cracked and structurally compromised homes post-disasters.",
      },
      {
        ar: "تجهيز مراكز الإيواء بالمستلزمات الحياتية والتدفئة.",
        tr: "Barınma merkezlerini temel yaşam ve kışlık ısıtma ekipmanlarıyla donatmak.",
        en: "Furnish shelters with essential non-food household kits and heaters.",
      },
    ],
    stats: {
      projectsCount: 17,
      beneficiariesCount: 62000,
      completedProjects: 13,
    },
  },
];

