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

export default function OrderManager(props: Props) {
  let count = 1
  const navigate = useNavigateParams()
  const navigation = useNavigate()
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(20)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        page: +newPage,
      }
    })
    navigate('', {
      ...filters,
      page: +newPage,
    } as any)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSize(+event.target.value)
    setPage(0)
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        page: 0,
        size: +event.target.value,
      }
    })
    navigate('', {
      ...filters,
      page: 0,
      size: +event.target.value,
    } as any)
  }
  React.useEffect(() => {
    if (searchParams) {
      if (!!Object.keys(queryParams).length) {
        setPage(parseInt(queryParams.page) || 0)
        setSize(parseInt(queryParams.size) || 20)

        setFilters(prevFilters => {
          return {
            ...prevFilters,
            ...queryParams,
          }
        })
      }
    }
  }, [searchParams])

  const onSubmitHandler: SubmitHandler<OrdersFilters> = (
    values: OrdersFilters,
  ) => {
    removeParamsHasDefaultValue(values)
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        ...values,
      }
    })
    navigate('', {
      ...filters,
      ...values,
    } as any)
  }
  const removeParamsHasDefaultValue = (objParams: Record<string, any>) => {
    Object.keys(objParams).forEach(key => {
      if (objParams[key] === 'all') objParams[key] = ''
    })
  }
  const [defaultValues] = useState<OrdersFilters>({
    status: queryParams.status ?? '',
    name: queryParams.name ?? '',
    from: queryParams.from ?? '',
    to: queryParams.to ?? '',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
  })
  const [filters, setFilters] = useState<OrdersFilters>(
    extractMergeFiltersObject(defaultValues, {}),
  )
  const {
    data: orders,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<OrderResponse, Error>(
    ['orders', filters],
    () => getListOrder(filters),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!filters,
    },
  )
  console.log(orders?.content)
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(0, 'email must be at least 0 characters')
      .max(255, 'Nội dung không được vượt quá 255 ký tự'),
  })
  const methods = useForm<OrdersFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })
  const from = methods.watch('from')
  const to = methods.watch('to')
  React.useEffect(() => {
    if (!from || !to) return
    if (moment(new Date(from)).unix() <= moment(new Date(to)).unix()) {
      methods.clearErrors('from')
      methods.clearErrors('to')
    }
  }, [from, to])

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
        <Breadcrumb routeSegments={[{ name: 'Quản lý đơn hàng' }]} />
      </Box>
      <Stack gap={3}>
        <SimpleCard>
          <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
            <FormProvider {...methods}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <FormInputText
                    type="text"
                    name="name"
                    label={'SĐT, email người đặt, tên sản phẩm'}
                    defaultValue=""
                    placeholder="Nhập SĐT, email, mã đơn hàng"
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Trạng thái
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Trạng thái"
                    >
                      <MenuItem value={0}>Hủy</MenuItem>
                      <MenuItem value={1}>Chờ xử lý</MenuItem>
                      <MenuItem value={2}>Hoàn thành</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box mt={1}>
                <Grid container spacing={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid item xs={3}>
                      <MuiRHFDatePicker name="from" label="Từ ngày" />
                    </Grid>
                    <Grid item xs={3}>
                      <MuiRHFDatePicker name="to" label="Đến ngày" />
                    </Grid>
                  </LocalizationProvider>
                  <Grid
                    item
                    xs={3}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <MuiButton
                      title="Tìm kiếm "
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{ width: '100%' }}
                      startIcon={<SearchSharp />}
                    />
                  </Grid>
                </Grid>
              </Box>
            </FormProvider>
          </form>
        </SimpleCard>
        <SimpleCard title="Danh sách đơn hàng">
          <StyledTable>
            <TableHead>
              <TableRow>
                {columnsOrders.map(header => (
                  <TableCell
                    align="center"
                    style={{ minWidth: header.width }}
                    key={header.id}
                  >
                    {header.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.content?.map(item => (
                <TableRow key={item.id}>
                  <TableCell align="center">{count++}</TableCell>
                  <TableCell align="center">{item.customerPhone}</TableCell>
                  <TableCell align="center" sx={{ color: 'red' }}>
                    {item.orderCode}
                  </TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="center">{item.amount}</TableCell>
                  <TableCell align="center">{item.createdDate}</TableCell>
                  <TableCell align="center">
                    {item.status !== undefined ? (
                      <Chip
                        sx={{ width: '100px' }}
                        label={getStatusText(item.status)}
                        color={
                          item.status === 2
                            ? 'success'
                            : item.status === 1
                            ? 'warning'
                            : 'error'
                        }
                      />
                    ) : (
                      'Unknown'
                    )}
                  </TableCell>
                  <TableCell align="center">{item.note}</TableCell>
                  <TableCell align="center">
                    <Link
                      to={`${item.id}`}
                      // to="chi-tiet-don-hang"
                      style={{
                        color: 'green',
                        textDecorationLine: 'underline',
                      }}
                    >
                      Chi tiết
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
          <TablePagination
            sx={{ px: 2 }}
            page={page}
            component="div"
            rowsPerPage={rowsPerPage}
            count={40}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[20, 50, 100]}
            labelRowsPerPage={'Dòng / Trang'}
            onRowsPerPageChange={handleChangeRowsPerPage}
            nextIconButtonProps={{ 'aria-label': 'Next Page' }}
            backIconButtonProps={{ 'aria-label': 'Previous Page' }}
          />
        </SimpleCard>
      </Stack>
    </Container>
  )
}
