export interface Testimonial {
  id: string
  /** Keep quotes at 220 characters or fewer so carousel slides stay the same height. */
  quote: string
  /** Role and industry only: these quotes are illustrative for the redesign exercise. */
  role: string
  company: string
}

export const testimonials: Testimonial[] = [
  {
    id: 'retail-digital',
    quote:
      'Suitmedia felt like an extension of our own team. Strategy, design and engineering came from one table, so nothing got lost in hand-offs.',
    role: 'Head of Digital',
    company: 'Retail group',
  },
  {
    id: 'fintech-product',
    quote:
      'They challenged our brief in the right places. The product we launched was simpler than the one we asked for, and it performed better.',
    role: 'VP Product',
    company: 'Financial services',
  },
  {
    id: 'healthcare-it',
    quote:
      'Clear milestones, honest reporting and a platform that has been stable since day one. Exactly what an enterprise programme needs.',
    role: 'IT Director',
    company: 'Healthcare network',
  },
]
