import { yupResolver } from '@hookform/resolvers/yup'
import { ChangeCircleSharp, SearchSharp } from '@mui/icons-material'
import { Grid, Icon, MenuItem, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { UseQueryResult } from '@tanstack/react-query'
import { SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiRHFDatePicker } from 'app/components/common/MuiRHFDatePicker'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useOrdersData,
  useReceiveCancelOrder,
  useReceiveOrder,
} from 'app/hooks/queries/useOrdersData'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { IOrderOverall } from 'app/models/order'
import { columnsOrdersCustomer } from 'app/utils/columns/columnsOrdersCustomer'
import { getOrderStatusSpec, OrderStatusEnum } from 'app/utils/enums/order'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import { messages } from 'app/utils/messages'
import React, { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import * as Yup from 'yup'
import { DiagLogConfirm } from '../../orders/details/ButtonsLink/DialogConfirm'
import { dateDefault } from '../../orders/OrdersHistory'

type ISearchFilters = {
  searchCamp?: string
  status?: string
  from?: string
  to?: string
  page?: number
  size?: number
  sort?: string
}

export interface Props {}

export default function OrdersHistory() {
  const navigation = useNavigate()
  const navigate = useNavigateParams()
  const prevRoute = useLocation()

  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])

  const [page, setPage] = useState<number>(
    queryParams.page ? +queryParams.page : 0,
  )
  const [size, setSize] = useState<number>(
    queryParams.size ? +queryParams.size : 20,
  )

  const [titleDialog, setTitleDialog] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [receiveType, setReceiveType] = useState(0)
  const [orderId, setOrderId] = useState(0)

  const [defaultValues] = useState<ISearchFilters>({
    searchCamp: queryParams.searchCamp ?? '',
    status: queryParams.status ?? 'all',
    from: queryParams.from ?? (dateDefault() as any).startDate?.toISOString(),
    to: queryParams.to ?? (dateDefault() as any).endDate?.toISOString(),
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
  })

  const [filters, setFilters] = useState<ISearchFilters>(
    extractMergeFiltersObject(
      {
        ...defaultValues,
        from: defaultValues.from,
        to: defaultValues.to,
      },
      {},
    ),
  )
  const { customerId } = useParams() ?? 0

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  }: UseQueryResult<any, Error> = useOrdersData({
    ...filters,
    cusId: customerId,
  })

  const validationSchema = Yup.object().shape(
    {
      searchCamp: Yup.string()
        .min(0, 'hashtag must be at least 0 characters')
        .max(255, 'Nội dung không được vượt quá 255 ký tự'),
      from: Yup.date()
        .when('to', (to, yup) => {
          if (to && to != 'Invalid Date') {
            const dayAfter = new Date(to.getTime())
            return yup.max(dayAfter, 'Ngày đắt đầu không lớn hơn ngày kết thúc')
          }
          return yup
        })
        .typeError('Sai định dạng.')
        .nullable()
        .required(messages.MSG1),
      to: Yup.date()
        .when('from', (from, yup) => {
          if (from && from != 'Invalid Date') {
            const dayAfter = new Date(from.getTime())
            return yup.min(dayAfter, 'Ngày kết thúc phải lớn hơn ngày đắt đầu')
          }
          return yup
        })
        .typeError('Sai định dạng.')
        .nullable()
        .required(messages.MSG1),
    },
    [['from', 'to']],
  )

  const methods = useForm<ISearchFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

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

  const onSubmitHandler: SubmitHandler<ISearchFilters> = (
    values: ISearchFilters,
  ) => {
    setPage(0)
    setSize(20)
    values = {
      ...values,
      searchCamp: values.searchCamp?.trim(),
      from: (values.from as any)?.toISOString(),
      to: (values.to as any)?.toISOString(),
    }
    setFilters(prevFilters => {
      return {
        ...extractMergeFiltersObject(prevFilters, values),
        page: 0,
        size: 20,
      }
    })

    navigate('', {
      ...extractMergeFiltersObject(filters, values),
      page: 0,
      size: 20,
    } as any)
  }

  const onResetFilters = () => {
    methods.reset({
      status: 'all',
      searchCamp: '',
      from: (dateDefault() as any).startDate?.toISOString(),
      to: (dateDefault() as any).endDate.toISOString(),
      page: 0,
      size: 20,
    })
    setPage(0)
    setSize(20)

    setFilters({
      from: (dateDefault() as any).startDate?.toISOString(),
      to: (dateDefault() as any).endDate.toISOString(),
      page: 0,
      size: 20,
    })

    navigate('', {
      from: (dateDefault() as any).startDate?.toISOString(),
      to: (dateDefault() as any).endDate.toISOString(),
      page: 0,
      size: 20,
    } as any)
  }

  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    setOpenDialog(false)
    navigation(`/quan-ly-don-hang/tat-ca/${orderId}`, {})
  }
  const { mutate: receive, isLoading: approveLoading } = useReceiveOrder(() =>
    onSuccess(null, 'Tiếp nhận đơn hàng thành công'),
  )
  const { mutate: receiveCancel, isLoading: cancelLoading } =
    useReceiveCancelOrder(() =>
      onSuccess(null, 'Tiếp nhận yêu cầu huỷ thành công'),
    )

  const approveConfirm = () => {
    if (receiveType === 1) {
      receive(orderId)
    } else if (receiveType === 2) {
      receiveCancel(orderId)
    }
  }

  const onClickRow = (cell: any, row: any) => {
    if (cell.id === 'action') {
      if (row.status === 0 || row.cancelRequestStatus === 0) {
        setReceiveType(row.cancelRequestStatus === 0 ? 2 : 1)
        setTitleDialog('Tiếp nhận')
        setOrderId(row.orderId)
        setOpenDialog(true)
      } else {
        navigation(`/quan-ly-don-hang/tat-ca/${row.orderId}`, {})
      }
    } else if (cell.id === 'cusAccount') {
      window.open(
        `/quan-ly-tai-khoan-khach-hang/${row?.customerId}/thong-tin`,
        '_blank',
      )
    } else if (cell.id === 'campGroundName') {
      window.open(`/chi-tiet-diem-camp/${row?.campGroundId}`, '_blank')
    } else if (cell.id === 'campGroundRepresent') {
      window.open(`/cap-nhat-thong-tin-doi-tac/${row?.merchantId}`, '_blank')
    }
  }

  if (isLoading) return <MuiLoading />

  if (isError)
    return (
      <Box my={2} textAlign="center">
        <MuiTypography variant="h5">{error.message}</MuiTypography>
      </Box>
    )

  return (
    <React.Fragment>
      <Stack gap={3}>
        <Stack
          sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 999 }}
        >
          <MuiButton
            title="Quay lại"
            variant="contained"
            color="inherit"
            onClick={() => {
              if (prevRoute && prevRoute?.state?.from) navigation(-1)
              else navigation('/quan-ly-tai-khoan-khach-hang', {})
            }}
            startIcon={<Icon>keyboard_return</Icon>}
          />
        </Stack>
        <SimpleCard title="Danh sách đơn hàng">
          <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
            <FormProvider {...methods}>
              <Grid container spacing={2}>
                <Grid item sm={3} xs={12}>
                  <FormInputText
                    label={'Điểm camp'}
                    type="text"
                    name="searchCamp"
                    defaultValue=""
                    placeholder="Nhập tên điểm camp"
                    fullWidth
                  />
                </Grid>

                <Grid item sm={3} xs={12}>
                  <SelectDropDown name="status" label="Trạng thái">
                    <MenuItem value="all">Tất cả</MenuItem>
                    {getDropdownMenuItems().map((item, index) => (
                      <MenuItem key={index} value={item.value}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </SelectDropDown>
                </Grid>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid item sm={3} xs={12} mt={-1}>
                    <MuiRHFDatePicker name="from" label="Từ ngày" />
                  </Grid>
                  <Grid item sm={3} xs={12} mt={-1}>
                    <MuiRHFDatePicker name="to" label="Đến ngày" />
                  </Grid>
                </LocalizationProvider>
              </Grid>

              <Grid container spacing={2}>
                <Grid item sm={3} xs={6} mt={2}>
                  <MuiButton
                    loading={isFetching}
                    title="Tìm kiếm"
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ width: '100%' }}
                    startIcon={<SearchSharp />}
                  />
                </Grid>
                <Grid item sm={3} xs={6} mt={2}>
                  <MuiButton
                    // loading={isReset && isFetching}
                    title="Làm mới"
                    variant="outlined"
                    color="primary"
                    onClick={onResetFilters}
                    sx={{ width: '100%' }}
                    startIcon={<ChangeCircleSharp />}
                  />
                </Grid>
              </Grid>
            </FormProvider>
          </form>
        </SimpleCard>

        <SimpleCard>
          <MuiStyledTable
            rows={data ? (data?.content as IOrderOverall[]) : []}
            columns={columnsOrdersCustomer}
            onClickRow={onClickRow}
            isFetching={isFetching}
            error={isError ? error : null}
          />
          <MuiStyledPagination
            component="div"
            rowsPerPageOptions={[20, 50, 100]}
            count={data ? (data?.totalElements as number) : 0}
            rowsPerPage={size}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </SimpleCard>
      </Stack>
      <DiagLogConfirm
        title={titleDialog}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={approveConfirm}
      >
        <Stack py={5} justifyContent={'center'} alignItems="center">
          <MuiTypography variant="subtitle1">Đồng ý tiếp nhận?</MuiTypography>
        </Stack>
      </DiagLogConfirm>
    </React.Fragment>
  )
}

const getDropdownMenuItems = () => {
  return [
    {
      value: getOrderStatusSpec(OrderStatusEnum.CHECK, 2).value,
      title: getOrderStatusSpec(OrderStatusEnum.CHECK, 2).title,
    },
    {
      value: getOrderStatusSpec(OrderStatusEnum.RECEIVED, 2).value,
      title: getOrderStatusSpec(OrderStatusEnum.RECEIVED, 2).title,
    },
    {
      value: getOrderStatusSpec(OrderStatusEnum.WAIT_PAY, 2).value,
      title: getOrderStatusSpec(OrderStatusEnum.WAIT_PAY, 2).title,
    },
    {
      value: getOrderStatusSpec(OrderStatusEnum.SUCCEEDED, 2).value,
      title: getOrderStatusSpec(OrderStatusEnum.SUCCEEDED, 2).title,
    },
    {
      value: getOrderStatusSpec(OrderStatusEnum.CANCELED, 2).value,
      title: getOrderStatusSpec(OrderStatusEnum.CANCELED, 2).title,
    },
    {
      value: getOrderStatusSpec(OrderStatusEnum.COMPLETED, 2).value,
      title: getOrderStatusSpec(OrderStatusEnum.COMPLETED, 2).title,
    },
  ]
}
