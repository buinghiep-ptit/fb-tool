export const tableModel = {
  headCell: [
    {
      name: 'STT',
      width: 50,
    },
    {
      name: 'Ảnh',
      width: 200,
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
      width: 200,
    },
    {
      name: 'Dịch vụ',
      width: 150,
    },
    {
      name: 'Trạng thái',
      width: 100,
    },
    {
      name: '',
      width: 100,
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

export const tableModelSevrvice = {
  headCell: [
    {
      name: 'STT',
      width: 50,
    },
    {
      name: 'Ảnh',
      width: 200,
    },
    {
      name: 'Tên dịch vụ',
      width: null,
    },
    {
      name: 'Loại dịch vụ',
      width: null,
    },
    {
      name: 'Số lượng',
      width: null,
    },
    {
      name: 'Trạng thái',
      width: null,
    },
    {
      name: '',
      width: null,
    },
  ],
  bodyCell: [
    'index',
    'image',
    'linkDetail',
    'type',
    'quantity',
    'status',
    'action',
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
      name: 'Ngưởi thêm',
      width: null,
    },
    {
      name: '',
      width: null,
    },
  ],
  bodyCell: ['index', 'nameHandBook', 'status', 'creator', 'action'],
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
  bodyCell: ['index', 'nameHandBook', 'action'],
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
