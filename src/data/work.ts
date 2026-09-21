export interface CaseStudy {
  slug: string
  client: string
  title: string
  summary: string
  industry: string
}

/**
 * The case studies listed on suitmedia.com/work (client, title and one-line summary as
 * published there). Only the public card text is reproduced; there are no detail pages.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'yappika-e-learning',
    client: 'YAPPIKA',
    title: 'Scalable E-Learning Solution',
    summary: 'Enhancing digital learning through a user-centred platform.',
    industry: 'Nonprofit',
  },
  {
    slug: 'apl-integrated-platforms',
    client: 'APL',
    title: 'Integrated Digital Platforms',
    summary: 'Streamlining business operations with a unified ecosystem.',
    industry: 'Professional Services',
  },
  {
    slug: 'apl-e-po',
    client: 'APL',
    title: 'e-PO Website Development',
    summary: 'Unifying fragmented purchase-order processes into one integrated system.',
    industry: 'Professional Services',
  },
  {
    slug: 'taf-customer-experience',
    client: 'TAF',
    title: 'Bridging Brand Promise and Customer Experience',
    summary: 'Adding a personal touch to the digital customer experience.',
    industry: 'Financials',
  },
  {
    slug: 'bali-united-mobile',
    client: 'Bali United',
    title: 'Driving Fan Loyalty via Interactive Mobile',
    summary: 'Developing an interactive all-in-one mobile application.',
    industry: 'Sports',
  },
  {
    slug: 'isc-league-platform',
    client: 'ISC',
    title: 'Transforming a New League into Vital Infrastructure',
    summary: 'Creating a comprehensive, user-centric digital experience.',
    industry: 'Sports',
  },
  {
    slug: 'suntory-garuda-campaign',
    client: 'Suntory Garuda Beverage',
    title: 'Digital Marketing Campaign',
    summary: 'Enhancing digital marketing for better campaign results.',
    industry: 'Consumer Goods',
  },
  {
    slug: 'bango-warisan-kuliner',
    client: 'Unilever Bango',
    title: 'Warisan Kuliner Mobile App',
    summary: 'Transforming recipe content into a community platform.',
    industry: 'Consumer Goods',
  },
  {
    slug: 'yamaha-online-booking',
    client: 'Yamaha Motor',
    title: 'Online Booking System',
    summary: 'Creating a unified platform for motorcycle purchases.',
    industry: 'Automotive',
  },
  {
    slug: 'toyota-digital-leadership',
    client: 'Toyota',
    title: 'From Market Dominance to Digital Leadership',
    summary: 'Driving customer engagement in the automotive sector.',
    industry: 'Automotive',
  },
  {
    slug: 'toyota-ai-chatbot',
    client: 'Toyota',
    title: 'From a Machine to Trusted Friend with an AI Chatbot',
    summary: 'Leveraging AI to strengthen brand relationships.',
    industry: 'Automotive',
  },
  {
    slug: 'fifgroup-social-media',
    client: 'FIFGROUP',
    title: 'Social Media Management',
    summary: 'Boosting visibility through an audience-centric approach.',
    industry: 'Financials',
  },
]
