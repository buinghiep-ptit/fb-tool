import { yupResolver } from '@hookform/resolvers/yup'
import { Chip, LinearProgress, Stack } from '@mui/material'
import { Box } from '@mui/system'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import FormTextArea from 'app/components/common/MuiTextarea'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useUnLockCustomer } from 'app/hooks/queries/useCustomerData'
import { ICustomerDetail } from 'app/models/account'
import React from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type Props = {
  title: string
}

type FormData = {
  reason?: string
}

export default function LockCustomer({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const customer: ICustomerDetail = location.state?.data ?? {}
  const { customerId } = useParams()

  const onSuccess = (data: any) => {
    toastSuccess({ message: 'Cập nhật mật khẩu thành công' })
    setTimeout(() => {
      navigate(-1)
    }, 1000)
  }
  const validationSchema = Yup.object().shape({
    reason: Yup.string()
      .required('Lý do không được bỏ trống')
      .max(256, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { mutate: unlockCustomer, isLoading } = useUnLockCustomer(onSuccess)

  const onSubmitHandler: SubmitHandler<FormData> = (values: FormData) => {
    console.log(values)
    unlockCustomer({
      customerId,
      ...values,
    })
  }

  const handleClose = () => {
    navigate(-1)
  }

  const getLabelByCusStatus = (status: number) => {
    switch (status) {
      case 1:
        return 'Hoạt động'
      case -1:
        return 'Xoá'

      case -2:
        return 'Khoá'

      case -3:
        return 'Khoá tạm thời'

      default:
        return 'Không hoạt động'
    }
  }

  const getColorByCusStatus = (status: number) => {
    switch (status) {
      case 1:
        return '#2F9B42'
      case -1:
        return '#AAAAAA'

      case -2:
        return '#FF3D57'

      case -3:
        return '#ff9e43'

      default:
        return '#AAAAAA'
    }
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
          <Stack gap={1.5}>
            <Stack flexDirection={'row'} gap={2}>
              <MuiTypography variant="subtitle2">Loại khoá:</MuiTypography>
              <Chip
                label={getLabelByCusStatus(customer.status as number)}
                size="small"
                sx={{
                  mx: 1,
                  px: 1,
                  backgroundColor: getColorByCusStatus(
                    customer.status as number,
                  ),
                  color: '#FFFFFF',
                }}
              />
            </Stack>

            <Stack flexDirection={'row'} gap={2}>
              <MuiTypography variant="subtitle2">Lý do khoá:</MuiTypography>
              <MuiTypography variant="body2" pb={1} flex={1}>
                Tuyên truyền văn hoá phẩm đồi bại. Ảnh hưởng đến thuần phong mỹ
                tục của con người
              </MuiTypography>
            </Stack>

            <Box>
              <MuiTypography variant="subtitle2" pb={1}>
                Lý do mở:*
              </MuiTypography>
              <FormTextArea
                name="reason"
                defaultValue={''}
                placeholder="Nội dung"
              />
            </Box>
          </Stack>
        </FormProvider>
        {isLoading && <LinearProgress />}
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
