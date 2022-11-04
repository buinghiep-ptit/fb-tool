import { Chip, Tooltip, Typography } from '@mui/material'
import { TableColumn } from 'app/models'
import { TitleHandbooks } from 'app/models/handbook'
import { CurrencyFormatter } from '../formatters/currencyFormatter'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'

export const columnsHandbooks: readonly TableColumn<TitleHandbooks>[] = [
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
    id: 'title',
    label: 'Tiêu đề',
    minWidth: 200,
    align: 'center',
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
    id: 'userName',
    label: 'Người đăng',
    minWidth: 200,
    align: 'center',
    format: (value: number) => (
      <Typography
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: '1',
          WebkitBoxOrient: 'vertical',
          pl: 1,
        }}
      >
        {value}
      </Typography>
    ),
  },
  {
    id: 'status',
    label: 'Trạng thái',
    minWidth: 60,
    align: 'center',
    status: (value: any) => (
      <Chip
        label={value === 1 ? 'Hoạt động' : 'Khoá'}
        size="small"
        color={value === 1 ? 'primary' : 'error'}
      />
    ),
  },
  {
    id: 'amountLinkedCampGround',
    label: 'Số lượng điểm camp',
    minWidth: 200,
    align: 'center',
    format: (value: number) =>
      value ? (
        <Typography color={'primary'}>{CurrencyFormatter(value, 2)}</Typography>
      ) : (
        <></>
      ),
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
