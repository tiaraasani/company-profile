import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, LoaderCircle, Send } from 'lucide-react'
import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { createPost, uniqueSlug } from './blogApi'
import { blogSchema, EMPTY_BLOG_VALUES, type BlogFormInput, type BlogFormValues } from './blogSchema'
import { parseTags, slugify } from './slugify'
import { clearBlogDraft, useBlogDraftAutosave, useStoredBlogDraft } from './useBlogDraft'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth/auth'
import { BackendlessError, NetworkError } from '@/lib/backendless'

const MarkdownRenderer = lazy(() => import('./MarkdownRenderer'))

const FIELD_LABELS: Record<keyof BlogFormInput, string> = {
  title: 'Title',
  excerpt: 'Excerpt',
  content: 'Content',
  tags: 'Tags',
}

function messageForPublishError(error: unknown): string {
  if (error instanceof NetworkError) {
    return "We couldn't reach the server. Your draft is kept; check your connection and try again."
  }
  if (error instanceof BackendlessError) {
    if (error.status === 413) {
      return 'The post is longer than the Blog table currently allows. In the Backendless console, change the `content` column type to TEXT (Data > Blog > Schema), then try again.'
    }
    if (error.status === 401 || error.status === 403) {
      return 'You are not allowed to publish. Sign in again and retry.'
    }
    return `Publishing failed (${error.message}).`
  }
  return 'Publishing failed. Please try again.'
}

export function BlogForm() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const baseId = useId()
  const ids = {
    title: `${baseId}-title`,
    excerpt: `${baseId}-excerpt`,
    content: `${baseId}-content`,
    tags: `${baseId}-tags`,
    summary: `${baseId}-summary`,
  }

  const storedDraft = useStoredBlogDraft()
  const [draftDismissed, setDraftDismissed] = useState(false)
  const showDraftNotice = storedDraft !== null && !draftDismissed
  const [publishError, setPublishError] = useState<string | null>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  const form = useForm<BlogFormInput, unknown, BlogFormValues>({
    resolver: zodResolver(blogSchema),
    mode: 'onBlur',
    defaultValues: EMPTY_BLOG_VALUES,
  })
  useBlogDraftAutosave(form.watch)

  // The draft is only known on the client (hydration-safe store), so restore it once here.
  useEffect(() => {
    if (storedDraft) form.reset({ ...EMPTY_BLOG_VALUES, ...storedDraft.values })
  }, [storedDraft, form])

  const { errors, submitCount, isSubmitting } = form.formState
  const errorEntries = (Object.keys(errors) as (keyof BlogFormInput)[])
    .filter((key) => errors[key]?.message)
    .map((key) => ({ key, message: errors[key]?.message ?? '' }))

  // After a failed submit, move focus to the error summary.
  useEffect(() => {
    if (submitCount > 0 && errorEntries.length > 0) summaryRef.current?.focus()
    // Only re-run when a new submit attempt happens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount])

  const contentValue = useWatch({ control: form.control, name: 'content' })
  const tagsValue = useWatch({ control: form.control, name: 'tags' })
  const tagPreview = parseTags(tagsValue ?? '')

  const discardDraft = () => {
    form.reset(EMPTY_BLOG_VALUES)
    clearBlogDraft()
    setDraftDismissed(true)
  }

  const onSubmit = async (values: BlogFormValues) => {
    setPublishError(null)
    try {
      const slug = await uniqueSlug(slugify(values.title))
      const post = await createPost({
        title: values.title,
        slug,
        excerpt: values.excerpt || values.content.replace(/\s+/g, ' ').slice(0, 160).trim(),
        content: values.content,
        tags: values.tags,
        authorName: user?.name ?? 'Suitmedia',
      })
      clearBlogDraft()
      form.reset(EMPTY_BLOG_VALUES)
      navigate(`/blog/${post.slug}`, { state: { published: true } })
    } catch (caught) {
      setPublishError(messageForPublishError(caught))
    }
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10 md:p-8"
    >
      <p className="text-sm text-muted-foreground">
        Title and content are required. Markdown is supported in the content.
      </p>

      {showDraftNotice && (
        <output className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted px-4 py-3 text-sm">
          <span>Your unpublished draft was restored.</span>
          <button
            type="button"
            onClick={discardDraft}
            className="min-h-11 font-medium underline underline-offset-4"
          >
            Discard draft
          </button>
        </output>
      )}

      {submitCount > 0 && errorEntries.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby={ids.summary}
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm"
        >
          <p id={ids.summary} className="flex items-center gap-2 font-semibold">
            <CircleAlert aria-hidden="true" className="size-4 text-destructive" />
            Please fix the following before publishing
          </p>
          <ul className="mt-2 list-disc space-y-1 ps-5">
            {errorEntries.map((entry) => (
              <li key={entry.key}>
                <a href={`#${ids[entry.key]}`} className="underline underline-offset-4">
                  {FIELD_LABELS[entry.key]}: {entry.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {publishError && (
        <Alert variant="destructive">
          <CircleAlert aria-hidden="true" />
          <AlertTitle>Post not published</AlertTitle>
          <AlertDescription>{publishError}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={ids.title}>Title</FieldLabel>
              <Input
                {...field}
                id={ids.title}
                aria-required="true"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.invalid ? `${ids.title}-error` : undefined}
                className="h-11 text-lg"
              />
              {fieldState.invalid && <FieldError id={`${ids.title}-error`} errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="excerpt"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={ids.excerpt}>Excerpt</FieldLabel>
              <Input
                {...field}
                id={ids.excerpt}
                aria-invalid={fieldState.invalid}
                aria-describedby={`${ids.excerpt}-help${fieldState.invalid ? ` ${ids.excerpt}-error` : ''}`}
                className="h-11"
              />
              <FieldDescription id={`${ids.excerpt}-help`}>
                Optional, up to 200 characters. Shown in the article list; the first sentences of
                the content are used when empty.
              </FieldDescription>
              {fieldState.invalid && <FieldError id={`${ids.excerpt}-error`} errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={ids.content}>Content</FieldLabel>
              <Tabs defaultValue="write">
                <TabsList>
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                  <Textarea
                    {...field}
                    id={ids.content}
                    rows={14}
                    aria-required="true"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={`${ids.content}-help${fieldState.invalid ? ` ${ids.content}-error` : ''}`}
                    className="min-h-80 font-mono text-sm leading-relaxed"
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="min-h-80 rounded-lg border bg-background p-4">
                    {contentValue?.trim() ? (
                      <Suspense fallback={<Skeleton className="h-24 w-full" />}>
                        <MarkdownRenderer content={contentValue} />
                      </Suspense>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              <FieldDescription id={`${ids.content}-help`}>
                Use ## for headings, **bold**, lists and links. HTML is not rendered.
              </FieldDescription>
              {fieldState.invalid && <FieldError id={`${ids.content}-error`} errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="tags"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={ids.tags}>Tags</FieldLabel>
              <Input
                {...field}
                id={ids.tags}
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                aria-describedby={`${ids.tags}-help${fieldState.invalid ? ` ${ids.tags}-error` : ''}`}
                className="h-11"
              />
              <FieldDescription id={`${ids.tags}-help`}>
                Comma-separated, up to 5, lowercase letters, numbers and dashes.
              </FieldDescription>
              {tagPreview.length > 0 && (
                <ul className="flex flex-wrap gap-1.5" aria-label="Tags preview">
                  {tagPreview.map((tag) => (
                    <li key={tag}>
                      <Badge variant="secondary">#{tag}</Badge>
                    </li>
                  ))}
                </ul>
              )}
              {fieldState.invalid && <FieldError id={`${ids.tags}-error`} errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" className="h-11 px-6 text-base" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
          ) : (
            <Send aria-hidden="true" className="size-4" />
          )}
          {isSubmitting ? 'Publishing' : 'Publish post'}
        </Button>
        <p className="text-sm text-muted-foreground">
          Publishing as <span className="font-medium text-foreground">{user?.name ?? 'you'}</span>
        </p>
      </div>
    </form>
  )
}
