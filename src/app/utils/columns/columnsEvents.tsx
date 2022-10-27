import { Chip, Icon, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { TableColumn, TitleEvents } from 'app/models'

export const columnsEvents: readonly TableColumn<TitleEvents>[] = [
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
      boxShadow: '-10px -10px 15px rgba(0,0,0,0.5)',
      clipPath: 'inset(0px -15px 0px 0px)',
    },
  },
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
        sx={{ justifyContent: 'center' }}
      />
    ),
    sticky: {
      position: 'sticky',
      right: 100,
      background: 'white',
      boxShadow: '0px 0px 4px rgba(0,0,0,0.15)',
      clipPath: 'inset(0px 0px 0px -15px)',
    },
  },
  {
    id: 'edit',
    label: '',
    minWidth: 50,
    align: 'right',
    action: (value: any) => <Icon color="secondary">edit_calendar</Icon>,
    sticky: {
      position: 'sticky',
      right: 50,
      background: 'white',
    },
  },
  {
    id: 'delete',
    label: '',
    minWidth: 50,
    align: 'right',
    action: (value: any) => <Icon color="error">delete</Icon>,
    sticky: {
      position: 'sticky',
      right: 0,
      background: 'white',
    },
  },
]
