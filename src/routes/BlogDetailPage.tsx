import { useParams } from 'react-router'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { company } from '@/data/company'
import { useSeo } from '@/hooks/useSeo'

export default function BlogDetailPage() {
  const { slug = '' } = useParams()
  useSeo(
    `Article | ${company.name} Blog`,
    'Read the full article from the Suitmedia blog.',
    `/blog/${slug}`,
  )

  return (
    <>
      <PageHero eyebrow="Blog" title="Article" />
      <Section labelledBy="post-placeholder">
        <h2 id="post-placeholder" className="sr-only">
          Article content
        </h2>
        <p className="text-muted-foreground">The article view comes next.</p>
      </Section>
    </>
  )
}
