import Loadable from 'app/components/Loadable'
import { lazy } from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutCustomer } from './accounts/customers/LayoutCustomerDetail'

const AdminAccounts = Loadable(
  lazy(() => import('./accounts/ManagementAdminAccounts')),
)
const UserDetail = Loadable(lazy(() => import('./accounts/users/UserDetail')))
const CreateUser = Loadable(lazy(() => import('./accounts/users/CreateUser')))

const CustomerAccounts = Loadable(
  lazy(() => import('./accounts/ManagementCustomerAccounts')),
)
const CustomerDetail = Loadable(
  lazy(() => import('./accounts/customers/CustomerInfoDetail')),
)
const ChangePassword = Loadable(
  lazy(() => import('./accounts/customers/details/ChangePassword')),
)
const CustomerHistory = Loadable(
  lazy(() => import('./accounts/customers/CustomerOrderHistoryDetail')),
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

const ManagementRoutes = [
  {
    path: '/quan-ly-tai-khoan-admin',
    element: (
      <>
        <AdminAccounts />
        <Outlet />
      </>
    ),
    children: [
      {
        path: ':id/chi-tiet',
        element: <UserDetail title="Chi tiết tài khoản" />,
      },
      {
        path: 'them-moi',
        element: <CreateUser title="Thêm mới tài khoản" />,
      },
    ],
  },
  { path: '/quan-ly-tai-khoan-khach-hang', element: <CustomerAccounts /> },
  {
    path: '/quan-ly-tai-khoan-khach-hang/:customerId',
    element: (
      <>
        <LayoutCustomer>
          <Outlet />
        </LayoutCustomer>
      </>
    ),
    children: [
      {
        // index: true,
        path: 'info',
        element: (
          <>
            <CustomerDetail />
            <Outlet />
          </>
        ),
        children: [
          {
            path: 'doi-mat-khau',
            element: <ChangePassword title="Đổi mật khẩu" />,
          },
        ],
      },
      { path: 'history', element: <CustomerHistory /> },
    ],
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
  { path: '/quan-ly-thong-tin-diem-camp', element: <ManagerCamp /> },
  { path: '/quan-ly-dich-vu', element: <ManagerServices /> },
  { path: '/quan-ly-tu-cam', element: <ManagerForbiddenWord /> },
]
export default ManagementRoutes
