export const tableModel = {
  headCell: [
    {
      name: 'STT',
      width: 50,
    },
    {
      name: 'Ảnh',
      width: null,
    },
    {
      name: 'Tên địa điểm Camping',
      width: null,
    },
    {
      name: 'Loại hình',
      width: null,
    },
    {
      name: 'Liên hệ',
      width: null,
    },
    {
      name: 'Địa danh',
      width: null,
    },
    {
      name: 'Địa chỉ',
      width: null,
    },
    {
      name: 'Dịch vụ',
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
    'imageGround',
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
      width: null,
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
}
