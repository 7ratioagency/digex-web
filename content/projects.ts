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
  | 'video'

export type ProjectLinkKind = 'live' | 'behance' | 'youtube'

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
    // Empty until real gallery exports arrive. These three used to name
    // /work/eve/1..3.webp, files that never existed — invisible while the
    // page drew placeholders, three 400s the moment it drew <Image>.
    gallery: [],
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