import { Navigate, useLocation, useNavigate } from 'react-router'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { findRoute } from '@/data/routes'
import { useAuth } from '@/features/auth/auth'
import { demoAccount } from '@/features/auth/demoAccount'
import { LoginForm } from '@/features/auth/LoginForm'
import { useSeo } from '@/hooks/useSeo'

const meta = findRoute('/login')!

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
    <>
      <PageHero eyebrow="Account" title="Log in" lead="Sign in to write and manage blog posts." />

      <Section labelledBy="login-heading">
        <h2 id="login-heading" className="sr-only">
          Sign in
        </h2>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,28rem)_1fr] lg:gap-16">
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className="text-xl font-semibold">Welcome back</h3>
              </CardTitle>
              <CardDescription>
                Accounts live in the Backendless <code>Users</code> table for this project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm onSuccess={() => navigate(from, { replace: true })} />
            </CardContent>
          </Card>

          <aside aria-labelledby="reviewer-heading" className="flex flex-col gap-3 text-sm text-muted-foreground">
            <h3 id="reviewer-heading" className="text-base font-semibold text-foreground">
              Reviewing this project?
            </h3>
            <p>
              A demo account exists so the protected <strong>Write a post</strong> page can be
              tried without registering. The button under the form fills it in.
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-lg bg-muted p-4 font-mono text-xs">
              <dt className="text-muted-foreground">email</dt>
              <dd className="text-foreground">{demoAccount.email}</dd>
              <dt className="text-muted-foreground">password</dt>
              <dd className="text-foreground">{demoAccount.password}</dd>
            </dl>
            <p>
              After signing in you are sent back to the page you came from; the session is kept
              in localStorage and validated with Backendless on every reload.
            </p>
          </aside>
        </div>
      </Section>
    </>
  )
}
