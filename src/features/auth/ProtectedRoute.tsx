import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from './auth'
import { PageSkeleton } from '@/components/shared/PageSkeleton'

/**
 * Gate for pages that need a signed-in user. While a stored session is being validated
 * the page skeleton is shown (never a redirect, or a hard refresh would bounce to login);
 * anonymous visitors go to /login and come back to `from` afterwards.
 *
 * Both placeholders reserve a full viewport of height so the footer stays below the fold
 * until the real page is in place (otherwise the swap counts as layout shift).
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'restoring') return <PageSkeleton className="min-h-dvh" />
  if (status === 'anonymous') {
    return (
      <div className="min-h-dvh" aria-busy="true">
        <output className="sr-only">Redirecting to the sign-in page</output>
        <Navigate
          to="/login"
          replace
          state={{ from: `${location.pathname}${location.search}` }}
        />
      </div>
    )
  }
  return children
}
