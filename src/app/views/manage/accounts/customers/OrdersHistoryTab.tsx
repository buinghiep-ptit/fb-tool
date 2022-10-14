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
import { useOrdersData } from 'app/hooks/queries/useOrdersData'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { IOrderOverall } from 'app/models/order'
import { columnsOrdersCustomer } from 'app/utils/columns/columnsOrdersCustomer'
import { getOrderStatusSpec, OrderStatusEnum } from 'app/utils/enums/order'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import React, { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'

type ISearchFilters = {
  search?: string
  searchHandler?: string
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
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])

  const [page, setPage] = useState<number>(
    queryParams.page ? +queryParams.page : 0,
  )
  const [size, setSize] = useState<number>(
    queryParams.size ? +queryParams.size : 20,
  )

  const [defaultValues] = useState<ISearchFilters>({
    search: queryParams.search ?? '',
    searchHandler: queryParams.searchHandler ?? '',
    status: queryParams.status ?? 'all',
    from: queryParams.from ?? undefined,
    to: queryParams.to ?? undefined,
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
  })

  const [filters, setFilters] = useState<ISearchFilters>(
    extractMergeFiltersObject(defaultValues, {}),
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

  const validationSchema = Yup.object().shape({
    search: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(255, 'hashtag must be at almost 256 characters'),
    searchHandler: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(255, 'hashtag must be at almost 256 characters'),
    from: Yup.date()
      //   .min(new Date(), 'Tối thiều là hôm nay')
      .typeError('Sai dịnh dạng.')
      .nullable(),
    to: Yup.date()
      .when('startDate', (startDate, yup) => {
        if (startDate && startDate != 'Invalid Date') {
          const dayAfter = new Date(startDate.getTime() + 86400000)
          return yup.min(dayAfter, 'Ngày kết thúc phải lớn hơn ngày đắt đầu')
        }
        return yup
      })
      .typeError('Sai định dạng.')
      .nullable(),
  })

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
    values = {
      ...values,
      from: (values.from as any)?.toISOString(),
      to: (values.to as any)?.toISOString(),
    }
    setFilters(prevFilters => {
      return {
        ...extractMergeFiltersObject(prevFilters, values),
        page,
        size,
      }
    })

    navigate('', {
      ...extractMergeFiltersObject(filters, values),
      page,
      size,
    } as any)
  }

  const onResetFilters = () => {
    methods.reset({
      searchHandler: '',
      status: 'all',
      search: '',
      from: undefined,
      to: undefined,
      page: 0,
      size: 20,
    })
    setPage(0)
    setSize(20)

    setFilters({
      page: 0,
      size: 20,
    })

    navigate('', {
      page: 0,
      size: 20,
    } as any)
  }

  const onClickRow = (cell: any, row: any) => {
    if (cell.action) {
      navigation(`${row.orderId}`, {})
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
            onClick={() => navigation(-1)}
            startIcon={<Icon>keyboard_return</Icon>}
          />
        </Stack>
        <SimpleCard title="Danh sách đơn hàng">
          <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
            <FormProvider {...methods}>
              <Grid container spacing={2}>
                <Grid item sm={3} xs={12}>
                  <FormInputText
                    label={'Số điện thoại, email'}
                    type="text"
                    name="search"
                    defaultValue=""
                    placeholder="Nhập số điện thoại, email"
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
                    <MuiRHFDatePicker name="from" label="Ngày bắt đầu" />
                  </Grid>
                  <Grid item sm={3} xs={12} mt={-1}>
                    <MuiRHFDatePicker name="to" label="Ngày kết thúc" />
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
