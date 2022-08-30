import { TableColumn, TitleFeeds } from 'app/models'

export const columnsFeedLogs: readonly TableColumn<TitleFeeds>[] = [
  { id: 'order', label: 'STT', minWidth: 50 },
  { id: 'action', label: 'Hành động', minWidth: 170 },
  {
    id: 'user',
    label: 'Người xử lý',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'status',
    label: 'Trạng thái xử lý',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'datePublished',
    label: 'Trạng thái xử lý',
    minWidth: 170,
    align: 'right',
    //   format: (value: number) => value.toLocaleString('en-US'),
  },
]
