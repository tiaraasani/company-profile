import { MapPin } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TeamMember } from './teamApi'

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Card className="h-full">
      <CardHeader className="items-center text-center">
        {/* randomuser portraits are 128px; shown at 96px so they stay sharp on 1x and 2x screens. */}
        <Avatar className="mb-3 size-24 justify-self-center ring-4 ring-background">
          <AvatarImage
            src={member.photo}
            alt=""
            width={128}
            height={128}
            loading="lazy"
            decoding="async"
            className="object-cover"
          />
          <AvatarFallback className="text-lg font-semibold">{initials(member.name)}</AvatarFallback>
        </Avatar>
        <CardTitle>
          <h3 className="text-lg font-semibold">{member.name}</h3>
        </CardTitle>
        <p className="text-sm font-medium text-primary">{member.role}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-center">
        <p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
        <p className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <MapPin aria-hidden="true" className="size-3.5" />
          {member.location}
        </p>
      </CardContent>
    </Card>
  )
}
