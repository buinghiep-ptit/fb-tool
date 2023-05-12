import { TextField } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import {
  getNoteLockCustomer,
  openCustomer,
} from 'app/apis/customer/customer.service'
import { toastSuccess } from 'app/helpers/toastNofication'
import * as React from 'react'
import { useParams } from 'react-router-dom'

export interface Props {
  setIsLoading: any
  function: any
}

const OpenDialog = React.forwardRef((props: Props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [note, setNote] = React.useState<any>('')
  const [noteLock, setNoteLock] = React.useState<any>('')
  const params = useParams()
  React.useImperativeHandle(ref, () => ({
    handleClickOpen: () => {
      fetchNote()
      setOpen(true)
    },

    handleClose: () => {
      setOpen(false)
    },
  }))
  const handleOpenLockCustomer = async () => {
    props.setIsLoading(true)
    const res = await openCustomer(params.idCustomer, { note })
    if (res) toastSuccess({ message: 'Mở khóa khách hàng' })
    props.setIsLoading(false)
    props.function()
    handleClose()
  }

  const fetchNote = async () => {
    const res = await getNoteLockCustomer(params.idCustomer)
    setNoteLock(res.note)
  }

  const handleClose = () => {
    setNote('')
    setOpen(false)
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Mở khóa</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Lý do khóa: {noteLock}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc muốn mở khóa tài khoản? Vui lòng nhập lý do và xác nhận!
          </DialogContentText>
          <TextField
            label="Lý do*"
            margin="normal"
            onChange={e => setNote(e.target.value)}
            value={note}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpenLockCustomer} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

export default OpenDialog
