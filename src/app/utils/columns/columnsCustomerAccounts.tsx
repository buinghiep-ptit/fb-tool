import { EditOutlined } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { TableColumn } from 'app/models'
import { TitleCustomers } from 'app/models/account'
import { DateTimeConverter } from '../formatters/dateTimeConverter'
import { LabelFormatter } from '../formatters/labelFormatter'

export const columnCustomerAccounts: readonly TableColumn<TitleCustomers>[] = [
  { id: 'order', label: 'STT', minWidth: 50 },
  {
    id: 'phoneNumber',
    label: 'Số điện thoại',
    minWidth: 120,
    action: (value: any) => (
      <Typography color={'primary'} sx={{ textDecorationLine: 'underline' }}>
        {value}
      </Typography>
    ),
  },
  { id: 'email', label: 'Email', minWidth: 200, align: 'center' },
  {
    id: 'displayName',
    label: 'Tên hiện thị',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'accountType',
    label: 'Loại tài khoản',
    minWidth: 120,
    align: 'center',
    format: (value: number) => LabelFormatter(value, 'accountType'),
  },
  {
    id: 'dateCreated',
    label: 'Thời gian đăng ký',
    minWidth: 170,
    align: 'center',
    format: (value: number) => DateTimeConverter(value),
  },
  {
    id: 'dateUpdated',
    label: 'Thời gian cập nhật',
    minWidth: 170,
    align: 'center',
    format: (value: number) => DateTimeConverter(value),
  },

  {
    id: 'status',
    label: 'Trạng thái',
    minWidth: 100,
    align: 'center',
    status: (value: any) => (
      <MuiSwitch
        checked={value === 1 ? true : false}
        sx={{ justifyContent: 'center' }}
      />
    ),
  },
  {
    id: 'action',
    label: '',
    minWidth: 50,
    align: 'right',
    action: (value: any) => <EditOutlined />,
  },
]
