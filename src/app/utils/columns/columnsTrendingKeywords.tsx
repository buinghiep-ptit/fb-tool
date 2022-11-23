import { Tooltip, Typography } from '@mui/material'
import { TableColumn } from 'app/models'
import { TitleKeywords } from 'app/models/keyword'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'

export const columnsTrendingKeywords: readonly TableColumn<TitleKeywords>[] = [
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
    id: 'word',
    label: 'Từ khoá',
    minWidth: 150,
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
    id: 'dateCreated',
    label: 'Thời gian thêm',
    minWidth: 170,
    align: 'center',
    format: (value: string) => ISODateTimeFormatter(value),
  },
  {
    id: 'createdBy',
    label: 'Người đăng',
    minWidth: 300,
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
