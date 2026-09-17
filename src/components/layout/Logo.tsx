import { company } from '@/data/company'
import { cn } from '@/lib/utils'

/** Wordmark with a simple geometric mark. Inline SVG so it needs no extra request. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
        className="size-8 shrink-0"
      >
        <rect width="32" height="32" rx="9" className="fill-primary" />
        <path
          d="M10 21.5c1.6 1.2 3.4 1.8 5.4 1.8 2.6 0 4.2-1.1 4.2-2.8 0-1.5-1-2.3-3.6-3l-2-.6c-3.3-.9-5-2.6-5-5.2 0-3.3 2.8-5.3 6.8-5.3 2 0 3.8.4 5.4 1.3v3.4c-1.6-1.1-3.3-1.7-5.2-1.7-2.4 0-3.9 1-3.9 2.5 0 1.4 1 2.2 3.4 2.8l2 .6c3.5 1 5.2 2.7 5.2 5.4 0 3.5-2.9 5.6-7.2 5.6-2.2 0-4.2-.5-5.9-1.5z"
          className="fill-primary-foreground"
        />
      </svg>
      <span className="text-lg font-extrabold tracking-tight">{company.name}</span>
    </span>
  )
}
