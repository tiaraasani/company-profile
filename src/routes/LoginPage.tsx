import { Check } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { findRoute } from '@/data/routes'
import { useAuth } from '@/features/auth/auth'
import { LoginForm } from '@/features/auth/LoginForm'
import { useSeo } from '@/hooks/useSeo'

const meta = findRoute('/login')!

const perks = [
  'Markdown editor with a live preview',
  'Drafts kept in this browser until you publish',
  'Published posts appear on Insights right away',
]

/**
 * Split sign-in screen: a brand panel and the form side by side, filling the viewport
 * below the header so the footer only follows on scroll. The panels stack on small screens.
 */
export default function LoginPage() {
  useSeo(meta.title, meta.description, meta.path)
  const { status } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/blog'

  if (status === 'authenticated') {
    return <Navigate to={from} replace />
  }

  return (
    <div className="grid lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-2">
      <section
        aria-labelledby="page-title"
        className="flex items-center bg-primary text-primary-foreground"
      >
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-12 md:px-6 lg:px-12 lg:py-20">
          <p className="text-sm font-semibold tracking-wide uppercase">Account</p>
          <h1
            id="page-title"
            className="text-4xl font-bold tracking-tight text-balance md:text-5xl"
          >
            Write for the Suitmedia blog
          </h1>
          <p className="text-lg">
            Sign in to publish articles on Insights and keep your drafts safe while you write.
          </p>
          <ul className="flex flex-col gap-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
                  <Check aria-hidden="true" className="size-3.5" />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="login-heading" className="flex items-center">
        <div className="mx-auto w-full max-w-md px-4 py-12 md:px-6 lg:py-20">
          <h2 id="login-heading" className="text-2xl font-semibold tracking-tight">
            Log in
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            There is no public sign-up: accounts are issued by the site owner.
          </p>
          <div className="mt-8">
            <LoginForm onSuccess={() => navigate(from, { replace: true })} />
          </div>
        </div>
      </section>
    </div>
  )
}
