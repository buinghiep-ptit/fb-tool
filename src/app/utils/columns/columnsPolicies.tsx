import { Chip, Tooltip, Typography } from '@mui/material'
import { TableColumn } from 'app/models'
import { TitlePolicies } from 'app/models/policy'
import { CurrencyFormatter } from '../formatters/currencyFormatter'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'
import { TooltipText } from './columnsEvents'

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
    link: (value: any) => (
      <TooltipText text={value} underline maxLines={1} color="primary" />
    ),
  },
  {
    id: 'scope',
    label: 'Phạm vi',
    minWidth: 80,
    align: 'center',
    status: (value: any) => (
      <Chip
        label={value === 2 ? 'Riêng' : 'Chung'}
        size="medium"
        color={value === 2 ? 'primary' : 'warning'}
      />
    ),
  },
  {
    id: 'scaleAmount',
    label: '% Giao dịch',
    minWidth: 100,
    align: 'center',
    format: (value: number) =>
      value ? (
        <Typography color={'primary'}>{value.toFixed(2)}</Typography>
      ) : (
        <></>
      ),
  },
  {
    id: 'amountCampGrounds',
    label: 'Camp áp dụng',
    minWidth: 200,
    link: (value: number) =>
      value ? (
        <TooltipText
          text={`${value.toString()} điểm camp liên kết`}
          underline
          maxLines={1}
          color="primary"
        />
      ) : (
        <></>
      ),
  },
  {
    id: 'dateUpdated',
    label: 'Thời gian cập nhật',
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
