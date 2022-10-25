import { DeleteSharp, EditOutlined } from '@mui/icons-material'
import { Chip, Icon, IconButton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { TableColumn, TitleEvents } from 'app/models'
import {
  DDMMYYYYFormatter,
  ISODateTimeFormatter,
} from '../formatters/dateTimeFormatters'

export const columnsEvents: readonly TableColumn<TitleEvents>[] = [
  { id: 'order', label: 'STT', minWidth: 50 },
  {
    id: 'mediaUrl',
    label: 'Ảnh/Video',
    minWidth: 150,
    align: 'center',
    media: (value: string) => (
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: 'auto 16 / 9',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={
            value ??
            'https://i.pinimg.com/564x/44/15/ba/4415ba5df0f4bfcee5893d6c441577e0.jpg'
          }
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'scale-down',
          }}
          loading="lazy"
          alt="bg"
        />
      </Box>
    ),
  },
  {
    id: 'name',
    label: 'Tên sự kiện',
    minWidth: 170,
    align: 'left',
    action: (value: any) => (
      <Typography color={'primary'} sx={{ textDecorationLine: 'underline' }}>
        {value}
      </Typography>
    ),
  },
  {
    id: 'dateActive',
    label: 'Thời gian diễn ra',
    minWidth: 200,
    align: 'center',
  },
  {
    id: 'tags',
    label: 'Hashtag',
    minWidth: 170,
    align: 'left',
    format: (values: any) => {
      return (
        <Box
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {values.map((val: any) => (
            <Chip
              key={val.id}
              label={`#${val.value}`}
              size="small"
              color={'default'}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      )
    },
  },
  {
    id: 'status',
    label: 'Trạng thái',
    minWidth: 100,
    align: 'center',
    action: (value: any) => (
      <MuiSwitch
        checked={value === 1 ? true : false}
        sx={{ justifyContent: 'flex-end' }}
      />
    ),
  },
  {
    id: 'edit',
    label: '',
    minWidth: 50,
    align: 'right',
    action: (value: any) => <Icon color="secondary">edit_calendar</Icon>,
  },
  {
    id: 'delete',
    label: '',
    minWidth: 50,
    align: 'right',
    action: (value: any) => <Icon color="error">delete</Icon>,
  },
]
