import { Chip, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { TableColumn, TitleActionsHistory } from 'app/models'
import { TitleRateReports, TitleRating } from 'app/models/rating'
import { ISODateTimeFormatter } from '../formatters/dateTimeFormatters'

const getColorByStarNum = (num?: number) => {
  switch (num) {
    case 1:
      return 'default'

    case 2:
      return 'default'
    case 3:
      return 'warning'
    case 4:
      return 'warning'
    case 5:
      return 'primary'

    default:
      return 'default'
  }
}

export const columnsBase: readonly TableColumn<TitleRating>[] = [
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
    id: 'customer',
    label: 'Tài khoản',
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
    id: 'name',
    label: 'Điểm Camp',
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
    id: 'rating',
    label: 'Số sao',
    minWidth: 60,
    align: 'center',
    status: (value: any) => (
      <Chip label={value} size="small" color={getColorByStarNum(value ?? 0)} />
    ),
  },
  {
    id: 'comment',
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
    id: 'imgUrl',
    label: 'Ảnh',
    minWidth: 100,
    width: 120,
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
]

export const columnsRatingAll: readonly TableColumn<TitleRating>[] = [
  ...columnsBase,
  {
    id: 'dateCreated',
    label: 'Thời gian nhận xét',
    minWidth: 170,
    align: 'center',
    format: (value: string) => ISODateTimeFormatter(value),
  },
  {
    id: 'status',
    label: 'Thao tác',
    minWidth: 80,
    align: 'center',
    action: (value: any) => (
      <MuiSwitch
        checked={value === 1 ? true : false}
        sx={{ justifyContent: 'center', fontSize: '16px!important' }}
      />
    ),
    sticky: {
      position: 'sticky',
      right: 0,
      background: 'white',
      boxShadow: '0px 0px 4px rgba(0,0,0,0.15)',
      clipPath: 'inset(0px 0px 0px -15px)',
    },
  },
]

export const columnsRatingReported: readonly TableColumn<TitleRating>[] = [
  ...columnsBase,
  {
    id: 'reportedNum',
    label: 'Số người báo cáo',
    minWidth: 80,
    align: 'center',
  },
  {
    id: 'dateCreated',
    label: 'Thời gian báo cáo vi phạm',
    minWidth: 170,
    align: 'center',
    format: (value: string) => ISODateTimeFormatter(value),
  },
  {
    id: 'actions',
    label: 'Thao tác',
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

export const columnsRateDetailReports: readonly TableColumn<TitleRateReports>[] =
  [
    { id: 'order', label: 'STT', minWidth: 50, align: 'center' },
    {
      id: 'customer',
      label: 'Tài khoản báo cáo vi phạm',
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
      id: 'reason',
      label: 'Nội dung',
      minWidth: 170,
      align: 'center',
    },
    {
      id: 'status',
      label: 'Trạng thái',
      minWidth: 100,
      align: 'center',
      status: (value: any) => (
        <Chip
          label={value === 1 ? 'Đã xử lý' : 'Chưa xử lý'}
          size="small"
          color={value === 1 ? 'primary' : 'default'}
        />
      ),
    },

    {
      id: 'dateCreated',
      label: 'Thời gian báo cáo',
      minWidth: 170,
      align: 'right',
      format: (value: string) => (value ? ISODateTimeFormatter(value) : null),
    },
  ]

export const columnsRateDetailActionsHistory: readonly TableColumn<TitleActionsHistory>[] =
  [
    { id: 'order', label: 'STT', minWidth: 50, align: 'center' },
    { id: 'processName', label: 'Hành động', minWidth: 170 },
    {
      id: 'email',
      label: 'Người xử lý',
      minWidth: 170,
      align: 'center',
    },
    {
      id: 'note',
      label: 'Ghi chú',
      minWidth: 170,
      align: 'center',
    },
    {
      id: 'actionDate',
      label: 'Thời gian',
      minWidth: 170,
      align: 'right',
      format: (value: string) => (value ? ISODateTimeFormatter(value) : null),
    },
  ]
