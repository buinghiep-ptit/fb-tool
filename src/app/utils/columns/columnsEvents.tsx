import { Chip, Icon, Tooltip, Typography, TypographyProps } from '@mui/material'
import { Box, BoxProps } from '@mui/system'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { TableColumn, TitleEvents } from 'app/models'
import { ReactElement } from 'react'

type Props = {
  url?: string
} & BoxProps

export const BoxImage = ({
  url = '/assets/images/app/image-default.png',
  ...props
}: Props) => {
  return (
    <Box
      {...props}
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
        src={url ?? '/assets/images/app/image-default.png'}
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
  )
}

type TextProps = {
  text?: string
  underline?: boolean
  maxLines?: number
} & TypographyProps

export const TooltipText = ({
  text = '',
  underline = false,
  maxLines = 1,
  ...props
}: TextProps) => {
  return (
    <Tooltip
      arrow
      title={<span style={{ whiteSpace: 'pre-line' }}>{text}</span>}
      followCursor
    >
      <Typography
        {...props}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: maxLines.toString(),
          WebkitBoxOrient: 'vertical',
          textDecorationLine: underline ? 'underline' : 'none',
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  )
}

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
    width: 120,
    align: 'center',
    media: (value: string) => <BoxImage url={value} />,
  },
  {
    id: 'name',
    label: 'Tên sự kiện',
    minWidth: 200,
    align: 'left',
    action: (value: any) => (
      <Tooltip arrow title={value}>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
            textDecorationLine: 'underline',
          }}
          color={'primary'}
        >
          {value}
        </Typography>
      </Tooltip>
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
