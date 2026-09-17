import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeroProps {
  eyebrow?: string
  title: string
  lead?: string
  children?: ReactNode
  className?: string
}

/**
 * Top band of an inner page. The h1 and lead are static text so they paint immediately
 * and act as the LCP element, even on pages that fetch data below.
 */
export function PageHero({ eyebrow, title, lead, children, className }: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-title"
      className={cn('border-b bg-card', className)}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex max-w-3xl flex-col gap-4">
          {eyebrow && (
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              {eyebrow}
            </p>
          )}
          <h1
            id="page-title"
            className="text-4xl font-bold tracking-tight text-balance md:text-5xl"
          >
            {title}
          </h1>
          {lead && <p className="text-lg text-muted-foreground md:text-xl">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
