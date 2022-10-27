import { Chip, Icon, IconButton, Stack, Typography } from '@mui/material'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { TableColumn, TitleFeeds } from 'app/models'
import moment from 'moment'
import { LabelFormatter } from '../formatters/labelFormatter'

export const columnFeeds: readonly TableColumn<TitleFeeds>[] = [
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
    id: 'account',
    label: 'Tài khoản',
    minWidth: 170,
    action: (value: any) => (
      <Typography color={'primary'} sx={{ textDecorationLine: 'underline' }}>
        {value}
      </Typography>
    ),
    sticky: {
      position: 'sticky',
      left: 40,
      background: 'white',
      zIndex: 9,
      boxShadow: '-10px -10px 15px rgba(0,0,0,0.5)',
      clipPath: 'inset(0px -15px 0px 0px)',
    },
  },
  {
    id: 'content',
    label: 'Nội dung',
    minWidth: 200,
    align: 'left',
    format: (value: number) => (
      <Typography
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
        }}
      >
        {value}
      </Typography>
    ),
  },
  {
    id: 'customerType',
    label: 'Loại TK',
    minWidth: 80,
    align: 'center',
    format: (value: number) => LabelFormatter(value, 'customerType'),
  },
  {
    id: 'dateCreated',
    label: 'Thời gian đăng',
    minWidth: 120,
    align: 'center',
    format: (value: string) => (
      <Stack>
        <MuiTypography fontWeight={500}>
          {moment(value).format('DD/MM/YYYY')}
        </MuiTypography>
        <MuiTypography variant="body2" fontSize={'0.75rem'}>
          {moment(value).format('(HH:mm:ss)')}
        </MuiTypography>
      </Stack>
    ),
  },
  {
    id: 'type',
    label: 'Thể loại',
    minWidth: 80,
    align: 'center',
    format: (value: any) => (
      <Chip
        label={value === 1 ? 'Video' : 'Ảnh'}
        size="small"
        color={value === 1 ? 'primary' : 'warning'}
        sx={{ m: 0.5 }}
      />
    ),
  },
  {
    id: 'status',
    label: 'Trạng thái',
    minWidth: 120,
    align: 'center',
    status: (value: any) => LabelFormatter(value, 'feed'),
  },
  {
    id: 'handler',
    label: 'Người tiếp nhận',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'reportedNum',
    label: 'Số BCVP',
    minWidth: 80,
    align: 'center',
  },
  {
    id: 'edit',
    label: '',
    minWidth: 30,
    align: 'right',
    action: () => (
      <IconButton size="small">
        <Icon color="primary" sx={{ fontSize: '20px !important' }}>
          east
        </Icon>
      </IconButton>
    ),
    sticky: {
      position: 'sticky',
      right: 60,
      background: 'white',
      boxShadow: '0px 0px 4px rgba(0,0,0,0.15)',
      clipPath: 'inset(0px 0px 0px -15px)',
    },
  },
  {
    id: 'approve',
    label: '',
    minWidth: 30,
    align: 'center',
    action: (status?: number) =>
      [-2, -1, 0].includes(status ?? 0) ? (
        <IconButton size="small">
          <Icon sx={{ fontSize: '20px !important' }}>checklist</Icon>
        </IconButton>
      ) : (
        <></>
      ),
    sticky: {
      position: 'sticky',
      right: 30,
      background: 'white',
    },
  },
  {
    id: 'violate',
    label: '',
    minWidth: 30,
    align: 'left',
    action: (status?: number) =>
      [-2, 0, 1].includes(status ?? 0) ? (
        <IconButton size="small">
          <Icon color="error" sx={{ fontSize: '20px !important' }}>
            report
          </Icon>
        </IconButton>
      ) : (
        <></>
      ),
    sticky: {
      position: 'sticky',
      right: 0,
      background: 'white',
    },
  },
]
