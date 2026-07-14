import React from 'react'
import Feed from './pages/Feed'
import Login from './pages/Login'
import Register from './pages/Register'
import { GuestOnly, RequireAuth, useAuth } from './context/AuthContext'

function navigateTo(path, replace = false) {
  if (replace) {
    window.history.replaceState({}, '', path)
  } else {
    window.history.pushState({}, '', path)
  }

  window.dispatchEvent(new PopStateEvent('popstate'))
}

function usePathname() {
  const [pathname, setPathname] = React.useState(window.location.pathname || '/')

  React.useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname || '/')
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return pathname
}

export default function App() {
  const pathname = usePathname()
  const { ready } = useAuth()

  if (!ready) {
    return null
  }

  if (pathname === '/feed') {
    return (
      <RequireAuth navigate={navigateTo}>
        <Feed navigate={navigateTo} />
      </RequireAuth>
    )
  }

  if (pathname === '/register') {
    return (
      <GuestOnly navigate={navigateTo}>
        <Register navigate={navigateTo} />
      </GuestOnly>
    )
  }

  return (
    <GuestOnly navigate={navigateTo}>
      <Login navigate={navigateTo} />
    </GuestOnly>
  )
}
