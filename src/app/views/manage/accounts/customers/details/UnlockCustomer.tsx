import { yupResolver } from '@hookform/resolvers/yup'
import { Chip, LinearProgress, Stack } from '@mui/material'
import { Box } from '@mui/system'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useUnLockCustomer } from 'app/hooks/queries/useCustomersData'
import { ICustomerDetail } from 'app/models/account'
import React from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { lockDetail } from 'app/apis/accounts/customer.service'
import { ISODateTimeFormatter } from 'app/utils/formatters/dateTimeFormatters'

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
    toastSuccess({ message: 'Mở khoá thành công' })
    navigate(-1)
  }
  const validationSchema = Yup.object().shape({
    reason: Yup.string()
      .required('Lý do không được bỏ trống')
      .max(255, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { data: lock }: UseQueryResult<any, Error> = useQuery<any, Error>(
    ['lock', customerId],
    () => lockDetail(Number(customerId ?? 0)),
    {
      enabled: !!customerId,
    },
  )

  const { mutate: unlockCustomer, isLoading } = useUnLockCustomer(onSuccess)

  const onSubmitHandler: SubmitHandler<FormData> = (values: FormData) => {
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
            <Stack flexDirection={'row'}>
              <MuiTypography variant="subtitle2">Loại khoá:</MuiTypography>
              <Stack direction={'row'} flex={1} alignItems="center">
                <Chip
                  label={getLabelByCusStatus(customer.status as number)}
                  size="small"
                  sx={{
                    mx: 0.5,
                    backgroundColor: getColorByCusStatus(
                      customer.status as number,
                    ),
                    color: '#FFFFFF',
                  }}
                />
                {lock && lock.lockExpireTime && (
                  <MuiTypography
                    variant="body2"
                    fontSize={'0.75rem'}
                    color={'primary'}
                  >
                    (hiệu lực đến:{' '}
                    {ISODateTimeFormatter((lock as any).lockExpireTime)})
                  </MuiTypography>
                )}
              </Stack>
            </Stack>

            <Stack flexDirection={'row'} gap={2}>
              <MuiTypography variant="subtitle2">Lý do khoá:</MuiTypography>
              <MuiTypography
                variant="body2"
                pb={1}
                flex={1}
                sx={{ whiteSpace: 'pre-line' }}
              >
                {lock && lock.reason}
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
        submitText="Mở khoá"
        cancelText="Huỷ"
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
