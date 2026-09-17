import { TeamCard } from './TeamCard'
import { fetchTeam, TEAM_CACHE_KEY } from './teamApi'
import { ErrorState } from '@/components/shared/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { useResource } from '@/lib/resource'

const PLACEHOLDER_COUNT = 8

/** Skeleton card with the same footprint as TeamCard so the grid does not shift. */
function TeamCardSkeleton() {
  return (
    <div className="flex h-full flex-col items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <Skeleton className="size-24 rounded-full" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

export function TeamGrid() {
  const team = useResource(TEAM_CACHE_KEY, fetchTeam, { cache: true })

  if (team.status === 'error') {
    return (
      <ErrorState
        title="The team could not be loaded"
        message="randomuser.me did not respond. Check your connection and try again."
        onRetry={team.reload}
      />
    )
  }

  const loading = team.status === 'loading'

  return (
    <div aria-busy={loading}>
      {loading && <output className="sr-only">Loading team members</output>}
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
              <li key={index} aria-hidden="true">
                <TeamCardSkeleton />
              </li>
            ))
          : team.data?.map((member) => (
              <li key={member.id}>
                <TeamCard member={member} />
              </li>
            ))}
      </ul>
    </div>
  )
}
