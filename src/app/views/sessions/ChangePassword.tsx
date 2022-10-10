import { yupResolver } from '@hookform/resolvers/yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, LinearProgress, Stack } from '@mui/material'
import { Box } from '@mui/system'
import FormInputText from 'app/components/common/MuiRHFInputText'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useChangePassword } from 'app/hooks/useAuth'
import { messages } from 'app/utils/messages'
import React, { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

type Props = {
  title: string
}

type FormData = {
  currentPassword?: string
  newPassword?: string
}

export default function ChangePassword({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const [showPassword, setShowPassword] = useState({
    visibility: false,
  })

  const onSuccess = (data: any) => {
    toastSuccess({ message: messages.MSG23 })
    navigate(-1)
  }
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required(messages.MSG1),
    newPassword: Yup.string()
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

  const methods = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { mutate: changePassword, isLoading } = useChangePassword(onSuccess)

  const onSubmitHandler: SubmitHandler<FormData> = (values: FormData) => {
    changePassword(values)
  }

  const handleClose = () => {
    navigate(-1)
  }

  const handleClickShowPassword = () => {
    setShowPassword(prev => ({
      ...prev,
      visibility: !prev.visibility,
    }))
  }

  const getContent = () => {
    return (
      <Box
        sx={{
          paddingLeft: {
            xs: '6.66%',
            sm: '13.33%',
          },
          paddingRight: {
            xs: '6.66%',
            sm: '13.33%',
          },
        }}
      >
        <FormProvider {...methods}>
          <Stack gap={3} py={3}>
            <FormInputText
              type={showPassword.visibility ? 'text' : 'password'}
              name="currentPassword"
              label={'Mật khẩu hiện tại'}
              placeholder="Nhập mật khẩu hiện tại"
              iconEnd={
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {!showPassword.visibility ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              }
              defaultValue=""
            />
            <FormInputText
              type={showPassword.visibility ? 'text' : 'password'}
              name="newPassword"
              placeholder="Nhập mật khẩu mới"
              label={'Mật khẩu mới'}
              iconEnd={
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {!showPassword.visibility ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              }
              defaultValue=""
            />
          </Stack>

          {isLoading && <LinearProgress />}
        </FormProvider>
      </Box>
    )
  }

  return (
    <React.Fragment>
      <MuiStyledModal
        title={title}
        open={isModal}
        onCloseModal={handleClose}
        isLoading={isLoading}
        onSubmit={methods.handleSubmit(onSubmitHandler)}
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
