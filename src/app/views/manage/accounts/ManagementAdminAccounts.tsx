import { yupResolver } from '@hookform/resolvers/yup'
import {
  ChangeCircleSharp,
  PersonAddAltSharp,
  SearchSharp,
} from '@mui/icons-material'
import { Grid, MenuItem, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { UseQueryResult } from '@tanstack/react-query'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useUpdateUserData, useUsersData } from 'app/hooks/queries/useUsersData'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { IUser, IUserResponse } from 'app/models/account'
import { columnsAdminAccounts } from 'app/utils/columns/columnsAdminAccounts'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import { messages } from 'app/utils/messages'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'
import { DiagLogConfirm } from '../orders/details/ButtonsLink/DialogConfirm'

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

type ISearchFilters = {
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
  const queryParams = Object.fromEntries([...searchParams])
  const [page, setPage] = useState<number>(
    queryParams.page ? +queryParams.page : 0,
  )
  const [size, setSize] = useState<number>(
    queryParams.size ? +queryParams.size : 20,
  )
  const [titleDialog, setTitleDialog] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [row, setRow] = useState<any>({})
  const [defaultValues] = useState<ISearchFilters>({
    role: queryParams.role ?? 'all',
    status: queryParams.status ?? 'all',
    email: queryParams.email ?? '',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
  })

  const [filters, setFilters] = useState<ISearchFilters>(
    extractMergeFiltersObject(defaultValues, {}),
  )

  const onRowUpdateSuccess = (data: any) => {
    toastSuccess({
      message: row.status === 1 ? messages.MSG31 : messages.MSG32,
    })
    setOpenDialog(false)
  }
  const { mutate: editUser } = useUpdateUserData(onRowUpdateSuccess)

  const changeStatusUser = () => {
    editUser({
      ...row,
      status: row.status * -1,
    })
  }

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
      page: 0,
      size: parseInt(event.target.value, 10),
    } as any)
  }

  const onSubmitHandler: SubmitHandler<ISearchFilters> = (
    values: ISearchFilters,
  ) => {
    setPage(0)
    setSize(20)

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

  const onClickRow = (cell: any, row: any) => {
    if (cell.action) {
      if (cell.id === 'email') {
        navigation(`${row.userId}/chi-tiet`, {
          state: { modal: true, data: row },
        })
      } else if (cell.id === 'action') {
        setTitleDialog(
          row.status === 1 ? 'Khoá tài khoản' : 'Mở khoá tài khoản',
        )
        setOpenDialog(true)
        setRow(row)
      }
    }
  }

  const onResetFilters = () => {
    methods.reset({
      email: '',
      role: 'all',
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
        <Breadcrumb routeSegments={[{ name: 'Quản lý tài khoản Admin' }]} />
      </Box>
      <Stack gap={3}>
        <SimpleCard title="">
          <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
            <FormProvider {...methods}>
              <Grid container spacing={2}>
                <Grid item sm={4} xs={12}>
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
                <Grid item sm={4} xs={12}>
                  <SelectDropDown name="role" label="Quyền">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="1">Admin</MenuItem>
                    <MenuItem value="2">CS</MenuItem>
                    <MenuItem value="3">Sale</MenuItem>
                    <MenuItem value="4">MKT</MenuItem>
                  </SelectDropDown>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <SelectDropDown name="status" label="Trạng thái">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="1">Hoạt động</MenuItem>
                    <MenuItem value="-1">Không hoạt động</MenuItem>
                  </SelectDropDown>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item sm={3} xs={6}>
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
                  <Grid item sm={3} xs={6}>
                    <MuiButton
                      title="Làm mới"
                      variant="outlined"
                      color="primary"
                      onClick={onResetFilters}
                      sx={{ width: '100%' }}
                      startIcon={<ChangeCircleSharp />}
                    />
                  </Grid>
                  <Grid item sm={3} xs={6}></Grid>
                  <Grid item sm={3} xs={6}>
                    <MuiButton
                      onClick={() =>
                        navigation(`them-moi`, {
                          state: { modal: true },
                        })
                      }
                      title="Thêm người dùng"
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

      <DiagLogConfirm
        title={titleDialog}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={changeStatusUser}
      >
        <Stack py={5} justifyContent={'center'} alignItems="center">
          <MuiTypography variant="subtitle1">
            {row.status === 1
              ? 'Bạn có chắc chắn muốn khoá tài khoản'
              : 'Bạn có đồng ý mở khoá cho tài khoản'}
          </MuiTypography>
          <MuiTypography variant="subtitle1" color="primary">
            {row.email}
          </MuiTypography>
        </Stack>
      </DiagLogConfirm>
    </Container>
  )
}
