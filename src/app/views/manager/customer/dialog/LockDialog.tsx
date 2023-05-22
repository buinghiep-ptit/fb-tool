import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IconButton, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { lockCustomer } from 'app/apis/customer/customer.service'
import { toastSuccess } from 'app/helpers/toastNofication'
import * as React from 'react'
import { useParams } from 'react-router-dom'

export interface Props {
  setIsLoading: any
  function: any
}

const LockDiaLog = React.forwardRef((props: Props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [note, setNote] = React.useState<any>('')
  const params = useParams()
  React.useImperativeHandle(ref, () => ({
    handleClickOpen: () => {
      setOpen(true)
    },
    handleClose: () => {
      setNote('')
      setOpen(false)
    },
  }))

  const handleLockCustomer = async () => {
    props.setIsLoading(true)
    const res = await lockCustomer(params.idCustomer, { note })
    if (res) toastSuccess({ message: 'Khóa khách hàng' })
    props.setIsLoading(false)
    props.function()
    handleClose()
  }

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
          <TextField
            label="Lý do*"
            margin="normal"
            onChange={e => setNote(e.target.value)}
            value={note}
          />
        </DialogContent>
        <DialogActions sx={{ textAlign: 'center' }}>
          <Button onClick={handleLockCustomer} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

export default LockDiaLog
