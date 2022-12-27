import { Chip, Grid, Icon, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { getDetailCampGround } from 'app/apis/campGround/ground.service'
import {
  getDistricts,
  getProvinces,
  getWards,
} from 'app/apis/common/common.service'
import { Breadcrumb } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useOrderDetailData,
  useUpdateContactOrder,
} from 'app/hooks/queries/useOrdersData'
import useAuth from 'app/hooks/useAuth'
import { IUserProfile } from 'app/models'
import { ICampground, IOrderDetail } from 'app/models/order'
import { getOrderStatusSpec } from 'app/utils/enums/order'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ActionsHistory } from './details/ActionsHistory'
import { ButtonsActions } from './details/ButtonsActions'
import { CampgroundInfo } from './details/CampgroundInfo'
import { CancelOrderInfo } from './details/CancelOrderInfo'
import { CustomerInfo } from './details/CustomerInfo'
import { OrderProcesses } from './details/OrderProcesses'
import { OrderServices } from './details/OrderServices'
import { useRHFOrder } from './details/useRHFOrder'

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

const getBreadCrumbDetailName = (slug?: string) => {
  switch (slug) {
    case 'xu-ly':
      return 'Cần xử lý'
    case 'tat-ca':
      return 'Tất cả'
    case 'yeu-cau-huy':
      return 'Yêu cầu huỷ đặt chỗ'

    default:
      return 'Tất cả'
  }
}

export const isExpiredReceiveUser = (expiredTimeISO: string) => {
  const NOW_IN_MS = new Date().getTime()
  const EXP_IN_MS = new Date(expiredTimeISO).getTime()

  return EXP_IN_MS <= NOW_IN_MS
}

export const isReceiveOrder = (order?: IOrderDetail, user?: any) => {
  if (!order || !user) return false
  return order.handledBy === (user as any).id
}

export const isInprogressOrder = (order?: IOrderDetail) => {
  if (!order) return false

  return (
    order?.status &&
    order?.status < 4 &&
    (order.cancelRequest?.status !== 2 ||
      (order.cancelRequest?.status === 2 && order?.status === 3)) &&
    order?.status !== -1
  )
}

type SchemaType = {
  fullName?: string
  mobilePhone?: string
  email?: string
  note?: string
}

export interface Props {}

export default function OrderDetail(props: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { source, orderId } = useParams()

  const prevRoute = useLocation()

  const [addressCampground, setAddressCampground] = useState('')

  const onSuccess = async (order: IOrderDetail) => {
    let address = ''
    try {
      const campground = (await getDetailCampGround(
        order.campGround?.id,
      )) as ICampground
      const provinces = await getProvinces()
      if (campground && campground.idProvince) {
        const province: any = provinces.find(
          (province: any) => province.id == campground.idProvince,
        )
        address += province ? province.name : ''
        const districts = await getDistricts(campground.idProvince)
        const district: any = districts.find(
          (district: any) => district.id == campground.idDistrict,
        )
        if (district) {
          address = district ? district.name + ', ' + address : address
          const awards = await getWards(district.id)
          const award: any = awards.find(
            (award: any) => award.id == campground.idWard,
          )
          address = award ? award.name + ', ' + address : address
          address = campground.address
            ? campground.address + ', ' + address
            : address
        }

        setAddressCampground(address)
      }
    } catch (error) {}
  }

  const {
    data: order,
    isLoading,
    isError,
    isFetching,
    error,
  } = useOrderDetailData(Number(orderId ?? 0), onSuccess)

  const [methods] = useRHFOrder(order as IOrderDetail)

  const { mutate: edit, isLoading: editLoading } = useUpdateContactOrder(() =>
    onRowUpdateSuccess(null, 'Cập nhật thành công'),
  )

  const onRowUpdateSuccess = (data: any, message: string) => {
    toastSuccess({ message: message })
  }

  const goBack = () => {
    if (prevRoute && prevRoute?.state?.from) navigate(-1)
    else navigate('/quan-ly-don-hang', {})
  }

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    const payload: any = {
      note: values.note || null,
      fullName: values.fullName,
      email: values.email || null,
      mobilePhone: values.mobilePhone,
    }
    edit({ payload: payload, orderId: Number(orderId ?? 0) })
  }

  if (isLoading) return <MuiLoading />

  if (isError)
    return (
      <Box my={2} textAlign="center">
        <MuiTypography variant="h5">{(error as Error).message}</MuiTypography>
      </Box>
    )

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý đơn hàng', path: '/quan-ly-don-hang' },
            { name: 'Chi tiết' },
            { name: getBreadCrumbDetailName(source ?? '') },
          ]}
        />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        {isReceiveOrder(order, user) &&
          order.status !== -1 &&
          order.status !== 4 && (
            <>
              <MuiButton
                title="Lưu"
                variant="contained"
                color="primary"
                type="submit"
                disabled={editLoading}
                loading={editLoading}
                onClick={methods.handleSubmit(onSubmitHandler)}
                startIcon={<Icon>done</Icon>}
              />
              {/* <MuiButton
                title="Huỷ"
                variant="contained"
                color="warning"
                disabled={editLoading}
                onClick={() => methods.reset()}
                startIcon={<Icon>clear</Icon>}
              /> */}
            </>
          )}

        <MuiButton
          title="Quay lại"
          variant="contained"
          color="inherit"
          onClick={() => goBack()}
          startIcon={<Icon>keyboard_return</Icon>}
        />
      </Stack>
      <Stack
        flexDirection={'row'}
        justifyContent="space-between"
        alignItems={'center'}
      >
        <ButtonsActions
          order={order}
          currentUser={user as unknown as IUserProfile}
        />
        {order.cancelRequest?.status == 2 && order.status === 3 ? (
          <Chip
            label="Đặt thành công"
            size="medium"
            sx={{
              px: 1,
              fontSize: '1.125rem',
              fontWeight: 500,
              color: '#2F9B42',
              bgColor: '#EDFDEF',
            }}
          />
        ) : (
          <Chip
            label={
              order.cancelRequest
                ? getOrderStatusSpec(order?.cancelRequest.status ?? 0, 3).title
                : getOrderStatusSpec(order?.status ?? 0, 2).title
            }
            size="medium"
            sx={{
              px: 1,
              fontSize: '1.125rem',
              fontWeight: 500,
              color: order.cancelRequest
                ? getOrderStatusSpec(order?.cancelRequest.status ?? 0, 3)
                    .textColor
                : getOrderStatusSpec(order?.status ?? 0, 2).textColor,
              bgcolor: order.cancelRequest
                ? getOrderStatusSpec(order?.cancelRequest.status ?? 0, 3)
                    .bgColor
                : getOrderStatusSpec(order?.status ?? 0, 2).bgColor,
            }}
          />
        )}
      </Stack>

      <form
        onSubmit={methods.handleSubmit(onSubmitHandler)}
        noValidate
        autoComplete="off"
      >
        <FormProvider {...methods}>
          <Stack gap={3} mt={3}>
            {order.cancelRequest && isInprogressOrder(order) && (
              <Stack>
                <CancelOrderInfo
                  order={order}
                  isViewer={
                    !isReceiveOrder(order, user) || !isInprogressOrder(order)
                  }
                />
              </Stack>
            )}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <CustomerInfo
                  order={order}
                  isViewer={
                    !isReceiveOrder(order, user) || !isInprogressOrder(order)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CampgroundInfo
                  campground={order.campGround}
                  address={addressCampground}
                />
              </Grid>
            </Grid>
            <Stack>
              <OrderServices
                order={order}
                isViewer={
                  !isReceiveOrder(order, user) ||
                  !isInprogressOrder(order) ||
                  order.status === 3
                }
              />
            </Stack>
            <Stack>
              <OrderProcesses rows={order.orderProcess} />
            </Stack>
            <Stack>
              <ActionsHistory orderId={Number(orderId ?? 0)} />
            </Stack>
          </Stack>
        </FormProvider>
      </form>
    </Container>
  )
}
