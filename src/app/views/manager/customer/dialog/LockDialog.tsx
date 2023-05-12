import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IconButton, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import * as React from 'react'

const LockDiaLog = React.forwardRef((props, ref) => {
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

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>Khóa</div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lý do khóa: Bạn có chắc muốn khóa tài khoản? Vui lòng nhập lý do và
            xác nhận!
          </DialogContentText>
          <DialogContentText>
            Bạn có chắc muốn mở khóa tài khoản? Vui lòng nhập lý do và xác nhận!
          </DialogContentText>
          <TextField label="Lý do*" margin="normal"></TextField>
        </DialogContent>
        <DialogActions sx={{ textAlign: 'center' }}>
          <Button onClick={handleClose} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

export default LockDiaLog
