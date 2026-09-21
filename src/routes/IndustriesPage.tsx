import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { CtaBand } from '@/components/shared/CtaBand'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { industries } from '@/data/industries'
import { findRoute } from '@/data/routes'
import { useSeo } from '@/hooks/useSeo'
import { icons } from '@/lib/icons'

const meta = findRoute('/industries')!

/** "Industries We Serve": the same eighteen sectors as suitmedia.com/industries. */
export default function IndustriesPage() {
  useSeo(meta.title, meta.description, meta.path)

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Industries We Serve"
        lead="Eighteen sectors, one way of working: strategy, creative, technology and communication adapted to the rules and customers of each."
      />

      <Section labelledBy="industries-heading">
        <h2 id="industries-heading" className="sr-only">
          Sectors
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => {
            const Icon = icons[industry.icon]
            return (
              <li key={industry.name}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon aria-hidden="true" className="size-5" />
                    </div>
                    <CardTitle>
                      <h3 className="text-lg font-semibold">{industry.name}</h3>
                    </CardTitle>
                    <CardDescription className="leading-relaxed">
                      {industry.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            )
          })}
        </ul>
      </Section>

      <CtaBand secondaryTo="/work" secondaryLabel="See Our Case Studies" />
    </>
  )
}
