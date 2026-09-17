import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/** Suspense fallback for lazily loaded pages; reserves height so the footer does not jump. */
export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20', className)}
    >
      <output className="sr-only">Loading page</output>
      <div aria-hidden="true" className="flex min-h-[60vh] flex-col gap-6">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-3/4 max-w-xl" />
        <Skeleton className="h-6 w-full max-w-2xl" />
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="hidden h-56 w-full sm:block" />
          <Skeleton className="hidden h-56 w-full lg:block" />
        </div>
      </div>
    </div>
  )
}
