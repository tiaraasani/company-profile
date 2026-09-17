import { Check, Mail } from 'lucide-react'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { CtaBand } from '@/components/shared/CtaBand'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { company } from '@/data/company'
import { findRoute } from '@/data/routes'
import { services } from '@/data/services'
import { useSeo } from '@/hooks/useSeo'
import { icons } from '@/lib/icons'
import { cn } from '@/lib/utils'

const meta = findRoute('/services')!

export default function ServicesPage() {
  useSeo(meta.title, meta.description, meta.path)
  const { hash } = useLocation()

  // Links such as /services#technology land on the right section once the page has rendered.
  useEffect(() => {
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
  }, [hash])

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What we do"
        lead="Strategy, creative, technology and communication, delivered end to end by one team."
      />

      <nav aria-label="Services on this page" className="border-b bg-card">
        <ul className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-4 md:px-6">
          {services.map((service) => (
            <li key={service.slug}>
              <a
                href={`#${service.slug}`}
                className="inline-flex h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                {service.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {services.map((service) => {
        const Icon = icons[service.icon]
        return (
          <Section
            key={service.slug}
            id={service.slug}
            labelledBy={`${service.slug}-heading`}
            className="border-b"
          >
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
              <div className="flex flex-col gap-6">
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon aria-hidden="true" className="size-6" />
                </div>
                <div className="flex flex-col gap-3">
                  <h2
                    id={`${service.slug}-heading`}
                    className="text-3xl font-bold tracking-tight md:text-4xl"
                  >
                    {service.title}
                  </h2>
                  <p className="text-lg text-primary">{service.tagline}</p>
                  <p className="leading-relaxed text-muted-foreground">{service.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">What is included</h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-muted-foreground">
                        <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardDescription>Indicative pricing</CardDescription>
                    <CardTitle>
                      <h3 className="text-lg font-semibold">{service.pricing.model}</h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <p className="text-2xl font-bold tracking-tight">{service.pricing.from}</p>
                    <p className="text-sm text-muted-foreground">{service.pricing.note}</p>
                  </CardContent>
                  <CardFooter>
                    <a
                      href={`mailto:${company.email}?subject=${encodeURIComponent(`${service.title} proposal`)}`}
                      className={cn(buttonVariants(), 'h-11 px-5')}
                    >
                      <Mail aria-hidden="true" className="size-4" />
                      Request a proposal
                    </a>
                  </CardFooter>
                </Card>

                <figure className="rounded-xl bg-muted/60 p-6">
                  <blockquote className="leading-relaxed">
                    <p>&ldquo;{service.testimonial.quote}&rdquo;</p>
                  </blockquote>
                  <figcaption className="mt-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{service.testimonial.role}</span>
                    , {service.testimonial.company}
                  </figcaption>
                </figure>
              </div>
            </div>
          </Section>
        )
      })}

      <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground md:px-6">
        Pricing and testimonials on this page are illustrative and were written for this
        redesign exercise.
      </p>

      <CtaBand />
    </>
  )
}
