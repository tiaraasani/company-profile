/**
 * Company facts used across the site. Headings, figures, office addresses and social
 * profiles come from the public Suitmedia website; descriptions are rewritten for this
 * redesign exercise (see `disclaimer`).
 */
export interface Stat {
  value: string
  label: string
}

export interface SocialLink {
  platform: 'instagram' | 'linkedin' | 'youtube' | 'facebook' | 'x' | 'spotify'
  label: string
  href: string
}

export interface Office {
  city: string
  /** "Head Office" or "Branch Office", as on the original contact page. */
  kind: string
  address: string
}

export const company = {
  name: 'Suitmedia',
  legalName: 'PT Suitmedia Kreasi Indonesia',
  /** Hero headline, as on suitmedia.com. */
  tagline: 'Unlock Your Business Potential with Digital Transformation',
  /** Hero subheadline, as on suitmedia.com. */
  shortDescription:
    'Suitmedia is a leading Indonesian digital agency, driving proven results in technology and marketing for enterprise clients.',
  /** Footer blurb. */
  footerDescription:
    'A full-service digital agency helping enterprise clients grow through strategy, creative, technology and communication, from the first idea to the releases that follow.',
  mission:
    'Create positive impacts through technology and creativity, guided by purpose, process and people.',
  foundedYear: 2009,
  location: 'Jakarta, Indonesia',
  /** Placeholder: the real address is not published in plain text. */
  email: 'hello@example.com',
  stats: [
    { value: '17+', label: 'Years of Excellence' },
    { value: '900+', label: 'Digital Projects' },
    { value: '150+', label: 'Satisfied Clients' },
    { value: '200+', label: 'Digital Experts' },
  ] satisfies Stat[],
  socials: [
    { platform: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/suitmedia/' },
    { platform: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/suitmedia/' },
    { platform: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@suitmedia' },
    { platform: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/suitmedia' },
    { platform: 'x', label: 'X (Twitter)', href: 'https://twitter.com/suitmedia' },
    { platform: 'spotify', label: 'Spotify', href: 'https://open.spotify.com/show/7D2MQnYYeui5DsXzfWMLXF' },
  ] satisfies SocialLink[],
  offices: [
    {
      city: 'Jakarta',
      kind: 'Head Office',
      address: 'Jl. Pekayon 1 No.26, Pasar Minggu, Jakarta Selatan, DKI Jakarta 12540',
    },
    { city: 'Bandung', kind: 'Branch Office', address: 'Jl. Sekeloa No.2, Dipatiukur, Bandung 40132' },
    { city: 'Yogyakarta', kind: 'Branch Office', address: 'Jl. Watugede No.58, Sleman, Yogyakarta 55581' },
    { city: 'Malang', kind: 'Branch Office', address: 'Jl. Tidar Barat No.3, Sukun, Malang 65149' },
    { city: 'Singapore', kind: 'Branch Office', address: '190 Clemenceau Avenue #06-02, Singapore 239924' },
  ] satisfies Office[],
  /** Shown in the footer: this is a student redesign, not the official site. */
  disclaimer:
    'Student redesign project for Purwadhika Code Challenge 2. Not affiliated with or endorsed by Suitmedia. The email address and forms on this site are placeholders.',
}
