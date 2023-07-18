import { ROLES } from './utils/enums/roles'

export const navigations = [
  {
    name: 'Trang chủ',
    path: '/dashboard',
    icon: 'dashboard',
    auth: [
      ROLES.ADMIN,
      ROLES.CONTENT_MANAGER,
      ROLES.OPERATOR,
      ROLES.MEMBERSHIP_MANAGER,
    ],
  },
  {
    name: 'Quản lý tài khoản vận hành',
    path: '/users',
    icon: 'contacts',
    auth: [ROLES.ADMIN],
  },
  {
    name: 'Quản lý khách hàng',
    path: '/customers',
    icon: 'person',
    auth: [ROLES.ADMIN, ROLES.OPERATOR, ROLES.MEMBERSHIP_MANAGER],
  },
  {
    name: 'Quản lý hội viên',
    path: '/members',
    icon: 'loyalty',
    auth: [ROLES.ADMIN, ROLES.MEMBERSHIP_MANAGER],
  },
  {
    name: 'Quản lý tin tức',
    path: '/news',
    icon: 'newspaper',
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    name: 'Quản lý CAHN TV',
    path: '/cahntv',
    icon: 'movie',
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    name: 'Quản lý banner',
    path: '/banner',
    icon: 'image',
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    name: 'Quản lý đơn hàng',
    path: '/orders',
    icon: 'notes',
    auth: [ROLES.ADMIN, ROLES.OPERATOR],
  },
  {
    name: 'Quản lý cửa hàng',
    path: '/shop',
    icon: 'storefront',
    auth: [ROLES.ADMIN, ROLES.OPERATOR],
  },
  {
    name: 'Quản lý đội bóng',
    path: '/teams',
    icon: 'groups',
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    name: 'Quản lý cầu thủ',
    path: '/players',
    icon: 'accessibility',
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    name: 'Quản lý giải đấu',
    path: '/leagues',
    icon: 'schedule',
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    name: 'Quản lý thông tin trận đấu',
    path: '/matches',
    icon: 'scoreboard',
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    name: 'Logo nhà tài trợ',
    path: '/logos',
    icon: 'flag-pennant',
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
  },
  {
    name: 'Quản lý ban huấn luyện',
    icon: 'sports_soccer',
    auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
    children: [
      {
        name: 'Danh sách BHL',
        iconText: 'SI',
        path: '/coachs',
        auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
      },
      {
        name: 'Quản lý vị trí ban huấn luyện',
        iconText: 'SU',
        path: '/position',
        auth: [ROLES.ADMIN, ROLES.CONTENT_MANAGER],
      },
    ],
  },
]
