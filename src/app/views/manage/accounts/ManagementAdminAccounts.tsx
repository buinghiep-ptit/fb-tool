import { yupResolver } from '@hookform/resolvers/yup'
import { PersonAddAltSharp, SearchSharp } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Grid, MenuItem, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { UseQueryResult } from '@tanstack/react-query'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useUpdateUserData, useUsersData } from 'app/hooks/queries/useUsersData'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { IUser, IUserResponse } from 'app/models/account'
import { columnsAdminAccounts } from 'app/utils/columns/columnsAdminAccounts'
import { useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

type ISearchFilters = {
  account?: string
  email?: string
  role?: string
  status?: string
  page?: number
  size?: number
  sort?: string
}

export interface Props {}

export default function AdminAccounts(props: Props) {
  const navigation = useNavigate()
  const navigate = useNavigateParams()
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(20)
  const [defaultValues] = useState<ISearchFilters>({
    role: 'all',
    status: 'all',
  })
  const [filters, setFilters] = useState<ISearchFilters>({
    page,
    size,
    sort: 'email,asc',
  })

  const onRowUpdateSuccess = (data: any) => {
    toastSuccess({ message: 'Cập nhật tài khoản thành công' })
  }
  const { mutate: editUser } = useUpdateUserData(onRowUpdateSuccess)

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
  }: UseQueryResult<IUserResponse, Error> = useUsersData(filters)

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
      if (cell.id === 'email') {
        navigation(`${row.userId}/chi-tiet`, {
          state: { modal: true, data: row },
        })
      } else if (cell.id === 'action') {
        editUser({
          ...row,
          status: row.status * -1,
        })
      }
    }
  }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý tài khoản Admin' }]} />
      </Box>
      <Stack gap={3}>
        <SimpleCard title="Quản lý TK Admin">
          <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
            <FormProvider {...methods}>
              <Grid container spacing={2}>
                <Grid item sm={3} xs={12}>
                  <FormInputText
                    label={'Tài khoản'}
                    type="text"
                    name="account"
                    defaultValue=""
                    size="small"
                    placeholder="Nhập tên tài khoản"
                    fullWidth
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <FormInputText
                    label={'Email'}
                    type="email"
                    name="email"
                    defaultValue=""
                    placeholder="Nhập Email"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item sm={3} xs={12}>
                  <SelectDropDown name="role" label="Quyền">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="1">Admin</MenuItem>
                    <MenuItem value="2">CS</MenuItem>
                    <MenuItem value="3">Sale</MenuItem>
                  </SelectDropDown>
                </Grid>
                <Grid item sm={3} xs={12}>
                  <SelectDropDown name="status" label="Trạng thái">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="1">Hoạt động</MenuItem>
                    <MenuItem value="-1">Không hoạt động</MenuItem>
                  </SelectDropDown>
                </Grid>
              </Grid>

              <Box mt={3}>
                <Grid container spacing={2}>
                  <Grid item sm={3} xs={12}>
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
                  <Grid item sm={6} xs={12}></Grid>
                  <Grid item sm={3} xs={12}>
                    <MuiButton
                      onClick={() =>
                        navigation(`them-moi`, {
                          state: { modal: true },
                        })
                      }
                      title="Thêm tài koản"
                      variant="contained"
                      color="primary"
                      sx={{ width: '100%' }}
                      startIcon={<PersonAddAltSharp />}
                    />
                  </Grid>
                </Grid>
              </Box>
            </FormProvider>
          </form>
        </SimpleCard>
        <SimpleCard>
          <MuiStyledTable
            rows={data ? (data?.content as IUser[]) : []}
            columns={columnsAdminAccounts}
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
    </Container>
  )
}
