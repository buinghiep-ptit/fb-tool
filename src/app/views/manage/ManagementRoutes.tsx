import Loadable from 'app/components/Loadable'
import { lazy } from 'react'

const AdminAccounts = Loadable(
  lazy(() => import('./accounts/ManagementAdminAccounts')),
)
const CustomerAccounts = Loadable(
  lazy(() => import('./accounts/ManagementCustomerAccounts')),
)
const CustomerDetail = Loadable(
  lazy(() => import('./accounts/CustomerInfoDetail')),
)
const CustomerHistory = Loadable(
  lazy(() => import('./accounts/CustomerOrderHistoryDetail')),
)

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
const DetailCampGround = Loadable(
  lazy(() => import('./managerLocation/detailCampGround/detailCampground')),
)
const ManagerLocation = Loadable(lazy(() => import('./managerLocation')))
const CreatePlace = Loadable(lazy(() => import('./managerPlace/CreactPlace')))
const ManagementRoutes = [
  { path: '/quan-ly-tai-khoan-admin', element: <AdminAccounts /> },
  { path: '/quan-ly-tai-khoan-khach-hang', element: <CustomerAccounts /> },
  {
    path: '/quan-ly-tai-khoan-khach-hang/:id/info',
    element: <CustomerDetail />,
  },
  {
    path: '/quan-ly-tai-khoan-khach-hang/:id/history',
    element: <CustomerHistory />,
  },
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
    path: '/them-dia-danh',
    element: <CreatePlace />,
  },
  {
    path: '/chi-tiet-dia-danh/:id',
    element: <DetailPlace />,
  },
  {
    path: '/chi-tiet-diem-camp/:id',
    element: <DetailCampGround />,
  },
  { path: '/quan-ly-thong-tin-diem-camp', element: <ManagerLocation /> },
  { path: '/quan-ly-dich-vu', element: <ManagerServices /> },
  { path: '/quan-ly-tu-cam', element: <ManagerForbiddenWord /> },
  { path: '/danh-sach-dia-diem', element: <ManagerLocation /> },
]
export default ManagementRoutes
