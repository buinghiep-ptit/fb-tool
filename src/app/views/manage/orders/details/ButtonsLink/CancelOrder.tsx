import { yupResolver } from '@hookform/resolvers/yup'
import { Stack } from '@mui/material'
import { Box } from '@mui/system'
import { BoxWrapperDialog } from 'app/components/common/BoxWrapperDialog'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useNoteOrder } from 'app/hooks/queries/useOrdersData'
import { messages } from 'app/utils/messages'
import React from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type Props = {
  title: string
}

export type ReassignSchema = {
  reason?: string
}

export default function CancelOrder({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const { orderId } = useParams()

  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    navigate(-1)
  }

  const validationSchema = Yup.object().shape({
    reason: Yup.string()
      .max(255, 'Nội dung không được vượt quá 255 ký tự')
      .required(messages.MSG1),
  })

  const methods = useForm<ReassignSchema>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { mutate: note, isLoading: isLoading } = useNoteOrder(() =>
    onSuccess(null, 'Huỷ đơn hàng thành công'),
  )

  const onSubmitHandler: SubmitHandler<ReassignSchema> = (
    values: ReassignSchema,
  ) => {
    note({
      orderId: Number(orderId ?? 0),
      note: values.reason ?? '',
    })
  }

  const handleClose = () => {
    navigate(-1)
  }

  const getContent = () => {
    return (
      <BoxWrapperDialog>
        <FormProvider {...methods}>
          <Stack my={1.5} gap={2}>
            <MuiTypography variant="subtitle2">
              Bạn có chắc muốn huỷ đơn hàng?
            </MuiTypography>
            <Box>
              <MuiTypography variant="subtitle2" pb={1}>
                Lý do:
              </MuiTypography>
              <FormTextArea
                name="reason"
                defaultValue={''}
                placeholder="Nhập nội dung"
              />
            </Box>
          </Stack>
        </FormProvider>
      </BoxWrapperDialog>
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
        submitText="Xác nhận"
        cancelText="Huỷ"
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
