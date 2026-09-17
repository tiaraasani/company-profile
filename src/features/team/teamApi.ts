/**
 * Team listing from https://randomuser.me, as the brief asks. A fixed seed returns the same
 * eight people on every load; roles and bios come from local templates.
 */
export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  photo: string
  location: string
}

interface RandomUser {
  login: { uuid: string }
  name: { first: string; last: string }
  picture: { large: string; medium: string; thumbnail: string }
  location: { city: string; country: string }
}

const ENDPOINT =
  'https://randomuser.me/api/1.4/?results=8&seed=suitmedia-team&nat=us,gb,ca,au,nz,ie&inc=login,name,picture,location&noinfo'

const ROLES = [
  'Chief Executive Officer',
  'Head of Strategy',
  'Head of Design',
  'Lead Engineer',
  'Product Manager',
  'Marketing Lead',
  'Data Analyst',
  'Customer Success Lead',
]

const FOCUS = [
  'keeps every programme anchored to the business outcome it has to move',
  'turns research and market signals into roadmaps clients can act on',
  'shapes brands and interfaces that people remember and enjoy using',
  'builds the web, mobile and commerce platforms behind our launches',
  'runs discovery and delivery so scope, timeline and quality stay honest',
  'plans campaigns and media so the right audience hears the story',
  'measures what changed after launch and turns the numbers into next steps',
  'stays close to clients after launch so the work keeps improving',
]

export const TEAM_CACHE_KEY = 'cp:team:v1'

export async function fetchTeam(signal?: AbortSignal): Promise<TeamMember[]> {
  const response = await fetch(ENDPOINT, { signal })
  if (!response.ok) {
    throw new Error(`randomuser.me responded with ${response.status}`)
  }
  const payload = (await response.json()) as { results: RandomUser[] }

  return payload.results.map((user, index) => {
    const first = user.name.first
    const role = ROLES[index % ROLES.length]
    return {
      id: user.login.uuid,
      name: `${first} ${user.name.last}`,
      role,
      bio: `${first} ${FOCUS[index % FOCUS.length]}. Based in ${user.location.city}.`,
      photo: user.picture.large,
      location: `${user.location.city}, ${user.location.country}`,
    }
  })
}
