import { EditOutlined } from '@mui/icons-material'
import { Avatar, Chip, styled, Tooltip, Typography } from '@mui/material'
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
  {
    id: 'order',
    label: 'STT',
    minWidth: 40,
    align: 'center',
    sticky: {
      position: 'sticky',
      left: 0,
      background: 'white',
      zIndex: 9,
    },
  },
  {
    id: 'mobilePhone',
    label: 'Số điện thoại',
    minWidth: 120,
    link: (value: any) => (
      <Typography color={'primary'} sx={{ textDecorationLine: 'underline' }}>
        {value}
      </Typography>
    ),
    sticky: {
      position: 'sticky',
      left: 40,
      background: 'white',
      zIndex: 9,
    },
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 200,
    align: 'center',
    link: (value: any) => (
      <Typography color={'primary'} sx={{ textDecorationLine: 'underline' }}>
        {value}
      </Typography>
    ),
  },
  {
    id: 'fullName',
    label: 'Tên hiển thị',
    minWidth: 150,
    align: 'center',
    link: (value: any) => (
      <Typography color={'primary'} sx={{ textDecorationLine: 'underline' }}>
        {value}
      </Typography>
    ),
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
    sticky: {
      position: 'sticky',
      right: 50,
      background: 'white',
      boxShadow: '0px 0px 4px rgba(0,0,0,0.15)',
      clipPath: 'inset(0px 0px 0px -15px)',
    },
  },
  {
    id: 'actions',
    label: '',
    minWidth: 50,
    align: 'center',
    sticky: {
      position: 'sticky',
      right: 0,
      background: 'white',
    },
  },
]
