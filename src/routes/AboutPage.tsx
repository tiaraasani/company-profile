import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { CtaBand } from '@/components/shared/CtaBand'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { milestones, values } from '@/data/about'
import { company } from '@/data/company'
import { findRoute } from '@/data/routes'
import { useSeo } from '@/hooks/useSeo'
import { icons } from '@/lib/icons'
import { cn } from '@/lib/utils'

const meta = findRoute('/about')!

export default function AboutPage() {
  useSeo(meta.title, meta.description, meta.path)

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Our story"
        lead={`Founded in ${company.foundedYear} by Informatics alumni of ITB, Suitmedia has grown from a software house into one of Indonesia's leading digital agencies.`}
      />

      <Section labelledBy="history-heading">
        <SectionHeading
          id="history-heading"
          eyebrow="History"
          title="From software house to digital partner"
          lead="The milestones that shaped how we work today."
        />
        <ol className="relative max-w-3xl border-s border-border ps-6 sm:ps-8">
          {milestones.map((milestone) => (
            <li key={milestone.year} className="relative pb-10 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute top-2 -start-[30px] size-2.5 rounded-full bg-primary ring-4 ring-background sm:-start-[38px]"
              />
              <article className="flex flex-col gap-2">
                <p className="text-sm font-semibold tracking-wide text-primary uppercase">
                  {milestone.year}
                </p>
                <h3 className="text-xl font-semibold">{milestone.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{milestone.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="team-heading" className="bg-muted/40">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            id="team-heading"
            eyebrow="Team"
            title="200+ digital experts"
            lead="Skilled strategists, engineers, designers and analysts with experience in end-to-end digital solutions."
            className="mb-0"
          />
          <div className="flex flex-col gap-6">
            <p className="leading-relaxed text-muted-foreground">
              Teams are formed around each programme: a strategist to keep the goal in view,
              designers and engineers who build side by side, and analysts who measure what
              changed. The same people stay with a client from discovery through launch and
              the releases that follow.
            </p>
            <dl className="grid grid-cols-2 gap-4">
              {company.stats.slice(2).map((stat) => (
                <div key={stat.label} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
                  <dd className="text-2xl font-bold tracking-tight">{stat.value}</dd>
                  <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                </div>
              ))}
            </dl>
            <Link
              to="/teams"
              className={cn(buttonVariants(), 'h-11 self-start px-5')}
            >
              Meet the team
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </Section>

      <Section labelledBy="culture-heading">
        <SectionHeading
          id="culture-heading"
          eyebrow="Culture"
          title="Purpose, process and people"
          lead={company.mission}
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

      <CtaBand
        title="Want to work with us?"
        lead="We are always looking for partners and people who care about doing digital well."
      />
    </>
  )
}
