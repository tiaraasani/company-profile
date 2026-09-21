import { Link } from 'react-router'
import type { BlogPost } from './blogTypes'
import { PostDate, TagBadge } from './PostMeta'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** Stable choice between the two cover colours, so a post always looks the same. */
function tone(slug: string): 'primary' | 'dark' {
  let sum = 0
  for (const char of slug) sum += char.charCodeAt(0)
  return sum % 2 === 0 ? 'primary' : 'dark'
}

/**
 * Article card like the original Insights grid (cover, title, summary) plus the author
 * and date the brief asks for. The cover is decorative: posts have no image column, so
 * it shows the first tag and the title's initial in the brand colours.
 */
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card className="h-full overflow-hidden pt-0">
      <div
        aria-hidden="true"
        className={cn(
          'flex aspect-video items-end justify-between p-5',
          tone(post.slug) === 'primary'
            ? 'bg-primary text-primary-foreground'
            : 'bg-foreground text-background',
        )}
      >
        <span className="text-5xl font-bold tracking-tight">{post.title.charAt(0).toUpperCase()}</span>
        <span className="text-sm font-medium">{post.tags[0] ? `#${post.tags[0]}` : 'Insights'}</span>
      </div>
      <CardHeader>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <PostDate timestamp={post.created} />
        </p>
        <CardTitle>
          <h3 className="text-xl font-semibold leading-snug">
            <Link
              to={`/blog/${post.slug}`}
              className="underline-offset-4 hover:text-primary hover:underline"
            >
              {post.title}
            </Link>
          </h3>
        </CardTitle>
        {post.excerpt && (
          <CardDescription className="line-clamp-3 leading-relaxed">{post.excerpt}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="text-sm text-muted-foreground">By {post.authorName}</p>
      </CardContent>
      {post.tags.length > 0 && (
        <CardFooter className="flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </CardFooter>
      )}
    </Card>
  )
}
