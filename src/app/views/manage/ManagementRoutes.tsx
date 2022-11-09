import Loadable from 'app/components/Loadable'
import { navCustomerDetail } from 'app/utils/navbars'
import { lazy } from 'react'
import CreateMerchant from './managerMerchant/CreactMerchant'
import { Navigate, Outlet } from 'react-router-dom'
import { LayoutWithNavTabs } from './layoutWithTabs/LayoutWithNavTabs'
import { ROLES } from 'app/utils/enums/roles'
import AvailablePayment from './orders/details/ButtonsLink/AvailablePayment'
import UnAvailableOrder from './orders/details/ButtonsLink/UnAvailableOrder'

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
const LockCustomer = Loadable(
  lazy(() => import('./accounts/customers/details/LockCustomer')),
)
const UnlockCustomer = Loadable(
  lazy(() => import('./accounts/customers/details/UnlockCustomer')),
)
const OrdersHistoryTab = Loadable(
  lazy(() => import('./accounts/customers/OrdersHistoryTab')),
)

const ManagerFeed = Loadable(lazy(() => import('./feeds/ManagerFeed')))
const FeedDetail = Loadable(lazy(() => import('./feeds/FeedDetail')))
const PostsCheck = Loadable(lazy(() => import('./feeds/PostsCheck')))
const ReportDialog = Loadable(lazy(() => import('./feeds/ReportDialog')))
const ManagerPlace = Loadable(lazy(() => import('./managerPlace/ManagerPlace')))
const ManagerMerchant = Loadable(lazy(() => import('./managerMerchant')))
const CreateFeed = Loadable(lazy(() => import('./feeds/CreateFeed')))
const ListAudios = Loadable(lazy(() => import('./audios/ListAudios')))
const AddAudio = Loadable(lazy(() => import('./audios/AddAudio')))
const ManagerEvents = Loadable(lazy(() => import('./events/ManagerEvents')))
const AddEvent = Loadable(lazy(() => import('./events/AddEvent')))
const ListPolicy = Loadable(lazy(() => import('./policies/ListPolicy')))
const AddPolicy = Loadable(lazy(() => import('./policies/AddPolicy')))
const ListTrendingKeyword = Loadable(
  lazy(() => import('./keywords/ListTrendingKeyword')),
)
const AddKeyword = Loadable(lazy(() => import('./keywords/AddKeyword')))
const ListHandbook = Loadable(lazy(() => import('./handbooks/ListHandbook')))
const AddHandbook = Loadable(lazy(() => import('./handbooks/AddHandbook')))
const ListRating = Loadable(lazy(() => import('./rating/ListRating')))
const RateDetail = Loadable(lazy(() => import('./rating/RateDetail')))

const ManagerServices = Loadable(
  lazy(() => import('./managerServices/ServiceSetting')),
)
const ManagerForbiddenWord = Loadable(
  lazy(() => import('./ManagerForbiddenWord')),
)
const ManagerServiceDetail = Loadable(
  lazy(() => import('./managerServices/ServiceDetail')),
)
const DetailPlace = Loadable(
  lazy(() => import('./managerPlace/detailPlace/detailPlace')),
)
const DetailCampGround = Loadable(
  lazy(() => import('./managerLocation/detailCampGround/detailCampground')),
)
const ManagerLocation = Loadable(lazy(() => import('./managerLocation')))
const CreatePlace = Loadable(lazy(() => import('./managerPlace/CreactPlace')))
const UpdateMerchant = Loadable(
  lazy(() => import('./managerMerchant/updateMerchant')),
)
const OrdersHistory = Loadable(lazy(() => import('./orders/OrdersHistory')))
const OrderDetail = Loadable(lazy(() => import('./orders/OrderDetail')))
const PaymentConfirm = Loadable(
  lazy(() => import('./orders/details/ButtonsLink/PaymentConfirm')),
)
const CancelBooking = Loadable(
  lazy(() => import('./orders/details/ButtonsLink/CancelBooking')),
)
const CancelOrder = Loadable(
  lazy(() => import('./orders/details/ButtonsLink/CancelOrder')),
)
const RefundOrder = Loadable(
  lazy(() => import('./orders/details/ButtonsLink/RefundOrder')),
)
const Reassign = Loadable(
  lazy(() => import('./orders/details/ButtonsLink/Reassign')),
)
const Note = Loadable(lazy(() => import('./orders/details/ButtonsLink/Note')))

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
        auth: [ROLES.ADMIN],
      },
      {
        path: 'them-moi',
        element: <CreateUser title="Thêm tài khoản" />,
        auth: [ROLES.ADMIN],
      },
    ],
    auth: [ROLES.ADMIN],
  },
  {
    path: '/quan-ly-tai-khoan-khach-hang',
    element: <CustomerAccounts />,
    auth: [ROLES.ADMIN, ROLES.CS],
  },
  {
    path: '/quan-ly-tai-khoan-khach-hang/:customerId',
    element: (
      <LayoutWithNavTabs navInfo={navCustomerDetail as any}>
        <Outlet />
      </LayoutWithNavTabs>
    ),
    children: [
      {
        // index: true,
        path: 'thong-tin',
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
          {
            path: 'mo-khoa-tai-khoan',
            element: <UnlockCustomer title="Mở khoá" />,
          },
          {
            path: 'khoa-tai-khoan',
            element: <LockCustomer title="Khoá" />,
          },
        ],
      },
      { path: 'lich-su-dat-cho', element: <OrdersHistoryTab /> },
    ],
  },
  {
    path: '/quan-ly-feeds',
    element: (
      <>
        <ManagerFeed />
        <Outlet />
      </>
    ),
    children: [
      {
        path: 'ds/:feedId/vi-pham',
        element: <ReportDialog title="Báo cáo vi phạm" />,
      },
    ],
    auth: [ROLES.ADMIN, ROLES.CS, ROLES.MKT],
  },
  {
    path: '/quan-ly-feeds/:feedId',
    element: (
      <>
        <FeedDetail />
        <Outlet />
      </>
    ),
    children: [
      {
        path: 'vi-pham',
        element: <ReportDialog title="Vi phạm" />,
      },
    ],
  },
  {
    path: '/quan-ly-feeds/:feedId/chinh-sua-feed',
    element: <CreateFeed />,
  },
  { path: '/quan-ly-feeds/bao-cao-vi-pham', element: <ReportDialog /> }, // ?? unused
  {
    path: '/quan-ly-feeds/hau-kiem',
    element: (
      <>
        <PostsCheck />
        <Outlet />
      </>
    ),
    children: [
      {
        path: ':feedId/vi-pham',
        element: <ReportDialog title="Báo cáo vi phạm" />,
      },
    ],
  },
  {
    path: 'quan-ly-feeds/them-moi-feed',
    element: <CreateFeed />,
    auth: [ROLES.ADMIN, ROLES.CS, ROLES.MKT],
  },
  {
    path: '/quan-ly-audios',
    element: (
      <>
        <ListAudios />
        <Outlet />
      </>
    ),
    children: [
      {
        path: ':audioId/chi-tiet',
        element: <AddAudio title="Chi tiết bài hát" />,
      },
      {
        path: 'them-moi',
        element: <AddAudio title="Thêm bài hát" />,
      },
    ],
    auth: [ROLES.ADMIN, ROLES.CS, ROLES.MKT],
  },
  {
    path: '/quan-ly-su-kien',
    element: <ManagerEvents />,
  },
  {
    path: '/quan-ly-su-kien/them-moi-su-kien',
    element: <AddEvent />,
  },
  { path: '/quan-ly-su-kien/:eventId/*', element: <AddEvent /> },
  {
    path: '/quan-ly-don-hang',
    children: [
      {
        index: true,
        element: <Navigate to="xu-ly" replace />,
      },
      {
        path: ':source',
        children: [
          { index: true, element: <OrdersHistory /> },
          // { path: ':orderId', element: <OrderDetail /> },
        ],
      },
      {
        path: ':source/:orderId',
        element: (
          <>
            <OrderDetail />
            <Outlet />
          </>
        ),
        children: [
          {
            path: 'xac-nhan-thanh-toan',
            element: <PaymentConfirm title="Xác nhận thanh toán" />,
          },
          {
            path: 'yeu-cau-huy-dat-cho',
            element: <CancelBooking title="Tạo yêu cầu huỷ" />,
          },
          {
            path: 'huy-don-hang',
            element: <CancelOrder title="Huỷ đơn hàng" />,
          },
          {
            path: 'hoan-tien',
            element: <RefundOrder title="Hoàn tiền" />,
          },
          {
            path: 'chuyen-tiep',
            element: <Reassign title="Chuyển tiếp" />,
          },
          {
            path: 'ghi-chu',
            element: <Note title="Ghi chú" />,
          },
          {
            path: 'het-cho',
            element: <UnAvailableOrder title="Chi tiết đơn hàng (Hết chỗ)" />,
          },
          {
            path: 'con-cho',
            element: (
              <AvailablePayment title="Chi tiết đơn hàng (Còn chỗ, chờ thanh toán)" />
            ),
          },
        ],
      },
    ],
    auth: [ROLES.ADMIN, ROLES.CS],
  },

  {
    path: '/quan-ly-chinh-sach',
    element: (
      <>
        <ListPolicy />
        <Outlet />
      </>
    ),
    children: [
      {
        path: ':policyId/chi-tiet',
        element: <AddPolicy title="Chi tiết chính sách" />,
      },
      {
        path: 'them-moi',
        element: <AddPolicy title="Thêm mới chính sách riêng" />,
      },
    ],
    auth: [ROLES.ADMIN, ROLES.CS],
  },
  {
    path: '/quan-ly-tu-khoa-yeu-thich',
    element: (
      <>
        <ListTrendingKeyword />
        <Outlet />
      </>
    ),
    children: [
      {
        path: 'them-moi',
        element: <AddKeyword title="Thêm từ khoá" />,
      },
    ],
    auth: [ROLES.ADMIN, ROLES.CS],
  },
  {
    path: '/quan-ly-cam-nang',
    element: (
      <>
        <ListHandbook />
        <Outlet />
      </>
    ),
    children: [
      // {
      //   path: 'them-moi',
      //   element: <AddHandbook title="Thêm cẩm nang" />,
      // },
    ],
    auth: [ROLES.ADMIN, ROLES.CS],
  },
  {
    path: '/quan-ly-cam-nang/them-moi',
    element: <AddHandbook />,
    children: [
      // {
      //   path: 'them-moi',
      //   element: <AddHandbook title="Thêm cẩm nang" />,
      // },
    ],
  },
  {
    path: '/quan-ly-cam-nang/:handbookId/chi-tiet',
    element: <AddHandbook />,
    children: [
      // {
      //   path: 'them-moi',
      //   element: <AddHandbook title="Thêm cẩm nang" />,
      // },
    ],
  },
  {
    path: '/quan-ly-danh-gia',
    element: <ListRating />,
  },
  {
    path: '/quan-ly-danh-gia/:rateId/chi-tiet',
    element: <RateDetail />,
  },
  {
    path: '/quan-ly-thong-tin-dia-danh',
    element: <ManagerPlace />,
  },
  {
    path: '/quan-ly-thong-tin-doi-tac',
    element: <ManagerMerchant />,
    auth: [ROLES.ADMIN, ROLES.SALE],
  },
  {
    path: '/them-dia-danh',
    element: <CreatePlace />,
  },
  {
    path: '/them-doi-tac',
    element: <CreateMerchant />,
    auth: [ROLES.ADMIN, ROLES.SALE],
  },
  {
    path: '/cap-nhat-thong-tin-doi-tac/:id',
    element: <UpdateMerchant />,
    auth: [ROLES.ADMIN, ROLES.SALE],
  },
  {
    path: '/chi-tiet-dia-danh/:id',
    element: <DetailPlace />,
  },
  {
    path: '/chi-tiet-diem-camp/:id',
    element: <DetailCampGround action="edit" />,
  },
  {
    path: '/them-diem-camp',
    element: <DetailCampGround action="create" />,
  },
  { path: '/quan-ly-thong-tin-diem-camp', element: <ManagerLocation /> },
  {
    path: '/quan-ly-dich-vu',
    element: <ManagerServices />,
    auth: [ROLES.ADMIN, ROLES.SALE],
  },
  { path: '/quan-ly-tu-cam', element: <ManagerForbiddenWord /> },
  {
    path: '/quan-ly-dich-vu/chi-tiet-dich-vu',
    element: <ManagerServiceDetail />,
  },
  {
    path: '/quan-ly-dich-vu/:serviceId/*',
    element: <ManagerServiceDetail />,
  },
  { path: '/danh-sach-dia-diem', element: <ManagerLocation /> },
]
export default ManagementRoutes
