import { Chip, Typography } from '@mui/material'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { TableColumn } from 'app/models'
import { TitleUsers } from 'app/models/account'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'
import { LabelFormatter } from '../formatters/labelFormatter'

export const columnsAdminAccounts: readonly TableColumn<TitleUsers>[] = [
  { id: 'order', label: 'STT', minWidth: 50 },
  {
    id: 'email',
    label: 'Email',
    minWidth: 120,
    action: (value: any) => (
      <Typography color={'primary'} sx={{ textDecorationLine: 'underline' }}>
        {value}
      </Typography>
    ),
  },
  {
    id: 'role',
    label: 'Quyền',
    minWidth: 120,
    align: 'center',
    format: (value: number) => LabelFormatter(value, 'role'),
  },
  {
    id: 'updateDate',
    label: 'Thời gian cập nhật',
    minWidth: 170,
    align: 'center',
    format: (value: string) => ISODateTimeFormatter(value),
  },
  {
    id: 'updateBy',
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
        label={value === 1 ? 'Hoạt động' : 'Không hoạt động'}
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
