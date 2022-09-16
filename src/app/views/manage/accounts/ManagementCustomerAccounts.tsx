import { yupResolver } from '@hookform/resolvers/yup'
import { SearchSharp } from '@mui/icons-material'
import { Grid, MenuItem, styled } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchCustomers } from 'app/apis/accounts/customer.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiInputText'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { SelectDropDown } from 'app/components/common/MuiSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { ICustomer, ICustomerResponse } from 'app/models/account'
import { columnCustomerAccounts } from 'app/utils/columns/columnsCustomerAccounts'
import { useEffect, useState } from 'react'
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
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(20)
  const [defaultValues] = useState<ISearchFilters>({
    cusType: 'all',
    status: 'all',
  })
  const [filters, setFilters] = useState<ISearchFilters>({
    page,
    size,
    sort: 'email,asc',
  })

  const validationSchema = Yup.object().shape({
    account: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(256, 'hashtag must be at almost 256 characters'),
    email: Yup.string()
      .min(0, 'email must be at least 0 characters')
      .max(256, 'email must be at almost 256 characters'),
  })

  const methods = useForm<ISearchFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  useEffect(() => {
    if (searchParams) {
      const queryParams = Object.fromEntries([...searchParams])
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
    enabled: !!filters,
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
      size: parseInt(event.target.value, 10),
    } as any)
  }

  const onSubmitHandler: SubmitHandler<ISearchFilters> = (
    values: ISearchFilters,
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

  const onClickRow = (cell: any, row: any) => {
    if (cell.action) {
      if (cell.id === 'mobilePhone') {
        navigate(`${row.customerId}/info`, {})
      } else if (cell.id === 'action') {
        console.log('Toggle active user')
      }
    }
  }

  if (isLoading) return <MuiLoading />

  if (isError)
    return (
      <Box my={2} textAlign="center">
        <MuiTypography variant="h5">
          Have an errors: {error.message}
        </MuiTypography>
      </Box>
    )

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý tài khoản KH' }]} />
      </Box>
      <SimpleCard title="Quản lý TK KH">
        <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
          <FormProvider {...methods}>
            <Grid container spacing={2}>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Email, SĐT, Tên hiển thị
                </MuiTypography>
                <FormInputText
                  type="text"
                  name="search"
                  size="small"
                  defaultValue=""
                  placeholder="Nhập Email, SĐT, Tên hiển thị"
                  fullWidth
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Loại tài khoản
                </MuiTypography>
                <SelectDropDown name="cusType">
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value={1}>Thường</MenuItem>
                  <MenuItem value={2}>KOL</MenuItem>
                </SelectDropDown>
              </Grid>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Trạng thái
                </MuiTypography>
                <SelectDropDown name="status">
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value={1}>Hoạt động</MenuItem>
                  <MenuItem value={-1}>Không hoạt động</MenuItem>
                  <MenuItem value={-2}>Khoá</MenuItem>
                  <MenuItem value={-3}>Khoá tạm thời</MenuItem>
                </SelectDropDown>
              </Grid>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  {'Tìm kiếm'}
                </MuiTypography>
                <MuiButton
                  title="Tìm kiếm"
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

        <Box mt={3}>
          <MuiStyledTable
            rows={data?.content as ICustomer[]}
            columns={columnCustomerAccounts}
            onClickRow={onClickRow}
            isFetching={isFetching}
          />
          <MuiStyledPagination
            component="div"
            rowsPerPageOptions={[20, 50, 100]}
            count={data?.totalElements as number}
            rowsPerPage={size}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </SimpleCard>
    </Container>
  )
}
