import { yupResolver } from '@hookform/resolvers/yup'
import { ChangeCircleSharp, SearchSharp } from '@mui/icons-material'
import { Grid, Icon, MenuItem, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchCustomers } from 'app/apis/accounts/customer.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { ICustomer, ICustomerResponse } from 'app/models/account'
import { columnCustomerAccounts } from 'app/utils/columns/columnsCustomerAccounts'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export interface Props {}

type ISearchFilters = {
  search?: string
  cusType?: number | string
  status?: number | string
  page?: number
  size?: number
  sort?: string
}

export default function CustomerAccounts(props: Props) {
  const navigate = useNavigateParams()
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])
  const [page, setPage] = useState<number>(
    queryParams.page ? +queryParams.page : 0,
  )
  const [size, setSize] = useState<number>(
    queryParams.size ? +queryParams.size : 20,
  )

  const [isSubmitted, setIsSubmitted] = useState(false)

  const [defaultValues] = useState<ISearchFilters>({
    search: queryParams.search ?? '',
    cusType: queryParams.cusType ?? 'all',
    status: queryParams.status ?? 'all',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
    sort: 'dateCreated,desc',
  })

  const [filters, setFilters] = useState<ISearchFilters>(
    extractMergeFiltersObject(defaultValues, {}),
  )

  const validationSchema = Yup.object().shape({
    account: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(255, 'hashtag must be at almost 256 characters'),
    email: Yup.string()
      .min(0, 'email must be at least 0 characters')
      .max(255, 'email must be at almost 256 characters'),
  })

  const methods = useForm<ISearchFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  }: UseQueryResult<ICustomerResponse, Error> = useQuery<
    ICustomerResponse,
    Error
  >(['customers', filters], () => fetchCustomers(filters), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: !!filters && isSubmitted,
  })

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        page: newPage,
      }
    })
    navigate('', {
      ...filters,
      page: newPage,
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
        size: parseInt(event.target.value, 10),
      }
    })
    navigate('', {
      ...filters,
      page: 0,
      size: parseInt(event.target.value, 10),
    } as any)
  }

  const onSubmitHandler: SubmitHandler<ISearchFilters> = (
    values: ISearchFilters,
  ) => {
    setIsSubmitted(true)
    setPage(0)
    setSize(20)

    setFilters(prevFilters => {
      return {
        ...extractMergeFiltersObject(prevFilters, {
          ...values,
          search: values.search ? values.search?.trim() : '',
        }),
        page: 0,
        size: 20,
      }
    })

    navigate('', {
      ...extractMergeFiltersObject(filters, {
        ...values,
        search: values.search ? values.search?.trim() : '',
      }),
      page: 0,
      size: 20,
    } as any)
  }

  const onRowUpdate = (cell: any, row: any) => {
    navigate(`${row.customerId}/thong-tin`, {})
  }

  const onClickRow = (cell: any, row: any) => {
    if (cell.action || cell.link) {
      navigate(`${row.customerId}/thong-tin`, {})
    }
  }

  const onResetFilters = () => {
    setIsSubmitted(false)

    methods.reset({
      search: '',
      cusType: 'all',
      status: 'all',
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

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý tài khoản end-user' }]} />
      </Box>
      <Stack gap={3}>
        <SimpleCard>
          <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
            <FormProvider {...methods}>
              <Grid container spacing={2}>
                <Grid item sm={4} xs={12}>
                  <FormInputText
                    label={'Email, SĐT, Tên hiển thị'}
                    type="text"
                    name="search"
                    size="small"
                    defaultValue=""
                    placeholder="Nhập Email, SĐT, Tên hiển thị"
                    fullWidth
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <SelectDropDown name="cusType" label="Loại tài khoản">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value={1}>Thường</MenuItem>
                    <MenuItem value={2}>KOL</MenuItem>
                  </SelectDropDown>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <SelectDropDown name="status" label="Trạng thái">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value={1}>Hoạt động</MenuItem>
                    <MenuItem value={-1}>Xoá</MenuItem>
                    <MenuItem value={-2}>Khoá</MenuItem>
                    <MenuItem value={-3}>Khoá tạm thời</MenuItem>
                  </SelectDropDown>
                </Grid>
                <Grid item sm={2} xs={6}>
                  <MuiButton
                    title="Tìm kiếm"
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ width: '100%' }}
                    startIcon={<Icon>person_search</Icon>}
                  />
                </Grid>
                <Grid item sm={2} xs={6}>
                  <MuiButton
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
            rows={data ? (data?.content as ICustomer[]) : []}
            columns={columnCustomerAccounts}
            rowsPerPage={size}
            page={page}
            onClickRow={onClickRow}
            isFetching={isFetching}
            error={isError ? error : null}
            actions={[
              {
                icon: 'edit',
                color: 'action',
                tooltip: 'Chi tiết',
                onClick: onRowUpdate,
              },
            ]}
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
    </Container>
  )
}
