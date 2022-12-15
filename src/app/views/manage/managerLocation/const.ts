export const tableModel = {
  headCell: [
    {
      name: 'STT',
      width: 50,
    },
    {
      name: 'Ảnh',
      width: 120,
    },
    {
      name: 'Tên địa điểm Camping',
      width: 200,
    },
    {
      name: 'Loại hình',
      width: 200,
    },
    {
      name: 'Liên hệ',
      width: 200,
    },
    {
      name: 'Địa danh',
      width: 150,
    },
    {
      name: 'Địa chỉ',
      width: 150,
    },
    {
      name: 'Dịch vụ',
      width: 50,
    },
    {
      name: 'Trạng thái',
      width: 60,
    },
    {
      name: '',
      width: 60,
    },
  ],
  bodyCell: [
    'index',
    'image',
    'linkDetail',
    'type',
    'contact',
    'place',
    'address',
    'service',
    'status',
    'action',
  ],
}

export const tableModelService = {
  headCell: [
    {
      name: 'STT',
      width: 50,
    },
    {
      name: 'Ảnh',
      width: 120,
    },
    {
      name: 'Tên dịch vụ',
      width: 120,
    },
    {
      name: 'Loại dịch vụ',
      width: 80,
    },
    {
      name: 'Số lượng',
      width: 80,
    },
    {
      name: 'Trạng thái',
      width: 100,
    },
    {
      name: '',
      width: 150,
    },
  ],
  bodyCell: [
    'index',
    'image',
    'linkView',
    'type',
    'quantity',
    'status',
    'action',
  ],
}

export const tableModelReview = {
  headCell: [
    {
      name: 'STT',
      width: 50,
    },
    {
      name: 'Tài khoản',
      width: 120,
    },
    {
      name: 'Số sao',
      width: 80,
    },
    {
      name: 'Nội dung',
      width: 150,
    },
    {
      name: 'Ảnh',
      width: 120,
    },
    {
      name: 'Thời gian nhận xét',
      width: 150,
    },
    {
      name: 'Trạng thái',
      width: 100,
    },
    {
      name: 'Chi tiết',
      width: 150,
    },
  ],
  bodyCell: [
    'index',
    'linkView',
    'star',
    'description',
    'image',
    'time',
    'status',
    'linkViewBlank',
  ],
}

export const tableModelHandBook = {
  headCell: [
    {
      name: 'STT',
      width: 50,
    },
    {
      name: 'Tên cẩm nang',
      width: null,
    },
    {
      name: 'Trạng thái',
      width: null,
    },
    {
      name: 'Người thêm',
      width: null,
    },
    {
      name: '',
      width: null,
    },
  ],
  bodyCell: ['index', 'linkView', 'statusHandBook', 'creator', 'action'],
}

export const tableModelHandBookUnLinked = {
  headCell: [
    {
      name: 'STT',
      width: 50,
    },
    {
      name: 'Tên cẩm nang',
      width: null,
    },
    {
      name: '',
      width: null,
    },
  ],
  bodyCell: ['index', 'linkView', 'action'],
}

export const seasons = [
  { id: 1, value: 'Xuân' },
  { id: 2, value: 'Hạ' },
  { id: 3, value: 'Thu' },
  { id: 4, value: 'Đông' },
]

export const seasonsById = {
  1: { id: 1, value: 'Xuân' },
  2: { id: 2, value: 'Hạ' },
  3: { id: 3, value: 'Thu' },
  4: { id: 4, value: 'Đông' },
}

export const INTERNET = {
  1: { name: 'viettel', speed: 'speedViettel' },
  2: { name: 'vinaphone', speed: 'speedVinaphone' },
  3: { name: 'mobiphone', speed: 'speedMobiphone' },
  4: { name: 'vietnamMobile', speed: 'speedVietnamMobile' },
}

export const VEHICLES = {
  1: { name: 'bus' },
  2: { name: 'car' },
  3: { name: 'motobike' },
  4: { name: 'boat' },
}

export const typeService = {
  1: 'Gói dịch vụ',
  2: 'Lưu trú',
  3: 'Khác',
}
