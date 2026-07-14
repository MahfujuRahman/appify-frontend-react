import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import {
  clearSession,
  readStoredSession,
  storeSession,
  SESSION_CLEARED_EVENT,
  SESSION_UPDATED_EVENT,
  normalizeUser,
} from '../auth/session'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = readStoredSession()
    setUser(normalizeUser(session.user))
    setToken(session.token)
    setRefreshToken(session.refreshToken)
    setReady(true)

    const syncSession = () => {
      const nextSession = readStoredSession()
      setUser(normalizeUser(nextSession.user))
      setToken(nextSession.token)
      setRefreshToken(nextSession.refreshToken)
    }

    window.addEventListener(SESSION_UPDATED_EVENT, syncSession)
    window.addEventListener(SESSION_CLEARED_EVENT, syncSession)
    window.addEventListener('storage', syncSession)

    return () => {
      window.removeEventListener(SESSION_UPDATED_EVENT, syncSession)
      window.removeEventListener(SESSION_CLEARED_EVENT, syncSession)
      window.removeEventListener('storage', syncSession)
    }
  }, [])

  const setSession = (nextUser, nextToken, nextRefreshToken) => {
    const normalizedUser = normalizeUser(nextUser)
    setUser(normalizedUser)
    setToken(nextToken)
    setRefreshToken(nextRefreshToken)
    storeSession({
      user: normalizedUser,
      token: nextToken,
      refreshToken: nextRefreshToken,
    })
  }

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload)
    setSession(response.data.user, response.data.token, response.data.refresh_token)
    return response.data
  }

  const login = async (payload) => {
    const response = await api.post('/auth/login', payload)
    setSession(response.data.user, response.data.token, response.data.refresh_token)
    return response.data
  }

  const logout = async () => {
    const currentRefreshToken = readStoredSession().refreshToken
    const logoutPayload = currentRefreshToken ? { refresh_token: currentRefreshToken } : undefined

    if (token) {
      await api.post('/auth/logout', logoutPayload, { skipAuthRefresh: true }).catch(() => {
        //
      })
    }

    clearSession()
    setUser(null)
    setToken(null)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      refreshToken,
      ready,
      isAuthenticated: Boolean(user && token),
      register,
      login,
      logout,
    }),
    [user, token, refreshToken, ready],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

export function RequireAuth({ children, navigate }) {
  const { isAuthenticated, ready } = useAuth()

  useEffect(() => {
    if (ready && !isAuthenticated) {
      navigate('/login', true)
    }
  }, [isAuthenticated, navigate, ready])

  if (!ready) {
    return null
  }

  return isAuthenticated ? children : null
}

export function GuestOnly({ children, navigate }) {
  const { isAuthenticated, ready } = useAuth()

  useEffect(() => {
    if (ready && isAuthenticated) {
      navigate('/feed', true)
    }
  }, [isAuthenticated, navigate, ready])

  if (!ready) {
    return null
  }

  return isAuthenticated ? null : children
}
