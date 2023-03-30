import Loadable from 'app/components/Loadable'
import { ROLES } from 'app/utils/enums/roles'
import { lazy } from 'react'

const CustomerManager = Loadable(lazy(() => import('./customer/Customers')))
const NewsManager = Loadable(lazy(() => import('./news/News')))
const PlayerManager = Loadable(lazy(() => import('./player/PlayerManager')))
const ScheduleManager = Loadable(
  lazy(() => import('./schedule/ScheduleManager')),
)
const ShopManager = Loadable(lazy(() => import('./shop/ShopManager')))
const TeamManager = Loadable(lazy(() => import('./team/TeamManager')))
const VideoManager = Loadable(lazy(() => import('./video/VideoManager')))

const managerRoutes = [
  {
    path: '/customers',
    element: <CustomerManager />,
  },
  { path: '/players', element: <PlayerManager /> },
  { path: '/news', element: <NewsManager /> },

  { path: '/teams', element: <TeamManager /> },
  { path: '/schedules', element: <ScheduleManager /> },
  { path: '/videos', element: <VideoManager /> },
  { path: '/shop', element: <ShopManager /> },
]
export default managerRoutes
