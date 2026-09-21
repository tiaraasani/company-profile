import type { IconName } from '@/lib/icons'

export interface Value {
  title: string
  description: string
  icon: IconName
}

export interface ApproachStep {
  title: string
  description: string
  icon: IconName
}

export interface JourneyPeriod {
  years: string
  title: string
  description: string
  highlights: string[]
}

export interface FaqItem {
  question: string
  answer: string
}

/** Culture: "purpose, process and people" from the About page, plus the impact statement. */
export const values: Value[] = [
  {
    title: 'Purpose',
    description:
      'Every engagement starts with the business outcome it must move, so effort goes where it matters.',
    icon: 'target',
  },
  {
    title: 'Process',
    description:
      'Research, design and engineering run as one programme with clear milestones and honest reporting.',
    icon: 'workflow',
  },
  {
    title: 'People',
    description:
      'Multidisciplinary teams that stay with a client from discovery to launch and beyond.',
    icon: 'users',
  },
  {
    title: 'Impact',
    description:
      'We create positive impacts through technology and creativity, for clients and the communities they serve.',
    icon: 'sparkles',
  },
]

/**
 * "Explore Our Approach" is illustrated rather than written on the original page; these
 * four steps are this redesign's reading of it, one per pillar.
 */
export const approach: ApproachStep[] = [
  {
    title: 'Discover',
    description:
      'Research the audience, the market and the systems already in place, then agree on the outcome the programme has to move.',
    icon: 'search',
  },
  {
    title: 'Design',
    description:
      'Shape the brand, the customer journeys and the interfaces, and test them with real users before engineering starts.',
    icon: 'pen-tool',
  },
  {
    title: 'Build',
    description:
      'Engineer web, mobile and commerce platforms in short releases, with quality and security built in from the first sprint.',
    icon: 'code',
  },
  {
    title: 'Grow',
    description:
      'Launch the campaigns, measure what changed, and keep improving the product and the marketing together.',
    icon: 'trending-up',
  },
]

/** "Discover Our Steps to Exceptional Journey": the three periods on suitmedia.com/about. */
export const journey: JourneyPeriod[] = [
  {
    years: '2009 - 2011',
    title: 'Starting Up',
    description:
      'Founded in Jakarta as PT Kreasi Online Indonesia by Informatics alumni of ITB, building software for the first clients.',
    highlights: ['Software development as the first service line', 'Annual revenue passed USD 250 thousand'],
  },
  {
    years: '2011 - 2015',
    title: 'Transition',
    description:
      'The e-commerce units were spun off and the agency expanded into digital marketing, growing into a full-service digital partner.',
    highlights: ['E-commerce spin-off', 'Digital marketing joined the service lines', 'Annual revenue passed USD 700 thousand'],
  },
  {
    years: '2015 - present',
    title: 'Scaling Up',
    description:
      'PT Suitmedia Kreasi Indonesia was established with a strategic partnership with Emtek Group, opening the door to enterprise-scale programmes.',
    highlights: ['Strategic partnership with Emtek Group', 'Annual revenue of around USD 2 million', '200+ digital experts across five offices'],
  },
]

/** The ten questions from the original FAQ, lightly tidied; answers are rewritten. */
export const faq: FaqItem[] = [
  {
    question: 'Why is Suitmedia considered a leading digital agency for corporations in Indonesia?',
    answer:
      'Since 2009 the agency has delivered more than 900 projects for medium and large enterprises, with solutions tailored to each business instead of one-size-fits-all packages.',
  },
  {
    question: "How can partnering with Suitmedia improve my company's digital marketing ROI?",
    answer:
      'Data-driven strategy is combined with creative work, so campaigns are planned against measurable targets and optimised continuously.',
  },
  {
    question: 'What industries does Suitmedia primarily serve in Indonesia?',
    answer:
      'Finance, healthcare, electronics, retail and FMCG make up most of the work, with strategies adapted to the rules and customers of each sector.',
  },
  {
    question: 'What qualifications and experience does Suitmedia have to handle complex projects?',
    answer:
      'Multidisciplinary teams of strategists, engineers and designers follow established project management and security practices on every engagement.',
  },
  {
    question: 'How does Suitmedia ensure effective collaboration with corporate executive teams?',
    answer:
      'Through transparent communication and an agile way of working, with stakeholders kept informed at every milestone.',
  },
  {
    question: 'What measurable results and KPIs can I expect from working with Suitmedia?',
    answer:
      'Typical targets are customer acquisition, engagement and operational efficiency, reported against a baseline agreed at the start of the programme.',
  },
  {
    question: 'How does Suitmedia handle data security and compliance in digital projects?',
    answer:
      'With secure architecture, strict access control and compliance with Indonesian regulations for sensitive corporate data.',
  },
  {
    question: 'What sets Suitmedia apart from other digital agencies in Jakarta?',
    answer:
      'Creative work paired with consulting and technical depth, and a commitment to long-term partnership rather than one-off projects.',
  },
  {
    question: "How can I evaluate Suitmedia's capabilities before starting a project?",
    answer:
      'Start with a consultation and walk through case studies from your industry to see how the approach fits your needs.',
  },
  {
    question: 'What are the first steps to initiate a partnership with Suitmedia?',
    answer:
      'Get in touch for a discovery session where we discuss your challenges and outline a tailored roadmap.',
  },
]
