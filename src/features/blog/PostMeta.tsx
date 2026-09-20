import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format'

/** Tag chip that links to the blog list filtered by that tag. Used by the list and the article. */
export function TagBadge({ tag }: { tag: string }) {
  return (
    <Badge variant="outline" asChild>
      <Link to={`/blog?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>
    </Badge>
  )
}

/** Publish date as a machine-readable <time> element. */
export function PostDate({ timestamp }: { timestamp: number }) {
  return <time dateTime={new Date(timestamp).toISOString()}>{formatDate(timestamp)}</time>
}
