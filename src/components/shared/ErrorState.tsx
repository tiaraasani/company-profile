import { CircleAlert, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

/** Announced error with a recovery action, used where remote data failed to load. */
export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-6"
    >
      <p className="flex items-center gap-2 font-semibold">
        <CircleAlert aria-hidden="true" className="size-5 text-destructive" />
        {title}
      </p>
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button type="button" variant="outline" className="h-11 px-4" onClick={onRetry}>
          <RotateCw aria-hidden="true" className="size-4" />
          Try again
        </Button>
      )}
    </div>
  )
}
