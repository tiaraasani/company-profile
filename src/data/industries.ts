import type { IconName } from '@/lib/icons'

export interface Industry {
  name: string
  description: string
  icon: IconName
}

/** The eighteen sectors on suitmedia.com/industries; descriptions are rewritten. */
export const industries: Industry[] = [
  {
    name: 'Automotive',
    description: 'Data-driven strategies and digital showrooms for a market that keeps changing.',
    icon: 'car',
  },
  {
    name: 'Construction',
    description: 'Digital tools that streamline operations and protect margins on every project.',
    icon: 'hard-hat',
  },
  {
    name: 'Consumer Goods',
    description: 'Campaigns and platforms that connect brands with shoppers and drive sales.',
    icon: 'shopping-bag',
  },
  {
    name: 'Education',
    description: 'Learning platforms that raise student engagement and outcomes.',
    icon: 'graduation-cap',
  },
  {
    name: 'Electronics',
    description: 'Seamless online experiences that grow sales and brand awareness.',
    icon: 'cpu',
  },
  {
    name: 'Energy',
    description: 'Data insights that optimise operations and support sustainability goals.',
    icon: 'zap',
  },
  {
    name: 'Financials',
    description: 'Secure digital products that deepen engagement and reduce risk.',
    icon: 'banknote',
  },
  {
    name: 'Government',
    description: 'Services that improve citizen engagement and make delivery more efficient.',
    icon: 'landmark',
  },
  {
    name: 'Healthcare',
    description: 'Digital solutions that improve patient care and everyday efficiency.',
    icon: 'heart-pulse',
  },
  {
    name: 'Materials',
    description: 'Supply-chain visibility and customer engagement built on data.',
    icon: 'boxes',
  },
  {
    name: 'Media',
    description: 'Strategies that grow audiences and turn content into revenue.',
    icon: 'newspaper',
  },
  {
    name: 'Nonprofit',
    description: 'Digital marketing that amplifies the message and maximises impact.',
    icon: 'heart-handshake',
  },
  {
    name: 'Professional Services',
    description: 'Content and marketing that attract clients and build reputation.',
    icon: 'briefcase',
  },
  {
    name: 'Real Estate',
    description: 'Digital marketing and experiences that attract buyers and tenants.',
    icon: 'building',
  },
  {
    name: 'Retail',
    description: 'Commerce experiences that delight customers and lift sales.',
    icon: 'store',
  },
  {
    name: 'Sports',
    description: 'Fan engagement and immersive experiences that grow revenue.',
    icon: 'trophy',
  },
  {
    name: 'Technology',
    description: 'Brand leadership and launches that showcase innovation.',
    icon: 'monitor-smartphone',
  },
  {
    name: 'Tourism',
    description: 'Compelling marketing and immersive tours that attract visitors.',
    icon: 'plane',
  },
]
