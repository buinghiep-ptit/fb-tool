import { Icon, IconButton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { getReturnValues } from 'app/hooks/useCountDown'
import { TableColumn } from 'app/models'
import { TitleAudios } from 'app/models/audio'

export const columnsAudios: readonly TableColumn<TitleAudios>[] = [
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
    id: 'urlImage',
    label: 'Hình',
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
          src={value ?? '/assets/images/app/image-default.png'}
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
    label: 'Tên bài hát',
    minWidth: 200,
    action: (value: any) => (
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
    id: 'performer',
    label: 'Người thể hiện',
    minWidth: 150,
    align: 'left',
    format: (value: number) => (
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
    ),
  },
  {
    id: 'author',
    label: 'Tác giả',
    minWidth: 150,
    align: 'left',
    format: (value: number) => (
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
    ),
  },
  {
    id: 'duration',
    label: 'Thời lượng',
    minWidth: 120,
    align: 'center',
    format: (value: string) => {
      const times = getReturnValues(Number(value) * 1000 ?? 0)
      const minutes = times[2]
        ? times[2] < 10
          ? '0' + times[2]
          : times[2]
        : '00'
      const seconds = times[3]
        ? times[3] < 10
          ? '0' + times[3]
          : times[3]
        : '00'
      return (
        <MuiTypography fontWeight={500}>
          {minutes + ':' + seconds}
        </MuiTypography>
      )
    },
  },
  {
    id: 'status',
    label: 'Trạng thái',
    minWidth: 80,
    align: 'center',
    status: (value: any) => (
      <MuiSwitch
        checked={value === 1 ? true : false}
        sx={{ justifyContent: 'center', fontSize: '16px!important' }}
      />
    ),
  },
  {
    id: 'isDefault',
    label: 'Nhạc hay',
    minWidth: 80,
    align: 'center',
    status: (value: any) => (
      <MuiSwitch
        checked={value === 1 ? true : false}
        sx={{ justifyContent: 'center', fontSize: '16px!important' }}
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
