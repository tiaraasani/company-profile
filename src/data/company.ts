/**
 * Company facts used across the site. Content is adapted from the public Suitmedia
 * website for this redesign exercise; see `disclaimer` below.
 */
export interface Stat {
  value: string
  label: string
}

export interface SocialLink {
  platform: 'linkedin' | 'instagram' | 'youtube' | 'email'
  label: string
  href: string
}

export const company = {
  name: 'Suitmedia',
  legalName: 'PT Suitmedia Kreasi Indonesia',
  tagline: 'Unlock your business potential with digital transformation',
  shortDescription:
    'A leading Indonesian digital agency, driving proven results in technology and marketing for enterprise clients.',
  mission:
    'Create positive impacts through technology and creativity, guided by purpose, process and people.',
  foundedYear: 2009,
  location: 'Jakarta, Indonesia',
  email: 'hello@example.com',
  phone: '+62 21 0000 0000',
  stats: [
    { value: '17+', label: 'Years of excellence' },
    { value: '900+', label: 'Digital projects' },
    { value: '150+', label: 'Satisfied clients' },
    { value: '200+', label: 'Digital experts' },
  ] satisfies Stat[],
  socials: [
    { platform: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/suitmedia' },
    { platform: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/suitmedia' },
    { platform: 'email', label: 'Email', href: 'mailto:hello@example.com' },
  ] satisfies SocialLink[],
  /** Shown in the footer: this is a student redesign, not the official site. */
  disclaimer:
    'Student redesign project for Purwadhika Code Challenge 2. Not affiliated with or endorsed by Suitmedia. Contact details on this site are placeholders.',
}
