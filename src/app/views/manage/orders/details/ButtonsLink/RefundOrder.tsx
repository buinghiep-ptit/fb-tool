import { yupResolver } from '@hookform/resolvers/yup'
import { MenuItem, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { BoxWrapperDialog } from 'app/components/common/BoxWrapperDialog'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import MuiRHFNumericFormatInput from 'app/components/common/MuiRHFWithNumericFormat'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useRefundOrder } from 'app/hooks/queries/useOrdersData'
import { IOrderDetail } from 'app/models/order'
import { messages } from 'app/utils/messages'
import React, { useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type Props = {
  title: string
}

export type SchemaType = {
  refundType?: number
  transCode?: string
  amount?: number | string
  note?: string
}

export default function RefundOrder({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const order: IOrderDetail = location.state?.data ?? {}
  const { orderId } = useParams()

  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    navigate(-1)
  }

  const validationSchema = Yup.object().shape({
    refundType: Yup.string().required(messages.MSG1),
    transCode: Yup.string().when('refundType', {
      is: (refundType: string) => Number(refundType) !== 3,
      then: Yup.string()
        .max(255, 'Nội dung không được vượt quá 255 ký tự')
        .required(messages.MSG1),
    }),
    amount: Yup.number().when('refundType', {
      is: (refundType: string) => Number(refundType) !== 3,
      then: Yup.number()
        .typeError('Giá trị phải là một chữ số')
        .positive('Giá trị phải là số nguyên dương')
        .max(
          order.paymentTrans?.amount ?? 0,
          'Giá trị không được lớn hơn số tiền đã thanh toán',
        )
        .required(messages.MSG1),
    }),
    note: Yup.string().max(255, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<SchemaType>({
    defaultValues: {
      refundType: 1,
      amount: order.paymentTrans?.amount ?? '',
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const refundType = methods.watch('refundType')

  const { mutate: refund, isLoading: isLoading } = useRefundOrder(() =>
    onSuccess(null, 'Hoàn tiền thành công'),
  )

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    const amount = values?.amount?.toString().replace(/,(?=\d{3})/g, '') ?? 0
    let payload = null
    if (values.refundType == 3) {
      payload = {
        refundType: Number(values.refundType),
        note: values.note || null,
      }
    } else {
      payload = {
        refundType: Number(values.refundType),
        transCode: values.refundType != 3 ? values.transCode : null,
        amount: values.refundType != 3 ? Number(amount) : null,
        note: values.note || null,
      }
    }
    refund({
      orderId: Number(orderId ?? 0),
      payload,
    })
  }

  useEffect(() => {
    if (refundType == 1) methods.setValue('amount', order.paymentTrans?.amount)
  }, [refundType])

  const handleClose = () => {
    navigate(-1)
  }

  const getContent = () => {
    return (
      <BoxWrapperDialog>
        <FormProvider {...methods}>
          <Stack my={1.5} gap={2}>
            <SelectDropDown name="refundType" label="Loại hoàn *">
              <MenuItem value="1">Hoàn toàn bộ</MenuItem>
              <MenuItem value="2">Hoàn 1 phần</MenuItem>
              <MenuItem value="3">Không hoàn</MenuItem>
            </SelectDropDown>
            {methods.watch('refundType') != 3 && (
              <FormInputText
                type="text"
                label={'Mã giao dịch'}
                name="transCode"
                placeholder="Nhập mã giao dịch"
                defaultValue=""
                required
                sx={{ flex: 1 }}
              />
            )}
            {methods.watch('refundType') != 3 && (
              <MuiRHFNumericFormatInput
                disabled={methods.watch('refundType') == 1}
                type="text"
                name="amount"
                label="Giá"
                placeholder="Nhập giá"
                fullWidth
                required
              />
            )}

            <Box>
              <MuiTypography variant="subtitle2" pb={1}>
                Ghi chú:
              </MuiTypography>
              <FormTextArea
                name="note"
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
        cancelText="Quay lại"
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
