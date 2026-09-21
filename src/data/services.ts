import type { IconName } from '@/lib/icons'

export interface ServiceOffering {
  /** Service name as listed on suitmedia.com/services. */
  name: string
  description: string
}

export interface ServicePricing {
  /** Engagement model shown on the pricing card. */
  model: string
  /** Starting price or range, as display text. */
  from: string
  note: string
}

export interface ServiceTestimonial {
  quote: string
  /** Role and industry only; these quotes are illustrative for the redesign. */
  role: string
  company: string
}

export interface Service {
  slug: string
  title: string
  tagline: string
  description: string
  icon: IconName
  /** The four named services under this pillar, as on the original site. */
  offerings: ServiceOffering[]
  pricing: ServicePricing
  testimonial: ServiceTestimonial
}

/**
 * The four pillars and their sixteen services follow suitmedia.com ("Expertises");
 * descriptions are rewritten, pricing and testimonials are illustrative.
 */
export const services: Service[] = [
  {
    slug: 'strategy',
    title: 'Strategy',
    tagline: 'Decide with evidence, then execute with focus.',
    description:
      'Digital advisory, customer research and analytics that turn business goals into a clear, measurable roadmap before anything gets built.',
    icon: 'compass',
    offerings: [
      {
        name: 'Digital Transformation Strategy',
        description:
          'Align technology investments with core business objectives so growth and efficiency move together.',
      },
      {
        name: 'Customer Experience Strategy',
        description:
          'Map and personalise customer journeys that turn first-time buyers into loyal advocates.',
      },
      {
        name: 'IT Strategy and Governance',
        description:
          'Give innovation a secure, well-governed IT foundation to run on.',
      },
      {
        name: 'Strategic Data Analytics',
        description:
          'Turn the data you already collect into insights that reveal opportunities and sharpen decisions.',
      },
    ],
    pricing: {
      model: 'Discovery sprint',
      from: 'From IDR 45 million',
      note: '2 to 4 weeks. Includes research, workshops and a prioritised roadmap.',
    },
    testimonial: {
      quote:
        'The discovery sprint gave our board a roadmap everyone could agree on, backed by research instead of opinions.',
      role: 'Head of Digital',
      company: 'Retail group',
    },
  },
  {
    slug: 'creative',
    title: 'Creative',
    tagline: 'Brands and experiences people remember.',
    description:
      'Brand building, experience design, content and visual storytelling, crafted by designers who work side by side with engineers.',
    icon: 'palette',
    offerings: [
      {
        name: 'Brand Equity Management',
        description:
          'Build long-term brand value with initiatives that keep the brand consistent, relevant and ahead of the market.',
      },
      {
        name: 'Digital Experience Design',
        description:
          'Design websites and apps that people enjoy using and that convert.',
      },
      {
        name: 'Strategic Content Marketing',
        description:
          'Plan and produce content that holds attention and moves the business forward.',
      },
      {
        name: 'Visual Storytelling',
        description:
          "Tell the brand's story through photography, video and motion that connect emotionally.",
      },
    ],
    pricing: {
      model: 'Design engagement',
      from: 'From IDR 60 million',
      note: 'Scoped per product or campaign. Design system hand-off included.',
    },
    testimonial: {
      quote:
        'Our app went from functional to something customers actually enjoy using. The design system keeps every new screen consistent.',
      role: 'Product Manager',
      company: 'Financial services',
    },
  },
  {
    slug: 'technology',
    title: 'Technology',
    tagline: 'Web, mobile and commerce platforms built to scale.',
    description:
      'Mobile and web development, digital commerce and search optimisation, delivered with the engineering discipline of a 17-year-old agency.',
    icon: 'code',
    offerings: [
      {
        name: 'Mobile Application Development',
        description:
          'Reach customers on iOS and Android with apps that are fast, stable and easy to grow.',
      },
      {
        name: 'Web Application Development',
        description:
          'Custom web platforms and portals that streamline how the business operates.',
      },
      {
        name: 'Digital Commerce Solutions',
        description:
          'E-commerce platforms tailored to how you sell, from catalogue to checkout to fulfilment.',
      },
      {
        name: 'Search Engine Optimization',
        description:
          'Grow organic visibility and qualified leads through technical and content SEO.',
      },
    ],
    pricing: {
      model: 'Build and run',
      from: 'From IDR 150 million',
      note: 'Fixed-scope builds or dedicated squads billed monthly. Support plans available.',
    },
    testimonial: {
      quote:
        'The new commerce platform handled our biggest campaign day without a hiccup, and the team kept shipping improvements after launch.',
      role: 'IT Director',
      company: 'Consumer electronics',
    },
  },
  {
    slug: 'communication',
    title: 'Communication',
    tagline: 'Campaigns that reach the right audience.',
    description:
      'Integrated campaigns, paid media, social and influencer marketing, planned and measured as one programme.',
    icon: 'megaphone',
    offerings: [
      {
        name: 'Integrated Marketing Campaigns',
        description:
          'Cohesive campaigns across channels so every touchpoint tells the same story.',
      },
      {
        name: 'Digital Advertising',
        description:
          'Data-driven paid media that makes every rupiah of ad spend count.',
      },
      {
        name: 'Social Media Management',
        description:
          'Everyday presence that builds meaningful connections and lasting loyalty.',
      },
      {
        name: 'Influencer Marketing',
        description:
          "Partnerships with trusted voices that amplify the brand's message.",
      },
    ],
    pricing: {
      model: 'Monthly retainer',
      from: 'From IDR 25 million per month',
      note: 'Media spend billed separately. Monthly reporting and optimisation included.',
    },
    testimonial: {
      quote:
        'Engagement doubled within a quarter, and for the first time we could see which channel actually drove sales.',
      role: 'Marketing Manager',
      company: 'FMCG brand',
    },
  },
]
