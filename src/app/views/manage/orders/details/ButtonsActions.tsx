import { Divider, Icon, LinearProgress, Stack } from '@mui/material'
import { MuiButton } from 'app/components/common/MuiButton'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useAvailableOrder,
  useOrderUsed,
  useReceiveCancelOrder,
  useUnAvailableOrder,
} from 'app/hooks/queries/useOrdersData'
import { IUser, IUserProfile } from 'app/models'
import { IOrderDetail } from 'app/models/order'
import { ReactElement, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { isExpiredReceiveUser } from '../OrderDetail'
import { DiagLogConfirm } from './ButtonsLink/DialogConfirm'

export interface IButtonsActionProps {
  order?: IOrderDetail
  currentUser?: IUserProfile
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
    message?: () => ReactElement
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

  const { mutate: orderUsed, isLoading: usedOrderLoading } = useOrderUsed(() =>
    onSuccess(null, 'Hoàn tất đơn hàng thành công'),
  )

  const loading =
    availableLoading || unavailableLoading || cancelLoading || usedOrderLoading

  const onClickButton = (type?: string) => {
    setOpenDialog(true)
    switch (type) {
      case 'AVAILABLE':
        setDialogData(prev => ({
          ...prev,
          title: 'Còn chỗ',
          message: () => (
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
          message: () => (
            <Stack py={5} justifyContent={'center'} alignItems="center">
              <MuiTypography variant="subtitle1">
                Xác nhận hết chỗ?
              </MuiTypography>
            </Stack>
          ),
          type: 'UN_AVAILABLE',
        }))
        break

      case 'RECEIVE_REQUEST_CANCEL':
        setDialogData(prev => ({
          ...prev,
          title: 'Tiếp nhận',
          message: () => (
            <Stack py={5} justifyContent={'center'} alignItems="center">
              <MuiTypography variant="subtitle1">
                Tiếp nhận yêu cầu huỷ?
              </MuiTypography>
            </Stack>
          ),
          type: 'RECEIVE_REQUEST_CANCEL',
        }))
        break

      case 'ORDER_USED':
        setDialogData(prev => ({
          ...prev,
          title: 'Hoàn tất',
          message: () => (
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

  const onSubmitDialog = (type?: string) => {
    switch (type) {
      case 'AVAILABLE':
        available(Number(orderId ?? 0))
        break

      case 'UN_AVAILABLE':
        unavailable(Number(orderId ?? 0))
        break

      case 'RECEIVE_REQUEST_CANCEL':
        receiveCancel(Number(orderId ?? 0))
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
      {order?.status === 2 && (
        <>
          <MuiButton
            title="Xác nhận KH đã thanh toán"
            variant="outlined"
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
            variant="outlined"
            color="error"
            onClick={() => onClickButton('AVAILABLE')}
            startIcon={<Icon>clear</Icon>}
          />
          <Divider
            orientation="vertical"
            sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 2 }}
            flexItem
          />
        </>
      )}

      {order?.status === 1 && (
        <>
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
        </>
      )}

      {order?.status && order?.status < 3 && !order.cancelRequest && (
        <>
          <MuiButton
            title="Chuyển tiếp"
            variant="outlined"
            color="warning"
            onClick={() =>
              navigate(`chuyen-tiep`, {
                state: { modal: true },
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

      {!order?.cancelRequest && order?.status === 3 && (
        <>
          <MuiButton
            title="Hoàn tất"
            variant="outlined"
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
            variant="outlined"
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

      {order?.cancelRequest &&
        order.cancelRequest.status === 1 &&
        isExpiredReceiveUser(order.cancelRequest.handleExpireTime ?? '') && (
          <MuiButton
            title="Tiếp nhận lại"
            variant="outlined"
            color="primary"
            onClick={() => onClickButton('RECEIVE_REQUEST_CANCEL')}
            startIcon={<Icon>how_to_reg</Icon>}
          />
        )}

      {order?.cancelRequest &&
        order.cancelRequest.status === 1 &&
        !isExpiredReceiveUser(order.cancelRequest.handleExpireTime ?? '') && (
          <MuiButton
            title="Huỷ chỗ, hoàn tiền"
            variant="outlined"
            color="error"
            onClick={() =>
              navigate(`hoan-tien`, {
                state: { modal: true, data: order },
              })
            }
            startIcon={<Icon>cached</Icon>}
          />
        )}

      {!order?.cancelRequest && (
        <MuiButton
          title="Ghi chú"
          variant="outlined"
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
      >
        <>
          {dialogData.message && dialogData.message()}
          {loading && <LinearProgress sx={{ flex: 1 }} />}
        </>
      </DiagLogConfirm>
    </Stack>
  )
}
