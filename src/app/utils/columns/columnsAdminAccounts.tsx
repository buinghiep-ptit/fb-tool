import { Chip, Typography } from '@mui/material'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { TableColumn } from 'app/models'
import { TitleAccounts } from 'app/models/account'
import { DateTimeConverter } from '../formatters/dateTimeConverter'

export const columnsAdminAccounts: readonly TableColumn<TitleAccounts>[] = [
  { id: 'order', label: 'STT', minWidth: 50 },
  {
    id: 'account',
    label: 'Tài khoản',
    minWidth: 120,
    action: (value: any) => (
      <Typography color={'primary'} sx={{ textDecorationLine: 'underline' }}>
        {value}
      </Typography>
    ),
  },
  { id: 'email', label: 'Email', minWidth: 200, align: 'center' },
  {
    id: 'role',
    label: 'Quyền',
    minWidth: 120,
    align: 'center',
  },
  {
    id: 'dateUpdated',
    label: 'Thời gian cập nhật',
    minWidth: 170,
    align: 'center',
    format: (value: number) => DateTimeConverter(value),
  },
  {
    id: 'userUpdated',
    label: 'Người cập nhật',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'status',
    label: 'Trạng thái',
    minWidth: 100,
    align: 'center',
    status: (value: any) => (
      <Chip
        label={value === 1 ? 'Hoạt động' : 'Khoá'}
        size="small"
        color={value === 1 ? 'primary' : 'default'}
      />
    ),
  },
  {
    id: 'action',
    label: '',
    minWidth: 85,
    align: 'right',
    action: (value: any) => (
      <MuiSwitch
        checked={value === 1 ? true : false}
        sx={{ justifyContent: 'flex-end' }}
      />
    ),
  },
]
