import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { findRoute } from '@/data/routes'
import { useSeo } from '@/hooks/useSeo'

const meta = findRoute('/blog/new')!

export default function CreateBlogPage() {
  useSeo(meta.title, meta.description, meta.path)

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Write a post"
        lead="Publish an article to the Suitmedia blog."
      />
      <Section labelledBy="create-placeholder">
        <h2 id="create-placeholder" className="sr-only">
          Editor
        </h2>
        <p className="text-muted-foreground">The editor comes next.</p>
      </Section>
    </>
  )
}
