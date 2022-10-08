import { Chip, Typography } from '@mui/material'
import { TableColumn } from 'app/models'
import { TitleOrders } from 'app/models/order'
import { getOrderStatusSpec } from '../enums/order'
import { CurrencyFormatter } from '../formatters/currencyFormatter'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'

export const columnsOrdersCustomer: readonly TableColumn<TitleOrders>[] = [
  { id: 'order', label: 'STT', minWidth: 50 },
  {
    id: 'campGroundName',
    label: 'Tên điểm camp',
    minWidth: 170,
    action: (value: any) => (
      <Typography color={'primary'} sx={{ textDecorationLine: 'underline' }}>
        {value}
      </Typography>
    ),
  },
  {
    id: 'campGroundRepresent',
    label: 'Chủ camp',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'amount',
    label: 'Tổng thực tế',
    minWidth: 170,
    align: 'center',
    format: (value: number) => (
      <Typography color={'primary'}>{CurrencyFormatter(value, 2)}</Typography>
    ),
  },
  {
    id: 'paymentAmnt',
    label: 'Tổng thanh toán',
    minWidth: 100,
    align: 'center',
    format: (value: number) => (
      <Typography color={'primary'}>{CurrencyFormatter(value, 2)}</Typography>
    ),
  },
  {
    id: 'dateCreated',
    label: 'Thời gian đặt',
    minWidth: 170,
    align: 'center',
    format: (value: string) => ISODateTimeFormatter(value),
  },
  {
    id: 'status',
    label: 'Trạng thái đơn',
    minWidth: 100,
    align: 'center',
    status: (value: any) => (
      <Chip
        label={getOrderStatusSpec(value, 2).title}
        size="small"
        color={'default'}
      />
    ),
  },
  {
    id: 'handledBy',
    label: 'Người tiếp nhận',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'action',
    label: 'Hành động',
    minWidth: 120,
    align: 'right',
    action: () => (
      <Typography variant="subtitle2" color="primary">
        Tiếp nhận
      </Typography>
    ),
  },
]
