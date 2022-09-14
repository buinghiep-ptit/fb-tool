import { Alert, Button, Snackbar } from '@mui/material'
import { amber, green } from '@mui/material/colors'
import { styled } from '@mui/system'
import { theme } from 'app/themes'
import React from 'react'

const ContentRoot = styled('div')(({ theme }) => ({
  '& .icon': { fontSize: 20 },
  '& .success': { backgroundColor: green[600] },
  '& .warning': { backgroundColor: amber[700] },
  '& .error': { backgroundColor: theme.palette.error.main },
  '& .info': { backgroundColor: theme.palette.primary.main },
  '& .iconVariant': { opacity: 0.9, marginRight: theme.spacing(1) },
  '& .message': { display: 'flex', alignItems: 'center' },
  '& .margin': { margin: theme.spacing(1) },
}))

export type SnackData = {
  open?: boolean
  status?: string
  message?: string
}

export interface Props {
  durations?: number
  data: SnackData
  setSnackBar: ({ open, status, message }: SnackData) => void
}

export default function MuiSnackBar({
  durations = 3000,
  data,
  setSnackBar,
}: Props) {
  return (
    <Snackbar
      open={data?.open}
      autoHideDuration={durations}
      onClose={() => setSnackBar({ ...data, open: false })}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={() => setSnackBar({ ...data, open: false })}
        severity={data?.status === 'success' ? 'success' : 'error'}
        sx={{
          width: '100%',
          color: 'white',
          backgroundColor:
            data?.status === 'success' ? green[600] : theme.palette.error.main,
        }}
        variant="filled"
      >
        {data?.message}
      </Alert>
    </Snackbar>
  )
}
