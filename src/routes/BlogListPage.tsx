import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { findRoute } from '@/data/routes'
import { useSeo } from '@/hooks/useSeo'

const meta = findRoute('/blog')!

export default function BlogListPage() {
  useSeo(meta.title, meta.description, meta.path)

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Insights"
        lead="Notes on digital strategy, design and engineering from our team."
      />
      <Section labelledBy="blog-placeholder">
        <h2 id="blog-placeholder" className="sr-only">
          Blog list
        </h2>
        <p className="text-muted-foreground">The article list comes next.</p>
      </Section>
    </>
  )
}
