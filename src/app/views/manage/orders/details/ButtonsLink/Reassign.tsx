import { yupResolver } from '@hookform/resolvers/yup'
import { Chip, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { UseQueryResult } from '@tanstack/react-query'
import { BoxWrapperDialog } from 'app/components/common/BoxWrapperDialog'
import { MuiRHFAutoComplete } from 'app/components/common/MuiRHFAutoComplete'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useOrderDetailData,
  useReassignOrder,
  useReassignOrderCancelRequest,
} from 'app/hooks/queries/useOrdersData'
import { useUsersData } from 'app/hooks/queries/useUsersData'
import { IUser, IUserResponse } from 'app/models/account'
import { messages } from 'app/utils/messages'
import React from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type Props = {
  title: string
}

export type ReassignSchema = {
  newHandler?: IUser
  note?: string
}

const extractAccounts = (accounts?: IUser[]) => {
  if (!accounts || !accounts.length) return []
  const accArr = accounts.filter(acc => acc.role === 1 || acc.role === 2)

  return accArr.map(acc =>
    Object.assign(acc, {
      icon: () => (
        <Chip
          label={acc.role === 1 ? 'Admin' : 'CS'}
          size="small"
          color={acc.role === 1 ? 'primary' : 'secondary'}
        />
      ),
    }),
  )
}

export default function Reassign({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const receiveType = location.state?.receiveType ?? 1
  const { orderId } = useParams()

  const { data: order } = useOrderDetailData(Number(orderId ?? 0))

  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    navigate(-1)
  }

  const validationSchema = Yup.object().shape({
    newHandler: Yup.object().required(messages.MSG1).nullable(),
    note: Yup.string()
      .max(255, 'Nội dung không được vượt quá 255 ký tự')
      .required(messages.MSG1),
  })

  const methods = useForm<ReassignSchema>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { data: handlerUsers }: UseQueryResult<IUserResponse, Error> =
    useUsersData({ page: 0, size: 500, status: 1 })

  const { mutate: reassign, isLoading: isLoading } = useReassignOrder(() =>
    onSuccess(null, 'Chuyển tiếp đơn hàng thành công'),
  )

  const { mutate: reassignCancel, isLoading: isLoadingCancel } =
    useReassignOrderCancelRequest(() =>
      onSuccess(null, 'Chuyển tiếp yêu cầu huỷ thành công'),
    )

  const onSubmitHandler: SubmitHandler<ReassignSchema> = (
    values: ReassignSchema,
  ) => {
    // if (receiveType == 1) {
    reassign({
      orderId: Number(orderId ?? 0),
      userId: values.newHandler?.userId,
      note: values.note,
    })
    // } else
    //   reassignCancel({
    //     orderId: Number(orderId ?? 0),
    //     userId: values.newHandler?.userId,
    //     note: values.note,
    //   })
  }

  const handleClose = () => {
    navigate(-1)
  }

  const getContent = () => {
    return (
      <BoxWrapperDialog>
        <FormProvider {...methods}>
          <Stack my={1.5} gap={2}>
            <MuiRHFAutoComplete
              name="newHandler"
              label="Chuyển tiếp cho"
              options={extractAccounts(handlerUsers?.content) ?? []}
              optionProperty="email"
              getOptionLabel={option => option.email ?? ''}
              defaultValue=""
              required
            />
            <Box>
              <MuiTypography variant="subtitle2" pb={1}>
                Lý do*:
              </MuiTypography>
              <FormTextArea
                name="note"
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
        isLoading={isLoading || isLoadingCancel}
        onSubmit={methods.handleSubmit(onSubmitHandler)}
        submitText="Chuyển tiếp"
        cancelText="Huỷ"
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
