import {
  Building2,
  Code,
  Compass,
  Cpu,
  HeartPulse,
  Landmark,
  Megaphone,
  Package,
  Palette,
  ShoppingBag,
  Sparkles,
  Target,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

/**
 * Icons referenced by name from the content files in src/data so that the data stays
 * plain and serializable.
 */
export const icons = {
  building: Building2,
  code: Code,
  compass: Compass,
  cpu: Cpu,
  'heart-pulse': HeartPulse,
  landmark: Landmark,
  megaphone: Megaphone,
  package: Package,
  palette: Palette,
  'shopping-bag': ShoppingBag,
  sparkles: Sparkles,
  target: Target,
  users: Users,
  workflow: Workflow,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof icons
