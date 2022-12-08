import { yupResolver } from '@hookform/resolvers/yup'
import { RefreshSharp, Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, LinearProgress, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useUpdatePasswordCustomer } from 'app/hooks/queries/useCustomersData'
import { ICustomerDetail } from 'app/models/account'
import { generatePassword } from 'app/utils/generatePassword'
import React, { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { messages } from 'app/utils/messages'

type Props = {
  title: string
}

type FormData = {
  password?: string
  note?: string
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
    navigate(-1)
  }
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required(messages.MSG1)
      .test('latinChars', messages.MSG21, value => {
        const regexStr = /^[\x20-\x7E]+$/
        if (value) {
          return regexStr.test(value)
        } else return false
      })
      .matches(/^\S*$/, messages.MSG21)
      .min(8, messages.MSG20)
      .max(32, messages.MSG20),
    // .matches(/^(?=.*?[a-z])(?=.*?[0-9]).{8,32}$/g, messages.MSG20),
    note: Yup.string()
      .required(messages.MSG1)
      .max(255, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { mutate: updatePassword, isLoading } =
    useUpdatePasswordCustomer(onSuccess)

  const onSubmitHandler: SubmitHandler<FormData> = (values: FormData) => {
    updatePassword({
      customerId: customerId as any,
      payload: {
        newPassword: values.password as string,
        note: values.note as string,
      },
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
      methods.setValue('password', generatePassword(2, 4, 2))
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
            <Stack flexDirection={'row'} alignItems="center" gap={1.5} mt={3}>
              <FormInputText
                type={showPassword.visibility ? 'text' : 'password'}
                name="password"
                size="small"
                label={'Mật khẩu mới:*'}
                placeholder="Nhập mật khẩu mới"
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
                sx={{
                  minWidth: '180px',
                  flex: 1,
                }}
                // startIcon={<RefreshSharp />}
                onClick={generatePasswordCustomer}
                loading={randLoading}
              />
            </Stack>
          </Stack>

          <Stack my={1.5}>
            <MuiTypography variant="subtitle2" pb={1}>
              Ghi chú*:
            </MuiTypography>
            <FormTextArea name="note" defaultValue={''} placeholder="Ghi chú" />
          </Stack>
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
        submitText="Lưu"
        cancelText="Huỷ"
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
