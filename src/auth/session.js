const ACCESS_TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'
const USER_KEY = 'auth_user'

export const SESSION_UPDATED_EVENT = 'auth:session-updated'
export const SESSION_CLEARED_EVENT = 'auth:session-cleared'

function dispatchSessionEvent(type) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(type))
}

export function normalizeUser(user) {
  if (!user) {
    return null
  }

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    full_name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
    email: user.email,
  }
}

export function readStoredSession() {
  if (typeof window === 'undefined') {
    return { token: null, refreshToken: null, user: null }
  }

  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  const rawUser = localStorage.getItem(USER_KEY)

  if (!token || !rawUser) {
    return { token: null, refreshToken: null, user: null }
  }

  try {
    return { token, refreshToken, user: JSON.parse(rawUser) }
  } catch {
    clearSession()
    return { token: null, refreshToken: null, user: null }
  }
}

export function storeSession({ user, token, refreshToken }) {
  if (typeof window === 'undefined') {
    return
  }

  const normalizedUser = normalizeUser(user)
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  if (normalizedUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser))
  } else {
    localStorage.removeItem(USER_KEY)
  }
  dispatchSessionEvent(SESSION_UPDATED_EVENT)
}

export function clearSession() {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  dispatchSessionEvent(SESSION_CLEARED_EVENT)
}

export function getAccessToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem(REFRESH_TOKEN_KEY)
}
