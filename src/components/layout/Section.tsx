import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  id?: string
  /** id of the heading that labels this section (aria-labelledby). */
  labelledBy?: string
  className?: string
  containerClassName?: string
  children: ReactNode
}

/** Section with the shared vertical rhythm and container width. */
export function Section({
  id,
  labelledBy,
  className,
  containerClassName,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('py-12 md:py-20', className)}
    >
      <div className={cn('mx-auto max-w-7xl px-4 md:px-6', containerClassName)}>
        {children}
      </div>
    </section>
  )
}
