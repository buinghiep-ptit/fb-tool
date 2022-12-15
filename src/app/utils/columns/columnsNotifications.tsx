import { Chip, Stack, Tooltip, Typography } from '@mui/material'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { TableColumn } from 'app/models'
import { TitleNotifications } from 'app/models/notification'
import moment from 'moment'
import { labelNotificationStatus } from '../formatters/labelFormatter'

export const columnsNotifications: readonly TableColumn<TitleNotifications>[] =
  [
    {
      id: 'order',
      label: 'STT',
      minWidth: 50,
      format: (value: number) => (
        <Tooltip
          arrow
          title={value}
          disableHoverListener={value >= 1000 ? false : true}
        >
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
        </Tooltip>
      ),
      sticky: {
        position: 'sticky',
        left: 0,
        background: 'white',
        zIndex: 9,
      },
    },
    {
      id: 'title',
      label: 'Tiêu đề',
      minWidth: 200,
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
              fontStyle: 'italic',
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
      id: 'scope',
      label: 'Phạm vi',
      minWidth: 80,
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
      id: 'srcType',
      label: 'Liên kết với',
      minWidth: 120,
      align: 'center',
      format: (value: any) => value,
    },
    {
      id: 'dateUpdated',
      label: 'Thời gian cập nhật',
      minWidth: 150,
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
      id: 'lastSendDate',
      label: 'Thời gian gửi',
      minWidth: 120,
      align: 'center',
      format: (value: string) =>
        value ? (
          <Stack>
            <MuiTypography fontWeight={500}>
              {moment(value).format('DD/MM/YYYY')}
            </MuiTypography>
            <MuiTypography variant="body2" fontSize={'0.75rem'}>
              {moment(value).format('(HH:mm:ss)')}
            </MuiTypography>
          </Stack>
        ) : (
          <></>
        ),
    },
    {
      id: 'lastModifiedBy',
      label: 'Người gửi',
      minWidth: 200,
      align: 'center',
      format: (value: any) => (
        <Tooltip arrow title={value}>
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
        </Tooltip>
      ),
    },
    {
      id: 'status',
      label: 'Trạng thái',
      minWidth: 120,
      align: 'center',
      // status: (value: any) => LabelFormatter(value, 'feed'),
      status: (value: any) =>
        value !== null ? (
          <Chip
            label={labelNotificationStatus(value).title}
            size="small"
            sx={{
              color: labelNotificationStatus(value).textColor,
              bgcolor: labelNotificationStatus(value).bgColor,
            }}
          />
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

export const columnsNotificationsHeadPage: readonly TableColumn<TitleNotifications>[] =
  [
    {
      id: 'order',
      label: 'STT',
      minWidth: 50,
      format: (value: number) => (
        <Tooltip
          arrow
          title={value}
          disableHoverListener={value >= 1000 ? false : true}
        >
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
        </Tooltip>
      ),
      sticky: {
        position: 'sticky',
        left: 0,
        background: 'white',
        zIndex: 9,
      },
    },
    {
      id: 'title',
      label: 'Tiêu đề',
      minWidth: 200,
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
              fontStyle: 'italic',
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
      id: 'scope',
      label: 'Phạm vi',
      minWidth: 80,
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
      id: 'srcType',
      label: 'Liên kết với',
      minWidth: 120,
      align: 'center',
      format: (value: any) => value,
    },
    {
      id: 'dateUpdated',
      label: 'Thời gian cập nhật',
      minWidth: 150,
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
      id: 'lastSendDate',
      label: 'Thời gian gửi',
      minWidth: 120,
      align: 'center',
      format: (value: string) =>
        value ? (
          <Stack>
            <MuiTypography fontWeight={500}>
              {moment(value).format('DD/MM/YYYY')}
            </MuiTypography>
            <MuiTypography variant="body2" fontSize={'0.75rem'}>
              {moment(value).format('(HH:mm:ss)')}
            </MuiTypography>
          </Stack>
        ) : (
          <></>
        ),
    },
    {
      id: 'lastModifiedBy',
      label: 'Người gửi',
      minWidth: 200,
      align: 'center',
      format: (value: any) => (
        <Tooltip arrow title={value}>
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
        </Tooltip>
      ),
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
