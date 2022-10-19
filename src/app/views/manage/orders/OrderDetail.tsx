import { Chip, Grid, Icon, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { Breadcrumb } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useOrderDetailData } from 'app/hooks/queries/useOrdersData'
import { IOrderDetail, IService } from 'app/models/order'
import { useState } from 'react'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { ActionsHistory } from './details/ActionsHistory'
import { ButtonsActions } from './details/ButtonsActions'
import { DiagLogConfirm } from './details/ButtonsLink/DialogConfirm'
import { CampgroundInfo } from './details/CampgroundInfo'
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

type SchemaType = {
  dateStart?: string
  dateEnd?: string
  fullName?: string
  mobilePhone?: string
  email?: string
  services?: IService[]
}

export interface Props {}

export default function OrderDetail(props: Props) {
  const navigate = useNavigate()
  const [titleDialog, setTitleDialog] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const { orderId } = useParams()
  const {
    data: order,
    isLoading,
    isError,
    isFetching,
    error,
  } = useOrderDetailData(Number(orderId ?? 0))

  const [methods, fields] = useRHFOrder(order as IOrderDetail)

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    console.log('values:', values)
  }

  const onSuccess = (data?: any) => {
    toastSuccess({ message: 'Huỷ thành công' })
    setOpenDialog(false)
  }

  const cancelOrderConfirm = () => {
    onSuccess()
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
            { name: 'Quản lý đặt chỗ', path: '/quan-ly-don-hang' },
            { name: 'Chi tiết' },
          ]}
        />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 1 }}
      >
        <MuiButton
          title="Lưu"
          variant="contained"
          color="primary"
          type="submit"
          onClick={methods.handleSubmit(onSubmitHandler)}
          startIcon={<Icon>done</Icon>}
        />
        <MuiButton
          title="Huỷ"
          variant="contained"
          color="secondary"
          onClick={() => methods.reset()}
          startIcon={<Icon>clear</Icon>}
        />
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
        {false ? (
          <MuiButton
            title="Huỷ chỗ, hoàn tiền"
            variant="outlined"
            color="error"
            onClick={() => {
              setTitleDialog('Hoàn tiền')
              setOpenDialog(true)
            }}
            startIcon={<Icon>clear</Icon>}
          />
        ) : (
          <ButtonsActions />
        )}
        <Chip label={'Tiếp nhận'} size="medium" color={'default'} />
      </Stack>

      <form
        onSubmit={methods.handleSubmit(onSubmitHandler)}
        noValidate
        autoComplete="off"
      >
        <FormProvider {...methods}>
          <Stack gap={3} mt={3}>
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
      <DiagLogConfirm
        title={titleDialog}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={cancelOrderConfirm}
      />
    </Container>
  )
}
