import { CircleAlert } from 'lucide-react'
import type { Ref } from 'react'

export interface FormErrorItem {
  /** Stable key, usually the field name. */
  id: string
  /** Anchor to the field, e.g. "#post-title". */
  href: string
  label: string
  message: string
}

interface FormErrorSummaryProps {
  /** Focused by the form after a failed submit. */
  ref: Ref<HTMLDivElement>
  headingId: string
  title: string
  items: FormErrorItem[]
}

/** Announced list of validation errors; each entry links to its field. */
export function FormErrorSummary({ ref, headingId, title, items }: FormErrorSummaryProps) {
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      aria-labelledby={headingId}
      className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm"
    >
      <p id={headingId} className="flex items-center gap-2 font-semibold">
        <CircleAlert aria-hidden="true" className="size-4 text-destructive" />
        {title}
      </p>
      <ul className="mt-2 list-disc space-y-1 ps-5">
        {items.map((item) => (
          <li key={item.id}>
            <a href={item.href} className="underline underline-offset-4">
              {item.label}: {item.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
