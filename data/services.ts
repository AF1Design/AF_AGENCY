import { ServiceDefinition, PortfolioItem } from "@/types";

export const servicesData: ServiceDefinition[] = [
  {
    id: "web",
    title: "Web Design & Development",
    shortDescription: "تصميم وتطوير مواقع وتطبيقات ويب فائقة السرعة ومبنية بنهج (Mobile-First) لتحقيق أعلى معدل تحويل لزوار الإعلانات.",
    iconName: "Globe",
    packages: [
      {
        id: "web-landing",
        name: "High-Converting Landing Page",
        description: "صفحة هبوط إعلانية تفاعلية ذات هدف بيعي مباشر وسرعة فائقة على الهواتف، مصممة خصيصاً لحملات السوشيال ميديا والإعلانات الممولة.",
        badge: "Most Popular for Ads",
        recommended: true,
        pricing: {
          EGP: {
            fromPrice: 950,
            display: "تبدأ من 950 ج.م"
          },
          SAR: {
            fromPrice: 450,
            toPrice: 750,
            display: "تبدأ من 450 ر.س (حتى 750 ر.س)"
          }
        },
        suitableFields: [
          "براندات العطور والأزياء ذات المنتج البطل",
          "عروض الفاست فود والوجبات المجمعة",
          "حملات التسجيل لوسطاء العقارات ومراكز التجميل",
          "بيع وتصفية المنتجات الفردية عبر حملات ميتا وتيك توك"
        ],
        features: [
          "تصميم تفاعلي فائق السرعة متوافق 100% مع شاشات الهواتف",
          "زر تواصل فوري عبر WhatsApp ونموذج حجز مباشر",
          "ربط بيكسل تتبع الإعلانات (Meta Pixel & TikTok Pixel)",
          "ربط قواعد بيانات سحابية مشفرة وفورية لحفظ وإدارة الطلبات بدقة",
          "استضافة سحابية عالمية فائقة السرعة تضمن جاهزية 99.9% في كافة الدول"
        ]
      },
      {
        id: "web-corporate",
        name: "Corporate Website Experience",
        description: "موقع رسمي متعدد الصفحات للشركات والمؤسسات يعكس ثقل علامتك التجارية ويبني مصداقية لا تتزعزع.",
        badge: "Best for Companies",
        pricing: {
          EGP: {
            fromPrice: 2500,
            toPrice: 7500,
            display: "2,500 - 7,500 ج.م"
          },
          SAR: {
            fromPrice: 1500,
            toPrice: 2400,
            display: "1,500 - 2,400 ر.س"
          }
        },
        suitableFields: [
          "شركات المقاولات، التشطيب، والديكور",
          "المكاتب الهندسية ومكاتب المحاماة والاستشارات",
          "المصانع وشركات التوريدات والاستيراد والتصدير",
          "العيادات والمراكز الطبية التخصصية"
        ],
        features: [
          "من 4 إلى 7 صفحات متكاملة بتصميم عصري حصري",
          "لوحة تحكم ذكية لإدارة وتحديث المحتوى والأخبار والمشاريع",
          "تهيئة احترافية متقدمة لمحركات البحث (Advanced SEO)",
          "نماذج تواصل تفاعلية وخريطة الموقع وتكامل السوشيال ميديا",
          "تجاوب كامل وانتقالات سلسة (Micro-interactions)"
        ]
      },
      {
        id: "web-ecommerce",
        name: "Full E-Commerce Store",
        description: "متجر إلكتروني جذاب يدعم بوابات الدفع الإلكتروني، إدارة المخزون، وسلة مشتريات سلسة بنقرة واحدة.",
        badge: "E-Commerce Ready",
        pricing: {
          EGP: {
            fromPrice: 7500,
            toPrice: 13500,
            display: "7,500 - 13,500 ج.م"
          },
          SAR: {
            fromPrice: 2500,
            toPrice: 4200,
            display: "2,500 - 4,200 ر.س"
          }
        },
        suitableFields: [
          "براندات الملابس والأحذية ذات الأقسام والمقاسات المتعددة",
          "متاجر الهاردوير وإكسسوارات الموبايل والكمبيوتر",
          "براندات مستحضرات التجميل والعناية بالبشرة (متعددة الـ SKUs)",
          "متاجر الهدايا والإكسسوارات المنزلية"
        ],
        features: [
          "عرض ديناميكي للمنتجات مع فلترة وبحث سريع وتصنيفات متعددة",
          "سلة تسوق حديثة وتجربة دفع في خطوة واحدة (One-Step Checkout)",
          "ربط بوابات الدفع الإلكتروني وطلبات الشراء المباشر عبر WhatsApp",
          "لوحة تحكم متكاملة لإدارة المنتجات، الطلبيات، والشحنات",
          "أعلى معايير الأمان والتشفير وحماية بيانات الدفع"
        ]
      },
      {
        id: "web-custom",
        name: "Custom Web Application",
        description: "تطوير منصات رقمية مخصصة، بوابات اشتراكات، أنظمة حجوزات، أو لوحات تحكم (Dashboard) متطورة.",
        badge: "Custom Solutions",
        pricing: {
          EGP: {
            fromPrice: 18000,
            display: "تبدأ من 18,000 ج.م (تحدد حسب نطاق العمل)"
          },
          SAR: {
            fromPrice: 5500,
            display: "تبدأ من 5,500 ر.س (تحدد حسب نطاق العمل)"
          }
        },
        suitableFields: [
          "منصات الكورسات والتدريب والاختبارات الأونلاين",
          "بوابات العقارات وإدارة الحجوزات والملاك",
          "أنظمة حجز المواعيد للعيادات والمراكز الرياضية",
          "منصات الاشتراكات الدورية وإدارة الليدات المتطورة"
        ],
        features: [
          "بنية برمجية معمارية سحابية متقدمة ومخصصة بالكامل",
          "نظام صلاحيات متقدم متعدد الأدوار (Role-Based Access)",
          "قاعدة بيانات سحابية سريعة مع نسخ احتياطي تلقائي",
          "واجهات تفاعلية متطورة وتكامل مع واجهات برمجية خارجية (APIs)",
          "دعم فني وتطوير مستمر مع ضمان الأداء العالي"
        ]
      }
    ],
    addons: [
      {
        id: "addon-multilang",
        name: "Multi-Language Support (عربي / English)",
        description: "توسيع نطاق أعمالك لاستهداف عملاء دوليين ومحليين بلغات متعددة.",
        technicalSpecs: "واجهة ثنائية (عربي / إنجليزي) مع ضبط اتجاهات الخطوط والتصميم (RTL / LTR)",
        pricing: {
          EGP: {
            price: 1200,
            display: "+1,200 ج.م"
          },
          SAR: {
            price: 400,
            display: "+400 ر.س"
          }
        }
      },
      {
        id: "addon-payments",
        name: "Online Payment Gateway Integration",
        description: "استقبال المدفوعات فوراً عبر Visa، Mastercard، والمحافظ الإلكترونية.",
        technicalSpecs: "ربط وتفعيل فيزا، ماستركارد، ومحافظ إلكترونية (Paymob / Fawry / Tap / Moyasar)",
        pricing: {
          EGP: {
            price: 1500,
            display: "+1,500 ج.م"
          },
          SAR: {
            price: 500,
            display: "+500 ر.س"
          }
        }
      },
      {
        id: "addon-chatbot",
        name: "AI Smart Chatbot Assistant",
        description: "روبوت ذكاء اصطناعي مدرب للإجابة الفورية على استفسارات العملاء على مدار الساعة.",
        technicalSpecs: "روبوت مدرب على داتا ومنتجات النشاط للرد الآلي وتجميع بيانات العملاء 24/7",
        pricing: {
          EGP: {
            price: 2200,
            display: "+2,200 ج.م"
          },
          SAR: {
            price: 700,
            display: "+700 ر.س"
          }
        }
      },
      {
        id: "addon-seo-booster",
        name: "Advanced SEO & Speed Optimization",
        description: "تصدر نتائج محركات البحث Google وتحقيق سرعة قياسية 95+ على PageSpeed.",
        technicalSpecs: "تسريع تحميل الموقع، أرشفة الخرائط (Sitemaps)، وتهيئة الكلمات المفتاحية لمجال البيزنس",
        pricing: {
          EGP: {
            price: 1500,
            display: "+1,500 ج.م"
          },
          SAR: {
            price: 450,
            display: "+450 ر.س"
          }
        }
      }
    ]
  },
  {
    id: "branding",
    title: "Brand Identity & Graphic Design",
    shortDescription: "نبتكر لعلامتك التجارية بصمة بصرية مميزة تجمع بين الجرأة الهندسية والفخامة لتبقى راسخة في أذهان عملائك.",
    iconName: "Palette",
    packages: [
      {
        id: "brand-logo",
        name: "Iconic Logo Design",
        description: "شعار أيقوني مدروس هندسياً وسيكولوجياً يعبر عن جوهر رسالتك ويصلح لجميع الوسائط الرقمية والمطبوعة.",
        badge: "Quick Kickoff",
        features: [
          "3 أفكار وشعارات إبداعية مختلفة تماماً للاختيار من بينها",
          "تعديلات مرنة ومستمرة حتى الوصول إلى الرضا التام",
          "تسليم الحزمة بكافة الصيغ الاحترافية (Vector, PNG, SVG, PDF)",
          "نسخ خاصة بالوضع الداكن (Dark Mode) والوضع الفاتح (Light Mode)"
        ]
      },
      {
        id: "brand-full",
        name: "Full Brand Identity Suite",
        description: "الهوية البصرية المتكاملة للشركات: الأساس الهندسي والبصري الشامل لانطلاق علامتك التجارية بقوة.",
        badge: "Highest Value",
        recommended: true,
        features: [
          "تصميم الشعار المعتمد بجميع صيغه وتطبيقاته",
          "دليل الهوية الكامل (Brand Guidelines: الألوان، الخطوط، وقواعد الاستخدام)",
          "بطاقات العمل (Business Cards)، الأوراق الرسمية (Letterheads)، والأظرف",
          "الفولدرات، الأختام، وتوقيع البريد الإلكتروني الرقمي الرسمي",
          "نماذج ثلاثية الأبعاد (3D Mockups) واقعية لتطبيقات الهوية على المنتجات"
        ]
      },
      {
        id: "brand-social",
        name: "Social Media Design Pack",
        description: "قوالب منشورات وإعلانات احترافية تمنح صفحاتك مظهراً موحداً وتزيد من معدلات التفاعل والمبيعات.",
        badge: "For Social Brands",
        features: [
          "تصميم أغلفة المنصات الرئيسية (Facebook, X, LinkedIn, YouTube)",
          "قوالب جاهزة للبوستات والقصص اليومية (Stories & Highlights)",
          "تصاميم إعلانية مخصصة للموبايل وقوالب Reels / TikTok جذابة",
          "تسليم الملفات المصدرية المفتوحة لسهولة التعديل مستقبلاً"
        ]
      },
      {
        id: "brand-profile",
        name: "Corporate Profile & Catalog",
        description: "كتيب تعريفي فاخر يستعرض خدمات شركتك وسابقة أعمالك أمام كبار العملاء والمستثمرين في المناقصات.",
        badge: "B2B & Proposals",
        features: [
          "صياغة وترتيب المحتوى بأسلوب تسويقي مقنع (Copywriting)",
          "إخراج فني فخم من 8 إلى 20 صفحة بتصميم استثنائي",
          "نسخة رقمية تفاعلية بملف خفيف للمشاركة المباشرة عبر WhatsApp",
          "نسخة مطبعية عالية الدقة مجهزة لطباعة أوفست الفاخرة"
        ]
      }
    ],
    addons: [
      {
        id: "addon-logo-motion",
        name: "Logo Motion & Video Intro",
        description: "تحريك الشعار باحترافية سينمائية لاستخدامه في مقدمات وخواتيم الفيديوهات الإعلانية.",
      },
      {
        id: "addon-source-files",
        name: "Full Source Files (AI, PSD, EPS)",
        description: "تسليم كافة ملفات برامج التصميم الأصلية بكامل الطبقات القابلة للتعديل.",
      },
      {
        id: "addon-3d-packaging",
        name: "3D Product & Packaging Render",
        description: "محاكاة واقعية ثلاثية الأبعاد للمنتجات والعلب والأكياس التجارية.",
      }
    ]
  },
  {
    id: "marketing",
    title: "Growth & Performance Marketing",
    shortDescription: "حملات إعلانية ممولة قائمة على البيانات وسيكولوجية العميل، تهدف لخفض تكلفة الاستحواذ ومضاعفة مبيعاتك.",
    iconName: "TrendingUp",
    packages: [
      {
        id: "market-starter",
        name: "Ad Campaign Kickoff",
        description: "إعداد وإطلاق حملة إعلانية واحدة مركزة لتحقيق هدف سريع محدد (زيادة الرسائل، المبيعات، أو الحجوزات).",
        badge: "Campaign Setup",
        features: [
          "دراسة وتحديد الشريحة المستهدفة بدقة واختبار الاهتمامات (Audience Research)",
          "كتابة نصوص إعلانية محفزة لقرار الشراء الفوري (High-Conversion Copy)",
          "ضبط البيكسل والأحداث المخصصة لتتبع النتائج بدقة (Conversion Tracking)",
          "مراقبة وتحسين أداء الإعلان وتعديل الميزانية لمدة 10 أيام",
          "تقرير أداء تحليلي نهائي مع توصيات النمو"
        ]
      },
      {
        id: "market-growth",
        name: "Full Monthly Growth Management",
        description: "إدارة شهرية متكاملة لجميع ميزانياتك وحملاتك الإعلانية على مدار الساعة لتوسيع نطاق أعمالك (Scaling).",
        badge: "Best for Scaling",
        recommended: true,
        features: [
          "إدارة ميزانيات منصات Meta (Facebook & Instagram) و TikTok Ads",
          "اختبار أكثر من 5 زوايا إعلانية مختلفة (A/B Creative Testing)",
          "إعادة استهداف ذكية ومخصصة (Dynamic Retargeting Funnels)",
          "تحسين يومي لتكلفة النقرة والعميل (CPC & CPL Optimization)",
          "تقارير أداء أسبوعية وشهرية تفصيلية ومتابعة مباشرة عبر WhatsApp"
        ]
      },
      {
        id: "market-content-ads",
        name: "All-in-One: Ads + Creative Production",
        description: "الحل الإعلاني الأقوى: نتولى الأفكار، كتابة السيناريو، تصميم الإعلانات، مونتاج الفيديوهات، وإدارة الحملات.",
        badge: "Complete Solution",
        features: [
          "تصميم 12 بوست إعلاني عالي الجاذبية والتأثير",
          "مونتاج 6 فيديوهات Reels / TikTok إعلانية سريعة الانتشار (UGC & Motion)",
          "كتابة نصوص وسيناريوهات بأسلوب نفسي يكسر اعتراضات العميل",
          "إدارة كاملة للميزانيات والحملات الإعلانية طوال الشهر"
        ]
      }
    ],
    addons: [
      {
        id: "addon-competitor-audit",
        name: "Competitor Intelligence & Spy Audit",
        description: "تحليل دقيق لإعلانات واستراتيجيات منافسيك الأكثر نجاحاً لكشف الثغرات واقتناص الصفقات.",
      },
      {
        id: "addon-landing-optimization",
        name: "Landing Page CRO Optimization",
        description: "إعادة هيكلة صفحات الهبوط وتطوير رحلة العميل لمضاعفة معدل التحويل (Conversion Rate).",
      }
    ]
  },
  {
    id: "courses",
    title: "AF ACADEMY",
    shortDescription: "مسارات تدريبية متخصصة في أساسيات الجرافيك ديزاين والذكاء الاصطناعي بأسعار مخفضة للطلاب وحديثي التخرج.",
    iconName: "GraduationCap",
    packages: [
      {
        id: "course-graphic-fundamentals",
        name: "كورس أساسيات الجرافيك ديزاين (فوتوشوب + إليستريتور)",
        description: "تعلم أساسيات التصميم الجرافيكي الاحترافي من الصفر عبر برنامجي فوتوشوب وإليستريتور مع تطبيقات عملية للمشاريع.",
        badge: "خصم 50% للطلاب وحديثي التخرج",
        pricing: {
          EGP: {
            fromPrice: 3000,
            toPrice: 6000,
            display: "3,000 ج.م (بدلاً من 6,000 ج.م)",
          },
          SAR: {
            fromPrice: 300,
            toPrice: 600,
            display: "300 ر.س (بدلاً من 600 ر.س)",
          },
        },
        features: [
          "إتقان أدوات وتقنيات برنامج أدوبي فوتوشوب (Photoshop)",
          "إتقان أدوات وتقنيات برنامج أدوبي إليستريتور (Illustrator)",
          "مخصص للطلاب وحديثي التخرج لتأسيس المهارات من الصفر",
          "تطبيقات ومشاريع عملية على التصاميم خلال فترة الكورس",
          "شهادة إكمال المسار التدريبي من الأكاديمية",
        ],
      },
      {
        id: "course-ai-video-ads",
        name: "كورس الذكاء الاصطناعي (إنشاء الفيديوهات والإعلانات)",
        description: "تعلم أحدث تقنيات وأدوات الذكاء الاصطناعي المتخصصة في صناعة وتوليد مقاطع الفيديو والإعلانات الرقمية.",
        badge: "خصم 50% للطلاب وحديثي التخرج",
        pricing: {
          EGP: {
            fromPrice: 3000,
            toPrice: 6000,
            display: "3,000 ج.م (بدلاً من 6,000 ج.م)",
          },
          SAR: {
            fromPrice: 300,
            toPrice: 600,
            display: "300 ر.س (بدلاً من 600 ر.س)",
          },
        },
        features: [
          "تعلم إنشاء وتوليد مقاطع الفيديو بالذكاء الاصطناعي",
          "صناعة وتصميم الإعلانات الرقمية الترويجية بأدوات الذكاء الاصطناعي",
          "مخصص للطلاب وحديثي التخرج لمواكبة متطلبات السوق",
          "تطبيقات عملية لإنتاج مواد إعلانية وفيديوهات متكاملة",
          "شهادة إكمال المسار التدريبي من الأكاديمية",
        ],
      },
      {
        id: "course-pro-bundle",
        name: "الكورس البرو (جرافيك ديزاين + ذكاء اصطناعي)",
        description: "المسار المتكامل الأقوى: يجمع بين مسار أساسيات الجرافيك ديزاين ومسار الذكاء الاصطناعي في باقة واحدة شاملة بأعلى نسبة توفير.",
        badge: "الباقة الأكثر شمولاً وتوفيراً",
        recommended: true,
        pricing: {
          EGP: {
            fromPrice: 4500,
            toPrice: 8000,
            display: "4,500 ج.م (بدلاً من 8,000 ج.م)",
          },
          SAR: {
            fromPrice: 450,
            toPrice: 800,
            display: "450 ر.س (بدلاً من 800 ر.س)",
          },
        },
        features: [
          "يشمل مسار أساسيات الجرافيك ديزاين كاملاً (فوتوشوب + إليستريتور)",
          "يشمل مسار الذكاء الاصطناعي كاملاً (إنشاء الفيديوهات والإعلانات)",
          "دمج مهارات التصميم الجرافيكي مع أدوات الذكاء الاصطناعي في مشاريع مشتركة",
          "مخصص حصرياً للطلاب وحديثي التخرج",
          "شهادة إكمال المسار الشامل (Pro Track) من الأكاديمية",
        ],
      },
    ],
    addons: [],
  },
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: "p1",
    title: "NextStore // Luxury E-Commerce Platform",
    category: "Web Development & UI/UX",
    categoryTag: "web",
    description: "بناء متجر إلكتروني فائق السرعة على الهواتف مع تجربة تسوق في خطوة واحدة، حقق زيادة بنسبة 45% في المبيعات خلال أول أسبوعين.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    results: "+45% Conversion Lift"
  },
  {
    id: "p2",
    title: "Aurora Specialty Coffee // Brand Identity System",
    category: "Branding & Visual Architecture",
    categoryTag: "branding",
    description: "ابتكار نظام هوية بصرية هندسية متكاملة تشمل الشعار، لوحة الألوان، تغليف المنتجات، ودليل إرشادي كامل عزز مكانة العلامة بالسوق.",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80",
    results: "Iconic Brand Identity"
  },
  {
    id: "p3",
    title: "Apex Real Estate // Meta & TikTok Performance Funnel",
    category: "Performance Marketing",
    categoryTag: "marketing",
    description: "حملة إعلانية ممولة استهدفت كبار المستثمرين العقاريين بنصوص إعلانية موجهة وفيديوهات سريعة، نتج عنها 380+ عميل محتمل مؤكد.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    results: "380+ Qualified Leads"
  },
  {
    id: "p4",
    title: "AI Growth Summit // High-Converting Event Landing Page",
    category: "Web Development & CRO",
    categoryTag: "web",
    description: "صفحة هبوط إعلانية لمؤتمر تقني تعتمد على تصميم نفسي يقنع الزائر بلمح البصر، أدت إلى اكتمال كافة مقاعد الفعالية في 48 ساعة.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    results: "Sold Out in 48 Hours"
  }
];

export const agencyStats = [
  { value: "120+", label: "Completed Projects", arabicLabel: "مشروع ناجح تم إنجازه" },
  { value: "98%", label: "Client Satisfaction", arabicLabel: "نسبة رضا العملاء والشركاء" },
  { value: "3.8X", label: "Average ROAS Lift", arabicLabel: "متوسط مضاعفة العائد الإعلاني" },
  { value: "500+", label: "Students Trained", arabicLabel: "مبدع تدربوا في أكاديميتنا" }
];
