import useAuth from 'app/hooks/useAuth'
import { navigations } from 'app/navigations'
import { getNavigationByUser } from 'app/redux/actions/NavigationAction'
import { flat } from 'app/utils/utils'
import { isValidToken } from 'app/utils/validToken'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

import AllPages from '../routes'

export const userHasPermission = (pathname: string, user: any, routes: any) => {
  if (!user || !user.authorities.length) {
    return false
  }
  const matched = routes.find((r: any) => {
    return pathname.includes(r.path)
  })
  const authenticated =
    matched && matched.auth && matched.auth.length
      ? matched.auth.includes(user.authorities[0])
      : true
  return authenticated
}

type Props = {
  children: ReactElement
}

const EXPIRES_DURATIONS = 60 * 50 * 1000 // ms

const AuthGuard = ({ children }: Props) => {
  const { isAuthenticated, logout, user } = useAuth()
  const [isAuth, setIsAuth] = useState(isAuthenticated)

  const ref = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (isValidToken(accessToken)) {
        setIsAuth(true)
      } else {
        setIsAuth(false)
        logout()
      }
    }, EXPIRES_DURATIONS)
    ref.current = interval as any

    return () => clearInterval(interval)
  }, [])

  const { pathname } = useLocation()

  const dispatch = useDispatch()

  const routes = flat(AllPages)

  const hasPermission = userHasPermission(pathname, user, routes)
  const authenticated =
    isAuthenticated && hasPermission && user && (user as any).status !== -1

  useEffect(() => {
    if (!isAuthenticated) return
    dispatch(getNavigationByUser(user, navigations))
  }, [authenticated])

  const accessToken = window.localStorage.getItem('accessToken') as string

  // const initAuth = isAuthenticated

  useEffect(() => {
    if (isValidToken(accessToken)) {
      setIsAuth(true)
    } else {
      setIsAuth(false)
      logout()
    }
  }, [pathname])

  console.log('hasPermission:', hasPermission)

  if (!hasPermission && isAuthenticated) {
    return <Navigate replace to="/" />
  }
  return (
    <>
      {authenticated ? (
        children
      ) : (
        <Navigate replace to="/session/signin" state={{ from: pathname }} />
      )}
    </>
  )
}

export default AuthGuard
