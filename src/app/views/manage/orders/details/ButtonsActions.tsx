import { Divider, Icon, LinearProgress, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { MuiButton } from 'app/components/common/MuiButton'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useAvailableOrder,
  useReassignOrder,
  useUnAvailableOrder,
} from 'app/hooks/queries/useOrdersData'
import { IOrderDetail } from 'app/models/order'
import { ReactElement, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { DiagLogConfirm } from './ButtonsLink/DialogConfirm'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { messages } from 'app/utils/messages'
import { BoxWrapperDialog } from 'app/components/common/BoxWrapperDialog'
import { useUsersData } from 'app/hooks/queries/useUsersData'
import { IUser, IUserResponse } from 'app/models'
import { UseQueryResult } from '@tanstack/react-query'
import { MuiRHFAutoComplete } from 'app/components/common/MuiRHFAutoComplete'

export interface IButtonsActionProps {
  order?: IOrderDetail
}

export type ReassignSchema = {
  newHandler?: IUser
  reason?: string
}

export function ButtonsActions({ order }: IButtonsActionProps) {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [dialogData, setDialogData] = useState<{
    title?: string
    message?: string | ReactElement
    type?: string
  }>({})
  const [openDialog, setOpenDialog] = useState(false)

  const validationSchemaReassign = Yup.object().shape({
    newHandler: Yup.object().required(messages.MSG1).nullable(),
    reason: Yup.string().max(255, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<ReassignSchema>({
    mode: 'onChange',
    resolver: yupResolver(validationSchemaReassign),
  })

  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    setOpenDialog(false)
  }

  const { data: handlerUsers }: UseQueryResult<IUserResponse, Error> =
    useUsersData({ page: 0, size: 200, status: 1, role: 2 })

  const { mutate: available, isLoading: availableLoading } = useAvailableOrder(
    () => onSuccess(null, 'Cập nhật đơn hàng thành công'),
  )

  const { mutate: unavailable, isLoading: unavailableLoading } =
    useUnAvailableOrder(() => onSuccess(null, 'Cập nhật đơn hàng thành công'))

  const { mutate: reassign, isLoading: reassignLoading } = useReassignOrder(
    () => onSuccess(null, 'Chuyển tiếp thành công'),
  )

  const loading = availableLoading || unavailableLoading || reassignLoading

  const onClickButton = (type?: string) => {
    setOpenDialog(true)
    switch (type) {
      case 'AVAILABLE':
        setDialogData(prev => ({
          ...prev,
          title: 'Còn chỗ',
          message: (
            <Stack py={5} justifyContent={'center'} alignItems="center">
              <MuiTypography variant="subtitle1">
                Xác nhận còn chỗ
              </MuiTypography>
            </Stack>
          ),
          type: 'AVAILABLE',
        }))
        break
      case 'UN_AVAILABLE':
        setDialogData(prev => ({
          ...prev,
          title: 'Hết chỗ',
          message: (
            <Stack py={5} justifyContent={'center'} alignItems="center">
              <MuiTypography variant="subtitle1">
                Xác nhận hết chỗ
              </MuiTypography>
            </Stack>
          ),
          type: 'UN_AVAILABLE',
        }))
        break

      case 'RE_ASSIGN':
        setDialogData(prev => ({
          ...prev,
          title: 'Chuyển tiếp',
          message: getContentReassignHandler(),
          type: 'RE_ASSIGN',
        }))
        break

      default:
        break
    }
  }

  const onSubmitDialog = (type?: string) => {
    switch (type) {
      case 'AVAILABLE':
        available(Number(orderId ?? 0))
        break

      case 'UN_AVAILABLE':
        unavailable(Number(orderId ?? 0))
        break

      case 'RE_ASSIGN':
        methods.handleSubmit(onSubmitHandler)()
        break

      default:
        break
    }
  }

  const onSubmitHandler: SubmitHandler<ReassignSchema> = (
    values: ReassignSchema,
  ) => {
    reassign({
      orderId: order?.id,
      userId: values.newHandler?.userId,
    })
  }

  const getContentReassignHandler = () => {
    return (
      <BoxWrapperDialog>
        <FormProvider {...methods}>
          <Stack my={1.5} gap={2}>
            <MuiRHFAutoComplete
              name="newHandler"
              label="Chuyển tiếp cho"
              options={handlerUsers?.content ?? []}
              optionProperty="email"
              getOptionLabel={option => option.email ?? ''}
              defaultValue=""
              required
            />
            <Box>
              <MuiTypography variant="subtitle2" pb={1}>
                Lý do:
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
    <Stack flexDirection={'row'}>
      <MuiButton
        title="Còn chỗ"
        variant="outlined"
        color="primary"
        onClick={() => onClickButton('AVAILABLE')}
        startIcon={<Icon>how_to_reg</Icon>}
      />
      <Divider
        orientation="vertical"
        sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
        flexItem
      />
      <MuiButton
        title="Hết chỗ"
        variant="outlined"
        sx={{ color: '#AAAAAA' }}
        onClick={() => onClickButton('UN_AVAILABLE')}
        startIcon={<Icon>person_off</Icon>}
      />
      <Divider
        orientation="vertical"
        sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
        flexItem
      />
      <MuiButton
        title="Huỷ"
        variant="outlined"
        color="error"
        startIcon={<Icon>person_remove</Icon>}
      />
      <Divider
        orientation="vertical"
        sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
        flexItem
      />
      <MuiButton
        title="Chuyển tiếp"
        variant="outlined"
        color="warning"
        onClick={() => onClickButton('RE_ASSIGN')}
        startIcon={<Icon>cached</Icon>}
      />
      <Divider
        orientation="vertical"
        sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
        flexItem
      />
      <MuiButton
        title="Ghi chú"
        variant="outlined"
        color="warning"
        startIcon={<Icon>event_note</Icon>}
      />

      <DiagLogConfirm
        title={dialogData.title ?? ''}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={() => onSubmitDialog(dialogData.type)}
      >
        <>
          {getContentReassignHandler()}
          {loading && <LinearProgress sx={{ flex: 1 }} />}
        </>
      </DiagLogConfirm>
    </Stack>
  )
}
