import Loadable from 'app/components/Loadable'
import { ROLES } from 'app/utils/enums/roles'
import { lazy } from 'react'
import { Outlet } from 'react-router-dom'

const LeagueManager = Loadable(lazy(() => import('./leagues/LeagueManager')))
const MediaManager = Loadable(lazy(() => import('./medias/MediasManager')))

const gameRoutes = [
  {
    path: '/quan-ly-giai-dau',
    element: (
      <>
        <LeagueManager />
        <Outlet />
      </>
    ),
    auth: [ROLES.ADMIN],
  },

  { path: '/quan-ly-su-homepages', element: <MediaManager /> },
]
export default gameRoutes
