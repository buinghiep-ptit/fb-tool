import { yupResolver } from '@hookform/resolvers/yup'
import { SearchSharp } from '@mui/icons-material'
import {
  Chip,
  Grid,
  MenuItem,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import { Box } from '@mui/system'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useQuery } from '@tanstack/react-query'
import { getListOrder } from 'app/apis/order/order.service'
import { Breadcrumb, Container, SimpleCard, StyledTable } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import { MuiRHFDatePicker } from 'app/components/common/MuiRHFDatePicker'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { OrderResponse, OrdersFilters } from 'app/models'
import { columnsOrders } from 'app/utils/columns'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import { format } from 'date-fns'
import moment from 'moment'
import * as React from 'react'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import * as Yup from 'yup'
export interface Props {}
export const dateDefault = () => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7)

  return {
    startDate: moment(startDate),
    endDate: moment(endDate),
  }
}

export default function OrderManager(props: Props) {
  const navigate = useNavigateParams()
  const navigation = useNavigate()
  const location = useLocation()
  const { q } = location.state || ''
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(20)

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

  const onSubmitHandler: SubmitHandler<OrdersFilters> = (
    values: OrdersFilters,
  ) => {
    setPage(0)
    setSize(20)
    setFilters(prevFilters => {
      return {
        ...extractMergeFiltersObject(prevFilters, {
          ...values,
          dateStart: format(new Date(values.dateStart ?? ''), 'yyyy-MM-dd'),
          dateEnd: format(new Date(values.dateEnd ?? ''), 'yyyy-MM-dd'),
        }),
        page: 0,
        size: 20,
      }
    })
    navigate('', {
      ...extractMergeFiltersObject(filters, {
        ...values,
        dateStart: format(new Date(values.dateStart ?? ''), 'yyyy-MM-dd'),
        dateEnd: format(new Date(values.dateEnd ?? ''), 'yyyy-MM-dd'),
      }),
      page: 0,
      size: 20,
    } as any)
  }
  const [defaultValues] = useState<OrdersFilters>({
    status: queryParams.status ?? '',
    q: (q || queryParams.q) ?? '',
    dateStart:
      queryParams.dateStart ??
      (dateDefault() as any).startDate?.format('YYYY-MM-DD'),
    dateEnd:
      queryParams.dateEnd ??
      (dateDefault() as any).endDate?.format('YYYY-MM-DD'),
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

  const dateStart = methods.watch('dateStart')
  const dateEnd = methods.watch('dateEnd')

  React.useEffect(() => {
    if (!dateStart || !dateEnd) return
    if (
      moment(new Date(dateStart)).unix() <= moment(new Date(dateEnd)).unix()
    ) {
      methods.clearErrors('dateStart')
      methods.clearErrors('dateEnd')
    }
  }, [dateStart, dateEnd])

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
              <Grid container spacing={2} alignItems={'center'}>
                <Grid item xs={3}>
                  <FormInputText
                    type="text"
                    name="q"
                    label={'SĐT, email người đặt, tên sản phẩm'}
                    defaultValue=""
                    placeholder="Nhập SĐT, email, mã đơn hàng"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1.5}>
                  <SelectDropDown name="status" label="Trạng thái">
                    <MenuItem value="0">Hủy</MenuItem>
                    <MenuItem value="1">Chờ xử lý</MenuItem>
                    <MenuItem value="2">Hoàn thành</MenuItem>
                  </SelectDropDown>
                </Grid>
                <Grid item xs={6} container spacing={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid item xs={6}>
                      <MuiRHFDatePicker name="dateStart" label="Từ ngày" />
                    </Grid>
                    <Grid item xs={6}>
                      <MuiRHFDatePicker name="dateEnd" label="Đến ngày" />
                    </Grid>
                  </LocalizationProvider>
                </Grid>
                <Grid
                  item
                  xs={1.5}
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
            </FormProvider>
          </form>
        </SimpleCard>
        <SimpleCard title="Danh sách đơn hàng">
          <Box width="100%" overflow="auto">
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
                {orders?.content?.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell align="center">
                      {size * page + index + 1}
                    </TableCell>
                    <TableCell align="center">{item.customerPhone}</TableCell>
                    <TableCell align="center" sx={{ color: 'red' }}>
                      {item.orderCode}
                    </TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="center">
                      {item.amount?.toLocaleString().replace(/,/g, '.')} VNĐ
                    </TableCell>
                    <TableCell align="center">
                      {item.createdDate
                        ? new Date(item.createdDate).toLocaleString()
                        : ''}
                    </TableCell>
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
              rowsPerPage={size}
              count={orders ? (orders?.totalElements as number) : 0}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[20, 50, 100]}
              labelRowsPerPage={'Dòng / Trang'}
              onRowsPerPageChange={handleChangeRowsPerPage}
              nextIconButtonProps={{ 'aria-label': 'Next Page' }}
              backIconButtonProps={{ 'aria-label': 'Previous Page' }}
            />
          </Box>
        </SimpleCard>
      </Stack>
    </Container>
  )
}
