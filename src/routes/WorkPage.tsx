import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { CtaBand } from '@/components/shared/CtaBand'
import { Badge } from '@/components/ui/badge'
import { findRoute } from '@/data/routes'
import { caseStudies } from '@/data/work'
import { useSeo } from '@/hooks/useSeo'
import { cn } from '@/lib/utils'

const meta = findRoute('/work')!

/** Initials for the decorative cover, e.g. "Suntory Garuda Beverage" -> "SG". */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

/** "Our Case Studies": the projects listed on suitmedia.com/work, as a card grid. */
export default function WorkPage() {
  useSeo(meta.title, meta.description, meta.path)

  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Our Case Studies"
        lead="Discover inspiring success stories where our clients overcome challenges, leverage our expertise, and achieve remarkable results."
      />

      <Section labelledBy="work-heading">
        <h2 id="work-heading" className="sr-only">
          Case studies
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((study, index) => (
            <li key={study.slug}>
              <article className="flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
                {/* Decorative cover: no client artwork is reproduced, only the name. */}
                <div
                  aria-hidden="true"
                  className={cn(
                    'flex aspect-video items-end justify-between p-5',
                    index % 2 === 0
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-foreground text-background',
                  )}
                >
                  <span className="text-5xl font-bold tracking-tight">{initials(study.client)}</span>
                  <span className="text-sm font-medium">{study.client}</span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <Badge variant="secondary" className="self-start">
                    {study.industry}
                  </Badge>
                  <h3 className="text-lg font-semibold leading-snug">
                    {study.client}: {study.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{study.summary}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-xs text-muted-foreground">
          Case studies as listed on suitmedia.com, summarised in one line each for this
          redesign exercise. No client data or artwork is reproduced.
        </p>
      </Section>

      <CtaBand />
    </>
  )
}
