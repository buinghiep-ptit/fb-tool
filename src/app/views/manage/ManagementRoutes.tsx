import Loadable from 'app/components/Loadable'
import { lazy } from 'react'

const AdminAccounts = Loadable(
  lazy(() => import('./accounts/ManagementAdminAccounts')),
)
const ManagerCamp = Loadable(lazy(() => import('./ManagerCamp')))
const ManagerFeed = Loadable(lazy(() => import('./feeds/ManagerFeed')))
const FeedDetail = Loadable(lazy(() => import('./feeds/FeedDetail')))
const ReportInfringe = Loadable(lazy(() => import('./feeds/ReportInfringe')))
const ManagerPlace = Loadable(lazy(() => import('./managerPlace/ManagerPlace')))
const ManagerToolPostFeed = Loadable(
  lazy(() => import('./ManagerToolPostFeed')),
)
const ManagerServices = Loadable(lazy(() => import('./ManagerServices')))
const ManagerForbiddenWord = Loadable(
  lazy(() => import('./ManagerForbiddenWord')),
)
const DetailPlace = Loadable(
  lazy(() => import('./managerPlace/detailPlace/detailPlace')),
)
const ManagerLocation = Loadable(lazy(() => import('./managerLocation')))

const ManagementRoutes = [
  { path: '/quan-ly-tai-khoan-admin', element: <AdminAccounts /> },
  {
    path: '/quan-ly-feeds',
    element: (
      <>
        <ManagerFeed />
        {/* <Outlet /> */}
      </>
    ),
    // children: [{ path: 'report-infringe', element: <ReportInfringe /> }],
  },
  { path: '/quan-ly-feeds/:id', element: <FeedDetail /> },
  { path: '/quan-ly-feeds/bao-cao-vi-pham', element: <ReportInfringe /> },
  { path: '/quan-ly-feeds/xet-duyet', element: <ReportInfringe /> },
  { path: '/tool-post-bai-feed', element: <ManagerToolPostFeed /> },
  {
    path: '/quan-ly-thong-tin-dia-danh',
    element: <ManagerPlace />,
  },
  {
    path: '/chi-tiet-dia-danh',
    element: <DetailPlace />,
  },
  { path: '/quan-ly-thong-tin-diem-camp', element: <ManagerCamp /> },
  { path: '/quan-ly-dich-vu', element: <ManagerServices /> },
  { path: '/quan-ly-tu-cam', element: <ManagerForbiddenWord /> },
  { path: '/danh-sach-dia-diem', element: <ManagerLocation /> },
]
export default ManagementRoutes
