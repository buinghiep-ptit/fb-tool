import Loadable from 'app/components/Loadable'
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
const Product = Loadable(lazy(() => import('./shop/Product')))
const PlayerDetail = Loadable(lazy(() => import('./player/PlayerDetail')))
const CreatePlayer = Loadable(lazy(() => import('./player/CreatePlayer')))
const LeaguesManager = Loadable(lazy(() => import('./leagues/Leagues')))
const MatchManager = Loadable(lazy(() => import('./matches/MatchManager')))
const MatchDetail = Loadable(lazy(() => import('./matches/MatchDetail')))
const CreateLeagues = Loadable(lazy(() => import('./leagues/CreateLeagues')))
const EditLeagues = Loadable(lazy(() => import('./leagues/EditLeagues')))

const managerRoutes = [
  {
    path: '/customers',
    element: <CustomerManager />,
  },
  {
    path: '/customers/:idCustomer',
    element: <EditCustomer />,
  },
  { path: '/leagues', element: <LeaguesManager /> },
  { path: '/players', element: <PlayerManager /> },
  { path: '/news', element: <NewsManager /> },
  { path: '/accounts', element: <AccountManager /> },
  { path: '/teams', element: <TeamManager /> },
  { path: '/schedules', element: <ScheduleManager /> },
  { path: '/videos', element: <VideoManager /> },
  { path: '/shop/sort', element: <SortManager /> },
  { path: '/shop/category/:id', element: <DetailCategory /> },
  { path: '/shop/product/:id', element: <Product /> },
  { path: '/players/:id', element: <PlayerDetail /> },
  { path: '/players/create', element: <CreatePlayer /> },
  { path: '/leagues/create', element: <CreateLeagues /> },
  { path: '/leagues/:id', element: <EditLeagues /> },
  {
    path: '/shop',
    element: <ShopManager />,
  },
  { path: '/orders', element: <OrderManager /> },
  {
    path: '/orders/chi-tiet-don-hang/:orderID',
    element: <OrderDetail />,
  },
  {
    path: '/orders/chi-tiet-don-hang',
    element: <OrderDetail />,
  },
  {
    path: '/orders/:orderID',
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
  { path: '/matches', element: <MatchManager /> },
  { path: '/matches/:id', element: <MatchDetail /> },
]
export default managerRoutes
