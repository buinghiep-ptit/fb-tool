import { Tooltip, Typography } from '@mui/material'
import { TableColumn } from 'app/models'
import { TitleCampgrounds } from 'app/models/camp'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'

export const columnsUnlinkedCampgrounds: readonly TableColumn<TitleCampgrounds>[] =
  [
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
      id: 'campAreaName',
      label: 'Tên địa điểm camping',
      minWidth: 200,
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
      id: 'campGroundName',
      label: 'Địa danh',
      minWidth: 200,
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
