import { BackendlessError, NetworkError, request } from '@/lib/backendless'

export interface AuthUser {
  objectId: string
  email: string
  name: string
}

interface UserRecord {
  objectId: string
  email: string
  name?: string | null
  'user-token'?: string
}

function toUser(record: UserRecord): AuthUser {
  return {
    objectId: record.objectId,
    email: record.email,
    name: (record.name ?? '').trim() || record.email.split('@')[0],
  }
}

/** POST /users/login -> user record with a `user-token` for later requests. */
export async function login(
  email: string,
  password: string,
  signal?: AbortSignal,
): Promise<{ user: AuthUser; token: string }> {
  const record = await request<UserRecord>('/users/login', {
    method: 'POST',
    body: { login: email, password },
    withAuth: false,
    signal,
  })
  const token = record['user-token']
  if (!token) {
    throw new BackendlessError('The login response did not include a session token.', 0, 200)
  }
  return { user: toUser(record), token }
}

/** GET /users/isvalidusertoken/<token> -> true while the session is still active. */
export function validateToken(token: string, signal?: AbortSignal): Promise<boolean> {
  return request<boolean>(`/users/isvalidusertoken/${encodeURIComponent(token)}`, {
    withAuth: false,
    signal,
  })
}

/** GET /users/logout with the token; the server-side session is closed. */
export function logout(): Promise<void> {
  return request<void>('/users/logout')
}

const LOGIN_ERRORS: Record<number, string> = {
  3003: 'Incorrect email or password.',
  3036: 'Too many failed attempts. Please wait a few minutes and try again.',
  3087: 'This account is disabled.',
}

/** Human-readable message for a failed login. */
export function messageForLoginError(error: unknown): string {
  if (error instanceof NetworkError) {
    return "We couldn't reach the server. Check your connection and try again."
  }
  if (error instanceof BackendlessError) {
    return LOGIN_ERRORS[error.code] ?? `Sign-in failed (${error.message}).`
  }
  return 'Sign-in failed. Please try again.'
}
