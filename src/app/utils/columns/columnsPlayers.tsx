import { DeleteSharp, EditOutlined } from '@mui/icons-material'
import { Chip, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { TableColumn, TitleServices } from 'app/models'
import { LabelFormatter } from '../formatters/labelFormatter'

export const columnsPlayers: readonly TableColumn<TitleServices>[] = [
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
    id: 'priority',
    label: '',
    minWidth: 5,
    align: 'center',
  },
  {
    id: 'name',
    label: 'Tên cầu thủ',
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
    id: 'position',
    label: 'Vị trí',
    minWidth: 200,
    align: 'left',
  },
  {
    id: 'idTeam',
    label: 'Đội thi đấu',
    minWidth: 80,
    align: 'center',
  },
  {
    id: 'dateOfBirth',
    label: 'Ngày sinh',
    minWidth: 80,
    align: 'center',
  },
  {
    id: 'height',
    label: 'Chiều cao',
    minWidth: 80,
    align: 'center',
  },
  {
    id: 'dateJoined',
    label: 'Ngày tham gia',
    minWidth: 80,
    align: 'center',
  },
  {
    id: 'status',
    label: 'Trạng thái',
    minWidth: 100,
    align: 'center',
    action: (value: any) => <Chip label="Hoạt động" color="success" />,
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

// export const headTablePlayer = [
//   {
//     name: 'STT',
//     width: '60px',
//   },
//   {
//     name: '',
//     width: '5px',
//   },
//   {
//     name: 'Tên cầu thủ',
//     width: '200px',
//   },
//   {
//     name: 'Vị trí',
//     width: '150px',
//   },
//   {
//     name: 'Đội thi đấu',
//     width: '150px',
//   },
//   {
//     name: 'Ngày sinh',
//     width: '120px',
//   },
//   {
//     name: 'Chiều cao (cm)',
//     width: '200px',
//   },
//   {
//     name: 'Ngày tham gia CAHN',
//     width: '200px',
//   },
//   {
//     name: 'Trang thái',
//     width: '100px',
//   },
//   {
//     name: 'Hành động',
//     width: '100px',
//   },
// ]
