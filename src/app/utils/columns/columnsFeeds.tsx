import { Chip, Stack, Tooltip, Typography } from '@mui/material'
import { MuiTypography } from 'app/components/common/MuiTypography'
import {
  TableColumn,
  TitleCampAreas,
  TitleCampGrounds,
  TitleFeeds,
} from 'app/models'
import moment from 'moment'
import { CurrencyFormatter } from '../formatters/currencyFormatter'
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
    minWidth: 150,
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
    sticky: {
      position: 'sticky',
      left: 40,
      background: 'white',
      zIndex: 9,
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
          pl: 1,
        }}
      >
        {value}
      </Typography>
    ),
  },
  {
    id: 'customerType',
    label: 'Loại TK',
    minWidth: 120,
    align: 'center',
    format: (value: any) => value,
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
    format: (value: number) =>
      value ? (
        <Typography color={'primary'}>{CurrencyFormatter(value, 2)}</Typography>
      ) : (
        <></>
      ),
  },
  {
    id: 'likeNum',
    label: 'Lượt thích',
    minWidth: 80,
    align: 'center',
    format: (value: number) =>
      value ? (
        <Typography color={'primary'}>{CurrencyFormatter(value, 2)}</Typography>
      ) : (
        <></>
      ),
  },
  {
    id: 'viewNum',
    label: 'Lượt xem',
    minWidth: 80,
    align: 'center',
    format: (value: number) =>
      value ? (
        <Typography color={'primary'}>{CurrencyFormatter(value, 2)}</Typography>
      ) : (
        <></>
      ),
  },
  {
    id: 'commentNum',
    label: 'Comment',
    minWidth: 80,
    align: 'center',
    format: (value: number) =>
      value ? (
        <Typography color={'primary'}>{CurrencyFormatter(value, 2)}</Typography>
      ) : (
        <></>
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

export const columnsCampAreas: readonly TableColumn<TitleCampAreas>[] = [
  {
    id: 'order',
    label: 'STT',
    width: 50,
    align: 'center',
    sticky: {
      position: 'sticky',
      left: 0,
      background: 'white',
      zIndex: 9,
    },
  },
  {
    id: 'name',
    label: 'Địa danh',
    minWidth: 200,
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
    id: 'status',
    label: 'Trạng thái',
    width: 120,
    align: 'center',
    status: (value: any) => (
      <Chip
        label={value !== -1 ? 'Hoạt động' : 'Không hoạt động'}
        size="small"
        color={value !== -1 ? 'primary' : 'default'}
      />
    ),
  },

  {
    id: 'actions',
    label: 'Hành động',
    width: 80,
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

export const columnsCampgrounds: readonly TableColumn<TitleCampGrounds>[] = [
  {
    id: 'order',
    label: 'STT',
    width: 50,
    align: 'center',
    sticky: {
      position: 'sticky',
      left: 0,
      background: 'white',
      zIndex: 9,
    },
  },
  {
    id: 'name',
    label: 'Tên địa điểm camping',
    minWidth: 200,
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
    id: 'status',
    label: 'Trạng thái',
    width: 120,
    align: 'center',
    status: (value: any) => (
      <Chip
        label={value === 1 ? 'Hoạt động' : 'Không hoạt động'}
        size="small"
        color={value === 1 ? 'primary' : 'default'}
      />
    ),
  },
  {
    id: 'actions',
    label: 'Hành động',
    width: 80,
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
