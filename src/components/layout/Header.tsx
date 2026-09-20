import { LogOut, Menu, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { Button, buttonVariants } from '@/components/ui/button'
import { navRoutes } from '@/data/routes'
import { useAuth } from '@/features/auth/auth'
import { clearBlogDraft } from '@/features/blog/useBlogDraft'
import { cn } from '@/lib/utils'

const MOBILE_NAV_ID = 'mobile-nav'
const DESKTOP_QUERY = '(min-width: 1024px)'

function navLinkClass(isActive: boolean, variant: 'desktop' | 'mobile') {
  return cn(
    'flex items-center rounded-md font-medium transition-colors hover:bg-muted hover:text-foreground',
    variant === 'desktop' ? 'h-11 px-3 text-sm' : 'h-12 px-4 text-base',
    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground',
  )
}

/** Sign-in / sign-out controls; a fixed-width placeholder while a stored session is checked. */
function AuthSlot({ variant }: { variant: 'desktop' | 'mobile' }) {
  const { status, user, logout } = useAuth()

  if (status === 'restoring') {
    return (
      <span
        aria-hidden="true"
        className={cn('block rounded-lg bg-muted', variant === 'desktop' ? 'h-11 w-24' : 'h-12 w-full')}
      />
    )
  }

  if (status === 'authenticated' && user) {
    return (
      <div className={cn('flex items-center gap-2', variant === 'mobile' && 'justify-between px-4 py-2')}>
        <span className="truncate text-sm text-muted-foreground">Hi, {user.name}</span>
        <Button
          type="button"
          variant="outline"
          className="h-11 px-4"
          onClick={() => {
            // Signing out on a shared computer must not leave a draft for the next person.
            clearBlogDraft()
            void logout()
          }}
        >
          <LogOut aria-hidden="true" className="size-4" />
          Log out
        </Button>
      </div>
    )
  }

  return variant === 'desktop' ? (
    <Link to="/login" className={cn(buttonVariants({ variant: 'outline' }), 'h-11 px-4')}>
      Log in
    </Link>
  ) : (
    <NavLink to="/login" className={({ isActive }) => navLinkClass(isActive, 'mobile')}>
      Log in
    </NavLink>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  const close = useCallback(() => setOpen(false), [])

  // Close the panel whenever the route changes, including Back/Forward. Adjusting state
  // during render is the documented React pattern for this, and avoids an extra pass.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }

  // While open: Escape closes and returns focus, and widening to desktop closes it.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const desktop = window.matchMedia(DESKTOP_QUERY)
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onChange)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onChange)
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" aria-label="Suitmedia home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navRoutes.map((route) => (
              <li key={route.path}>
                <NavLink
                  to={route.path}
                  end={route.path === '/'}
                  className={({ isActive }) => navLinkClass(isActive, 'desktop')}
                >
                  {route.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden sm:block">
            <AuthSlot variant="desktop" />
          </div>
          <ThemeToggle />
          <Button
            ref={toggleRef}
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls={MOBILE_NAV_ID}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Disclosure panel: overlays the page instead of pushing it down. */}
      <nav
        id={MOBILE_NAV_ID}
        aria-label="Mobile navigation"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b bg-background shadow-lg lg:hidden"
      >
        <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 md:px-6">
          {navRoutes.map((route) => (
            <li key={route.path}>
              <NavLink
                to={route.path}
                end={route.path === '/'}
                onClick={close}
                className={({ isActive }) => navLinkClass(isActive, 'mobile')}
              >
                {route.label}
              </NavLink>
            </li>
          ))}
          <li className="sm:hidden">
            <AuthSlot variant="mobile" />
          </li>
        </ul>
      </nav>
    </header>
  )
}
