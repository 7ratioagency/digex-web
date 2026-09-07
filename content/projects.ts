// Destination in repo: content/projects.ts
//
// This is the file that fixes the biggest weakness of the old site.
// The old portfolio was an anonymous image grid (0.jpg, 1.jpg...) — visitors
// saw pictures but learned nothing. Every entry here has a real client name,
// a sector, what was delivered, and a real link.
//
// RULE: never add an entry without a real client name and a working link.

export type Locale = 'ar' | 'fr' | 'en'
export type Localized = Record<Locale, string>
export type LocalizedList = Record<Locale, string[]>

export type ProjectCategory =
  | 'websites'
  | 'branding'
  | 'design'
  | 'print'
  /*
   * Social media and campaign work. Added because the portfolio had nowhere to
   * put it — digital marketing was the one service on the site with no
   * category that could evidence it, so its page showed no work at all while
   * the agency had been running campaigns for years.
   */
  | 'marketing'
  /*
   * Photography as well as film. The label is "Photo & video" in every locale;
   * the key stays 'video' because renaming it would rewrite every entry that
   * already uses it for no gain.
   */
  | 'video'

export type ProjectLinkKind = 'live' | 'behance' | 'youtube'

/** One numbered pillar of a solution, as the agency presented it. */
export interface CaseStudyStep {
  title: Localized
  points: LocalizedList
}

/**
 * The long form of a project, for /work/[slug].
 *
 * Recovered from the old digex.agency, which published two of these
 * (assets/backup/digex-content.json → case_studies) and is now offline. French
 * is the agency's own published wording; Arabic and English are written
 * natively here, because the old site had neither.
 *
 * Optional, and likely to stay that way for most entries: a case study is a
 * piece of writing the agency has to actually do, not a field that can be
 * filled in from a slug. A project without one still renders its summary,
 * deliverables and link.
 */
export interface CaseStudy {
  /** The client, and where they stood before the work. */
  about: Localized
  /** What the engagement set out to do. */
  objectives: LocalizedList
  /** How it was approached, in the order it was approached. */
  solution: CaseStudyStep[]
  /** What came of it. The client's own claims, unedited. */
  results: LocalizedList
}

export interface Project {
  /** URL slug for /work/[slug] */
  slug: string
  /** Real client name — displayed as-is, not translated */
  client: string
  category: ProjectCategory
  /** Business sector, shown as a small label */
  sector: Localized
  /** One-line summary of the project */
  summary: Localized
  /** Concrete deliverables — the antidote to generic copy */
  delivered: LocalizedList
  /**
   * Where the work can be seen for itself. Optional, because not all of it
   * lives at a URL: a shopfront's illuminated lettering or a printed vitrine
   * has no link to follow, only the photographs of it. Every entry that CAN
   * be linked must be — the rule at the top of this file stands for anything
   * with an online destination.
   */
  link?: {
    kind: ProjectLinkKind
    url: string
  }
  /**
   * Cover image under /public. Optional: only set it where the file actually
   * exists, so the components can render a designed placeholder instead of a
   * broken <Image> for the projects still waiting on assets.
   */
  cover?: string
  /** Gallery images for the case study page */
  gallery: string[]
  /** The long form, where one has been written. */
  caseStudy?: CaseStudy
  /** Show on the homepage "selected work" section */
  featured: boolean
  /** Year delivered — set to the real year before launch */
  year?: number
}

export const projects: Project[] = [
  {
    slug: 'eve-accessoires',
    client: 'EVE Accessoires',
    category: 'websites',
    sector: {
      ar: 'إكسسوارات وموضة',
      fr: 'Accessoires & mode',
      en: 'Accessories & fashion',
    },
    summary: {
      ar: 'هوية بصرية كاملة ومتجر إلكتروني لعلامة إكسسوارات جزائرية، من الشعار حتى أول طلبية.',
      fr: "Identité visuelle complète et boutique en ligne pour une marque algérienne d'accessoires, du logo à la première commande.",
      en: 'Full brand identity and online store for an Algerian accessories brand, from logo to first order.',
    },
    delivered: {
      ar: ['هوية بصرية كاملة', 'متجر إلكتروني', 'تصوير المنتجات', 'قوالب سوشل ميديا'],
      fr: ['Identité visuelle complète', 'Boutique en ligne', 'Photographie produit', 'Gabarits réseaux sociaux'],
      en: ['Full brand identity', 'E-commerce store', 'Product photography', 'Social media templates'],
    },
    link: { kind: 'live', url: 'https://eveaccessoires.com' },
    cover: '/work/eve-accessoires/cover.webp',
    caseStudy: {
      about: {
        ar: 'إيف أكسسوار متجر متخصّص في بيع الإكسسوارات والمجوهرات التقليدية والعصرية، بتشكيلة راقية موجّهة لزبون متطلّب، تجمع بين الثراء الثقافي والإبداع المعاصر.',
        fr: "Eve Accessoires est une boutique spécialisée dans la vente d'accessoires et de bijoux traditionnels et modernes. Elle propose une sélection raffinée pour une clientèle exigeante, alliant richesse culturelle et créations contemporaines.",
        en: 'Eve Accessoires sells traditional and modern accessories and jewellery — a refined selection for a demanding clientele, where cultural richness meets contemporary design.',
      },
      objectives: {
        ar: [
          'تحديث صورة العلامة عبر هوية بصرية قوية ومتماسكة.',
          'إنشاء متجر إلكتروني عالي الأداء.',
          'وضع نظام بسيط وفعّال لتسيير المخزون.',
          'اقتراح استراتيجية تسويق ملائمة لزيادة الظهور.',
        ],
        fr: [
          "Moderniser l'image de la marque à travers une identité visuelle forte et cohérente.",
          'Créer une boutique en ligne performante.',
          'Mettre en place un système de gestion des stocks simple et efficace.',
          'Proposer une stratégie de marketing adaptée pour accroître la visibilité.',
        ],
        en: [
          "Modernise the brand's image with a strong, coherent visual identity.",
          'Build an online store that performs.',
          'Put a simple, effective stock system in place.',
          'Propose a marketing strategy suited to growing visibility.',
        ],
      },
      solution: [
        {
          title: {
            ar: 'بناء هوية بصرية قوية',
            fr: "Création d'une identité visuelle forte",
            en: 'A strong visual identity',
          },
          points: {
            ar: ['تصميم دليل بصري أنيق يشمل الشعار والألوان والخطوط.'],
            fr: [
              "Conception d'une charte graphique élégante incluant logo, couleurs et typographies.",
            ],
            en: ['An elegant graphic charter: logo, colours and typefaces.'],
          },
        },
        {
          title: {
            ar: 'تطوير الموقع',
            fr: 'Développement web',
            en: 'Web development',
          },
          points: {
            ar: ['متجر إلكتروني مصمّم خصيصًا، متجاوب ومحسّن لتجربة الاستخدام.'],
            fr: [
              "Développement d'un site e-commerce sur mesure, responsive et optimisé UX.",
            ],
            en: ['A bespoke e-commerce site, responsive and optimised for UX.'],
          },
        },
        {
          title: {
            ar: 'تسيير المخزون',
            fr: 'Gestion des stocks',
            en: 'Stock management',
          },
          points: {
            ar: ['اقتراح برنامج Odoo وضبطه لإدارة المنتجات والمخزون.'],
            fr: [
              'Proposition et configuration du logiciel Odoo pour la gestion des produits et des stocks.',
            ],
            en: ['Odoo proposed and configured for products and stock.'],
          },
        },
      ],
      results: {
        ar: [
          'هوية بصرية متماسكة ومميّزة.',
          'متجر إلكتروني جاهز للتشغيل.',
          'تسيير مركزي ومبسّط للمخزون بفضل Odoo.',
        ],
        fr: [
          'Une identité visuelle cohérente et distinctive.',
          'Un site e-commerce clé en main.',
          'Une gestion de stock centralisée et simplifiée grâce à Odoo.',
        ],
        en: [
          'A coherent, distinctive visual identity.',
          'A turnkey e-commerce site.',
          'Centralised, simplified stock management through Odoo.',
        ],
      },
    },
    // Empty until real gallery exports arrive. These three used to name
    // /work/eve/1..3.webp, files that never existed — invisible while the
    // page drew placeholders, three 400s the moment it drew <Image>.
    gallery: [],
    featured: true,
  },
  /*
   * The strongest piece of work in the archive, and it was missing entirely:
   * the old site carried this case study but content/projects.ts never had the
   * client. Placed second so it reaches the homepage's three hero scenes.
   */
  {
    slug: 'bissanelab',
    client: 'BissaneLab',
    category: 'websites',
    sector: {
      ar: 'مخبر ديرمو-كوزمتيك',
      fr: 'Laboratoire dermo-cosmétique',
      en: 'Dermo-cosmetic laboratory',
    },
    summary: {
      ar: 'إطلاق رقمي كامل من الصفر: هوية، تصوير منتجات، شبكات اجتماعية، وموقع مع متجر إلكتروني.',
      fr: 'Lancement digital complet depuis zéro : identité, photographie produit, réseaux sociaux, site et boutique en ligne.',
      en: 'A complete digital launch from zero: identity, product photography, social, and a site with an online store.',
    },
    delivered: {
      ar: ['هوية بصرية', 'تصوير المنتجات', 'إدارة الشبكات الاجتماعية', 'موقع ومتجر إلكتروني'],
      fr: [
        'Identité visuelle',
        'Photographie produit',
        'Gestion des réseaux sociaux',
        'Site & boutique en ligne',
      ],
      en: [
        'Visual identity',
        'Product photography',
        'Social media management',
        'Site & online store',
      ],
    },
    link: { kind: 'live', url: 'https://bissanelab.com' },
    gallery: [],
    caseStudy: {
      about: {
        ar: 'عميلنا مخبر متخصّص في الديرمو-كوزمتيك، يقدّم عناية جلدية راقية موجّهة للبشرة الحسّاسة والمتطلّبة. قبل تدخّلنا، لم يكن للعلامة أي حضور رقمي ولا حسابات على الشبكات الاجتماعية، ولا موقع تعريفي ولا متجر إلكتروني.',
        fr: "Notre client est un laboratoire spécialisé en dermo-cosmétique, proposant des soins dermatologiques haut de gamme, conçus pour répondre aux besoins des peaux sensibles et exigeantes. Avant notre intervention, la marque n'avait aucune présence digitale ni réseaux sociaux, et ne disposait pas d'un site vitrine ou e-commerce.",
        en: 'Our client is a laboratory specialising in dermo-cosmetics, making high-end dermatological care for sensitive, demanding skin. Before we started the brand had no digital presence, no social accounts, and neither a showcase site nor an online store.',
      },
      objectives: {
        ar: [
          'بناء حضور رقمي احترافي وتطويره.',
          'إطلاق حسابات رسمية على أهم الشبكات الاجتماعية.',
          'إبراز المنتجات بصور جذّابة.',
          'إنشاء موقع تعريفي ومتجر إلكتروني.',
        ],
        fr: [
          'Créer et développer une présence digitale professionnelle.',
          'Lancer des comptes officiels sur les principaux réseaux sociaux.',
          'Mettre en valeur les produits via des photos attractives.',
          'Créer un site web vitrine et une boutique e-commerce.',
        ],
        en: [
          'Build a professional digital presence from nothing.',
          'Launch official accounts on the main social platforms.',
          'Show the products off through attractive photography.',
          'Build a showcase site and an e-commerce store.',
        ],
      },
      solution: [
        {
          title: {
            ar: 'استراتيجية العلامة والهوية البصرية',
            fr: 'Stratégie de marque et identité visuelle',
            en: 'Brand strategy and visual identity',
          },
          points: {
            ar: [
              'تحديد التموضع في مجال الديرمو-كوزمتيك.',
              'وضع دليل بصري متماسك مخصّص للرقمي.',
            ],
            fr: [
              'Définition du positionnement dermo-cosmétique.',
              "Création d'une charte visuelle cohérente pour le digital.",
            ],
            en: [
              'Defining the dermo-cosmetic positioning.',
              'A coherent visual system built for digital.',
            ],
          },
        },
        {
          title: {
            ar: 'تصوير احترافي للمنتجات',
            fr: 'Photographie produit professionnelle',
            en: 'Professional product photography',
          },
          points: {
            ar: ['جلسة تصوير مخصّصة لإبراز التغليف والقوام.'],
            fr: ['Shooting dédié pour présenter les packagings et textures.'],
            en: ['A dedicated shoot for the packaging and the textures.'],
          },
        },
        {
          title: {
            ar: 'التسويق عبر الشبكات الاجتماعية',
            fr: 'Social media marketing',
            en: 'Social media marketing',
          },
          points: {
            ar: [
              'إنشاء وفتح الحسابات الرسمية على فيسبوك وإنستغرام.',
              'مخطّط تحريري على ستة أشهر.',
              'حملات إعلانية موجّهة لتسريع نموّ المتابعين.',
            ],
            fr: [
              'Création et ouverture des comptes officiels (Facebook, Instagram).',
              'Planning éditorial sur 6 mois.',
              'Campagnes publicitaires ciblées pour accélérer la croissance des abonnés.',
            ],
            en: [
              'Opening the official Facebook and Instagram accounts.',
              'A six-month editorial plan.',
              'Targeted ad campaigns to accelerate follower growth.',
            ],
          },
        },
        {
          title: {
            ar: 'تطوير الموقع',
            fr: 'Développement web',
            en: 'Web development',
          },
          points: {
            ar: [
              'موقع تعريفي عصري ومتجاوب مع كل الشاشات.',
              'دمج متجر إلكتروني متكامل.',
            ],
            fr: [
              "Création d'un site vitrine moderne et responsive.",
              "Intégration d'une boutique e-commerce complète.",
            ],
            en: [
              'A modern, responsive showcase site.',
              'A full e-commerce store integrated into it.',
            ],
          },
        },
      ],
      results: {
        ar: [
          'نموّ المتابعين على إنستغرام وفيسبوك من صفر إلى 30 500 متابع في ستة أشهر.',
          'فيديو CGI أنتجناه ليحمل العلامة، من حضور رقمي انطلق من الصفر إلى رافعة تجارية ومجتمعية حقيقية.',
          'أكثر من 150 منشورًا صُمّم ونُشر، اعتمادًا على تصوير أصلي.',
          'إطلاق ناجح للمتجر الإلكتروني، مع أول طلبية في الأسبوع الأول.',
        ],
        fr: [
          'Croissance des abonnés sur Instagram et Facebook de 0 à 30 500 followers en 6 mois.',
          "Une vidéo CGI produite pour porter la marque, d'une présence digitale partie de zéro à un véritable levier commercial et communautaire.",
          '+150 publications créées et publiées, avec shooting original.',
          'Lancement réussi de la boutique en ligne, avec une première commande dès la première semaine.',
        ],
        en: [
          'Instagram and Facebook grew from zero to 30,500 followers in six months.',
          'A CGI film made to carry the brand — from a digital presence starting at zero to a real commercial and community lever.',
          'More than 150 posts created and published, all on original photography.',
          'The online store launched successfully, with its first order in the first week.',
        ],
      },
    },
    featured: true,
  },
  {
    slug: 'expert-informatique',
    client: 'Expert Informatique',
    category: 'websites',
    sector: {
      ar: 'إعلام آلي وتجهيزات',
      fr: 'Informatique & équipement',
      en: 'IT & equipment',
    },
    summary: {
      ar: 'متجر إلكتروني لبيع تجهيزات الإعلام الآلي، مع كتالوج منتجات وإدارة مخزون.',
      fr: "Boutique en ligne d'équipement informatique, avec catalogue produits et gestion de stock.",
      en: 'Online store for IT equipment, with a product catalogue and stock management.',
    },
    delivered: {
      ar: ['متجر إلكتروني', 'كتالوج منتجات', 'لوحة تحكّم'],
      fr: ['Boutique en ligne', 'Catalogue produits', 'Back-office'],
      en: ['E-commerce store', 'Product catalogue', 'Admin dashboard'],
    },
    link: { kind: 'live', url: 'https://expertinformatique.store' },
    gallery: [],
    featured: true,
  },
  {
    slug: 'sarl-dadas',
    client: 'SARL Dadas',
    category: 'websites',
    sector: {
      ar: 'صناعة وتوزيع',
      fr: 'Industrie & distribution',
      en: 'Industry & distribution',
    },
    summary: {
      ar: 'موقع مؤسّسي لشركة توزيع، يعرض النشاط والمنتجات ويسهّل التواصل مع الموزّعين.',
      fr: "Site corporate pour une société de distribution, présentant l'activité et facilitant le contact distributeurs.",
      en: 'Corporate site for a distribution company, presenting the business and streamlining distributor contact.',
    },
    delivered: {
      ar: ['موقع مؤسّسي', 'صفحات المنتجات', 'نموذج تواصل'],
      fr: ['Site corporate', 'Pages produits', 'Formulaire de contact'],
      en: ['Corporate website', 'Product pages', 'Contact form'],
    },
    link: { kind: 'live', url: 'https://sarldadas.com' },
    gallery: [],
    featured: true,
  },
  {
    slug: 'ets-mammeri',
    client: 'ETS Mammeri',
    category: 'websites',
    sector: {
      ar: 'تجارة وتجهيز',
      fr: 'Commerce & équipement',
      en: 'Trade & equipment',
    },
    summary: {
      ar: 'موقع تجاري يعرّف بالمؤسسة ومنتجاتها ويوجّه الزبائن للطلب المباشر.',
      fr: "Site commercial présentant l'entreprise et ses produits, orientant vers la commande directe.",
      en: 'Commercial site introducing the business and its products, driving direct enquiries.',
    },
    delivered: {
      ar: ['موقع تجاري', 'عرض المنتجات', 'ربط واتساب'],
      fr: ['Site commercial', 'Vitrine produits', 'Intégration WhatsApp'],
      en: ['Commercial website', 'Product showcase', 'WhatsApp integration'],
    },
    link: { kind: 'live', url: 'https://etsmammeri.com' },
    gallery: [],
    featured: false,
  },
  {
    slug: 'gpl-dz',
    client: 'GPL DZ',
    category: 'websites',
    sector: {
      ar: 'طاقة وتجهيزات الغاز',
      fr: 'Énergie & équipement gaz',
      en: 'Energy & gas equipment',
    },
    summary: {
      ar: 'متجر إلكتروني متخصّص في تجهيزات الغاز، مع كتالوج تقني وطلب مباشر.',
      fr: "Boutique en ligne spécialisée en équipement gaz, avec catalogue technique et commande directe.",
      en: 'Specialist online store for gas equipment, with a technical catalogue and direct ordering.',
    },
    delivered: {
      ar: ['متجر إلكتروني', 'كتالوج تقني', 'نظام الطلبات'],
      fr: ['Boutique en ligne', 'Catalogue technique', 'Système de commande'],
      en: ['E-commerce store', 'Technical catalogue', 'Order system'],
    },
    link: { kind: 'live', url: 'https://gpl-dz.store' },
    gallery: [],
    featured: false,
  },
  {
    slug: 'etb-batna',
    client: 'ETB Batna',
    category: 'websites',
    sector: {
      ar: 'بناء وأشغال',
      fr: 'Bâtiment & travaux',
      en: 'Construction & works',
    },
    summary: {
      ar: 'موقع مؤسّسي لشركة بناء، يبرز المشاريع المنجزة والمراجع.',
      fr: 'Site corporate pour une entreprise de bâtiment, mettant en avant les réalisations et références.',
      en: 'Corporate site for a construction firm, highlighting completed projects and references.',
    },
    delivered: {
      ar: ['موقع مؤسّسي', 'معرض المشاريع', 'صفحة المراجع'],
      fr: ['Site corporate', 'Galerie de réalisations', 'Page références'],
      en: ['Corporate website', 'Project gallery', 'References page'],
    },
    link: { kind: 'live', url: 'https://www.beet-batna.dz' },
    gallery: [],
    featured: false,
  },

  // ---------- Branding ----------
  {
    slug: 'eve-branding',
    client: 'EVE',
    category: 'branding',
    sector: {
      ar: 'إكسسوارات وموضة',
      fr: 'Accessoires & mode',
      en: 'Accessories & fashion',
    },
    summary: {
      ar: 'هوية بصرية كاملة: شعار، ألوان، خطوط، وتغليف لعلامة إكسسوارات راقية.',
      fr: "Identité visuelle complète : logo, palette, typographies et packaging pour une marque d'accessoires haut de gamme.",
      en: 'Complete brand identity: logo, palette, type and packaging for a premium accessories brand.',
    },
    delivered: {
      ar: ['شعار', 'نظام ألوان وخطوط', 'تغليف', 'دليل الهوية'],
      fr: ['Logo', 'Palette & typographies', 'Packaging', 'Charte graphique'],
      en: ['Logo', 'Colour & type system', 'Packaging', 'Brand guidelines'],
    },
    link: {
      kind: 'behance',
      url: 'https://www.behance.net/gallery/212509663/EVE-Accessoire',
    },
    gallery: [],
    featured: true,
  },
  /*
   * Was "Delmouche", an agrifood brand, linked to Behance gallery 243804263.
   * All three were wrong. The client's own catalogue spells it Delmoosh and
   * describes a pet centre — "accessoires, nourriture, jouets" — and 243804263
   * is a different project entirely (a recycling app logo). The real gallery
   * is 211312043, "delmoosh branding v2", on the agency's own profile. Name,
   * sector, summary and link all now come from those two sources.
   */
  {
    slug: 'delmoosh',
    client: 'Delmoosh',
    category: 'branding',
    sector: {
      ar: 'مستلزمات الحيوانات الأليفة',
      fr: 'Animalerie',
      en: 'Pet care',
    },
    summary: {
      ar: 'هوية بصرية لمركز حيوانات أليفة: قُرب ولطف وثقة، من الشعار إلى الأجواء العامة.',
      fr: "Identité de marque pour un centre animalier : proximité, douceur et confiance, du logo à l'ambiance.",
      en: 'Brand identity for a pet centre: closeness, warmth and trust, from the logo outward.',
    },
    delivered: {
      ar: ['شعار', 'هوية بصرية', 'عالم بصري للعلامة'],
      fr: ['Logo', 'Identité visuelle', 'Univers de marque'],
      en: ['Logo', 'Visual identity', 'Brand world'],
    },
    link: {
      kind: 'behance',
      url: 'https://www.behance.net/gallery/211312043/delmoosh-branding-v2',
    },
    gallery: [],
    featured: true,
  },
  /*
   * From the catalogue's Nos Projets chapter, which shows three projects —
   * EVE, Delmoosh and Shuttle Click — and only the first two were here.
   */
  {
    slug: 'shuttle-click',
    client: 'Shuttle Click',
    category: 'branding',
    sector: {
      ar: 'نقل بسائق',
      fr: 'VTC & mobilité',
      en: 'Ride-hailing & mobility',
    },
    summary: {
      ar: 'شركة نقل بسائق في فرنسا: هوية تجارية مبنية من الألف إلى الياء، من التموضع إلى الشكل البصري.',
      fr: "Entreprise de VTC en France : identité de marque construite de A à Z, du positionnement au visuel.",
      en: 'A French ride-hailing company: brand identity built end to end, from positioning to the visuals.',
    },
    delivered: {
      ar: ['التموضع', 'هوية العلامة', 'نظام بصري'],
      fr: ['Positionnement', 'Identité de marque', 'Système visuel'],
      en: ['Positioning', 'Brand identity', 'Visual system'],
    },
    link: {
      kind: 'behance',
      url: 'https://www.behance.net/gallery/211312673/shuttle-click-branding',
    },
    gallery: [],
    featured: true,
  },
  {
    slug: 'silvira',
    client: 'Silvira',
    category: 'branding',
    sector: {
      ar: 'منتجات استهلاكية',
      fr: 'Produits de consommation',
      en: 'Consumer goods',
    },
    summary: {
      ar: 'هوية بصرية وتغليف لعلامة ناشئة، مع نظام بصري قابل للتوسّع.',
      fr: "Identité et packaging pour une marque émergente, avec un système visuel évolutif.",
      en: 'Brand identity and packaging for an emerging brand, with a scalable visual system.',
    },
    delivered: {
      ar: ['شعار', 'نظام بصري', 'تغليف', 'قوالب سوشل ميديا'],
      fr: ['Logo', 'Système visuel', 'Packaging', 'Gabarits réseaux sociaux'],
      en: ['Logo', 'Visual system', 'Packaging', 'Social templates'],
    },
    link: {
      kind: 'behance',
      url: 'https://www.behance.net/gallery/211320045/silvira',
    },
    gallery: [],
    featured: false,
  },
  /*
   * The rest of the client list the old site published
   * (assets/backup/digex-content.json → clients), none of which had ever made
   * it into the portfolio. Sector and scope are the agency's own one-line
   * descriptions of each engagement; the deliverables are what those lines and
   * the clients' own testimonials actually name. Nothing beyond that is
   * claimed.
   *
   * None carries a link. The old site published none for these, and
   * taxiclick.fr — the one URL it did give — no longer resolves. Add one the
   * moment a working URL exists.
   */
  {
    slug: 'el-arkem',
    client: 'El Arkem',
    category: 'branding',
    sector: { ar: 'علامة شاي', fr: 'Marque de thé', en: 'Tea brand' },
    summary: {
      ar: 'هوية وتغليف لعلامة شاي: شعار وتصميم علبة يعكسان جودة المنتج على الرفّ.',
      fr: "Identité et packaging pour une marque de thé : un logo et un design d'emballage qui portent la qualité du produit en rayon.",
      en: 'Identity and packaging for a tea brand: a logo and a pack design that carry the product’s quality on the shelf.',
    },
    delivered: {
      ar: ['شعار', 'هوية بصرية', 'تصميم التغليف'],
      fr: ['Logo', 'Identité visuelle', 'Design du packaging'],
      en: ['Logo', 'Visual identity', 'Packaging design'],
    },
    gallery: [],
    featured: false,
  },
  {
    slug: 'chips-miaw',
    client: 'Chips Miaw',
    category: 'branding',
    sector: { ar: 'وجبات خفيفة', fr: 'Snacks', en: 'Snacks' },
    summary: {
      ar: 'هوية بصرية جريئة وتغليف لأربع نكهات، مصمّم ليلفت الأنظار في الرفوف.',
      fr: 'Identité visuelle audacieuse et packaging pour quatre saveurs, pensé pour se démarquer en rayon.',
      en: 'A bold visual identity and packaging across four flavours, made to stand out on the shelf.',
    },
    delivered: {
      ar: ['هوية بصرية', 'تغليف أربع نكهات', 'شعار'],
      fr: ['Identité visuelle', 'Packaging 4 saveurs', 'Logo'],
      en: ['Visual identity', 'Packaging for four flavours', 'Logo'],
    },
    gallery: [],
    featured: false,
  },
  {
    slug: 'qaada',
    client: 'Qaada',
    category: 'branding',
    sector: { ar: 'براندينغ وعرض تقديمي', fr: 'Branding & présentation', en: 'Branding & presentation' },
    summary: {
      ar: 'عمل هوية وعرض تقديمي للعلامة.',
      fr: 'Travail de branding et de présentation de marque.',
      en: 'Branding and brand-presentation work.',
    },
    delivered: {
      ar: ['هوية العلامة', 'عرض تقديمي'],
      fr: ['Identité de marque', 'Présentation'],
      en: ['Brand identity', 'Presentation'],
    },
    gallery: [],
    featured: false,
  },
  {
    slug: 'azas-tapis-royal',
    client: 'Azas Tapis Royal',
    category: 'marketing',
    sector: { ar: 'زرابي وفرش', fr: 'Tapis', en: 'Rugs & carpets' },
    summary: {
      ar: 'إدارة الشبكات الاجتماعية وحملات ممولة موجّهة، بنَت حضورًا رقميًا قويًا للعلامة.',
      fr: 'Gestion des réseaux sociaux et campagnes sponsorisées ciblées, qui ont bâti une forte présence en ligne.',
      en: 'Social media management and targeted sponsored campaigns that built a strong online presence.',
    },
    delivered: {
      ar: ['إدارة الشبكات الاجتماعية', 'حملات ممولة', 'محتوى منتظم'],
      fr: ['Gestion des réseaux sociaux', 'Campagnes sponsorisées', 'Contenu régulier'],
      en: ['Social media management', 'Sponsored campaigns', 'Regular content'],
    },
    gallery: [],
    featured: false,
  },
  {
    slug: 'almas-travel',
    client: 'Almas Travel',
    category: 'websites',
    sector: { ar: 'وكالة أسفار', fr: 'Agence de voyage', en: 'Travel agency' },
    summary: {
      ar: 'موقع تعريفي بتصميم مميّز يعكس مكانة الوكالة.',
      fr: "Site vitrine au design distinctif, à la hauteur du prestige de l'agence.",
      en: 'A showcase site with a distinctive design, matched to the agency’s standing.',
    },
    delivered: {
      ar: ['موقع تعريفي', 'تصميم الواجهة', 'موقع متجاوب'],
      fr: ['Site vitrine', 'Design de l’interface', 'Site responsive'],
      en: ['Showcase site', 'Interface design', 'Responsive build'],
    },
    gallery: [],
    featured: false,
  },
  {
    slug: 'taxiclick',
    client: 'Taxiclick',
    category: 'websites',
    sector: { ar: 'نقل بسائق', fr: 'VTC & mobilité', en: 'Ride-hailing & mobility' },
    summary: {
      ar: 'موقع إلكتروني لخدمة النقل بسائق.',
      fr: 'Site web pour un service de VTC.',
      en: 'A website for a ride-hailing service.',
    },
    delivered: {
      ar: ['موقع إلكتروني', 'تصميم الواجهة'],
      fr: ['Site web', 'Design de l’interface'],
      en: ['Website', 'Interface design'],
    },
    gallery: [],
    featured: false,
  },
  {
    slug: 'rozajin',
    client: 'Rozajin',
    category: 'video',
    sector: { ar: 'تصوير المنتجات', fr: 'Photographie produit', en: 'Product photography' },
    summary: {
      ar: 'جلسة تصوير منتجات احترافية، بإخراج فني موحّد عبر كامل التشكيلة.',
      fr: 'Shooting produit professionnel, avec une direction artistique tenue sur toute la gamme.',
      en: 'A professional product shoot, art-directed consistently across the range.',
    },
    delivered: {
      ar: ['تصوير المنتجات', 'إخراج فني', 'صور جاهزة للنشر'],
      fr: ['Photographie produit', 'Direction artistique', 'Images prêtes à publier'],
      en: ['Product photography', 'Art direction', 'Publish-ready images'],
    },
    gallery: [],
    featured: false,
  },
  /*
   * Signage and vitrine work, added from the photographs the client sent.
   * Neither has a link: an illuminated storefront is not a URL. Everything
   * below is read off the photographs themselves — the names on the signs, the
   * trade each shop is in, and the pieces actually installed. No results, no
   * dates and no claims beyond what is visible.
   */
  {
    slug: 'dari-shop',
    client: 'Dari Shop',
    category: 'design',
    sector: {
      ar: 'لوازم الحلويات والأفراح',
      fr: 'Articles de pâtisserie & fêtes',
      en: 'Pastry & party supplies',
    },
    summary: {
      ar: 'واجهة محل كاملة: حروف بارزة مضيئة، شعار مجسّم فوقها، ولوحة داخلية بإضاءة خلفية.',
      fr: "Habillage complet de façade : lettres boîtier lumineuses, logo en relief au-dessus et enseigne intérieure rétroéclairée.",
      en: 'A complete storefront: illuminated box letters, a raised logo sign above them, and a backlit sign inside.',
    },
    delivered: {
      ar: ['حروف مضيئة', 'لوحة الواجهة', 'شعار مجسّم', 'لوحة داخلية بإضاءة خلفية'],
      fr: [
        'Lettres boîtier lumineuses',
        'Enseigne de façade',
        'Logo en relief',
        'Enseigne intérieure rétroéclairée',
      ],
      en: [
        'Illuminated box letters',
        'Facade sign',
        'Raised logo sign',
        'Backlit interior sign',
      ],
    },
    cover: '/work/dari-shop/cover.webp',
    gallery: [
      '/work/dari-shop/facade-day.webp',
      '/work/dari-shop/interior-sign.webp',
    ],
    featured: true,
  },
  {
    slug: 'barbecue-el-hadje',
    // Spelled as the window itself spells it. The logo beside it reads
    // "مشاوي الحاج"; the Latin lettering is the one the shopfront leads with.
    client: 'Barbecue El Hadje',
    category: 'design',
    sector: {
      ar: 'مطعم ومشاوي',
      fr: 'Restauration & grillades',
      en: 'Restaurant & grill',
    },
    summary: {
      ar: 'تغليف كامل للواجهة الزجاجية: ألواح مطبوعة بصور الأطباق، وشعار المحل في القلب.',
      fr: "Habillage complet de la vitrine : panneaux imprimés aux visuels des plats, logo de l'enseigne au centre.",
      en: 'A full window wrap: printed panels carrying the dishes, with the restaurant logo at the centre.',
    },
    delivered: {
      ar: ['تغليف الواجهة الزجاجية', 'ألواح مطبوعة', 'شعار على الواجهة'],
      fr: ['Habillage de vitrine', 'Panneaux imprimés', 'Logo en façade'],
      en: ['Window wrap', 'Printed panels', 'Storefront logo'],
    },
    cover: '/work/barbecue-el-hadje/cover.webp',
    gallery: [],
    featured: false,
  },
]

/** Client logos for the trust wall. Names are real; add the rest from the old site. */
export const clients = [
  { name: 'EVE Accessoires', logo: '/clients/eve.webp' },
  { name: 'Expert Informatique', logo: '/clients/expert.webp' },
  { name: 'SARL Dadas', logo: '/clients/dadas.webp' },
  { name: 'GPL DZ', logo: '/clients/gpl.webp' },
  { name: 'ETS Mammeri', logo: '/clients/mammeri.webp' },
  { name: 'ETB Batna', logo: '/clients/etb.webp' },
  // TODO: add remaining logos from the old site with their real names.
] as const

/** YouTube Shorts produced by the agency. */
export const videos = [
  'YWwl8FQcMjg',
  'WHVWLsHj0QI',
  'oeL7ejQkSYI',
  'Cxt4N1TeXQ0',
  '-nN3BEaTEvI',
  'IIeTersdVUo',
  'PS1JReoKygE',
  'Rr6xvKzkLx4',
  'DGAA5zX4v6k',
  'Vr8i_fDBBsk',
  'a9uUFCcDZHM',
  'gP1-YXGgNSs',
] as const

export const featuredProjects = projects.filter((p) => p.featured)

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug)

export const projectsByCategory = (category: ProjectCategory | 'all') =>
  category === 'all' ? projects : projects.filter((p) => p.category === category)