import { Typography } from '@mui/material'
import { TableColumn, TitleFeeds } from 'app/models'

export const columnFeeds: readonly TableColumn<TitleFeeds>[] = [
  { id: 'order', label: 'STT', minWidth: 50 },
  { id: 'productName', label: 'productName', minWidth: 170 },
  {
    id: 'productLogo',
    label: 'productLogo',
    minWidth: 170,
    align: 'center',
  },
  // {
  //   id: 'description',
  //   label: 'description',
  //   minWidth: 170,
  //   align: 'center',
  // },
  {
    id: 'slugName',
    label: 'slugName',
    minWidth: 170,
    align: 'center',
    //   format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'price',
    label: 'price',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'priceSale',
    label: 'priceSale',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'action',
    label: 'action',
    minWidth: 170,
    align: 'right',
    action: () => (
      <Typography
        variant="subtitle2"
        color="primary"
        sx={{ textAlign: 'center' }}
      >
        Chi tiết | Duyệt | Vi phạm
      </Typography>
    ),
  },
]
