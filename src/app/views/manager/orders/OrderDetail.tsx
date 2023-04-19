import { Box } from '@mui/system'
import * as React from 'react'
import { Breadcrumb, SimpleCard, Container, StyledTable } from 'app/components'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Autocomplete,
  Icon,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MuiRHFDatePicker } from 'app/components/common/MuiRHFDatePicker'
import { MuiButton } from 'app/components/common/MuiButton'
import { SearchSharp } from '@mui/icons-material'
import { columnsOrders } from 'app/utils/columns'
import { OrderResponse, OrdersFilters } from 'app/models'
import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { getListOrder } from 'app/apis/order/order.service'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import moment from 'moment'
export interface Props {}

export default function OrderDetail(props: Props) {
  const navigate = useNavigateParams()
  const navigation = useNavigate()
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(20)
  const [rowsPerPage, setRowsPerPage] = useState(20)

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
        <Chip
          sx={{ width: '100px', fontSize: '14px', height: '52px' }}
          label="Chờ Xử Lý"
          color="warning"
        />
        <MuiButton
          title="Quay lại"
          variant="outlined"
          color="primary"
          type="submit"
          onClick={() => navigation(`/orders`, {})}
          startIcon={<Icon>keyboard_return</Icon>}
        />
      </Stack>
      <Stack flexDirection={'row'} gap={50}>
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
                <TableCell align="left">Người đặt</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Thời gian đặt
                </TableCell>
                <TableCell align="left">Người đặt</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Mã đơn hàng
                </TableCell>
                <TableCell align="left">Người đặt</TableCell>
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
                <TableCell align="left">Nguyễn đức thành</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Số điện thoại
                </TableCell>
                <TableCell align="left">09876543312</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Email
                </TableCell>
                <TableCell align="left">Thanhnd77@fpt.com.vn</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Địa chỉ
                </TableCell>
                <TableCell align="left">
                  Só 10 Pham Van Bach, Cau Giäy, Ha Noi
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Khu vực
                </TableCell>
                <TableCell align="left">hà nội</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Phường/ Xã
                </TableCell>
                <TableCell align="left">Mai dịch</TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ borderRight: '1px solid #e3dfdf', fontWeight: '600' }}
                >
                  Ghi chú
                </TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableBody>
          </StyledTable>
        </SimpleCard>
      </Stack>
      <Stack sx={{ marginTop: '20px' }}>
        <SimpleCard title="Danh sách sản phẩm">
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <img
                src="https://i.pinimg.com/564x/6b/fe/2a/6bfe2ab44b7243aaef796648a3dba260.jpg"
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: 4,
                }}
                alt="bg"
              />
            </Grid>
            <Grid container item xs={3}>
              <Grid item xs={12}>
                <h2>Tên sản phẩm(name)</h2>
                <h3>Full name</h3>
              </Grid>
              <Grid item xs={6}>
                <h3>Số lượng: 1</h3>
              </Grid>
              <Grid item xs={6}>
                <h3 style={{ color: 'red' }}>Tiền</h3>
              </Grid>
            </Grid>
          </Grid>
        </SimpleCard>
      </Stack>
      <Stack sx={{ marginTop: '20px' }}>
        <SimpleCard title="Thông tin đơn hàng">
          <Grid container>
            <Grid item xs={3}>
              <h3>Tổng tiền số sản phẩm:</h3>
            </Grid>
            <Grid item xs={3}>
              <h3 style={{ color: 'red' }}>Tiền</h3>
            </Grid>
          </Grid>
        </SimpleCard>
      </Stack>
    </Container>
  )
}
