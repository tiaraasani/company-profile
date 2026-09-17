export interface BlogPost {
  objectId: string
  title: string
  slug: string
  excerpt: string
  /** Markdown source. */
  content: string
  tags: string[]
  authorName: string
  /** Epoch milliseconds set by Backendless. */
  created: number
  ownerId: string | null
}

export interface BlogPostInput {
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  authorName: string
}
