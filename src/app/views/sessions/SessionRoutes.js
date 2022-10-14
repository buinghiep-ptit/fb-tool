import Loadable from 'app/components/Loadable'
import { lazy } from 'react'

const NotFound = Loadable(lazy(() => import('./NotFound')))
const ForgotPassword = Loadable(lazy(() => import('./ForgotPassword')))
const JwtLogin = Loadable(lazy(() => import('./JwtLogin')))
const JwtRegister = Loadable(lazy(() => import('./JwtRegister')))
const ChangePassword = Loadable(lazy(() => import('./ChangePassword')))

const sessionRoutes = [
  { path: '/session/signup', element: <JwtRegister /> },
  { path: '/session/signin', element: <JwtLogin /> },
  { path: '/session/forgot-password', element: <ForgotPassword /> },
  {
    path: '/session/change-password',
    element: <ChangePassword title={'Thay đổi mật khẩu'} />,
  },
  { path: '/session/404', element: <NotFound /> },
]

export default sessionRoutes
