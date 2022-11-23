import { Grid, Stack } from '@mui/material'
import { Box } from '@mui/system'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { useOrderDetailData } from 'app/hooks/queries/useOrdersData'
import { IOrderDetail } from 'app/models/order'
import React from 'react'
import { FormProvider, SubmitErrorHandler } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CampgroundInfo } from '../CampgroundInfo'
import { CustomerInfo } from '../CustomerInfo'
import { OrderProcesses } from '../OrderProcesses'
import { useRHFOrder } from '../useRHFOrder'

type Props = {
  title: string
}

export default function UnAvailableOrder({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const { orderId } = useParams()

  const {
    data: order,
    isLoading,
    isError,
    isFetching,
    error,
  } = useOrderDetailData(Number(orderId ?? 0))
  const [methods] = useRHFOrder(order as IOrderDetail)

  const onSubmitHandler: SubmitErrorHandler<any> = (values: any) => {
    console.log(values)
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
              <OrderProcesses rows={order.orderProcess} />
            </Stack>
          </Stack>
        </FormProvider>
      </Box>
    )
  }

  return (
    <React.Fragment>
      <MuiStyledModal
        title={title}
        open={isModal}
        maxWidth={'lg'}
        onCloseModal={handleClose}
        isLoading={false}
        cancelText="Quay lại"
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
