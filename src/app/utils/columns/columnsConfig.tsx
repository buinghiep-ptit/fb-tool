import { Chip, Tooltip, Typography } from '@mui/material'
import { TableColumn } from 'app/models'
import { TitleConfigs } from 'app/models/config'

export const columnsConfigs: readonly TableColumn<TitleConfigs>[] = [
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
    id: 'id_CONFIG',
    label: 'id_CONFIG',
    minWidth: 200,
    format: (value: any) => (
      <Tooltip placement="bottom-start" arrow title={value}>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
            px: 1,
          }}
        >
          {value}
        </Typography>
      </Tooltip>
    ),
  },
  {
    id: 'str_VALUE',
    label: 'Giá trị',
    minWidth: 200,
    format: (value: any) =>
      value ? (
        <Tooltip placement="bottom-start" arrow title={value}>
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
              px: 1,
            }}
          >
            {value}
          </Typography>
        </Tooltip>
      ) : (
        <></>
      ),
  },
  {
    id: 'str_DESCRIPTION',
    label: 'Mô tả',
    minWidth: 200,
    format: (value: any) =>
      value ? (
        <Tooltip placement="bottom-start" arrow title={value}>
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
              px: 1,
            }}
          >
            {value}
          </Typography>
        </Tooltip>
      ) : (
        <></>
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
    label: 'Hành động',
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
