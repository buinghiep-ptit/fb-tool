import { EditOutlined } from '@mui/icons-material'
import { Avatar, Chip, styled, Typography } from '@mui/material'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { TableColumn } from 'app/models'
import { TitleCustomers } from 'app/models/account'
import { getColorByCusStatus } from '../common'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'
import {
  getLabelByCusStatus,
  LabelFormatter,
} from '../formatters/labelFormatter'

const StyledAvatar = styled(Avatar)(() => ({
  height: '32px',
  width: '32px',
}))

export const columnCustomerAccounts: readonly TableColumn<TitleCustomers>[] = [
  { id: 'order', label: 'STT', minWidth: 50 },
  {
    id: 'avatar',
    label: '',
    minWidth: 40,
    media: (value: string) => (
      <StyledAvatar src={value ?? '/assets/images/avatars/avatar-duck.jpeg'} />
    ),
  },
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
      <Chip
        label={getLabelByCusStatus(value as number)}
        size="small"
        sx={{
          mx: 1,
          px: 1,
          backgroundColor: getColorByCusStatus(value as number),
          color: '#FFFFFF',
        }}
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
