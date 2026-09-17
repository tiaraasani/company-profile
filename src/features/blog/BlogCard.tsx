import { Link } from 'react-router'
import type { BlogPost } from './blogTypes'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/format'

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <time dateTime={new Date(post.created).toISOString()}>{formatDate(post.created)}</time>
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
            <Badge key={tag} variant="outline" asChild>
              <Link to={`/blog?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>
            </Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  )
}
