import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
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
import { createUser } from 'app/apis/users/users.service'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { toastSuccess } from 'app/helpers/toastNofication'
import { messages } from 'app/utils/messages'
import * as React from 'react'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

export interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  refresh: () => void
}

const DialogCreateUser = React.forwardRef((props: Props, ref) => {
  const { isLoading, setIsLoading, refresh } = props
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState({
    visibility: false,
  })

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

  const handleClickShowPassword = () => {
    setShowPassword((prev: any) => ({
      ...prev,
      visibility: !prev.visibility,
    }))
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
      password: yup
        .string()
        .required(messages.MSG1)
        .test('latinChars', messages.MSG21, value => {
          const regexStr = /^[\x20-\x7E]+$/
          if (value) {
            return regexStr.test(value)
          } else return false
        })
        .matches(/^\S*$/, messages.MSG21)
        .matches(/^(?=.*?[a-z])(?=.*?[0-9]).{8,32}$/g, messages.MSG20),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      status: 1,
      role: 1,
      password: '',
    },
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)

    const payload: any = {
      email: data.email,
      status: data.status,
      role: data.role,
      password: data.password,
    }

    await createUser(payload)
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
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormProvider {...methods}>
            <DialogTitle>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>Thêm tài khoản</div>
                <IconButton
                  aria-label="close"
                  size="large"
                  onClick={handleClose}
                >
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
                    inputProps={{
                      autoComplete: 'new-password',
                    }}
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
              <FormInputText
                type={showPassword.visibility ? 'text' : 'password'}
                name="password"
                placeholder="Nhập mật khẩu"
                label={'Mật khẩu*'}
                iconEnd={
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {!showPassword.visibility ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                }
                fullWidth
                margin="normal"
                inputProps={{
                  autoComplete: 'new-password',
                }}
              />
            </DialogContent>
            <DialogActions sx={{ textAlign: 'center' }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                disabled={isLoading}
              >
                Đóng
              </Button>
              <Button
                type="submit"
                autoFocus
                variant="contained"
                disabled={isLoading}
              >
                {isLoading ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogActions>
          </FormProvider>
        </form>
      </Dialog>
    </div>
  )
})

export default DialogCreateUser
