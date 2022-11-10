import { Chip, Tooltip, Typography } from '@mui/material'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { TableColumn } from 'app/models'
import { TitleCampgrounds } from 'app/models/camp'
import { TooltipText } from './columnsEvents'

export const columnsCampgroundsPolicy: readonly TableColumn<TitleCampgrounds>[] =
  [
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
      id: 'name',
      label: 'Tên địa điểm camping',
      minWidth: 200,
      link: (value: string) => (
        <TooltipText text={value} underline maxLines={1} color="primary" />
      ),
    },
    {
      id: 'address',
      label: 'Địa chỉ',
      minWidth: 200,
      align: 'left',
      action: (value: number) => (
        <Tooltip placement="bottom-start" arrow title={value}>
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      id: 'status',
      label: 'Trạng thái',
      minWidth: 80,
      align: 'center',
      status: (value: any) => (
        <Chip
          label={value === 1 ? 'Hoạt động' : 'Không hoạt động'}
          size="medium"
          color={value === 1 ? 'primary' : 'default'}
        />
      ),
    },
    {
      id: 'actions',
      label: '',
      minWidth: 80,
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
