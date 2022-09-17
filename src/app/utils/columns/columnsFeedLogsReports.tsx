import { TableColumn, TitleReportsDecline } from 'app/models'
import { ISODateTimeFormatter } from '../formatters/dateTimeISOFormatter'

export const columnsFeedLogsReports: readonly TableColumn<TitleReportsDecline>[] =
  [
    { id: 'order', label: 'STT', minWidth: 50 },
    { id: 'reporter', label: 'Người tố cáo', minWidth: 170 },
    {
      id: 'reason',
      label: 'Nội dung tố cáo',
      minWidth: 170,
      align: 'center',
    },
    {
      id: 'status',
      label: 'Trạng thái tố cáo',
      minWidth: 170,
      align: 'center',
    },
    {
      id: 'reportDate',
      label: 'Thời gian tố cáo',
      minWidth: 170,
      align: 'right',
      format: (value: string) => (value ? ISODateTimeFormatter(value) : null),
    },
  ]
