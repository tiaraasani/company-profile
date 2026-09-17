import type { IconName } from '@/lib/icons'

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
  features: string[]
  pricing: ServicePricing
  testimonial: ServiceTestimonial
}

/** Service lines adapted from suitmedia.com ("Expertises"). Pricing is illustrative. */
export const services: Service[] = [
  {
    slug: 'strategy',
    title: 'Strategy',
    tagline: 'Decide with evidence, then execute with focus.',
    description:
      'Digital and IT advisory, UX and market research, and performance monitoring that turn business goals into a clear, measurable digital roadmap.',
    icon: 'compass',
    features: [
      'Digital and IT advisory',
      'UX research and market research',
      'Digital roadmap and product discovery',
      'Performance monitoring and analytics',
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
    tagline: 'Brands and interfaces people remember.',
    description:
      'Brand development, UI/UX design, content creation and videography, crafted by designers who work side by side with engineers.',
    icon: 'palette',
    features: [
      'Brand identity and guidelines',
      'UI/UX design and prototyping',
      'Content creation and copywriting',
      'Videography and motion',
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
      'iOS and Android development, web development, e-commerce solutions and SEO, delivered with the engineering discipline of a 17-year-old agency.',
    icon: 'code',
    features: [
      'iOS and Android apps',
      'Web applications and portals',
      'E-commerce platforms and integrations',
      'Technical SEO and site performance',
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
      'Creative campaigns, social media management, digital advertising and influencer marketing, planned and measured as one programme.',
    icon: 'megaphone',
    features: [
      'Creative campaign concepts',
      'Social media management',
      'Digital advertising and media buying',
      'Influencer and community marketing',
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
