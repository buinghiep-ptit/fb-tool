import { yupResolver } from '@hookform/resolvers/yup'
import { MenuItem, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { BoxWrapperDialog } from 'app/components/common/BoxWrapperDialog'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useInitCancelOrder,
  useReceiveCancelOrder,
} from 'app/hooks/queries/useOrdersData'
import { messages } from 'app/utils/messages'
import React from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type Props = {
  title: string
}

export type SchemaType = {
  requester?: 1 | 2 | 3
  reason?: string
}

export default function CancelBooking({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const { orderId } = useParams()

  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    // navigate(-1)
  }

  const validationSchema = Yup.object().shape({
    requester: Yup.string().required(messages.MSG1),
    reason: Yup.string()
      .max(255, 'Nội dung không được vượt quá 255 ký tự')
      .required(messages.MSG1),
  })

  const methods = useForm<SchemaType>({
    defaultValues: {
      requester: 1,
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { mutate: cancelInit, isLoading: isLoading } = useInitCancelOrder(
    (data: any) => {
      if (data) {
        onSuccess(null, 'Tạo yêu cầu huỷ thành công')
        navigate(-1)
        // receiveCancel(Number(orderId ?? 0))
      }
    },
  )
  const { mutate: receiveCancel, isLoading: cancelLoading } =
    useReceiveCancelOrder(() =>
      onSuccess(null, 'Tiếp nhận yêu cầu huỷ thành công'),
    )

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    cancelInit({
      orderId: Number(orderId ?? 0),
      payload: {
        requester: Number(values.requester),
        reason: values.reason,
      },
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
            <SelectDropDown name="requester" label="Yêu cầu từ" required>
              <MenuItem value="1">Người đặt</MenuItem>
              <MenuItem value="2">Campdi</MenuItem>
              <MenuItem value="3">Điểm camp</MenuItem>
            </SelectDropDown>
            <Box>
              <MuiTypography variant="subtitle2" pb={1}>
                Lý do*:
              </MuiTypography>
              <FormTextArea
                name="reason"
                defaultValue={''}
                placeholder="Nhập lý do"
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
        isLoading={isLoading || cancelLoading}
        onSubmit={methods.handleSubmit(onSubmitHandler)}
        submitText="Tiếp tục xử lý"
        cancelText="Quay lại"
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
