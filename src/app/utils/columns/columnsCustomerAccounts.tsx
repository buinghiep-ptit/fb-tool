import { EditOutlined } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { TableColumn } from 'app/models'
import { TitleCustomers } from 'app/models/account'
import { ISODateTimeFormatter } from '../formatters/dateTimeISOFormatter'
import { LabelFormatter } from '../formatters/labelFormatter'

export const columnCustomerAccounts: readonly TableColumn<TitleCustomers>[] = [
  { id: 'order', label: 'STT', minWidth: 50 },
  {
    id: 'mobilePhone',
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
    id: 'fullName',
    label: 'Tên hiển thị',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'customerType',
    label: 'Loại tài khoản',
    minWidth: 120,
    align: 'center',
    format: (value: number) => LabelFormatter(value, 'customerType'),
  },
  {
    id: 'dateCreated',
    label: 'Thời gian đăng ký',
    minWidth: 170,
    align: 'center',
    format: (value: string) => ISODateTimeFormatter(value),
  },
  {
    id: 'lastLoginDate',
    label: 'Thời gian đăng nhập lần cuối',
    minWidth: 200,
    align: 'center',
    format: (value: string) => (value ? ISODateTimeFormatter(value) : null),
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
