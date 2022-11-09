import { Chip, Stack, Tooltip, Typography } from '@mui/material'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { TableColumn } from 'app/models'
import { TitleOrders } from 'app/models/order'
import moment from 'moment'
import { getOrderStatusSpec } from '../enums/order'
import { CurrencyFormatter } from '../formatters/currencyFormatter'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'
import { TooltipText } from './columnsEvents'

export const columnOrdersOverall: readonly TableColumn<TitleOrders>[] = [
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
    id: 'cusAccount',
    label: 'Tài khoản đặt',
    minWidth: 120,
    link: (value: any) => (
      <Tooltip arrow title={value}>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
            textDecorationLine: 'underline',
          }}
          color={'primary'}
        >
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    id: 'campGroundName',
    label: 'Tên điểm camp',
    minWidth: 150,
    link: (value: any) => (
      <Tooltip arrow title={value}>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
            textDecorationLine: 'underline',
          }}
          color={'primary'}
        >
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    id: 'campGroundRepresent',
    label: 'Chủ camp',
    minWidth: 120,
    align: 'center',
    link: (value: any) => (
      <Tooltip arrow title={value}>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
            textDecorationLine: 'underline',
          }}
          color={'primary'}
        >
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    id: 'amount',
    label: 'Giá trị đơn (VNĐ)',
    minWidth: 120,
    align: 'center',
    format: (value: number) =>
      value ? (
        <Typography color={'primary'}>{CurrencyFormatter(value, 2)}</Typography>
      ) : (
        <></>
      ),
  },
  {
    id: 'paymentAmnt',
    label: 'Giá trị cọc (VNĐ)',
    minWidth: 120,
    align: 'center',
    format: (value: number) =>
      value ? (
        <Typography color={'primary'}>{CurrencyFormatter(value, 2)}</Typography>
      ) : (
        <></>
      ),
  },
  {
    id: 'dateCreated',
    label: 'Thời gian đặt',
    minWidth: 100,
    align: 'center',
    format: (value: string) => (
      <Stack>
        <MuiTypography fontWeight={500}>
          {moment(value).format('DD/MM/YYYY')}
        </MuiTypography>
        <MuiTypography variant="body2" fontSize={'0.75rem'}>
          {moment(value).format('(HH:mm:ss)')}
        </MuiTypography>
      </Stack>
    ),
  },
  {
    id: 'status',
    label: 'Trạng thái đơn',
    minWidth: 100,
    align: 'center',
    status: (value: any) =>
      value !== null ? (
        <Chip
          label={getOrderStatusSpec(value, 2).title}
          size="small"
          sx={{
            color: getOrderStatusSpec(value, 2).textColor,
            bgcolor: getOrderStatusSpec(value, 2).bgColor,
          }}
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
          sx={{
            color: getOrderStatusSpec(value, 3).textColor,
            bgcolor: getOrderStatusSpec(value, 3).bgColor,
          }}
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
    minWidth: 90,
    align: 'center',
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
    minWidth: 40,
    align: 'center',
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
    minWidth: 120,
    link: (value: any) => (
      <Tooltip arrow title={value}>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
            textDecorationLine: 'underline',
          }}
          color={'primary'}
        >
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    id: 'campGroundName',
    label: 'Tên điểm camp',
    minWidth: 150,
    link: (value: any) => (
      <Tooltip arrow title={value}>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
            textDecorationLine: 'underline',
          }}
          color={'primary'}
        >
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    id: 'campGroundRepresent',
    label: 'Chủ camp',
    minWidth: 120,
    align: 'center',
    link: (value: any) => (
      <Tooltip arrow title={value}>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
            textDecorationLine: 'underline',
          }}
          color={'primary'}
        >
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    id: 'amount',
    label: 'Tổng thực tế (VNĐ)',
    minWidth: 150,
    align: 'center',
    format: (value: number) =>
      value ? (
        <Typography color={'primary'}>{CurrencyFormatter(value, 2)}</Typography>
      ) : (
        <></>
      ),
  },
  // {
  //   id: 'paymentAmnt',
  //   label: 'Đã thanh toán',
  //   minWidth: 120,
  //   align: 'center',
  //   format: (value: number) =>
  //     value ? (
  //       <Typography color={'primary'}>{CurrencyFormatter(value, 2)}</Typography>
  //     ) : (
  //       <></>
  //     ),
  // },
  {
    id: 'dateCreated',
    label: 'Thời gian đặt',
    minWidth: 120,
    align: 'center',
    format: (value: string) => (
      <Stack>
        <MuiTypography fontWeight={500}>
          {moment(value).format('DD/MM/YYYY')}
        </MuiTypography>
        <MuiTypography variant="body2" fontSize={'0.75rem'}>
          {moment(value).format('(HH:mm:ss)')}
        </MuiTypography>
      </Stack>
    ),
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
        sx={{
          color: getOrderStatusSpec(value, 1).textColor,
          bgcolor: getOrderStatusSpec(value, 1).bgColor,
        }}
      />
    ),
  },
  {
    id: 'adminNote',
    label: 'Ghi chú',
    minWidth: 170,
    format: (value: any) => (
      <TooltipText text={value} underline={false} maxLines={2} />
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
    minWidth: 90,
    align: 'center',
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
    minWidth: 40,
    align: 'center',
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
    minWidth: 120,
    link: (value: any) => (
      <Tooltip arrow title={value}>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
            textDecorationLine: 'underline',
          }}
          color={'primary'}
        >
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    id: 'campGroundName',
    label: 'Tên điểm camp',
    minWidth: 150,
    link: (value: any) => (
      <Tooltip arrow title={value}>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
            textDecorationLine: 'underline',
          }}
          color={'primary'}
        >
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    id: 'campGroundRepresent',
    label: 'Chủ camp',
    minWidth: 120,
    align: 'center',
    link: (value: any) => (
      <Tooltip arrow title={value}>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
            textDecorationLine: 'underline',
          }}
          color={'primary'}
        >
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    id: 'amount',
    label: 'Tổng thực tế (VNĐ)',
    minWidth: 150,
    align: 'center',
    format: (value: number) =>
      value !== null ? (
        <Typography color={'primary'}>{CurrencyFormatter(value, 2)}</Typography>
      ) : (
        <></>
      ),
  },
  {
    id: 'paymentAmnt',
    label: 'Đã thanh toán (VNĐ)',
    minWidth: 150,
    align: 'center',
    format: (value: number) =>
      value ? (
        <Typography color={'primary'}>{CurrencyFormatter(value, 2)}</Typography>
      ) : (
        <></>
      ),
  },
  {
    id: 'dateCreated',
    label: 'Thời gian đặt',
    minWidth: 100,
    align: 'center',
    format: (value: string) => (
      <Stack>
        <MuiTypography fontWeight={500}>
          {moment(value).format('DD/MM/YYYY')}
        </MuiTypography>
        <MuiTypography variant="body2" fontSize={'0.75rem'}>
          {moment(value).format('(HH:mm:ss)')}
        </MuiTypography>
      </Stack>
    ),
  },
  {
    id: 'status',
    label: 'Trạng thái y/c huỷ',
    minWidth: 100,
    align: 'center',
    status: (value: any) => (
      <Chip
        label={getOrderStatusSpec(value, 3).title}
        size="small"
        sx={{
          color: getOrderStatusSpec(value, 3).textColor,
          bgcolor: getOrderStatusSpec(value, 3).bgColor,
        }}
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
    minWidth: 90,
    align: 'center',
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
  { id: 'order', label: 'STT', minWidth: 50, align: 'center' },
  // {
  //   id: 'action',
  //   label: 'Hành động',
  //   minWidth: 120,
  //   align: 'center',
  // },
  {
    id: 'account',
    label: 'Người xử lý',
    minWidth: 170,
    action: (value: any) => <TooltipText text={value} />,
  },
  {
    id: 'status',
    label: 'Trạng thái đơn hàng',
    minWidth: 120,
    align: 'center',
    status: (value: any) =>
      value !== null ? (
        <Chip
          label={getOrderStatusSpec(value, 2).title}
          size="small"
          sx={{
            color: getOrderStatusSpec(value, 2).textColor,
            bgcolor: getOrderStatusSpec(value, 2).bgColor,
          }}
        />
      ) : (
        <></>
      ),
  },
  {
    id: 'dateCreated',
    label: 'Thời gian',
    minWidth: 170,
    align: 'center',
    format: (value: string) => ISODateTimeFormatter(value),
  },
]

export const columnsLogsOrderDetail: any = [
  { id: 'order', label: 'STT', minWidth: 50, align: 'center' },
  {
    id: 'processName',
    label: 'Hành động',
    minWidth: 170,
  },
  {
    id: 'email',
    label: 'Người thực hiện',
    minWidth: 170,
  },
  {
    id: 'note',
    label: 'Ghi chú',
    minWidth: 200,
    format: (value: any) => (
      <TooltipText text={value} underline={false} maxLines={2} />
    ),
  },
  {
    id: 'actionDate',
    label: 'Thời gian',
    minWidth: 170,
    align: 'center',
    format: (value: string) => ISODateTimeFormatter(value),
  },
]
