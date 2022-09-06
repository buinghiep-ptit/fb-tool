import Loadable from 'app/components/Loadable'
import { lazy } from 'react'

const ManagerCamp = Loadable(lazy(() => import('./ManagerCamp')))
const ManagerFeed = Loadable(lazy(() => import('./ManagerFeed')))
const ManagerPlace = Loadable(lazy(() => import('./managerPlace/ManagerPlace')))
const ManagerToolPostFeed = Loadable(
  lazy(() => import('./ManagerToolPostFeed')),
)
const ManagerServices = Loadable(
  lazy(() => import('./managerServices/ServiceSetiing')),
)
const ManagerServiceDetail = Loadable(
  lazy(() => import('./managerServices/ServiceDetail')),
)
const ManagerForbiddenWord = Loadable(
  lazy(() => import('./ManagerForbiddenWord')),
)

const ManagementRoutes = [
  { path: '/quan-ly-bang-tin', element: <ManagerFeed /> },
  { path: '/tool-post-bai-feed', element: <ManagerToolPostFeed /> },
  {
    path: '/quan-ly-thong-tin-dia-danh',
    element: <ManagerPlace />,
  },
  { path: '/quan-ly-thong-tin-diem-camp', element: <ManagerCamp /> },
  { path: '/quan-ly-dich-vu', element: <ManagerServices /> },
  { path: '/quan-ly-tu-cam', element: <ManagerForbiddenWord /> },
  { path: '/chi-tiet-dich-vu', element: <ManagerServiceDetail /> },
]

export default ManagementRoutes
