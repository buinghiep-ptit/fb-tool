import useAuth from 'app/hooks/useAuth'
import { isValidToken } from 'app/utils/validToken'
import { ReactElement, useEffect, useRef, useState } from 'react'
// import { flat } from 'app/utils/utils';
import { Navigate, useLocation } from 'react-router-dom'
// import AllPages from '../routes';

// const userHasPermission = (pathname, user, routes) => {
//   if (!user) {
//     return false;
//   }
//   const matched = routes.find((r) => r.path === pathname);

//   const authenticated =
//     matched && matched.auth && matched.auth.length ? matched.auth.includes(user.role) : true;
//   return authenticated;
// };

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
      console.log('vao day')
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
  //   const routes = flat(AllPages);

  //   const hasPermission = userHasPermission(pathname, user, routes);
  //   let authenticated = isAuthenticated && hasPermission;

  // // IF YOU NEED ROLE BASED AUTHENTICATION,
  // // UNCOMMENT ABOVE LINES
  // // AND COMMENT OUT BELOW authenticated VARIABLE
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

  return (
    <>
      {isAuth && user ? (
        children
      ) : (
        <Navigate replace to="/session/signin" state={{ from: pathname }} />
      )}
    </>
  )
}

export default AuthGuard
