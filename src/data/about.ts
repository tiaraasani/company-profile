import type { IconName } from '@/lib/icons'

export interface Milestone {
  year: string
  title: string
  description: string
}

export interface Value {
  title: string
  description: string
  icon: IconName
}

export interface Industry {
  name: string
  icon: IconName
}

/** Company history adapted from suitmedia.com/about. */
export const milestones: Milestone[] = [
  {
    year: '2009',
    title: 'Founded in Jakarta',
    description:
      'Started as PT Kreasi Online Indonesia by Informatics alumni of ITB, offering software development services.',
  },
  {
    year: '2011',
    title: 'From software to digital',
    description:
      'Spun off the e-commerce units and expanded into digital marketing, growing into a full-service digital partner.',
  },
  {
    year: '2015',
    title: 'PT Suitmedia Kreasi Indonesia',
    description:
      'Established the new entity with a strategic partnership with Emtek Group, opening the door to enterprise-scale programmes.',
  },
  {
    year: 'Today',
    title: 'Scaling up',
    description:
      'More than 900 digital projects delivered for 150+ clients by a team of 200+ strategists, engineers, designers and analysts.',
  },
]

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

/** Sectors mentioned on the About page. */
export const industries: Industry[] = [
  { name: 'Finance', icon: 'landmark' },
  { name: 'Healthcare', icon: 'heart-pulse' },
  { name: 'Electronics', icon: 'cpu' },
  { name: 'Retail', icon: 'shopping-bag' },
  { name: 'FMCG', icon: 'package' },
  { name: 'Public sector', icon: 'building' },
]
