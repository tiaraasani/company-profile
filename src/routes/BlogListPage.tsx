import { PenLine } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { ErrorState } from '@/components/shared/ErrorState'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { findRoute } from '@/data/routes'
import { BlogCard } from '@/features/blog/BlogCard'
import { fetchPosts, postsCacheKey } from '@/features/blog/blogApi'
import { useSeo } from '@/hooks/useSeo'
import { useResource } from '@/lib/resource'
import { cn } from '@/lib/utils'

const meta = findRoute('/blog')!
const SKELETON_COUNT = 6

/** Filter chip; the active one is filled with the brand colour. */
function chipClass(active: boolean) {
  return cn(
    'inline-flex h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors hover:bg-muted',
    active && 'bg-primary text-primary-foreground hover:bg-primary/90',
  )
}

function PostSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-6 w-5/6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-auto h-4 w-28" />
    </div>
  )
}

export default function BlogListPage() {
  useSeo(meta.title, meta.description, meta.path)
  const [searchParams] = useSearchParams()
  const tag = searchParams.get('tag')?.trim().toLowerCase() || undefined

  const fetcher = useMemo(
    () => (signal: AbortSignal) => fetchPosts({ tag, signal }),
    [tag],
  )
  // The unfiltered list is prerendered at build time; it is revalidated after hydration so
  // posts published since the last deploy appear too.
  const posts = useResource(postsCacheKey(tag), fetcher, { revalidate: true })

  const tags = useMemo(
    () => [...new Set((posts.data ?? []).flatMap((post) => post.tags))].sort(),
    [posts.data],
  )

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Insights"
        lead="Notes on digital strategy, design and engineering from our team."
      >
        <Link
          to="/blog/new"
          className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 h-11 self-start px-5')}
        >
          <PenLine aria-hidden="true" className="size-4" />
          Write a post
        </Link>
      </PageHero>

      <Section labelledBy="posts-heading">
        <h2 id="posts-heading" className="sr-only">
          Articles
        </h2>

        {(tag || tags.length > 0) && (
          <nav aria-label="Filter by tag" className="mb-8">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link
                  to="/blog"
                  aria-current={tag ? undefined : 'page'}
                  className={chipClass(!tag)}
                >
                  All
                </Link>
              </li>
              {(tag && !tags.includes(tag) ? [tag, ...tags] : tags).map((item) => (
                <li key={item}>
                  <Link
                    to={`/blog?tag=${encodeURIComponent(item)}`}
                    aria-current={tag === item ? 'page' : undefined}
                    className={chipClass(tag === item)}
                  >
                    #{item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {posts.status === 'error' && (
          <ErrorState
            title="The articles could not be loaded"
            message="Backendless did not respond. Check your connection and try again."
            onRetry={posts.reload}
          />
        )}

        {posts.status === 'loading' && (
          <div aria-busy="true">
            <output className="sr-only">Loading articles</output>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <li key={index}>
                  <PostSkeleton />
                </li>
              ))}
            </ul>
          </div>
        )}

        {posts.status === 'success' && (posts.data?.length ?? 0) === 0 && (
          <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed p-8">
            <p className="text-lg font-semibold">
              {tag ? `No posts tagged #${tag} yet.` : 'No posts yet.'}
            </p>
            <p className="text-muted-foreground">
              Signed-in users can publish the first article from the editor.
            </p>
            <Link to="/blog/new" className={cn(buttonVariants(), 'h-11 px-5')}>
              <PenLine aria-hidden="true" className="size-4" />
              Write the first post
            </Link>
          </div>
        )}

        {posts.status === 'success' && (posts.data?.length ?? 0) > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.data!.map((post) => (
              <li key={post.objectId}>
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}
