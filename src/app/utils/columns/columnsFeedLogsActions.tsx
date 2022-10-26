import { TableColumn, TitleActionsHistory } from 'app/models'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'

export const columnsFeedLogsActions: readonly TableColumn<TitleActionsHistory>[] =
  [
    { id: 'order', label: 'STT', minWidth: 50 },
    { id: 'processName', label: 'Hành động', minWidth: 170 },
    {
      id: 'email',
      label: 'Người xử lý',
      minWidth: 170,
      align: 'center',
    },
    {
      id: 'note',
      label: 'Ghi chú',
      minWidth: 170,
      align: 'center',
    },
    {
      id: 'actionDate',
      label: 'Thời gian',
      minWidth: 170,
      align: 'right',
      format: (value: string) => (value ? ISODateTimeFormatter(value) : null),
    },
  ]
