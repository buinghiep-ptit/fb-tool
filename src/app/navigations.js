import { ROLES } from './utils/enums/roles'

export const navigations = [
  { name: 'Trang chủ', path: '/dashboard', icon: 'dashboard' },
  {
    name: 'Quản lý giải đấu',
    icon: 'sports_soccer',
    children: [
      {
        name: 'BXH',
        iconText: 'SI',
        path: '/quan-ly-thong-bao/nguoi-dung',
      },
      {
        name: 'Quản lý cố phiếu đội',
        iconText: 'SU',
        path: '/quan-ly-thong-bao/dau-trang',
      },
    ],
    auth: [ROLES.ADMIN],
  },
  {
    name: 'Quản lý Homepages',
    path: '/quan-ly-tai-khoan-admin',
    icon: 'mediation',
    auth: [ROLES.ADMIN],
  },
]
