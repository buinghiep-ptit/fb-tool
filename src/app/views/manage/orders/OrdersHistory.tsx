import { yupResolver } from '@hookform/resolvers/yup'
import { SearchSharp } from '@mui/icons-material'
import { Grid, Icon, MenuItem, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { UseQueryResult } from '@tanstack/react-query'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiNavTabs } from 'app/components/common/MuiNavTabs'
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
import {
  columnOrdersCancel,
  columnOrdersOverall,
  columnOrdersProcess,
} from 'app/utils/columns/columnsOrders'
import { getOrderStatusSpec, OrderStatusEnum } from 'app/utils/enums/order'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import { messages } from 'app/utils/messages'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'
import { DiagLogConfirm } from './details/ButtonsLink/DialogConfirm'

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export const navOrdersHistory = {
  rootName: 'Quản lý đơn hàng',
  path: 'quan-ly-don-hang',
  items: [
    {
      tab: 'xu-ly',
      label: 'Cần xử lý',
    },
    {
      tab: 'tat-ca',
      label: 'Tất cả',
    },
    {
      tab: 'yeu-cau-huy',
      label: 'Yêu cầu huỷ',
    },
  ],
}

type ISearchFilters = {
  search?: string
  searchHandler?: string
  status?: string
  from?: any
  to?: any
  page?: number
  size?: number
  sort?: string
  isPending?: 1 | 0
}

export const dateDefault = () => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7)

  return {
    startDate: moment(startDate),
    endDate: moment(endDate),
  }
}

export interface Props {}

export default function OrdersHistory() {
  const navigation = useNavigate()
  const navigate = useNavigateParams()
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
    search: queryParams.search ?? '',
    searchHandler: queryParams.searchHandler ?? '',
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

  const filtersRef = useRef(
    extractMergeFiltersObject(
      {
        ...defaultValues,
        from: defaultValues.from,
        to: defaultValues.to,
      },
      {},
    ),
  )

  const { source, orderId: id } = useParams() ?? 0

  const tabRef = useRef<number>(-1)

  const getCurrentTabIndex = (source: string) => {
    const index = navOrdersHistory.items.findIndex(item =>
      source.includes(item.tab),
    )
    return index
  }

  const [tabName, setTabName] = useState(navOrdersHistory.items[0].label)
  const [currentTab, setCurrentTab] = useState<number>(
    getCurrentTabIndex(source ?? ''),
  )

  useEffect(() => {
    // const idx = getCurrentTabIndex(source ?? '')
    // if (idx !== -1) {
    //   setTabName(navOrdersHistory.items[idx].label)
    // }
    if (tabRef && tabRef.current != -1) {
      onResetFilters()
    }
    tabRef.current = currentTab
  }, [currentTab])

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }: UseQueryResult<any, Error> = useOrdersData(filters, currentTab)

  const validationSchema = Yup.object().shape(
    {
      search: Yup.string()
        .min(0, 'hashtag must be at least 0 characters')
        .max(255, 'Nội dung không được vượt quá 255 ký tự'),
      searchHandler: Yup.string()
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

  const from = methods.watch('from')
  const to = methods.watch('to')

  useEffect(() => {
    if (!from || !to) return

    if (moment(new Date(from)).unix() <= moment(new Date(to)).unix()) {
      methods.clearErrors('from')
      methods.clearErrors('to')
    }
  }, [from, to])

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
      search: values.search?.trim(),
      searchHandler: values.searchHandler?.trim(),
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

    if (
      JSON.stringify(filtersRef.current) ===
      JSON.stringify({
        ...extractMergeFiltersObject(filters, values),
        page: 0,
        size: 20,
      })
    ) {
      refetch()
    }

    filtersRef.current = {
      ...extractMergeFiltersObject(filters, values),
      page: 0,
      size: 20,
    }

    navigate('', {
      ...extractMergeFiltersObject(filters, values),
      page: 0,
      size: 20,
    } as any)
  }

  const onResetFilters = () => {
    methods.reset({
      searchHandler: '',
      status: 'all',
      search: '',
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

  const onClickRow = (cell: any, row: any) => {
    if (cell.id === 'action') {
      if (row.status === 0 || row.cancelRequestStatus === 0) {
        if (currentTab === 0) {
          setReceiveType(1)
        } else if (currentTab === 1) {
          setReceiveType(row.cancelRequestStatus === 0 ? 2 : 1)
        } else if (currentTab === 2) {
          setReceiveType(2)
        }

        setTitleDialog('Tiếp nhận')
        setOrderId(row.orderId)
        setOpenDialog(true)
      } else {
        navigation(`${row.orderId}`, {})
      }
    } else if (cell.id === 'cusAccount') {
      window.open(
        `/quan-ly-tai-khoan-khach-hang/${row?.customerId}/lich-su-dat-cho`,
        '_blank',
      )
    } else if (cell.id === 'campGroundName') {
      window.open(`/chi-tiet-diem-camp/${row?.campGroundId}`, '_blank')
      // navigation(`/chi-tiet-diem-camp/${row?.campGroundId}`, {})
    } else if (cell.id === 'campGroundRepresent') {
      window.open(`/cap-nhat-thong-tin-doi-tac/${row?.merchantId}`, '_blank')
      // navigation(`/cap-nhat-thong-tin-doi-tac/${row?.merchantId}`, {})
    }
  }

  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    setOpenDialog(false)
    navigation(`${orderId}`, {})
  }
  const { mutate: receive, isLoading: approveLoading } = useReceiveOrder(() =>
    onSuccess(null, 'Tiếp nhận đơn hàng thành công'),
  )
  const { mutate: receiveCancel, isLoading: cancelLoading } =
    useReceiveCancelOrder(() =>
      onSuccess(null, 'Tiếp nhận yêu cầu huỷ thành công'),
    )

  const approveConfirm = () => {
    console.log(receiveType)
    if (receiveType === 1) {
      receive(orderId)
    } else if (receiveType === 2) {
      receiveCancel(orderId)
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
    <Container>
      <React.Fragment>
        <Box className="breadcrumb">
          <Breadcrumb
            routeSegments={[
              {
                name: navOrdersHistory.rootName,
                path: `/${navOrdersHistory.path}`,
              },
              { name: tabName },
            ]}
          />
        </Box>
        <Stack mt={-2} gap={3}>
          <MuiNavTabs
            navInfo={navOrdersHistory}
            id={id ?? 0}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            data={data ?? []}
          />
          <SimpleCard>
            <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
              <FormProvider {...methods}>
                <Grid container spacing={2}>
                  <Grid item sm={4} xs={12}>
                    <FormInputText
                      label={'Số điện thoại, email người đặt'}
                      type="text"
                      name="search"
                      defaultValue=""
                      placeholder="Nhập số điện thoại, email người đặt"
                      fullWidth
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <FormInputText
                      label={'Email người tiếp nhận'}
                      type="text"
                      name="searchHandler"
                      defaultValue=""
                      placeholder="Nhập email người tiếp nhận"
                      fullWidth
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <SelectDropDown name="status" label="Trạng thái">
                      <MenuItem value="all">Tất cả</MenuItem>
                      {getDropdownMenuItems(currentTab).map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                          {item.title}
                        </MenuItem>
                      ))}
                    </SelectDropDown>
                  </Grid>
                </Grid>

                <Box mt={1}>
                  <Grid container spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Grid item sm={4} xs={12}>
                        <MuiRHFDatePicker name="from" label="Ngày bắt đầu" />
                      </Grid>
                      <Grid item sm={4} xs={12}>
                        <MuiRHFDatePicker name="to" label="Ngày kết thúc" />
                      </Grid>
                    </LocalizationProvider>
                    <Grid item sm={2} xs={12} mt={1}>
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
                    <Grid item sm={2} xs={12} mt={1}>
                      <MuiButton
                        title="Làm mới"
                        variant="outlined"
                        color="primary"
                        onClick={onResetFilters}
                        sx={{ width: '100%' }}
                        startIcon={<Icon>cached</Icon>}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </FormProvider>
            </form>
          </SimpleCard>

          <SimpleCard>
            <MuiStyledTable
              rows={data ? (data?.content as IOrderOverall[]) : []}
              columns={getColumns(currentTab)}
              actionKeys={['status', 'cancelRequestStatus']}
              rowsPerPage={size}
              page={page}
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
      </React.Fragment>

      <DiagLogConfirm
        title={titleDialog}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={approveConfirm}
        isLoading={approveLoading || cancelLoading}
      >
        <Stack py={5} justifyContent={'center'} alignItems="center">
          <MuiTypography variant="subtitle1">Đồng ý tiếp nhận?</MuiTypography>
        </Stack>
      </DiagLogConfirm>
    </Container>
  )
}

const getColumns = (tabIndex: number) => {
  switch (tabIndex) {
    case 0:
      return columnOrdersProcess

    case 1:
      return columnOrdersOverall

    case 2:
      return columnOrdersCancel
    default:
      return columnOrdersOverall
  }
}

const getDropdownMenuItems = (tabIndex: number) => {
  switch (tabIndex) {
    case 0:
      return [
        {
          value: getOrderStatusSpec(OrderStatusEnum.CHECK, 1).value,
          title: getOrderStatusSpec(OrderStatusEnum.CHECK, 1).title,
        },
        {
          value: getOrderStatusSpec(OrderStatusEnum.RECEIVED, 1).value,
          title: getOrderStatusSpec(OrderStatusEnum.RECEIVED, 1).title,
        },
        {
          value: getOrderStatusSpec(OrderStatusEnum.WAIT_PAY, 1).value,
          title: getOrderStatusSpec(OrderStatusEnum.WAIT_PAY, 1).title,
        },
        {
          value: getOrderStatusSpec(OrderStatusEnum.SUCCEEDED, 1).value,
          title: getOrderStatusSpec(OrderStatusEnum.SUCCEEDED, 1).title,
        },
      ]

    case 1:
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

    case 2:
      return [
        {
          value: getOrderStatusSpec(OrderStatusEnum.RECEIVED).value,
          title: getOrderStatusSpec(OrderStatusEnum.RECEIVED).title,
        },
        {
          value: getOrderStatusSpec(OrderStatusEnum.WAIT_HANDLE).value,
          title: getOrderStatusSpec(OrderStatusEnum.WAIT_HANDLE).title,
        },
        {
          value: getOrderStatusSpec(OrderStatusEnum.HANDLE_COMPLETED).value,
          title: getOrderStatusSpec(OrderStatusEnum.HANDLE_COMPLETED).title,
        },
      ]

    default:
      return []
  }
}
