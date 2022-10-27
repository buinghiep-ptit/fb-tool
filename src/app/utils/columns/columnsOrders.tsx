import { Chip, Typography } from '@mui/material'
import { TableColumn } from 'app/models'
import { TitleOrders } from 'app/models/order'
import { getOrderStatusSpec } from '../enums/order'
import { CurrencyFormatter } from '../formatters/currencyFormatter'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'

export const columnOrdersOverall: readonly TableColumn<TitleOrders>[] = [
  {
    id: 'order',
    label: 'STT',
    minWidth: 50,
    sticky: {
      position: 'sticky',
      left: 0,
      background: 'white',
      zIndex: 9,
      boxShadow: '-10px -10px 15px rgba(0,0,0,0.5)',
      clipPath: 'inset(0px -15px 0px 0px)',
    },
  },
  {
    id: 'cusAccount',
    label: 'Tài khoản đặt',
    minWidth: 170,
    link: (value: any) => (
      <Typography color={'primary'} sx={{ textDecorationLine: 'underline' }}>
        {value}
      </Typography>
    ),
  },
  {
    id: 'campGroundName',
    label: 'Tên điểm camp',
    minWidth: 170,
    link: (value: any) => (
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
      <Typography color={'primary'}>
        {CurrencyFormatter(value ?? 0, 2)}
      </Typography>
    ),
  },
  {
    id: 'paymentAmnt',
    label: 'Tổng thanh toán',
    minWidth: 100,
    align: 'center',
    format: (value: number) => (
      <Typography color={'primary'}>
        {CurrencyFormatter(value ?? 0, 2)}
      </Typography>
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
    status: (value: any) =>
      value ? (
        <Chip
          label={getOrderStatusSpec(value, 2).title}
          size="small"
          color={'default'}
        />
      ) : (
        <></>
      ),
  },
  {
    id: 'cancelRequestStatus',
    label: 'Trạng thái y/c huỷ',
    minWidth: 120,
    align: 'center',
    status: (value: any) =>
      value !== null ? (
        <Chip
          label={getOrderStatusSpec(value, 3).title}
          size="small"
          color={'default'}
        />
      ) : (
        <></>
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
    minWidth: 100,
    align: 'right',
    action: (value?: any) => (
      <Typography variant="subtitle2" color="primary">
        {value === 0 ? 'Tiếp nhận' : 'Chi tiết'}
      </Typography>
    ),
    sticky: {
      position: 'sticky',
      right: 0,
      background: 'white',
      boxShadow: '0px 0px 4px rgba(0,0,0,0.15)',
      clipPath: 'inset(0px 0px 0px -15px)',
    },
  },
]

export const columnOrdersProcess: readonly TableColumn<TitleOrders>[] = [
  {
    id: 'order',
    label: 'STT',
    minWidth: 50,
    sticky: {
      position: 'sticky',
      left: 0,
      background: 'white',
      zIndex: 9,
      boxShadow: '-10px -10px 15px rgba(0,0,0,0.5)',
      clipPath: 'inset(0px -15px 0px 0px)',
    },
  },
  {
    id: 'cusAccount',
    label: 'Tài khoản đặt',
    minWidth: 170,
    link: (value: any) => (
      <Typography color={'primary'} sx={{ textDecorationLine: 'underline' }}>
        {value}
      </Typography>
    ),
  },
  {
    id: 'campGroundName',
    label: 'Tên điểm camp',
    minWidth: 170,
    link: (value: any) => (
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
        label={getOrderStatusSpec(value, 1).title}
        size="small"
        color={'default'}
      />
    ),
  },
  {
    id: 'adminNote',
    label: 'Ghi chú',
    minWidth: 170,
    align: 'center',
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
    minWidth: 100,
    align: 'right',
    action: (value?: any) => (
      <Typography variant="subtitle2" color="primary">
        {value === 0 ? 'Tiếp nhận' : 'Chi tiết'}
      </Typography>
    ),
    sticky: {
      position: 'sticky',
      right: 0,
      background: 'white',
      boxShadow: '0px 0px 4px rgba(0,0,0,0.15)',
      clipPath: 'inset(0px 0px 0px -15px)',
    },
  },
]

export const columnOrdersCancel: readonly TableColumn<TitleOrders>[] = [
  {
    id: 'order',
    label: 'STT',
    minWidth: 50,
    sticky: {
      position: 'sticky',
      left: 0,
      background: 'white',
      zIndex: 9,
      boxShadow: '-10px -10px 15px rgba(0,0,0,0.5)',
      clipPath: 'inset(0px -15px 0px 0px)',
    },
  },
  {
    id: 'cusAccount',
    label: 'Tài khoản đặt',
    minWidth: 170,
    link: (value: any) => (
      <Typography color={'primary'} sx={{ textDecorationLine: 'underline' }}>
        {value}
      </Typography>
    ),
  },
  {
    id: 'campGroundName',
    label: 'Tên điểm camp',
    minWidth: 170,
    link: (value: any) => (
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
    label: 'Trạng thái y/c huỷ',
    minWidth: 120,
    align: 'center',
    status: (value: any) => (
      <Chip
        label={getOrderStatusSpec(value, 3).title}
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
    minWidth: 100,
    align: 'right',
    action: (value?: any) => (
      <Typography variant="subtitle2" color="primary">
        {value === 0 ? 'Tiếp nhận' : 'Chi tiết'}
      </Typography>
    ),
    sticky: {
      position: 'sticky',
      right: 0,
      background: 'white',
      boxShadow: '0px 0px 4px rgba(0,0,0,0.15)',
      clipPath: 'inset(0px 0px 0px -15px)',
    },
  },
]

export const columnsOrderProcessesDetail: any = [
  { id: 'order', label: 'STT', minWidth: 50 },
  {
    id: 'action',
    label: 'Hành động',
    minWidth: 120,
    align: 'center',
  },
  {
    id: 'account',
    label: 'Người xử lý',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'status',
    label: 'Trạng thái xử lý',
    minWidth: 120,
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
    id: 'dateCreated',
    label: 'Thời gian',
    minWidth: 170,
    align: 'right',
    format: (value: string) => ISODateTimeFormatter(value),
  },
]

export const columnsLogsOrderDetail: any = [
  { id: 'order', label: 'STT', minWidth: 50 },
  {
    id: 'processName',
    label: 'Hành động',
    minWidth: 120,
    align: 'center',
  },
  {
    id: 'email',
    label: 'Người xử lý',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'requestStatus',
    label: 'Trạng thái xử lý',
    minWidth: 120,
    align: 'center',
    status: (value: any) => (
      <Chip label={value} size="small" color={'default'} />
    ),
  },
  {
    id: 'actionDate',
    label: 'Thời gian',
    minWidth: 170,
    align: 'right',
    format: (value: string) => ISODateTimeFormatter(value),
  },
]
