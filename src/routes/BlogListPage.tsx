import { LoaderCircle, PenLine } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { ErrorState } from '@/components/shared/ErrorState'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { findRoute } from '@/data/routes'
import { BlogCard } from '@/features/blog/BlogCard'
import { fetchPosts, postsCacheKey } from '@/features/blog/blogApi'
import { PAGE_SIZE } from '@/features/blog/blogRow'
import type { BlogPost } from '@/features/blog/blogTypes'
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

/** Pages fetched by the "Load More" button, kept per tag so switching filters starts over. */
interface MoreState {
  tag: string | undefined
  pages: BlogPost[][]
  status: 'idle' | 'loading' | 'error'
}

function PostSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-2 h-4 w-28" />
      </div>
    </div>
  )
}

/**
 * "Articles", like the original Insights page: a card grid with a Load More button.
 * The first page is prerendered at build time and revalidated after hydration; the tag
 * filter lives in the URL (?tag=) so filtered views can be shared.
 */
export default function BlogListPage() {
  useSeo(meta.title, meta.description, meta.path)
  const [searchParams] = useSearchParams()
  const tag = searchParams.get('tag')?.trim().toLowerCase() || undefined

  const fetcher = useMemo(
    () => (signal: AbortSignal) => fetchPosts({ tag, signal }),
    [tag],
  )
  const posts = useResource(postsCacheKey(tag), fetcher, { revalidate: true })

  // Extra pages are local state; changing the filter resets them (adjust-state-during-render).
  const [more, setMore] = useState<MoreState>({ tag, pages: [], status: 'idle' })
  if (more.tag !== tag) setMore({ tag, pages: [], status: 'idle' })

  const firstPage = posts.data
  const allPosts = useMemo(() => {
    const seen = new Set<string>()
    return [...(firstPage ?? []), ...more.pages.flat()].filter((post) => {
      if (seen.has(post.objectId)) return false
      seen.add(post.objectId)
      return true
    })
  }, [firstPage, more.pages])
  const lastPage = more.pages.length > 0 ? more.pages[more.pages.length - 1] : (firstPage ?? [])
  const hasMore = posts.status === 'success' && lastPage.length === PAGE_SIZE

  const tags = useMemo(
    () => [...new Set(allPosts.flatMap((post) => post.tags))].sort(),
    [allPosts],
  )

  const loadMore = async () => {
    setMore((state) => ({ ...state, status: 'loading' }))
    try {
      const page = await fetchPosts({
        tag,
        offset: (firstPage?.length ?? 0) + more.pages.flat().length,
      })
      setMore((state) =>
        state.tag === tag ? { tag, pages: [...state.pages, page], status: 'idle' } : state,
      )
    } catch {
      setMore((state) => ({ ...state, status: 'error' }))
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Articles"
        lead="Notes on digital strategy, design, technology and marketing from the Suitmedia team."
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
                <Link to="/blog" aria-current={tag ? undefined : 'page'} className={chipClass(!tag)}>
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

        {posts.status === 'success' && allPosts.length === 0 && (
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

        {posts.status === 'success' && allPosts.length > 0 && (
          <>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allPosts.map((post) => (
                <li key={post.objectId}>
                  <BlogCard post={post} />
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center gap-3">
              <output className="text-sm text-muted-foreground">
                Showing {allPosts.length} article{allPosts.length === 1 ? '' : 's'}
              </output>
              {more.status === 'error' && (
                <p role="alert" className="text-sm text-destructive">
                  The next page could not be loaded. Try again.
                </p>
              )}
              {hasMore && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 px-6"
                  onClick={() => {
                    void loadMore()
                  }}
                  disabled={more.status === 'loading'}
                  aria-busy={more.status === 'loading'}
                >
                  {more.status === 'loading' && (
                    <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
                  )}
                  {more.status === 'loading' ? 'Loading' : 'Load More'}
                </Button>
              )}
            </div>
          </>
        )}
      </Section>
    </>
  )
}
