// Destination in repo: content/testimonials.ts
//
// Real client testimonials, recovered from the old digex.agency site
// (assets/backup/digex-content.json → testimonials_fr / testimonials_en).
//
// RULE, same as content/projects.ts: never add an entry that a client did not
// actually say. Until this file existed the site had no testimonials at all,
// precisely because inventing them was not an option.
//
// French and English are the client's own published wording, kept verbatim
// apart from the typographic quotes the old CMS wrapped them in. Arabic is
// written natively here — the old site never had an Arabic version, and
// running the French through a translator would have produced exactly the
// stiff register CLAUDE.md rules out.
//
// `logo` is deliberately absent. The old site's logo files
// (wp-content/uploads/2025/03/*.png) are named in the media inventory but the
// binaries are not in the backup, and digex.agency no longer serves them. Add
// a `logo` field here once those files arrive.

import type { Locale, Localized } from './projects'

export interface Testimonial {
  /** Real client name — displayed as-is, not translated. */
  client: string
  /** How the client describes themselves. */
  role: Localized
  quote: Localized
  /**
   * Portfolio slug, where the same client has a project entry. Lets a
   * testimonial link through to the work it is talking about.
   */
  projectSlug?: string
}

export const testimonials: Testimonial[] = [
  {
    client: 'EVE',
    projectSlug: 'eve-accessoires',
    role: {
      ar: 'متجر إلكتروني',
      fr: 'Boutique en ligne',
      en: 'Online shop',
    },
    quote: {
      ar: 'بفضل ديجكس، صارت لعلامتنا للمجوهرات هوية مبهرة ومتجر إلكتروني سلس. التصميم والوظائف والنتائج فاقت كل ما توقّعناه.',
      fr: 'Grâce à DIGEX, notre marque de bijoux a maintenant une identité étonnante et un site de commerce fluide. Le design, les fonctionnalités et les résultats ont dépassé nos attentes !',
      en: 'Thanks to DIGEX, our jewellery brand now has a stunning identity and a seamless eCommerce website. The design, functionality, and results exceeded our expectations!',
    },
  },
  {
    client: 'BissaneLab',
    projectSlug: 'bissanelab',
    role: {
      ar: 'علامة ديرمو-كوزمتيك',
      fr: 'Marque dermo-cosmétique',
      en: 'Dermo-cosmetic brand',
    },
    quote: {
      ar: 'رفعت ديجكس مستوى علامتنا في مجال الديرمو-كوزمتيك باستراتيجية تسويق قوية، وتغليف لافت، وحضور نشط على الشبكات الاجتماعية. بفضل عملهم، ارتفعت مبيعاتنا بشكل ملحوظ.',
      fr: 'DIGEX a élevé notre marque dermocosmétique avec une stratégie de marketing forte, un emballage exceptionnel et une présence dynamique sur les réseaux sociaux. Grâce à leur travail, nos ventes ont considérablement augmenté !',
      en: 'DIGEX elevated our cosmetic brand with a strong marketing strategy, eye-catching packaging, and a dynamic social media presence. Thanks to their work, our sales have significantly increased!',
    },
  },
  {
    client: 'El Arkem',
    role: {
      ar: 'صاحب المؤسسة',
      fr: "Propriétaire d'entreprise",
      en: 'Business owner',
    },
    quote: {
      ar: 'بفضل ديجكس، صارت لعلامة الشاي خاصتنا هوية راقية وتغليف أنيق يعكس جودتنا فعلًا. إبداعهم واهتمامهم بالتفاصيل جعلانا نتميّز في السوق.',
      fr: 'Grâce à DIGEX, notre marque de thé possède maintenant une identité raffinée et un packaging élégant qui reflètent vraiment notre qualité. Leur créativité et leur sens du détail nous ont permis de nous démarquer sur le marché !',
      en: 'Thanks to DIGEX, our tea brand now has a refined identity and elegant packaging that truly reflects our quality. Their creativity and attention to detail helped us stand out in the market!',
    },
  },
  {
    client: 'Azas Tapis Royal',
    role: {
      ar: 'صاحب المؤسسة',
      fr: "Propriétaire d'entreprise",
      en: 'Business owner',
    },
    quote: {
      ar: 'حصلنا على حضور رقمي قوي بفضل إدارة احترافية للشبكات الاجتماعية وحملات ممولة موجّهة. التزامهم وجدّيتهم في العمل رفعا قيمة علامتنا حقًا.',
      fr: 'Nous avons acquis une forte présence en ligne grâce à une gestion experte des réseaux sociaux et à des campagnes sponsorisées ciblées. Le dévouement de DIGEX et leur travail acharné ont véritablement valorisé notre marque !',
      en: 'We gained a strong online presence with expert social media management and targeted sponsorships. Their dedication and hard work have truly elevated our brand!',
    },
  },
  {
    client: 'Chips Miaw',
    role: {
      ar: 'صاحب المؤسسة',
      fr: "Propriétaire d'entreprise",
      en: 'Business owner',
    },
    quote: {
      ar: 'أعطت ديجكس الحياة لـ Chips Miaw بهوية بصرية جريئة وتغليف مرح لنكهاتنا الأربع. إبداعهم وخبرتهم جعلا منتجنا يلفت الأنظار في الرفوف.',
      fr: 'DIGEX a donné vie à Chips Miaw avec une identité visuelle audacieuse et un packaging mignon pour nos quatre délicieuses saveurs. Leur créativité et leur expertise ont permis à notre produit de se démarquer en rayon !',
      en: 'DIGEX brought Chips Miaw to life with a bold brand identity and vibrant packaging for our four delicious flavors. Their creativity and expertise made our product stand out on the shelves!',
    },
  },
  {
    client: 'Almas Travel',
    role: {
      ar: 'وكالة أسفار',
      fr: 'Agence de voyage',
      en: 'Travel agency',
    },
    quote: {
      ar: 'صار لوكالة الماس للأسفار حضور مبهر بتصميم مميّز يعكس تمامًا مكانة الوكالة. أسلوبهم الإبداعي واحترافيتهم فاقا توقّعاتنا.',
      fr: "Almas Travel dispose désormais d'une présence en ligne impressionnante avec un design distinctif qui incarne parfaitement le prestige de notre agence. Leur approche créative et leur professionnalisme ont largement dépassé nos attentes.",
      en: "Almas Travel now has a stunning showcase with a standout design that perfectly reflects our agency's prestige. Their creativity and professionalism exceeded our expectations!",
    },
  },
  {
    client: 'Delmoosh',
    projectSlug: 'delmoosh',
    role: {
      ar: 'مركز للحيوانات الأليفة',
      fr: 'Animalerie',
      en: 'Pet centre',
    },
    quote: {
      // English written here: the old site published this one in French only.
      ar: 'أعطت ديجكس الحياة لمركزنا للحيوانات الأليفة. الهوية والموقع والتصميم الداخلي، كلها جاءت منسجمة تمامًا مع رؤيتنا.',
      fr: "DIGEX a donné vie à notre animalerie ! La marque, le site web et le design d'intérieur étaient tous parfaitement alignés avec notre vision.",
      en: 'DIGEX brought our pet centre to life. The brand, the website and the interior design were all perfectly aligned with our vision.',
    },
  },
]

/** The testimonial for one project, where that client left one. */
export const testimonialFor = (projectSlug: string) =>
  testimonials.find((t) => t.projectSlug === projectSlug)

export type { Locale }
