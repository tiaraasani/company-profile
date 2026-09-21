import { Link } from 'react-router'
import { Logo } from './Logo'
import { SocialIcon } from '@/components/shared/BrandIcons'
import { company } from '@/data/company'
import { footerRoutes } from '@/data/routes'

/** Two link columns like the original footer: pages, then social profiles. */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[2fr_1fr_1fr] md:px-6">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">{company.footerDescription}</p>
          <address className="text-sm not-italic text-muted-foreground">
            <span className="block">{company.offices[0].address}</span>
            <a
              href={`mailto:${company.email}`}
              className="inline-flex min-h-11 items-center underline-offset-4 hover:text-foreground hover:underline"
            >
              {company.email}
            </a>
          </address>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-sm font-semibold">Capabilities &amp; Culture</h2>
          <ul className="mt-3 flex flex-col">
            {footerRoutes.map((route) => (
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
          <h2 className="text-sm font-semibold">Engage with Us</h2>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Social profiles">
            {company.socials.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label} (opens in a new tab)`}
                  className="inline-flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <SocialIcon platform={link.platform} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground md:px-6">
          <p>
            &copy; {company.name} {company.foundedYear}-{year}. All rights reserved. Redesign
            concept.
          </p>
          <p>{company.disclaimer}</p>
        </div>
      </div>
    </footer>
  )
}
