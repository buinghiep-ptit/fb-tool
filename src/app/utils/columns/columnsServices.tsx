import { DeleteSharp, EditOutlined } from '@mui/icons-material'
import { Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { TableColumn, TitleServices } from 'app/models'
import { LabelFormatter } from '../formatters/labelFormatter'

export const columnsServices: readonly TableColumn<TitleServices>[] = [
  {
    id: 'order',
    label: 'STT',
    minWidth: 50,
    align: 'center',
    sticky: {
      position: 'sticky',
      left: 0,
      background: 'white',
      zIndex: 9,
    },
  },
  {
    id: 'image',
    label: 'Hình ảnh',
    minWidth: 100,
    width: 120,
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
    label: 'Tên dịch vụ',
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
    id: 'rentalType',
    label: 'Loại dịch vụ',
    minWidth: 170,
    align: 'center',
    format: (value: number) => LabelFormatter(value, 'rentalType'),
  },
  {
    id: 'campGroundName',
    label: 'Địa điểm Camp',
    minWidth: 200,
    align: 'left',
  },
  {
    id: 'capacity',
    label: 'Áp dụng',
    minWidth: 80,
    align: 'center',
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
