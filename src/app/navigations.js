import { ROLES } from './utils/enums/roles'

export const navigations = [
  { name: 'Trang chủ', path: '/dashboard', icon: 'dashboard' },
  {
    name: 'Quản lý tài khoản Admin',
    path: '/quan-ly-tai-khoan-admin',
    icon: 'admin_panel_settings',
    auth: [ROLES.ADMIN],
  },
  {
    name: 'Quản lý tài khoản End-User',
    path: '/quan-ly-tai-khoan-khach-hang',
    icon: 'account_box',
    auth: [ROLES.ADMIN, ROLES.CS],
  },
  {
    name: 'Quản lý Feed',
    path: '/quan-ly-feeds',
    icon: 'feed',
    auth: [ROLES.ADMIN, ROLES.CS, ROLES.MKT],
  },
  // {
  //   name: 'Thêm mới Feed',
  //   path: '/them-moi-feed',
  //   icon: 'event_note',
  //   auth: [ROLES.ADMIN, ROLES.CS, ROLES.MKT],
  // },
  {
    name: 'Quản lý âm nhạc',
    path: '/quan-ly-audios',
    icon: 'library_music',
  },
  {
    name: 'Quản lý sự kiện',
    path: '/quan-ly-su-kien',
    icon: 'event',
  },
  {
    name: 'Quản lý đơn hàng',
    path: '/quan-ly-don-hang',
    icon: 'fact_check',
    auth: [ROLES.ADMIN, ROLES.CS],
  },
  {
    name: 'Quản lý địa danh',
    path: '/quan-ly-thong-tin-dia-danh',
    icon: 'edit_location_alt',
  },
  {
    name: 'Quản lý điểm camp',
    path: '/quan-ly-thong-tin-diem-camp',
    icon: 'edit_location',
  },
  {
    name: 'Quản lý dịch vụ',
    path: '/quan-ly-dich-vu',
    icon: 'event',
    auth: [ROLES.ADMIN, ROLES.SALE],
  },
  {
    name: 'Quản lý đối tác',
    path: '/quan-ly-thong-tin-doi-tac',
    icon: 'store_front',
    auth: [ROLES.ADMIN, ROLES.SALE],
  },
  {
    name: 'Quản lý từ cấm',
    path: '/quan-ly-tu-cam',
    icon: 'comments_disabled',
  },
  {
    name: 'Quản lý cẩm nang',
    path: '/quan-ly-cam-nang',
    icon: 'menu_book',
  },
  {
    name: 'Quản lý chính sách',
    path: '/quan-ly-chinh-sach',
    icon: 'security',
  },
  {
    name: 'Quản lý  đánh giá',
    path: '/quan-ly-danh-gia',
    icon: 'stars',
  },
  {
    name: 'Quản lý từ khoá yêu thích',
    path: '/quan-ly-tu-khoa-yeu-thich',
    icon: 'travel_explore',
  },
  // { label: 'PAGES', type: 'label' },
  {
    name: 'Session/Auth',
    icon: 'shield',
    children: [
      // { name: 'Sign in', iconText: 'SI', path: '/session/signin' },
      // { name: 'Sign up', iconText: 'SU', path: '/session/signup' },
      {
        name: 'Quên mật khẩu',
        iconText: 'FP',
        path: '/session/forgot-password',
      },
      // { name: 'Error', iconText: '404', path: '/session/404' },
    ],
  },
  // { label: 'Components', type: 'label' },
  {
    name: 'Biểu đồ / Thống kê',
    icon: 'trending_up',
    children: [{ name: 'Echarts', path: '/charts/echarts', iconText: 'E' }],
  },
  // {
  //   name: 'MUI-Components',
  //   icon: 'favorite',
  //   badge: { value: '10+', color: 'secondary' },
  //   children: [
  //     { name: 'Auto Complete', path: '/material/autocomplete', iconText: 'A' },
  //     { name: 'Buttons', path: '/material/buttons', iconText: 'B' },
  //     { name: 'Checkbox', path: '/material/checkbox', iconText: 'C' },
  //     { name: 'Dialog', path: '/material/dialog', iconText: 'D' },
  //     {
  //       name: 'Expansion Panel',
  //       path: '/material/expansion-panel',
  //       iconText: 'E',
  //     },
  //     { name: 'Form', path: '/material/form', iconText: 'F' },
  //     { name: 'Icons', path: '/material/icons', iconText: 'I' },
  //     { name: 'Menu', path: '/material/menu', iconText: 'M' },
  //     { name: 'Progress', path: '/material/progress', iconText: 'P' },
  //     { name: 'Radio', path: '/material/radio', iconText: 'R' },
  //     { name: 'Switch', path: '/material/switch', iconText: 'S' },
  //     { name: 'Slider', path: '/material/slider', iconText: 'S' },
  //     { name: 'Snackbar', path: '/material/snackbar', iconText: 'S' },
  //     { name: 'Table', path: '/material/table', iconText: 'T' },
  //   ],
  // },
  // {
  //   name: 'Documentation',
  //   icon: 'launch',
  //   type: 'extLink',
  //   path: 'http://demos.ui-lib.com/matx-react-doc/',
  // },
]
