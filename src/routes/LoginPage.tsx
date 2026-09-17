import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { findRoute } from '@/data/routes'
import { useSeo } from '@/hooks/useSeo'

const meta = findRoute('/login')!

export default function LoginPage() {
  useSeo(meta.title, meta.description, meta.path)

  return (
    <>
      <PageHero eyebrow="Account" title="Log in" lead={meta.description} />
      <Section labelledBy="login-placeholder">
        <h2 id="login-placeholder" className="sr-only">
          Login form
        </h2>
        <p className="text-muted-foreground">The sign-in form comes next.</p>
      </Section>
    </>
  )
}
