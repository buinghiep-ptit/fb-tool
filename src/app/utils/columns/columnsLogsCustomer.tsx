import { TableColumn } from 'app/models'
import { ILogsActionCustomer } from 'app/models/account'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'

export const columnLogsCustomer: readonly TableColumn<ILogsActionCustomer>[] = [
  { id: 'order', label: 'STT', minWidth: 50 },
  { id: 'processName', label: 'Hành động', minWidth: 170 },
  {
    id: 'email',
    label: 'Người thực hiện',
    minWidth: 150,
  },
  {
    id: 'note',
    label: 'Lý do',
    minWidth: 170,
  },
  {
    id: 'actionDate',
    label: 'Thời gian',
    minWidth: 170,
    align: 'right',
    format: (value: string) => ISODateTimeFormatter(value),
  },
]
