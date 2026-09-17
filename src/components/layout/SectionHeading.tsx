import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** id used by the parent <Section aria-labelledby>. */
  id: string
  eyebrow?: string
  title: string
  lead?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-10 flex max-w-2xl flex-col gap-3 md:mb-14',
        align === 'center' && 'mx-auto items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
        {title}
      </h2>
      {lead && <p className="text-lg text-muted-foreground">{lead}</p>}
    </div>
  )
}
