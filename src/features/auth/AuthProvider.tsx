import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthStatus } from './auth'
import { login as apiLogin, logout as apiLogout, validateToken } from './authApi'
import { clearSession, getStoredToken, saveSession, useStoredSession } from './authStorage'
import { registerAuthHooks } from '@/lib/backendless'

// Every request carries the stored token; a 3064 (dead token) response signs the user out.
registerAuthHooks({ getToken: getStoredToken, onInvalidToken: clearSession })

interface Validation {
  token: string
  valid: boolean
}

/**
 * Auth state = the stored session (external store, hydration-safe) + one validation
 * result per token. Status is derived, so no state is set synchronously in effects.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useStoredSession()
  const [validation, setValidation] = useState<Validation | null>(null)

  // Validate a session found in storage once per token.
  useEffect(() => {
    if (!session || validation?.token === session.token) return
    const controller = new AbortController()
    const token = session.token
    validateToken(token, controller.signal)
      .then((valid) => {
        if (controller.signal.aborted) return
        if (!valid) clearSession()
        setValidation({ token, valid })
      })
      .catch(() => {
        // Network trouble: keep the session; a later 3064 response will sign out.
        if (!controller.signal.aborted) setValidation({ token, valid: true })
      })
    return () => controller.abort()
  }, [session, validation])

  const status: AuthStatus = !session
    ? 'anonymous'
    : validation?.token !== session.token
      ? 'restoring'
      : validation.valid
        ? 'authenticated'
        : 'anonymous'

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await apiLogin(email, password)
    saveSession({ token, user, savedAt: Date.now() })
    setValidation({ token, valid: true })
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } catch {
      // The local session is cleared regardless.
    }
    clearSession()
    setValidation(null)
  }, [])

  const value = useMemo(
    () => ({
      status,
      user: status === 'authenticated' && session ? session.user : null,
      login,
      logout,
    }),
    [status, session, login, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
