import { parseTags, TAG_PATTERN } from './slugify'
import { z } from '@/lib/zod'

export const blogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(8, 'Give the post a title of at least 8 characters.')
    .max(120, 'The title must be 120 characters or fewer.'),
  excerpt: z
    .string()
    .trim()
    .max(200, 'The excerpt must be 200 characters or fewer.'),
  content: z
    .string()
    .trim()
    .min(100, 'Write at least 100 characters. Markdown is supported.')
    .max(20000, 'The post must be 20,000 characters or fewer.'),
  tags: z
    .string()
    .trim()
    .transform(parseTags)
    .pipe(
      z
        .array(
          z
            .string()
            .regex(TAG_PATTERN, 'Tags use lowercase letters, numbers and dashes (2 to 20 characters).'),
        )
        .max(5, 'Use at most 5 tags.'),
    ),
})

/** What the inputs hold (tags as a comma-separated string). */
export type BlogFormInput = z.input<typeof blogSchema>
/** What the resolver hands to onSubmit (tags as an array). */
export type BlogFormValues = z.output<typeof blogSchema>

export const EMPTY_BLOG_VALUES: BlogFormInput = {
  title: '',
  excerpt: '',
  content: '',
  tags: '',
}
