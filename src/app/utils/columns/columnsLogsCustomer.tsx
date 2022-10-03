import { TableColumn } from 'app/models'
import { ILogsActionCustomer } from 'app/models/account'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'

export const columnLogsCustomer: readonly TableColumn<ILogsActionCustomer>[] = [
  { id: 'order', label: 'STT', minWidth: 50 },
  { id: 'processName', label: 'Hành động', minWidth: 170 },
  {
    id: 'email',
    label: 'Người xử lý',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'note',
    label: 'Lý do',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'actionDate',
    label: 'Thời gian',
    minWidth: 170,
    align: 'right',
    format: (value: string) => ISODateTimeFormatter(value),
  },
]
