import { Chip, Stack } from '@mui/material'
import { toastWarning } from 'app/helpers/toastNofication'
import { useCountdown } from 'app/hooks/useCountDown'
import { MuiTypography } from './MuiTypography'

export interface Props {
  targetDate?: number
  callBack?: () => void
}

export function CountdownTimer({ targetDate = 0, callBack }: Props) {
  const [days, hours, minutes, seconds] = useCountdown(targetDate)

  if (days + hours + minutes + seconds <= 0) {
    toastWarning({
      message: 'Đã hết thời gian 30 phút, các feed chưa xử lý sẽ được gắn cờ',
    })
    // callBack()
    return <></>
  } else {
    return (
      <Stack
        flexDirection={'row'}
        justifyContent="center"
        alignItems={'center'}
        gap={1}
      >
        <MuiTypography variant="subtitle1" color="error">
          Đếm ngược
        </MuiTypography>
        <Chip
          label={`${minutes < 10 ? '0' + minutes : minutes}phút ${
            seconds < 10 ? '0' + seconds : seconds
          }giây`}
          sx={{ fontSize: '1rem' }}
          size="medium"
          color={'warning'}
        />
      </Stack>
    )
  }
}
