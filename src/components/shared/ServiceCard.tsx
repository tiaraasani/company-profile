import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Service } from '@/data/services'
import { icons } from '@/lib/icons'

export function ServiceCard({ service }: { service: Service }) {
  const Icon = icons[service.icon]

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <CardTitle>
          <h3 className="text-xl font-semibold">{service.title}</h3>
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">{service.tagline}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          {service.features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        <Link
          to={`/services#${service.slug}`}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Explore {service.title.toLowerCase()} services
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </CardFooter>
    </Card>
  )
}
