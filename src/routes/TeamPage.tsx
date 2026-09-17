import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { CtaBand } from '@/components/shared/CtaBand'
import { findRoute } from '@/data/routes'
import { TeamGrid } from '@/features/team/TeamGrid'
import { useSeo } from '@/hooks/useSeo'

const meta = findRoute('/teams')!

export default function TeamPage() {
  useSeo(meta.title, meta.description, meta.path)

  return (
    <>
      <PageHero
        eyebrow="Teams"
        title="The people behind the work"
        lead="Strategists, engineers, designers and analysts who stay with a client from discovery to launch."
      />

      <Section labelledBy="team-heading">
        <h2 id="team-heading" className="sr-only">
          Team members
        </h2>
        <TeamGrid />
        <p className="mt-8 text-xs text-muted-foreground">
          Profiles are generated from randomuser.me for this exercise; names and photos are
          not real Suitmedia staff.
        </p>
      </Section>

      <CtaBand
        title="Join the team"
        lead="We hire strategists, designers, engineers and analysts who like solving real problems together."
      />
    </>
  )
}
