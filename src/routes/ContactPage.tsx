import { MapPin } from 'lucide-react'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { company } from '@/data/company'
import { findRoute } from '@/data/routes'
import { InquiryForm } from '@/features/contact/InquiryForm'
import { useSeo } from '@/hooks/useSeo'

const meta = findRoute('/contact')!

/** Contact page like the original: the request form and the five offices. */
export default function ContactPage() {
  useSeo(meta.title, meta.description, meta.path)

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Ready to Begin Your Journey with Us?"
        lead="Tell us about the digital initiative you have in mind and we will get back to you within two working days."
      />

      <Section labelledBy="contact-heading">
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <div>
            <SectionHeading
              id="contact-heading"
              eyebrow="Get a free consultation"
              title="Let's Talk About Business"
              lead="Every request lands with a strategist who replies personally."
              className="mb-8"
            />
            <InquiryForm />
          </div>

          <aside aria-labelledby="offices-heading" className="flex flex-col gap-6">
            <h3 id="offices-heading" className="text-2xl font-bold tracking-tight">
              Our Offices
            </h3>
            <ul className="flex flex-col gap-4">
              {company.offices.map((office) => (
                <li key={office.city} className="flex gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
                  <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold">
                      {office.city}
                      <span className="ms-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {office.kind}
                      </span>
                    </p>
                    <address className="text-sm not-italic text-muted-foreground">{office.address}</address>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Open in Google Maps
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              Office addresses are from suitmedia.com. The email address and this form are
              placeholders for the redesign exercise.
            </p>
          </aside>
        </div>
      </Section>
    </>
  )
}
