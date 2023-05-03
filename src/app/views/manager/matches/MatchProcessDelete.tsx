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
import { deleteMatchProcess } from 'app/apis/matches/matches.service'
import { toastSuccess } from 'app/helpers/toastNofication'
import * as React from 'react'

export interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  refresh: () => void
  matchProcess: any
}

const DialogDeleteProcess = React.forwardRef((props: Props, ref) => {
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

  const tryToDeleteProcess = async () => {
    props.setIsLoading(true)

    await deleteMatchProcess(props.matchProcess.id)
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
    <Dialog open={open} onClose={handleClose}>
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
          <div>Xóa diễn biến</div>
          <IconButton aria-label="close" size="large" onClick={handleClose}>
            <HighlightOffIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div>Bạn có chắc muốn xóa diễn biến này?</div>
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
          onClick={tryToDeleteProcess}
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

export default DialogDeleteProcess
