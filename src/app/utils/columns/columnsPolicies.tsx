import { Tooltip, Typography } from '@mui/material'
import { TableColumn } from 'app/models'
import { TitlePolicies } from 'app/models/policy'
import { CurrencyFormatter } from '../formatters/currencyFormatter'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'

export const columnsPolicies: readonly TableColumn<TitlePolicies>[] = [
  {
    id: 'order',
    label: 'STT',
    minWidth: 40,
    maxWidth: 50,
    align: 'center',
    sticky: {
      position: 'sticky',
      left: 0,
      background: 'white',
      zIndex: 9,
    },
  },
  {
    id: 'name',
    label: 'Tên chính sách',
    minWidth: 150,
    action: (value: any) => (
      <Tooltip arrow title={value}>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
          }}
          color={'primary'}
        >
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    id: 'scope',
    label: 'Phạm vi',
    minWidth: 80,
    align: 'center',
  },
  {
    id: 'amount',
    label: 'Giá trị',
    minWidth: 100,
    align: 'center',
    format: (value: number) =>
      value ? (
        <Typography color={'primary'}>{CurrencyFormatter(value, 2)}</Typography>
      ) : (
        <></>
      ),
  },
  {
    id: 'campGroundNames',
    label: 'Camps áp dụng',
    minWidth: 200,
    format: (value: number) => (
      <Typography
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
          pl: 1,
        }}
      >
        {value}
      </Typography>
    ),
  },
  {
    id: 'dateUpdated',
    label: 'Thời gian',
    minWidth: 170,
    align: 'center',
    format: (value: string) => ISODateTimeFormatter(value),
  },
  {
    id: 'actions',
    label: 'Hành động',
    minWidth: 60,
    align: 'center',
    sticky: {
      position: 'sticky',
      right: 0,
      background: 'white',
      boxShadow: '0px 0px 4px rgba(0,0,0,0.15)',
      clipPath: 'inset(0px 0px 0px -15px)',
    },
  },
]
