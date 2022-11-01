import { Chip, Grid, Icon, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { Breadcrumb } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useUpdateOrder } from 'app/hooks/queries/useOrderData'
import { useOrderDetailData } from 'app/hooks/queries/useOrdersData'
import useAuth from 'app/hooks/useAuth'
import { IUserProfile } from 'app/models'
import { IOrderDetail, IService } from 'app/models/order'
import { getOrderStatusSpec } from 'app/utils/enums/order'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
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
      return 'Yêu cầu huỷ'

    default:
      return 'Tất cả'
  }
}

export const isExpiredReceiveUser = (expiredTimeISO: string) => {
  const NOW_IN_MS = new Date().getTime()
  const EXP_IN_MS = new Date(expiredTimeISO).getTime()

  return EXP_IN_MS <= NOW_IN_MS
}

type SchemaType = {
  dateStart?: string
  dateEnd?: string
  fullName?: string
  mobilePhone?: string
  email?: string
  note?: string
  services?: IService[]
}

export interface Props {}

export default function OrderDetail(props: Props) {
  const { user } = useAuth()

  const navigate = useNavigate()
  const { source, orderId } = useParams()
  const {
    data: order,
    isLoading,
    isError,
    isFetching,
    error,
  } = useOrderDetailData(Number(orderId ?? 0))

  const { mutate: edit, isLoading: editLoading } = useUpdateOrder(() =>
    onRowUpdateSuccess(null, 'Cập nhật thành công'),
  )

  const onRowUpdateSuccess = (data: any, message: string) => {
    toastSuccess({ message: message })
  }

  const [methods, fields] = useRHFOrder(order as IOrderDetail)

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    values = {
      ...values,
      dateStart: (values.dateStart as any)?.toISOString(),
      dateEnd: (values.dateEnd as any)?.toISOString(),
    }
    if (values.services && values.services.length) {
      values.services = values.services.map(item => ({
        ...item,
        quantity: Number(
          item.quantity?.toString().replace(/,(?=\d{3})/g, '') ?? 0,
        ),
      })) as IService[]
    }

    const payload: IOrderDetail = {
      ...order,
      dateStart: values.dateStart,
      dateEnd: values.dateEnd,
      note: values.note,
      contact: {
        ...order?.contact,
        fullName: values.fullName,
        email: values.email,
        mobilePhone: values.mobilePhone,
      },
      services: [...(values?.services ?? [])],
    }
    edit({ ...payload, id: Number(orderId ?? 0) })
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
        {!isExpiredReceiveUser(order.handleExpireTime ?? '') &&
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
              <MuiButton
                title="Huỷ"
                variant="contained"
                color="warning"
                disabled={editLoading}
                onClick={() => methods.reset()}
                startIcon={<Icon>clear</Icon>}
              />
            </>
          )}

        <MuiButton
          title="Quay lại"
          variant="contained"
          color="inherit"
          onClick={() => navigate(-1)}
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
        <Chip
          label={
            order.cancelRequest
              ? getOrderStatusSpec(order?.cancelRequest.status ?? 0, 3).title
              : getOrderStatusSpec(order?.status ?? 0, 2).title
          }
          size="medium"
          color={'default'}
        />
      </Stack>

      <form
        onSubmit={methods.handleSubmit(onSubmitHandler)}
        noValidate
        autoComplete="off"
      >
        <FormProvider {...methods}>
          <Stack gap={3} mt={3}>
            {order.cancelRequest && (
              <Stack>
                <CancelOrderInfo order={order} />
              </Stack>
            )}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <CustomerInfo order={order} />
              </Grid>
              <Grid item xs={12} md={6}>
                <CampgroundInfo campground={order.campGround} />
              </Grid>
            </Grid>
            <Stack>
              <OrderServices order={order} fields={fields} methods={methods} />
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
