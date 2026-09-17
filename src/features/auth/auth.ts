import { createContext, useContext } from 'react'
import type { AuthUser } from './authApi'

/**
 * - anonymous: no session, or the stored one turned out to be invalid
 * - restoring: a stored session is being validated with the server (first load)
 * - authenticated: session confirmed
 */
export type AuthStatus = 'anonymous' | 'restoring' | 'authenticated'

export interface AuthContextValue {
  status: AuthStatus
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return context
}
