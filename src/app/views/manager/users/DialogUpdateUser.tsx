import { yupResolver } from '@hookform/resolvers/yup'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Button,
  DialogActions,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Box } from '@mui/system'
import { updateUser } from 'app/apis/users/users.service'
import { toastSuccess } from 'app/helpers/toastNofication'
import * as React from 'react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

export interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  refresh: () => void
  user: any
}

const DialogUpdateUser = React.forwardRef((props: Props, ref) => {
  const { isLoading, setIsLoading, refresh, user } = props
  const [open, setOpen] = React.useState(false)

  React.useImperativeHandle(ref, () => ({
    handleClickOpen: () => {
      setOpen(true)
    },
    handleClose: () => {
      setOpen(false)
      methods.reset()
    },
  }))

  const handleClose = () => {
    setOpen(false)
    methods.reset()
  }

  const schema = yup
    .object({
      email: yup
        .string()
        .email('Email không hợp lệ')
        .required('Giá trị bắt buộc')
        .trim()
        .max(255, 'Tối đa 255 ký tự'),
      status: yup.number().required('Giá trị bắt buộc'),
      role: yup.number().required('Giá trị bắt buộc'),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      status: 1,
      role: 1,
    },
  })

  const initDefaultValues = (user: any) => {
    const defaultValues: any = {}
    defaultValues.email = user.email
    defaultValues.status = user.status
    defaultValues.role = user.role
    methods.reset({ ...defaultValues })
  }

  useEffect(() => {
    if (user && open) initDefaultValues(user)
  }, [open])

  const onSubmit = async (data: any) => {
    setIsLoading(true)

    const payload: any = {
      email: data.email,
      status: data.status,
      role: data.role,
    }

    await updateUser(user.userId, payload)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
        refresh()
      })
      .catch(() => {})
      .finally(() => {
        handleClose()
        setIsLoading(false)
      })
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        {isLoading && (
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
            <div>Chi tiết tài khoản</div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Controller
            name="email"
            control={methods.control}
            render={({ field }) => (
              <TextField
                error={!!methods.formState.errors?.email}
                helperText={methods.formState.errors?.email?.message}
                {...field}
                label="Email*"
                variant="outlined"
                margin="normal"
                fullWidth
                disabled
              />
            )}
          />
          <Controller
            name="status"
            control={methods.control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel id="demo-simple-select-label">
                  Trạng thái*
                </InputLabel>
                <Select
                  fullWidth
                  {...field}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Trạng thái*"
                >
                  <MenuItem value={1}>Hoạt động</MenuItem>
                  <MenuItem value={-1}>Không hoạt động</MenuItem>
                </Select>
                {!!methods.formState.errors?.status?.message && (
                  <FormHelperText>
                    {methods.formState.errors?.status.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
          <Controller
            name="role"
            control={methods.control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel id="demo-simple-select-label">
                  Nhóm quyền*
                </InputLabel>
                <Select
                  fullWidth
                  {...field}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Nhóm quyền*"
                >
                  <MenuItem value={1}>Admin</MenuItem>
                </Select>
                {!!methods.formState.errors?.role?.message && (
                  <FormHelperText>
                    {methods.formState.errors?.role.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </DialogContent>
        <DialogActions sx={{ textAlign: 'center' }}>
          <Button onClick={handleClose} variant="outlined" disabled={isLoading}>
            Đóng
          </Button>
          <Button
            onClick={methods.handleSubmit(onSubmit)}
            autoFocus
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? '...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

export default DialogUpdateUser
