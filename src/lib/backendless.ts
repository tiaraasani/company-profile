/**
 * Minimal typed client for the Backendless REST API (no SDK).
 * Base URL comes from VITE_BACKENDLESS_API_URL, e.g. https://<subdomain>.backendless.app/api
 * The session token is attached by AuthProvider through registerAuthHooks().
 */
const RAW_BASE = import.meta.env.VITE_BACKENDLESS_API_URL?.trim() ?? ''

export const BACKENDLESS_API_URL = RAW_BASE.replace(/\/+$/, '')
export const isBackendlessConfigured = BACKENDLESS_API_URL.length > 0

/** Backendless error code for an expired or unknown user token. */
export const INVALID_TOKEN_CODE = 3064

export class BackendlessError extends Error {
  readonly code: number
  readonly status: number

  constructor(message: string, code: number, status: number) {
    super(message)
    this.name = 'BackendlessError'
    this.code = code
    this.status = status
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message)
    this.name = 'NetworkError'
  }
}

interface AuthHooks {
  getToken: () => string | null
  onInvalidToken: () => void
}

let authHooks: AuthHooks = { getToken: () => null, onInvalidToken: () => {} }

/** Registered once by the auth feature so every request can carry the user token. */
export function registerAuthHooks(hooks: AuthHooks) {
  authHooks = hooks
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  signal?: AbortSignal
  /** Attach the user token when one exists (default true). */
  withAuth?: boolean
}

export async function request<T>(
  path: string,
  { method = 'GET', body, signal, withAuth = true }: RequestOptions = {},
): Promise<T> {
  if (!isBackendlessConfigured) {
    throw new BackendlessError('Backendless is not configured', 0, 0)
  }

  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = withAuth ? authHooks.getToken() : null
  if (token) headers['user-token'] = token

  let response: Response
  try {
    response = await fetch(`${BACKENDLESS_API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new NetworkError()
  }

  const text = await response.text()

  if (!response.ok) {
    let code = 0
    let message = `Request failed with status ${response.status}`
    try {
      const data = JSON.parse(text) as { code?: number; message?: string }
      code = data.code ?? 0
      message = data.message ?? message
    } catch {
      // Non-JSON error body; keep the generic message.
    }
    if (code === INVALID_TOKEN_CODE) authHooks.onInvalidToken()
    throw new BackendlessError(message, code, response.status)
  }

  return (text ? JSON.parse(text) : undefined) as T
}

/** Query string with encodeURIComponent (Backendless documents %20 for spaces in where clauses). */
export function query(params: Record<string, string | number | undefined>): string {
  const parts = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
  return parts.length > 0 ? `?${parts.join('&')}` : ''
}

/**
 * Quotes a value for a where clause. Backendless follows SQL-92 here: a single quote is
 * escaped by doubling it and a backslash has no special meaning (a `\'` sequence is
 * rejected as an invalid clause). Callers still validate the value against an allowlist
 * first; this is the second line of defence.
 */
export function quote(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}
