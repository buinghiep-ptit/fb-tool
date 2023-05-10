import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Button,
  DialogActions,
  IconButton,
  LinearProgress,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Box } from '@mui/system'
import { deleteLogo } from 'app/apis/logos/logos.service'
import { toastSuccess } from 'app/helpers/toastNofication'
import * as React from 'react'

export interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  refresh: () => void
  logo: any
}

const DialogDeleteLogo = React.forwardRef((props: Props, ref) => {
  const [open, setOpen] = React.useState(false)

  React.useImperativeHandle(ref, () => ({
    handleClickOpen: () => {
      setOpen(true)
    },
    handleClose: () => {
      setOpen(false)
    },
  }))

  const handleClose = () => {
    setOpen(false)
  }

  const tryToDeleteLogo = async () => {
    props.setIsLoading(true)

    await deleteLogo(props.logo.id)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
        props.refresh()
        handleClose()
      })
      .catch(() => {})
      .finally(() => {
        props.setIsLoading(false)
      })
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      {props.isLoading && (
        <Box
          sx={{
            width: '100%',
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '1000',
          }}
        >
          <LinearProgress />
        </Box>
      )}
      <DialogTitle>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>Xóa logo</div>
          <IconButton aria-label="close" size="large" onClick={handleClose}>
            <HighlightOffIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div>Bạn có chắc muốn xóa logo?</div>
      </DialogContent>
      <DialogActions sx={{ textAlign: 'center' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={props.isLoading}
        >
          Hủy
        </Button>
        <Button
          onClick={tryToDeleteLogo}
          autoFocus
          variant="contained"
          disabled={props.isLoading}
        >
          {props.isLoading ? 'Đang xóa...' : 'Xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default DialogDeleteLogo
