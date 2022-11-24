import { Divider, Icon, Stack } from '@mui/material'
import { MuiButton } from 'app/components/common/MuiButton'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import useNoteDialogForm from 'app/hooks/components/useNoteDialogForm'
import {
  useAvailableOrder,
  useIgnoreCancelOrder,
  useOrderUsed,
  useReceiveCancelOrder,
  useUnAvailableOrder,
} from 'app/hooks/queries/useOrdersData'
import { IProfile, IUser } from 'app/models'
import { IOrderDetail } from 'app/models/order'
import { ReactElement, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { isInprogressOrder, isReceiveOrder } from '../OrderDetail'
import { DiagLogConfirm } from './ButtonsLink/DialogConfirm'

export interface IButtonsActionProps {
  order?: IOrderDetail
  currentUser?: IProfile
}

export type ReassignSchema = {
  newHandler?: IUser
  reason?: string
}

export function ButtonsActions({ order, currentUser }: IButtonsActionProps) {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [dialogData, setDialogData] = useState<{
    title?: string
    message?: string | ReactElement | any
    type?: string
  }>({})
  const [openDialog, setOpenDialog] = useState(false)

  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    setOpenDialog(false)
  }

  const { mutate: available, isLoading: availableLoading } = useAvailableOrder(
    () => onSuccess(null, 'Cập nhật đơn hàng thành công'),
  )

  const { mutate: unavailable, isLoading: unavailableLoading } =
    useUnAvailableOrder(() => onSuccess(null, 'Cập nhật đơn hàng thành công'))

  const { mutate: receiveCancel, isLoading: cancelLoading } =
    useReceiveCancelOrder(() =>
      onSuccess(null, 'Tiếp nhận yêu cầu huỷ thành công'),
    )

  const { mutate: ignoreCancel, isLoading: ignoreCancelLoading } =
    useIgnoreCancelOrder(() => onSuccess(null, 'Bỏ yêu cầu huỷ thành công'))

  const { mutate: orderUsed, isLoading: usedOrderLoading } = useOrderUsed(() =>
    onSuccess(null, 'Hoàn tất đơn hàng thành công'),
  )

  const [getContentNote, methodsNote] = useNoteDialogForm('note')

  const loading =
    availableLoading ||
    unavailableLoading ||
    cancelLoading ||
    usedOrderLoading ||
    ignoreCancelLoading

  const onClickButton = (type?: string) => {
    setOpenDialog(true)
    switch (type) {
      case 'AVAILABLE':
        setDialogData(prev => ({
          ...prev,
          title: 'Còn chỗ',
          message: (loading?: boolean) => (
            <Stack py={5} justifyContent={'center'} alignItems="center">
              <MuiTypography variant="subtitle1">
                Xác nhận còn chỗ?
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
          message: (unAvailableLoading?: boolean) =>
            getContentNote(unAvailableLoading),
          type: 'UN_AVAILABLE',
        }))
        break

      case 'RECEIVE_REQUEST_CANCEL':
        setDialogData(prev => ({
          ...prev,
          title: 'Tiếp nhận',
          message: (loading?: boolean) => (
            <Stack py={5} justifyContent={'center'} alignItems="center">
              <MuiTypography variant="subtitle1">
                Tiếp nhận yêu cầu huỷ?
              </MuiTypography>
            </Stack>
          ),
          type: 'RECEIVE_REQUEST_CANCEL',
        }))
        break

      case 'IGNORE_CANCEL':
        setDialogData(prev => ({
          ...prev,
          title: 'Bỏ yêu cầu',
          message: (loading?: boolean) => (
            <Stack py={5} justifyContent={'center'} alignItems="center">
              <MuiTypography variant="subtitle1">
                Bạn có chắc chắn muốn bỏ yêu cầu?
              </MuiTypography>
            </Stack>
          ),
          type: 'IGNORE_CANCEL',
        }))
        break

      case 'ORDER_USED':
        setDialogData(prev => ({
          ...prev,
          title: 'Hoàn tất',
          message: (loading?: boolean) => (
            <Stack py={5} justifyContent={'center'} alignItems="center">
              <MuiTypography variant="subtitle1">
                Xác nhận hoàn tất đơn hàng?
              </MuiTypography>
            </Stack>
          ),
          type: 'ORDER_USED',
        }))
        break

      default:
        break
    }
  }

  const onSubmitDialogHandler: SubmitHandler<{
    note?: string
  }> = (values: { note?: string }) => {
    unavailable({
      orderId: Number(orderId ?? 0),
      note: values.note ?? '',
    })
  }

  const onSubmitDialog = (type?: string) => {
    switch (type) {
      case 'AVAILABLE':
        available(Number(orderId ?? 0))
        break

      case 'UN_AVAILABLE':
        methodsNote.handleSubmit(onSubmitDialogHandler)()
        break

      case 'RECEIVE_REQUEST_CANCEL':
        receiveCancel(Number(orderId ?? 0))
        break
      case 'IGNORE_CANCEL':
        ignoreCancel(Number(orderId ?? 0))
        break

      case 'ORDER_USED':
        orderUsed(Number(orderId ?? 0))
        break

      default:
        break
    }
  }

  return (
    <Stack flexDirection={'row'}>
      {order?.status === 2 && isReceiveOrder(order, currentUser) && (
        <>
          <MuiButton
            title="Xác nhận KH đã thanh toán"
            variant="contained"
            color="primary"
            onClick={() =>
              navigate(`xac-nhan-thanh-toan`, {
                state: { modal: true },
              })
            }
            startIcon={<Icon>how_to_reg</Icon>}
          />
          <Divider
            orientation="vertical"
            sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
            flexItem
          />
          <MuiButton
            title="Huỷ đơn"
            variant="contained"
            color="error"
            onClick={() =>
              navigate(`huy-don-hang`, {
                state: { modal: true },
              })
            }
            startIcon={<Icon>clear</Icon>}
          />
          <Divider
            orientation="vertical"
            sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
            flexItem
          />
        </>
      )}

      {order?.status === 1 && isReceiveOrder(order, currentUser) && (
        <>
          <MuiButton
            title="Còn chỗ"
            variant="contained"
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
            variant="contained"
            color="warning"
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
            variant="contained"
            color="error"
            onClick={() =>
              navigate(`huy-don-hang`, {
                state: { modal: true },
              })
            }
            startIcon={<Icon>person_remove</Icon>}
          />
          <Divider
            orientation="vertical"
            sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
            flexItem
          />
        </>
      )}

      {isInprogressOrder(order) &&
        (isReceiveOrder(order, currentUser) ||
          currentUser?.authorities?.includes(1)) && (
          <>
            <MuiButton
              title="Chuyển tiếp"
              variant="contained"
              color="primary"
              onClick={() =>
                navigate(`chuyen-tiep`, {
                  state: { modal: true, receiveType: 1 },
                })
              }
              startIcon={<Icon>cached</Icon>}
            />
            <Divider
              orientation="vertical"
              sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
              flexItem
            />
          </>
        )}

      {!order?.cancelRequest &&
        order?.status === 3 &&
        isReceiveOrder(order, currentUser) && (
          <>
            <MuiButton
              title="Hoàn tất"
              variant="contained"
              color="primary"
              onClick={() => onClickButton('ORDER_USED')}
              startIcon={<Icon>how_to_reg</Icon>}
            />
            <Divider
              orientation="vertical"
              sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
              flexItem
            />
            <MuiButton
              title="Huỷ đặt chỗ"
              variant="contained"
              color="error"
              onClick={() =>
                navigate(`yeu-cau-huy-dat-cho`, {
                  state: { modal: true },
                })
              }
              startIcon={<Icon>clear</Icon>}
            />
            <Divider
              orientation="vertical"
              sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
              flexItem
            />
          </>
        )}

      {isInprogressOrder(order) &&
        isReceiveOrder(order, currentUser) &&
        order?.cancelRequest && (
          <>
            <MuiButton
              title="Huỷ chỗ, hoàn tiền"
              variant="contained"
              color="error"
              onClick={() =>
                navigate(`hoan-tien`, {
                  state: { modal: true, data: order },
                })
              }
              startIcon={<Icon>clear</Icon>}
            />
            <Divider
              orientation="vertical"
              sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
              flexItem
            />
            <MuiButton
              title="Bỏ yêu cầu"
              variant="contained"
              color="warning"
              onClick={() => onClickButton('IGNORE_CANCEL')}
              startIcon={<Icon>clear</Icon>}
            />
            <Divider
              orientation="vertical"
              sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
              flexItem
            />
          </>
        )}

      {(isReceiveOrder(order, currentUser) ||
        currentUser?.authorities?.includes(1)) && (
        <MuiButton
          title="Ghi chú"
          variant="contained"
          color="warning"
          onClick={() =>
            navigate(`ghi-chu`, {
              state: { modal: true },
            })
          }
          startIcon={<Icon>event_note</Icon>}
        />
      )}

      <DiagLogConfirm
        title={dialogData.title ?? ''}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={() => onSubmitDialog(dialogData.type)}
        isLoading={loading}
      >
        {dialogData.message && dialogData.message(unavailableLoading)}
      </DiagLogConfirm>
    </Stack>
  )
}
