import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { CtaBand } from '@/components/shared/CtaBand'
import { ServiceCard } from '@/components/shared/ServiceCard'
import { TestimonialCarousel } from '@/components/shared/TestimonialCarousel'
import { buttonVariants } from '@/components/ui/button'
import { values } from '@/data/about'
import { company } from '@/data/company'
import { findRoute } from '@/data/routes'
import { services } from '@/data/services'
import { testimonials } from '@/data/testimonials'
import { useSeo } from '@/hooks/useSeo'
import { icons } from '@/lib/icons'
import { cn } from '@/lib/utils'

const meta = findRoute('/')!

/**
 * Follows the order of suitmedia.com's home page (hero with figures, the four pillars, the
 * closing call to action), with the company overview and testimonials the brief requires
 * in between. Eagerly imported: this page carries the LCP for the most visited URL.
 */
export default function HomePage() {
  useSeo(meta.title, meta.description, meta.path)

  return (
    <>
      <section aria-labelledby="page-title" className="border-b bg-card">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              Digital agency since {company.foundedYear}
            </p>
            <h1
              id="page-title"
              className="text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl"
            >
              {company.tagline}
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
              {company.shortDescription}
            </p>
            <div>
              <Link
                to="/services"
                className={cn(buttonVariants({ size: 'lg' }), 'h-11 px-6 text-base')}
              >
                Explore Our Solutions
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 sm:grid-cols-4">
              {company.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="order-2 text-sm text-muted-foreground">{stat.label}</dt>
                  <dd className="order-1 text-3xl font-bold tracking-tight">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <img
            src="/images/hero-home-1024.webp"
            srcSet="/images/hero-home-640.webp 640w, /images/hero-home-1024.webp 1024w, /images/hero-home-1600.webp 1600w"
            sizes="(min-width: 1024px) 45vw, 100vw"
            width={1600}
            height={1000}
            alt="Abstract illustration of connected screens, charts and interface cards in Suitmedia's colours"
            fetchPriority="high"
            decoding="async"
            className="w-full rounded-2xl ring-1 ring-foreground/10"
          />
        </div>
      </section>

      <Section labelledBy="solutions-heading">
        <SectionHeading
          id="solutions-heading"
          eyebrow="Expertises"
          title="Strategic Digital Solutions for Your Businesses"
          lead="Strategy, creative, technology and communication, planned and delivered together so nothing is lost between hand-offs."
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="overview-heading" className="bg-muted/40">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            id="overview-heading"
            eyebrow="Who we are"
            title="A digital partner for the long run"
            lead={company.mission}
            className="mb-0"
          />
          <div className="flex flex-col gap-6">
            <p className="leading-relaxed text-muted-foreground">
              Founded in {company.foundedYear} by Informatics alumni of ITB, Suitmedia grew
              from a software house into a full-service digital agency. Today strategists,
              engineers, designers and analysts work as one team on end-to-end digital
              programmes for enterprise clients across finance, healthcare, electronics,
              retail and FMCG.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {values.map((value) => {
                const Icon = icons[value.icon]
                return (
                  <li key={value.title} className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <div>
                      <p className="font-semibold">{value.title}</p>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
            <Link
              to="/about"
              className={cn(buttonVariants({ variant: 'outline' }), 'h-11 self-start px-5')}
            >
              Read our story
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </Section>

      <Section labelledBy="testimonials-heading">
        <SectionHeading
          id="testimonials-heading"
          eyebrow="Testimonials"
          title="What clients say"
          align="center"
        />
        <TestimonialCarousel items={testimonials} />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Illustrative testimonials written for this redesign exercise.
        </p>
      </Section>

      <CtaBand />
    </>
  )
}
