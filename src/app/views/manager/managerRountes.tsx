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
const EditCustomer = Loadable(lazy(() => import('./customer/EditCustomer')))
const AccountManager = Loadable(lazy(() => import('./accounts/AccountManager')))
const OrderManager = Loadable(lazy(() => import('./orders/OrderManager')))
const SortManager = Loadable(lazy(() => import('./shop/Sort')))
const DetailCategory = Loadable(lazy(() => import('./shop/DetailCategory')))
const Product = Loadable(lazy(() => import('./shop/Product')))
const managerRoutes = [
  {
    path: '/customers',
    element: <CustomerManager />,
  },
  {
    path: '/customers/:idCustomer',
    element: <EditCustomer />,
  },
  { path: '/players', element: <PlayerManager /> },
  { path: '/news', element: <NewsManager /> },
  { path: '/accounts', element: <AccountManager /> },
  { path: '/teams', element: <TeamManager /> },
  { path: '/schedules', element: <ScheduleManager /> },
  { path: '/videos', element: <VideoManager /> },
  { path: '/shop/sort', element: <SortManager /> },
  { path: '/shop/category/:id', element: <DetailCategory /> },
  { path: '/shop/product/:id', element: <Product /> },
  // { path: '/shop/ca/:id', element: <Product /> },
  {
    path: '/shop',
    element: <ShopManager />,
  },
  { path: '/orders', element: <OrderManager /> },
]
export default managerRoutes
