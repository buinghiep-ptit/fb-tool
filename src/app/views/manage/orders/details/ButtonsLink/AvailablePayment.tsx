import { Chip, Grid, Icon, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useOrderDetailData } from 'app/hooks/queries/useOrdersData'
import { IOrderDetail } from 'app/models/order'
import React, { useState } from 'react'
import { FormProvider, SubmitErrorHandler } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CampgroundInfo } from '../CampgroundInfo'
import { CustomerInfo } from '../CustomerInfo'
import { OrderProcesses } from '../OrderProcesses'
import { OrderServices } from '../OrderServices'
import { useRHFOrder } from '../useRHFOrder'
import { DiagLogConfirm } from './DialogConfirm'

type Props = {
  title: string
}

export default function AvailablePayment({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const { orderId } = useParams()
  const [titleDialog, setTitleDialog] = useState('')
  const [paymentStatus, setPaymentStatus] = useState(0) // 0 wait 1 success
  const [openDialog, setOpenDialog] = useState(false)

  const {
    data: order,
    isLoading,
    isError,
    isFetching,
    error,
  } = useOrderDetailData(Number(orderId ?? 0))
  const [methods, fields] = useRHFOrder(order as IOrderDetail)

  const onSubmitHandler: SubmitErrorHandler<any> = (values: any) => {
    console.log(values)
  }

  const onSuccess = (data?: any) => {
    toastSuccess({ message: 'Thanh toán thành công' })
    setPaymentStatus(1)

    setOpenDialog(false)
  }

  const paymentConfirm = () => {
    onSuccess()
  }

  const cancelRequest = () => {
    setTitleDialog('Tạo yêu cầu huỷ')
    setOpenDialog(true)
  }

  const handleClose = () => {
    navigate(-1)
  }

  if (isLoading) return <MuiLoading />

  if (isError)
    return (
      <Box my={2} textAlign="center">
        <MuiTypography variant="h5">{(error as Error).message}</MuiTypography>
      </Box>
    )

  const getContent = () => {
    return (
      <Box px={2}>
        <FormProvider {...methods}>
          <Stack
            flexDirection={'row'}
            gap={2}
            sx={{
              position: 'absolute',
              top: '64px',
              left: '32px',
              zIndex: 1,
            }}
          >
            {paymentStatus === 0 && (
              <>
                <MuiButton
                  title="Xác nhận thanh toán"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setTitleDialog('Xác nhận thanh toán')
                    setOpenDialog(true)
                  }}
                  startIcon={<Icon>done</Icon>}
                />
                <MuiButton
                  title="Huỷ thanh toán"
                  variant="contained"
                  color="secondary"
                  onClick={handleClose}
                  startIcon={<Icon>clear</Icon>}
                />
              </>
            )}
            {paymentStatus === 1 && (
              <MuiButton
                title="Huỷ đặt chỗ"
                variant="contained"
                color="secondary"
                onClick={cancelRequest}
                startIcon={<Icon>clear</Icon>}
              />
            )}
          </Stack>
          <Chip
            sx={{ position: 'absolute', top: '80px', right: '48px', zIndex: 1 }}
            label={paymentStatus === 1 ? 'Đặt thành công' : 'Chờ thanh toán'}
            size="medium"
            color={paymentStatus === 1 ? 'primary' : 'default'}
          />
          <Stack gap={3} mt={8}>
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
          </Stack>
        </FormProvider>
      </Box>
    )
  }

  return (
    <React.Fragment>
      <DiagLogConfirm
        title={titleDialog}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={paymentConfirm}
      />

      <MuiStyledModal
        title={title}
        open={isModal}
        maxWidth={'lg'}
        onCloseModal={handleClose}
        isLoading={false}
        onSubmit={methods.handleSubmit(onSubmitHandler)}
        submitText="Lưu cập nhật đơn"
        cancelText="Huỷ cập nhật"
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
