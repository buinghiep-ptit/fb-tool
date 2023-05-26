import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { editCoachPosition } from 'app/apis/coachs/coachs.service'
import { toastError, toastSuccess } from 'app/helpers/toastNofication'
import * as React from 'react'
interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  fetchData: any
}

const DialogEditPosition = React.forwardRef((props: Props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [checkValidate, setCheckValidate] = React.useState(false)
  const [name, setName] = React.useState<any>('')
  const [id, setId] = React.useState<any>('')
  const [status, setStatus] = React.useState<any>(1)

  React.useImperativeHandle(ref, () => ({
    handleClickOpen: (position: any) => {
      setName(position.description)
      setStatus(position.status)
      setId(position.id)
      setOpen(true)
    },
    handleClose: () => {
      setOpen(false)
    },
  }))

  const addRound = async () => {
    setCheckValidate(true)
    if (!name) return
    props.setIsLoading(true)
    const payload = {
      id: id,
      description: name,
      status: status,
      matches: [],
    }
    try {
      const res = await editCoachPosition(payload)
      if (res) {
        toastSuccess({
          message: 'Cập nhật vị trí công tác thành công',
        })
        props.fetchData()
        handleClose()
      }
    } catch (e) {
      toastError({
        message: 'Cập nhật vị trí công tác thất bại',
      })
    } finally {
      props.setIsLoading(false)
      setCheckValidate(false)
    }
  }

  const handleClose = () => {
    setName('')
    setStatus(1)
    setOpen(false)
  }

  return (
    <div>
      <Dialog open={open} maxWidth="sm">
        <DialogTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>Cập nhật vị trí công tác</div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="outlined-basic"
                label="Tên vị trí công tác*"
                placeholder="Nhập vị trí công tác"
                variant="outlined"
                margin="normal"
                error={!name && checkValidate}
                helperText={!name && checkValidate ? 'Giá trị bắt buộc' : ''}
                fullWidth
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Trạng thái*
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={status}
                  label="Trạng thái*"
                  onChange={e => setStatus(e.target.value)}
                >
                  <MenuItem value={1}>Hoạt động</MenuItem>
                  <MenuItem value={0}>Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                color="primary"
                type="submit"
                variant="contained"
                disabled={props.isLoading}
                style={{ padding: '12px 20px' }}
                onClick={addRound}
              >
                Lưu
              </Button>
              <Button
                style={{ marginLeft: '15px', padding: '12px 20px' }}
                variant="contained"
                onClick={handleClose}
              >
                Quay lại
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default DialogEditPosition
