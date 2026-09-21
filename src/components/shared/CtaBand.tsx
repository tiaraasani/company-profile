import { ArrowRight, Mail } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { company } from '@/data/company'
import { cn } from '@/lib/utils'

interface CtaBandProps {
  title?: string
  lead?: string
  /** Secondary link; defaults to the services page. */
  secondaryTo?: string
  secondaryLabel?: string
}

/** Closing call to action used on the marketing pages, worded like the original site. */
export function CtaBand({
  title = "Ready to Transform Your Digital Presence? Let's Talk.",
  lead = 'Tell us about your goals and we will come back with a plan, a team and a timeline.',
  secondaryTo = '/services',
  secondaryLabel = 'Explore Our Solutions',
}: CtaBandProps) {
  return (
    <section aria-labelledby="cta-heading" className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between md:px-6 md:py-20">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 id="cta-heading" className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
            {title}
          </h2>
          <p className="text-lg">{lead}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${company.email}`}
            className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'h-11 px-6 text-base')}
          >
            <Mail aria-hidden="true" className="size-4" />
            Get a Free Consultation
          </a>
          <Link
            to={secondaryTo}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'h-11 border-primary-foreground/40 bg-transparent px-6 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground',
            )}
          >
            {secondaryLabel}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
