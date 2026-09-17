import { Link } from 'react-router'
import { Section } from '@/components/layout/Section'
import { buttonVariants } from '@/components/ui/button'
import { company } from '@/data/company'
import { useSeo } from '@/hooks/useSeo'
import { cn } from '@/lib/utils'

export default function NotFoundPage() {
  useSeo(
    `Page not found | ${company.name}`,
    'The page you are looking for does not exist or has moved.',
    '/404',
  )

  return (
    <Section labelledBy="notfound-title" className="py-20 md:py-32">
      <div className="flex max-w-xl flex-col gap-4">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Error 404
        </p>
        <h1 id="notfound-title" className="text-4xl font-bold tracking-tight md:text-5xl">
          Page not found
        </h1>
        <p className="text-lg text-muted-foreground">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link to="/" className={cn(buttonVariants(), 'h-11 px-6 text-base')}>
            Back to home
          </Link>
          <Link
            to="/blog"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-11 px-6 text-base',
            )}
          >
            Read the blog
          </Link>
        </div>
      </div>
    </Section>
  )
}
