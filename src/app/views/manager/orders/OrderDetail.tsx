import {
  Chip,
  Grid,
  Icon,
  Stack,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material'
import { Box } from '@mui/system'
import { getOrderDetail } from 'app/apis/order/order.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import { IOrderDetail } from 'app/models'
import * as React from 'react'
import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
export interface Props {}
// type TypeElement = {
//   status?: number | string
// }

export default function OrderDetail(props: Props) {
  const params = useParams()
  const navigation = useNavigate()
  const [searchParams] = useSearchParams()
  const [order, setOrder] = useState<IOrderDetail | undefined>()

  const fetchOrder = async () => {
    const res = await getOrderDetail(params.orderID)
    setOrder(res)
  }

  React.useEffect(() => {
    fetchOrder()
  }, [])

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return 'Hủy'
      case 1:
        return 'Chờ xử lý'
      case 2:
        return 'Hoàn thành'
    }
  }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Chi tiết đơn hàng' }]} />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        {order?.status !== undefined ? (
          <Chip
            sx={{ width: '100px', fontSize: '14px', height: '52px' }}
            label={getStatusText(order.status)}
            color={
              order.status === 2
                ? 'success'
                : order.status === 1
                ? 'warning'
                : 'error'
            }
          />
        ) : (
          'Unknown'
        )}
        <MuiButton
          title="Quay lại"
          variant="outlined"
          color="primary"
          type="submit"
          onClick={() => navigation(`/orders`, {})}
          startIcon={<Icon>keyboard_return</Icon>}
        />
      </Stack>
      <Stack flexDirection={'row'} gap={10}>
        <SimpleCard title="Thông tin người đặt">
          <StyledTable>
            <TableBody>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Người đặt
                </TableCell>
                <TableCell align="left">
                  {order?.customer?.fullName}
                  {'-'}
                  {order?.customer?.mobilePhone}
                  {'-'}
                  {order?.customer?.email}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Thời gian đặt
                </TableCell>
                <TableCell align="left">
                  {order?.createdDate
                    ? new Date(order.createdDate).toLocaleString()
                    : ''}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Mã đơn hàng
                </TableCell>
                <TableCell align="left">{order?.orderCode}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Mã đơn hàng KiotViet
                </TableCell>
                <TableCell align="left">{order?.orderCodePartner}</TableCell>
              </TableRow>
            </TableBody>
          </StyledTable>
        </SimpleCard>
        <SimpleCard title="Thông tin giao hàng">
          <StyledTable>
            <TableBody>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Họ và tên
                </TableCell>
                <TableCell align="left">{order?.delivery?.fullName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Số điện thoại
                </TableCell>
                <TableCell align="left">{order?.delivery?.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Email
                </TableCell>
                <TableCell align="left">{order?.delivery?.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Địa chỉ
                </TableCell>
                <TableCell align="left">{order?.delivery?.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Khu vực
                </TableCell>
                <TableCell align="left">
                  {order?.delivery?.districtName}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Phường/ Xã
                </TableCell>
                <TableCell align="left">{order?.delivery?.wardName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Ghi chú
                </TableCell>
                <TableCell align="left">{order?.delivery?.note}</TableCell>
              </TableRow>
            </TableBody>
          </StyledTable>
        </SimpleCard>
      </Stack>
      <Stack sx={{ marginTop: '20px' }}>
        <SimpleCard title="Danh sách sản phẩm">
          {order?.orderDetails?.map(item => (
            <Grid container spacing={3} key={item.productId}>
              <Grid item xs={3}>
                <img
                  src={
                    item.imgUrl && item.imgUrl.length
                      ? item.imgUrl[0]
                      : 'https://i.pinimg.com/564x/e2/d7/53/e2d753f4b2fc3301f6217f80142eb0f6.jpg'
                  }
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: 4,
                  }}
                  alt="bg"
                />
              </Grid>
              <Grid container item xs={5}>
                <Grid item xs={12}>
                  <p style={{ fontWeight: '600', fontSize: '15px' }}>
                    {item.name}
                  </p>
                  <p style={{ fontWeight: '500', fontSize: '14px' }}>
                    Sản phẩm: {item.fullName}
                  </p>
                </Grid>
                <Grid item xs={12}>
                  <p style={{ fontWeight: '500', fontSize: '14px' }}>
                    Số lượng: {item.quantity}
                  </p>
                  <p style={{ fontWeight: '500', fontSize: '14px' }}>
                    Đơn giá:&nbsp;
                    <span
                      style={{
                        color: 'red',
                        fontSize: '14px',
                      }}
                    >
                      {item.amount?.toLocaleString().replace(/,/g, '.')} VNĐ
                    </span>
                  </p>
                  <p style={{ fontWeight: '500', fontSize: '14px' }}>
                    Thành tiền:&nbsp;{' '}
                    <span
                      style={{
                        color: 'red',
                        fontSize: '14px',
                      }}
                    >
                      {item.amount && item.quantity
                        ? (item.amount * item.quantity)
                            .toLocaleString()
                            .replace(/,/g, '.')
                        : '-'}{' '}
                      VNĐ
                    </span>
                  </p>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </SimpleCard>
      </Stack>
      <Stack sx={{ marginTop: '20px' }}>
        <SimpleCard title="Thông tin đơn hàng">
          <Grid container>
            <Grid item xs={3}>
              <h3>Tổng tiền {order?.quantity} sản phẩm:</h3>
            </Grid>
            <Grid item xs={3}>
              <h3 style={{ color: 'red' }}>
                {order?.amount?.toLocaleString().replace(/,/g, '.')} VNĐ
              </h3>
            </Grid>
          </Grid>
        </SimpleCard>
      </Stack>
    </Container>
  )
}
