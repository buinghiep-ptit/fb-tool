import { Chip, Icon, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { TableColumn, TitleEvents } from 'app/models'

export const columnsEvents: readonly TableColumn<TitleEvents>[] = [
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
    id: 'mediaUrl',
    label: 'Ảnh/Video',
    minWidth: 100,
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
          border: '1px solid #D9D9D9',
          backgroundColor: '#EEEEEE',
          p: 0.25,
          ml: 1,
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
            objectFit: 'cover',
            borderRadius: 4,
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
    minWidth: 200,
    align: 'left',
    action: (value: any) => (
      <Typography
        color={'primary'}
        sx={{ textDecorationLine: 'underline', pl: 1 }}
      >
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
    minWidth: 250,
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
    minWidth: 75,
    align: 'center',
    action: (value: any) => (
      <MuiSwitch
        checked={value === 1 ? true : false}
        sx={{ justifyContent: 'center', fontSize: '16px!important' }}
      />
    ),
    // sticky: {
    //   position: 'sticky',
    //   right: 80,
    //   background: 'white',
    //   boxShadow: '0px 0px 4px rgba(0,0,0,0.15)',
    //   clipPath: 'inset(0px 0px 0px -15px)',
    // },
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
