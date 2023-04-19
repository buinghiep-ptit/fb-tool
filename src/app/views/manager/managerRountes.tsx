import Loadable from 'app/components/Loadable'
import { ROLES } from 'app/utils/enums/roles'
import { lazy } from 'react'

const CustomerManager = Loadable(lazy(() => import('./customer/Customers')))
const NewsManager = Loadable(lazy(() => import('./news/News')))
const PlayerManager = Loadable(lazy(() => import('./player/PlayerManager')))
const BannerManager = Loadable(lazy(() => import('./banner/BannerManager')))
const AddBanner = Loadable(lazy(() => import('./banner/AddBanner')))
const ScheduleManager = Loadable(
  lazy(() => import('./schedule/ScheduleManager')),
)
const ShopManager = Loadable(lazy(() => import('./shop/ShopManager')))
const TeamManager = Loadable(lazy(() => import('./team/TeamManager')))
const VideoManager = Loadable(lazy(() => import('./video/VideoManager')))
const EditCustomer = Loadable(lazy(() => import('./customer/EditCustomer')))
const AccountManager = Loadable(lazy(() => import('./accounts/AccountManager')))
const OrderManager = Loadable(lazy(() => import('./orders/OrderManager')))
const OrderDetail = Loadable(lazy(() => import('./orders/OrderDetail')))
const SortManager = Loadable(lazy(() => import('./shop/Sort')))
const DetailCategory = Loadable(lazy(() => import('./shop/DetailCategory')))

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
  {
    path: '/shop',
    element: <ShopManager />,
  },
  { path: '/orders', element: <OrderManager /> },
  {
    path: '/orders/chi-tiet-don-hang',
    element: <OrderDetail />,
  },
  {
    path: '/orders/:orderID/*',
    element: <OrderDetail />,
  },
  { path: '/banner', element: <BannerManager /> },
  {
    path: '/banner/chi-tiet-banner',
    element: <AddBanner />,
  },
  {
    path: '/banner/:bannerID/*',
    element: <AddBanner />,
  },
]
export default managerRoutes
