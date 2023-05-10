import Loadable from 'app/components/Loadable'
import { lazy } from 'react'

const CustomerManager = Loadable(lazy(() => import('./customer/Customers')))
const NewsManager = Loadable(lazy(() => import('./news/News')))
const NewsDetail = Loadable(lazy(() => import('./news/NewsDetail')))
const NewsCreate = Loadable(lazy(() => import('./news/NewsCreate')))
const PlayerManager = Loadable(lazy(() => import('./player/PlayerManager')))
const BannerManager = Loadable(lazy(() => import('./banner/BannerManager')))
const AddBanner = Loadable(lazy(() => import('./banner/AddBanner')))
const DetailBanner = Loadable(lazy(() => import('./banner/DetailBanner')))
const ShopManager = Loadable(lazy(() => import('./shop/ShopManager')))
const TeamManager = Loadable(lazy(() => import('./team/TeamManager')))
const VideoManager = Loadable(lazy(() => import('./video/VideoManager')))
const VideoDetail = Loadable(lazy(() => import('./video/VideoDetail')))
const VideoCreate = Loadable(lazy(() => import('./video/VideoCreate')))
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
const CoachManager = Loadable(lazy(() => import('./coach/CoachManager')))
const MemberManager = Loadable(lazy(() => import('./members/MemberManager')))
const MemberDetail = Loadable(lazy(() => import('./members/MemberDetail')))
const MemberSetting = Loadable(lazy(() => import('./members/MemberSetting')))
const LogoManager = Loadable(lazy(() => import('./logos/LogoManager')))

const managerRoutes = [
  {
    path: '/customers',
    element: <CustomerManager />,
  },
  {
    path: '/customers/:idCustomer',
    element: <EditCustomer />,
  },
  { path: '/coachs', element: <CoachManager /> },
  { path: '/leagues', element: <LeaguesManager /> },
  { path: '/players', element: <PlayerManager /> },
  { path: '/news', element: <NewsManager /> },
  { path: '/news/:id', element: <NewsDetail /> },
  { path: '/news/create', element: <NewsCreate /> },
  { path: '/accounts', element: <AccountManager /> },
  { path: '/teams', element: <TeamManager /> },
  { path: '/cahntv', element: <VideoManager /> },
  { path: '/cahntv/:id', element: <VideoDetail /> },
  { path: '/cahntv/create', element: <VideoCreate /> },
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
    path: '/orders/:orderID',
    element: <OrderDetail />,
  },
  { path: '/banner', element: <BannerManager /> },
  {
    path: '/banner/:bannerID',
    element: <DetailBanner />,
  },
  {
    path: '/banner/them-moi-banner',
    element: <AddBanner />,
  },

  { path: '/matches', element: <MatchManager /> },
  { path: '/matches/:id', element: <MatchDetail /> },
  { path: '/members', element: <MemberManager /> },
  { path: '/members/:id', element: <MemberDetail /> },
  { path: '/members/setting', element: <MemberSetting /> },
  { path: '/logos', element: <LogoManager /> },
]
export default managerRoutes
