import { Link } from 'react-router'
import { Logo } from './Logo'
import { SocialIcon } from '@/components/shared/BrandIcons'
import { company } from '@/data/company'
import { navRoutes } from '@/data/routes'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[2fr_1fr_1fr] md:px-6">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            {company.shortDescription}
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Social profiles">
            {company.socials.map((link) => {
              const external = link.href.startsWith('http')
              return (
                <li key={link.platform}>
                  <a
                    href={link.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    aria-label={
                      external ? `${link.label} (opens in a new tab)` : link.label
                    }
                    className="inline-flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-sm font-semibold">Pages</h2>
          <ul className="mt-3 flex flex-col">
            {navRoutes.map((route) => (
              <li key={route.path}>
                <Link
                  to={route.path}
                  className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">Contact</h2>
          <address className="mt-3 flex flex-col text-sm not-italic text-muted-foreground">
            <a
              href={`mailto:${company.email}`}
              className="inline-flex min-h-11 items-center underline-offset-4 hover:text-foreground hover:underline"
            >
              {company.email}
            </a>
            <span className="inline-flex min-h-11 items-center">{company.phone}</span>
            <span className="inline-flex min-h-11 items-center">{company.location}</span>
          </address>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground md:px-6">
          <p>{company.disclaimer}</p>
          <p>
            &copy; {year} {company.legalName}. Redesign concept.
          </p>
        </div>
      </div>
    </footer>
  )
}
