import { Chip, Typography } from '@mui/material'
import { TableColumn, TitleFeeds } from 'app/models'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'
import { LabelFormatter } from '../formatters/labelFormatter'

export const columnFeeds: readonly TableColumn<TitleFeeds>[] = [
  { id: 'order', label: 'STT', minWidth: 50 },
  { id: 'account', label: 'Tài khoản', minWidth: 170 },
  {
    id: 'content',
    label: 'Nội dung',
    minWidth: 170,
    align: 'left',
  },
  {
    id: 'customerType',
    label: 'Loại tài khoản',
    minWidth: 170,
    align: 'center',
    format: (value: number) => LabelFormatter(value, 'customerType'),
  },
  {
    id: 'dateCreated',
    label: 'Thời gian đăng',
    minWidth: 170,
    align: 'center',
    format: (value: string) => ISODateTimeFormatter(value),
  },
  {
    id: 'type',
    label: 'Loại media',
    minWidth: 100,
    align: 'center',
    format: (value: any) => (
      <Chip
        label={value === 1 ? 'Video' : 'Ảnh'}
        size="small"
        color={'primary'}
        sx={{ m: 0.5 }}
      />
    ),
  },
  {
    id: 'status',
    label: 'Trạng thái',
    minWidth: 100,
    align: 'center',
    status: (value: any) => LabelFormatter(value, 'feed'),
  },
  {
    id: 'handler',
    label: 'Người tiếp nhận',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'reportedNum',
    label: 'Số b/c vi phạm',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'action',
    label: 'Hành động',
    minWidth: 170,
    align: 'right',
    action: () => (
      <Typography
        variant="subtitle2"
        color="primary"
        sx={{ textAlign: 'center' }}
      >
        Chi tiết | Duyệt | Vi phạm
      </Typography>
    ),
  },
]
