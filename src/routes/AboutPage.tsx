import { ArrowRight, ChevronDown, Mail } from 'lucide-react'
import { Link } from 'react-router'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { CtaBand } from '@/components/shared/CtaBand'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { approach, faq, journey, values } from '@/data/about'
import { company } from '@/data/company'
import { findRoute } from '@/data/routes'
import { TeamGrid } from '@/features/team/TeamGrid'
import { useSeo } from '@/hooks/useSeo'
import { icons } from '@/lib/icons'
import { cn } from '@/lib/utils'

const meta = findRoute('/about')!

/**
 * Same section order as suitmedia.com/about: values, approach, journey, FAQ, team, call to
 * action and careers. The team section carries the culture description the brief asks for
 * and previews the first four people from the Teams page (randomuser.me).
 */
export default function AboutPage() {
  useSeo(meta.title, meta.description, meta.path)

  return (
    <>
      <PageHero
        eyebrow="About"
        title="We Navigate Your Success in the Digital World"
        lead={`Guiding organisations through digital change with innovation and purpose since ${company.foundedYear}.`}
      />

      <Section labelledBy="values-heading">
        <SectionHeading
          id="values-heading"
          eyebrow="Our values"
          title="Create positive impacts through technology and creativity"
          lead="Purpose, process and people: the three things every programme is built around."
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = icons[value.icon]
            return (
              <li key={value.title}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon aria-hidden="true" className="size-5" />
                    </div>
                    <CardTitle>
                      <h3 className="text-lg font-semibold">{value.title}</h3>
                    </CardTitle>
                    <CardDescription className="leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section labelledBy="approach-heading" className="bg-muted/40">
        <SectionHeading
          id="approach-heading"
          eyebrow="How we work"
          title="Explore Our Approach"
          lead="Four steps that take a programme from the first question to measurable growth."
        />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {approach.map((step, index) => {
            const Icon = icons[step.icon]
            return (
              <li key={step.title} className="flex flex-col gap-3 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </li>
            )
          })}
        </ol>
      </Section>

      <Section labelledBy="journey-heading">
        <SectionHeading
          id="journey-heading"
          eyebrow="History"
          title="Discover Our Steps to Exceptional Journey"
          lead="From a software house founded by ITB alumni to one of Indonesia's leading digital agencies."
        />
        <ol className="relative max-w-3xl border-s border-border ps-6 sm:ps-8">
          {journey.map((period) => (
            <li key={period.title} className="relative pb-10 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute top-2 -start-[30px] size-2.5 rounded-full bg-primary ring-4 ring-background sm:-start-[38px]"
              />
              <article className="flex flex-col gap-2">
                <p className="text-sm font-semibold tracking-wide text-primary uppercase">
                  {period.years}
                </p>
                <h3 className="text-xl font-semibold">{period.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{period.description}</p>
                <ul className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground">
                  {period.highlights.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="faq-heading" className="bg-muted/40">
        <SectionHeading
          id="faq-heading"
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          lead="What prospective clients ask before they start working with us."
        />
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {faq.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl bg-card ring-1 ring-foreground/10 open:ring-primary/40"
            >
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-medium [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  aria-hidden="true"
                  className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section labelledBy="team-heading">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            id="team-heading"
            eyebrow="Team and culture"
            title="Fuel Innovation with Our Visionary People"
            lead="Skilled strategists, engineers, designers and analysts with experience in end-to-end digital solutions."
            className="mb-0"
          />
          <div className="flex flex-col gap-6">
            <p className="leading-relaxed text-muted-foreground">
              Teams are formed around each programme: a strategist to keep the goal in view,
              designers and engineers who build side by side, and analysts who measure what
              changed. The same people stay with a client from discovery through launch and
              the releases that follow, and every office shares the same way of working.
            </p>
            {/* Term before description, as <dl> requires; the figure is shown first via order. */}
            <dl className="grid grid-cols-2 gap-4">
              {company.stats.slice(2).map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col rounded-xl bg-card p-4 ring-1 ring-foreground/10"
                >
                  <dt className="order-2 text-sm text-muted-foreground">{stat.label}</dt>
                  <dd className="order-1 text-2xl font-bold tracking-tight">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-10 md:mt-14">
          <TeamGrid limit={4} />
        </div>
        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <Link to="/teams" className={cn(buttonVariants(), 'h-11 px-5')}>
            Meet Our People
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <p className="text-xs text-muted-foreground">
            Profiles are generated from randomuser.me for this exercise; names and photos are
            not real Suitmedia staff.
          </p>
        </div>
      </Section>

      <CtaBand />

      <Section labelledBy="careers-heading" className="bg-muted/40">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <SectionHeading
            id="careers-heading"
            eyebrow="Careers"
            title="Are You Ready to Embark on New Journey?"
            lead="We hire strategists, designers, engineers and analysts who like solving real problems together."
            className="mb-0"
          />
          <a
            href={`mailto:${company.email}?subject=${encodeURIComponent('Career at Suitmedia')}`}
            className={cn(buttonVariants({ variant: 'outline' }), 'h-11 shrink-0 px-6 text-base')}
          >
            <Mail aria-hidden="true" className="size-4" />
            Join Us Now
          </a>
        </div>
      </Section>
    </>
  )
}
