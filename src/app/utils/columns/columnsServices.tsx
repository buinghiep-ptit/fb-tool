import { DeleteSharp, EditOutlined } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { TableColumn, TitleServices } from 'app/models'
import { LabelFormatter } from '../formatters/labelFormatter'

export const columnsServices: readonly TableColumn<TitleServices>[] = [
  { id: 'order', label: 'STT', minWidth: 50 },
  {
    id: 'image',
    label: 'Hình ảnh',
    minWidth: 150,
    media: (value: string) => (
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          aspectRatio: 'auto 16 / 9',
          borderRadius: 1,
        }}
      >
        <img
          src={
            value ??
            'https://i.pinimg.com/originals/14/db/30/14db306602b53cf9ccca3a2a1031e7f7.jpg'
          }
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
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
    minWidth: 170,
    align: 'left',
    action: (value: any) => (
      <Typography color={'primary'} sx={{ textDecorationLine: 'underline' }}>
        {value}
      </Typography>
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
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'capacity',
    label: 'Áp dụng',
    minWidth: 170,
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
        sx={{ justifyContent: 'flex-end' }}
      />
    ),
  },
  {
    id: 'edit',
    label: '',
    minWidth: 50,
    align: 'right',
    action: (value: any) => <EditOutlined />,
  },
  {
    id: 'delete',
    label: '',
    minWidth: 50,
    align: 'right',
    action: (value: any) => <DeleteSharp />,
  },
]
