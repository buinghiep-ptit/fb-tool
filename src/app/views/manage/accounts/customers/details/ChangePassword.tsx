import { yupResolver } from '@hookform/resolvers/yup'
import { RefreshSharp, Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, LinearProgress, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiInputText'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import FormTextArea from 'app/components/common/MuiTextarea'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useUpdatePasswordCustomer } from 'app/hooks/queries/useCustomerData'
import { ICustomerDetail } from 'app/models/account'
import { generatePassword } from 'app/utils/generatePassword'
import React, { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type Props = {
  title: string
}

type FormData = {
  password?: string
  note?: number
}

export default function ChangePassword({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const customer: ICustomerDetail = location.state?.data ?? {}
  const [showPassword, setShowPassword] = useState({
    visibility: false,
  })
  const [randLoading, setRandLoading] = useState(false)
  const { customerId } = useParams()

  const onSuccess = (data: any) => {
    toastSuccess({ message: 'Cập nhật mật khẩu thành công' })
    setTimeout(() => {
      navigate(-1)
    }, 1000)
  }
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .matches(
        // /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,32}$)/,
        'Mật khẩu không hợp lệ',
      )
      .required('Mật khẩu là bắt buộc'),
    note: Yup.string().max(256, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { mutate: updatePassword, isLoading } =
    useUpdatePasswordCustomer(onSuccess)

  const onSubmitHandler: SubmitHandler<FormData> = (values: FormData) => {
    console.log(values)
    updatePassword({
      customerId: customerId as any,
      payload: { newPassword: values.password as string },
    })
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

  const generatePasswordCustomer = () => {
    setRandLoading(true)
    setTimeout(() => {
      methods.setValue('password', generatePassword(8))
      setRandLoading(false)
    }, 1500)
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
          <Stack>
            <MuiTypography variant="subtitle2" pb={1}>
              Mật khẩu mới:*
            </MuiTypography>
            <Stack flexDirection={'row'} alignItems="center" gap={1.5}>
              <FormInputText
                type={showPassword.visibility ? 'text' : 'password'}
                name="password"
                size="small"
                placeholder="Nhập mật khẩu"
                defaultValue={customer?.email ? customer?.email : ''}
                iconEnd={
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {!showPassword.visibility ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                }
              />
              <MuiButton
                title="Tạo ngẫu nhiên"
                variant="outlined"
                color="primary"
                loadingColor="primary"
                type="submit"
                sx={{ width: '100%', flex: 1 }}
                startIcon={<RefreshSharp />}
                onClick={generatePasswordCustomer}
                loading={randLoading}
              />
            </Stack>
          </Stack>

          <Stack my={1.5}>
            <MuiTypography variant="subtitle2" pb={1}>
              Ghi chú:
            </MuiTypography>
            <FormTextArea name="note" defaultValue={''} placeholder="Ghi chú" />
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
