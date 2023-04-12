import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { IconButton, TextField } from '@mui/material'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { textAlign } from '@mui/system'
import BackupIcon from '@mui/icons-material/Backup'
const DialogSettingImage = React.forwardRef((props, ref) => {
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

  const inputUploadImage = document.getElementById(
    'uploadImage',
  ) as HTMLInputElement | null

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>Cài đặt hình ảnh</div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <input
            type="file"
            id="uploadImage"
            style={{ display: 'none' }}
          ></input>
          <div
            onClick={() => inputUploadImage?.click()}
            style={{
              width: 500,
              height: 400,
              border: '2px dashed black',
              textAlign: 'center',
              paddingTop: '100px',
            }}
          >
            <div>Chọn ảnh để tải lên</div>
            <div>Hoặc kéo và thả tập tin</div>
            <BackupIcon fontSize="large" />
            <div>PNG/JPEG hoặc JPG</div>
            <div>Dung lượng không quá 50mb</div>
            <div>(Tỷ lệ ảnh phù hợp)</div>
          </div>
        </DialogContent>
        <DialogActions sx={{ textAlign: 'center' }}>
          <Button onClick={handleClose} autoFocus>
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

export default DialogSettingImage
