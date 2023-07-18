import Loadable from 'app/components/Loadable'
import { lazy } from 'react'
import { ROLES } from '../../utils/enums/roles'

const CustomerManager = Loadable(lazy(() => import('./customer/Customers')))
const NewsManager = Loadable(lazy(() => import('./news/News')))
const NewsDetail = Loadable(lazy(() => import('./news/NewsDetail')))
const NewsCreate = Loadable(lazy(() => import('./news/NewsCreate')))
const PlayerManager = Loadable(lazy(() => import('./player/PlayerManager')))
const BannerManager = Loadable(lazy(() => import('./banner/BannerManager')))
const AddBanner = Loadable(lazy(() => import('./banner/AddBanner')))
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
const EditBanner = Loadable(lazy(() => import('./banner/EditBanner')))
const UserManager = Loadable(lazy(() => import('./users/UserManager')))
const CoachDetail = Loadable(lazy(() => import('./coach/CoachDetail')))
const AddCoach = Loadable(lazy(() => import('./coach/AddCoach')))
const PositionManager = Loadable(lazy(() => import('./coach/PositionManager')))

const managerRoutes = [
  {
    path: '/customers',
    element: <CustomerManager />,
    auth: [ROLES.ADMIN, ROLES.OPERATOR, ROLES.MEMBERSHIP_MANAGER],
  },
  {
    path: '/customers/:idCustomer',
    element: <EditCustomer />,
    auth: [ROLES.ADMIN, ROLES.OPERATOR, ROLES.MEMBERSHIP_MANAGER],
  },
  {
    path: '/coachs',
    element: <CoachManager />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/coachs/create',
    element: <AddCoach />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/position',
    element: <PositionManager />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/coachs/:id',
    element: <CoachDetail />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/leagues',
    element: <LeaguesManager />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/players',
    element: <PlayerManager />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/news',
    element: <NewsManager />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/news/:id',
    element: <NewsDetail />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/news/create',
    element: <NewsCreate />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  { path: '/accounts', element: <AccountManager /> },
  {
    path: '/teams',
    element: <TeamManager />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/cahntv',
    element: <VideoManager />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/cahntv/:id',
    element: <VideoDetail />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/cahntv/create',
    element: <VideoCreate />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/shop/sort',
    element: <SortManager />,
    auth: [ROLES.ADMIN, ROLES.OPERATOR],
  },
  {
    path: '/shop/category/:id',
    element: <DetailCategory />,
    auth: [ROLES.ADMIN, ROLES.OPERATOR],
  },
  {
    path: '/shop/product/:id',
    element: <Product />,
    auth: [ROLES.ADMIN, ROLES.OPERATOR],
  },
  {
    path: '/players/:id',
    element: <PlayerDetail />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/players/create',
    element: <CreatePlayer />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/leagues/create',
    element: <CreateLeagues />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/leagues/:id',
    element: <EditLeagues />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/shop',
    element: <ShopManager />,
  },
  {
    path: '/orders',
    element: <OrderManager />,
    auth: [ROLES.ADMIN, ROLES.OPERATOR],
  },

  {
    path: '/orders/:orderID',
    element: <OrderDetail />,
    auth: [ROLES.ADMIN, ROLES.OPERATOR],
  },
  {
    path: '/banner',
    element: <BannerManager />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/banner/:id',
    element: <EditBanner />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/banner/them-moi-banner',
    element: <AddBanner />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },

  {
    path: '/matches',
    element: <MatchManager />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/matches/:id',
    element: <MatchDetail />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    path: '/members',
    element: <MemberManager />,
    auth: [ROLES.ADMIN, ROLES.MEMBERSHIP_MANAGER],
  },
  {
    path: '/members/:id',
    element: <MemberDetail />,
    auth: [ROLES.ADMIN, ROLES.MEMBERSHIP_MANAGER],
  },
  {
    path: '/members/setting',
    element: <MemberSetting />,
    auth: [ROLES.ADMIN, ROLES.MEMBERSHIP_MANAGER],
  },
  {
    path: '/logos',
    element: <LogoManager />,
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  { path: '/users', element: <UserManager />, auth: [ROLES.ADMIN] },
]
export default managerRoutes
