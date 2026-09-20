import { ArrowLeft, Check } from 'lucide-react'
import { lazy, Suspense, useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { Section } from '@/components/layout/Section'
import { ErrorState } from '@/components/shared/ErrorState'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { company } from '@/data/company'
import { fetchPostBySlug, postCacheKey } from '@/features/blog/blogApi'
import { PostDate, TagBadge } from '@/features/blog/PostMeta'
import { useSeo } from '@/hooks/useSeo'
import { readingTime } from '@/lib/format'
import { useResource } from '@/lib/resource'
import { cn } from '@/lib/utils'

const MarkdownRenderer = lazy(() => import('@/features/blog/MarkdownRenderer'))

function ArticleSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-4">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-11/12" />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="mt-4 h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
    </div>
  )
}

export default function BlogDetailPage() {
  const { slug = '' } = useParams()
  const location = useLocation()
  const justPublished = (location.state as { published?: boolean } | null)?.published === true

  const fetcher = useMemo(
    () => (signal: AbortSignal) => fetchPostBySlug(slug, signal),
    [slug],
  )
  const post = useResource(postCacheKey(slug), fetcher)
  const article = post.status === 'success' ? post.data : null

  useSeo(
    article ? `${article.title} | ${company.name} Blog` : `Article | ${company.name} Blog`,
    article?.excerpt || `Read the full article on the ${company.name} blog.`,
    `/blog/${slug}`,
  )

  if (post.status === 'success' && !article) {
    return (
      <Section labelledBy="page-title" className="py-20 md:py-32">
        <div className="flex max-w-xl flex-col gap-4">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">Error 404</p>
          <h1 id="page-title" className="text-4xl font-bold tracking-tight md:text-5xl">
            Article not found
          </h1>
          <p className="text-lg text-muted-foreground">
            There is no published post at this address. It may have been unpublished or the
            link may be incomplete.
          </p>
          <Link to="/blog" className={cn(buttonVariants(), 'mt-2 h-11 self-start px-6 text-base')}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to the blog
          </Link>
        </div>
      </Section>
    )
  }

  return (
    <article>
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <div className="flex max-w-3xl flex-col gap-4">
            <Link
              to="/blog"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              All articles
            </Link>
            {article ? (
              <>
                <h1 id="page-title" className="text-4xl font-bold tracking-tight text-balance md:text-5xl">
                  {article.title}
                </h1>
                <p className="text-muted-foreground">
                  By {article.authorName} on{' '}
                  <PostDate timestamp={article.created} />
                  , {readingTime(article.content)} min read
                </p>
                {article.tags.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
                    {article.tags.map((tag) => (
                      <li key={tag}>
                        <TagBadge tag={tag} />
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <>
                <h1 id="page-title" className="text-4xl font-bold tracking-tight md:text-5xl">
                  {post.status === 'error' ? 'Article unavailable' : 'Loading article'}
                </h1>
                {post.status === 'loading' && <Skeleton className="h-5 w-64" />}
              </>
            )}
          </div>
        </div>
      </header>

      <Section labelledBy="page-title">
        <div className="mx-auto max-w-3xl">
          {justPublished && (
            <output className="mb-8 flex items-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-foreground">
              <Check aria-hidden="true" className="size-4" />
              Your post is published and now appears in the blog list.
            </output>
          )}

          {post.status === 'error' && (
            <ErrorState
              title="The article could not be loaded"
              message="Backendless did not respond. Check your connection and try again."
              onRetry={post.reload}
            />
          )}

          {post.status === 'loading' && (
            <div aria-busy="true">
              <output className="sr-only">Loading article</output>
              <ArticleSkeleton />
            </div>
          )}

          {article && (
            <Suspense fallback={<ArticleSkeleton />}>
              <MarkdownRenderer content={article.content} />
            </Suspense>
          )}
        </div>
      </Section>
    </article>
  )
}
