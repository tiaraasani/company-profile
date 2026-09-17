import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { findRoute } from '@/data/routes'
import { BlogForm } from '@/features/blog/BlogForm'
import { useSeo } from '@/hooks/useSeo'

const meta = findRoute('/blog/new')!

/** Wrapped in <ProtectedRoute> in App.tsx: anonymous visitors are sent to /login first. */
export default function CreateBlogPage() {
  useSeo(meta.title, meta.description, meta.path)

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Write a post"
        lead="Publish an article to the Suitmedia blog. Drafts are saved in this browser automatically."
      />
      <Section labelledBy="editor-heading">
        <h2 id="editor-heading" className="sr-only">
          Editor
        </h2>
        <div className="mx-auto max-w-3xl">
          <BlogForm />
        </div>
      </Section>
    </>
  )
}
