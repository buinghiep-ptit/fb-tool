import { yupResolver } from '@hookform/resolvers/yup'
import { PersonAddAltSharp, SearchSharp } from '@mui/icons-material'
import { Grid, MenuItem, styled } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchFeeds } from 'app/apis/feed/feed.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiInputText'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { SelectDropDown } from 'app/components/common/MuiSelectDropdown'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { IFeedResponse } from 'app/models'
import { IAccount } from 'app/models/account'
import { columnsAdminAccounts } from 'app/utils/columns/columnsAdminAccounts'
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

const DATA: (IAccount & { action?: number })[] = [
  {
    id: 1,
    account: 'nghiepbv2',
    email: 'nghiepbvptit@gmail.com',
    role: 1,
    dateUpdated: 1661869487000,
    userUpdated: 'nghiepbv2',
    status: 1,
    action: 1,
  },
  {
    id: 2,
    account: 'quanbv',
    email: 'quanbv@gmail.com',
    role: 2,
    dateUpdated: 1661869487000,
    userUpdated: 'quanbv',
    status: 0,
    action: 0,
  },
]

export interface Props {}

type ISearchFilters = {
  account?: string
  email?: string
  role?: string
  status?: string
  page?: number
  rowsPerPage?: number
}

export default function AdminAccounts(props: Props) {
  const navigate = useNavigateParams()
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [titleModal, setTitleModal] = useState<string>('')

  const [defaultValues] = useState<ISearchFilters>({
    role: 'all',
    status: 'all',
  })

  const [filters, setFilters] = useState<ISearchFilters>(defaultValues)

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
        setRowsPerPage(parseInt(queryParams.rowsPerPage) || 10)

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
  }: UseQueryResult<IFeedResponse, Error> = useQuery<IFeedResponse, Error>(
    ['feeds', filters],
    () => fetchFeeds({ page: page, sortId: 4 }),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!filters,
    },
  )

  const handleChangePage = (event: unknown, newPage: number) => {
    // setPage(newPage)
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
    // setRowsPerPage(+event.target.value)
    // setPage(0)
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        page: 0,
        rowsPerPage: +event.target.value,
      }
    })
    navigate('', {
      ...filters,
      rowsPerPage: +event.target.value,
    } as any)
  }

  const onSubmitHandler: SubmitHandler<ISearchFilters> = (
    values: ISearchFilters,
  ) => {
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        ...values,
        page,
        rowsPerPage,
      }
    })
    navigate('', {
      ...filters,
      ...values,
      page,
      rowsPerPage,
    } as any)
  }

  const onClickRow = (cell: any, row: any) => {
    if (cell.action) {
      if (cell.id === 'account') {
        setTitleModal('Chi tiết tài khoản')
        setOpenModal(true)
      } else if (cell.id === 'action') {
        console.log('Toggle active user')
      }
    }
  }

  if (isLoading) return <MuiLoading />

  if (isError)
    return (
      <Box my={2} textAlign="center">
        <MuiTypography variant="h1">
          Have an errors: {error.message}
        </MuiTypography>
      </Box>
    )

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý tài khoản Admin' }]} />
      </Box>
      <SimpleCard title="Quản lý TK Admin">
        <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
          <FormProvider {...methods}>
            <Grid container spacing={2}>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Tài khoản
                </MuiTypography>
                <FormInputText
                  type="text"
                  name="account"
                  size="small"
                  placeholder="Nhập Tên tài khoản"
                  fullWidth
                  // focused
                  // required
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Email
                </MuiTypography>
                <FormInputText
                  type="email"
                  name="email"
                  placeholder="Nhập Email"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Quyền
                </MuiTypography>
                <SelectDropDown name="role">
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="sa">Super Admin</MenuItem>
                  <MenuItem value="operators">Vận hành</MenuItem>
                </SelectDropDown>
              </Grid>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Trạng thái
                </MuiTypography>
                <SelectDropDown name="status">
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="de-active">Không hoạt động</MenuItem>
                </SelectDropDown>
              </Grid>
            </Grid>
          </FormProvider>
        </form>
        <Box mt={3}>
          <Grid container spacing={2}>
            <Grid item sm={3} xs={12}>
              <MuiButton
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
                onClick={() => {
                  setTitleModal('Thêm tài khoản')
                  setOpenModal(true)
                }}
                title="Thêm tài koản"
                variant="contained"
                color="primary"
                sx={{ width: '100%' }}
                startIcon={<PersonAddAltSharp />}
              />
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <MuiStyledTable
            rows={DATA as IAccount[]}
            columns={columnsAdminAccounts}
            onClickRow={onClickRow}
            isFetching={isFetching}
          />
          <MuiStyledPagination
            component="div"
            rowsPerPageOptions={[10, 25, 100]}
            count={DATA.length as number}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </SimpleCard>
      <MuiStyledModal
        title={titleModal}
        open={openModal}
        setOpenModal={setOpenModal}
      >
        <Box
          sx={{
            paddingLeft: {
              xs: '6.66%',
              sm: '13.33%',
            },
            paddingRight: {
              xs: '6.66%',
              sm: '13.33%',
            },
          }}
        >
          <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
            <FormProvider {...methods}>
              <Grid container alignItems={'center'} py={1}>
                <Grid item sm={4} xs={12}>
                  <MuiTypography variant="subtitle2" pb={1}>
                    Tên đăng nhập:*
                  </MuiTypography>
                </Grid>
                <Grid item sm={8} xs={12}>
                  <FormInputText
                    type="text"
                    name="account"
                    size="small"
                    placeholder="Nhập tên tài khoản"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container alignItems={'center'} py={1}>
                <Grid item sm={4} xs={12}>
                  <MuiTypography variant="subtitle2" pb={1}>
                    Email:*
                  </MuiTypography>
                </Grid>
                <Grid item sm={8} xs={12}>
                  <FormInputText
                    type="email"
                    name="email"
                    placeholder="Nhập Email"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container alignItems={'center'} py={1}>
                <Grid item sm={4} xs={12}>
                  <MuiTypography variant="subtitle2" pb={1}>
                    Họ và tên:*
                  </MuiTypography>
                </Grid>
                <Grid item sm={8} xs={12}>
                  <FormInputText
                    type="text"
                    name="name"
                    placeholder="Nhập họ và tên"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container alignItems={'center'} py={1}>
                <Grid item sm={4} xs={12}>
                  <MuiTypography variant="subtitle2" pb={1}>
                    Trạng thái:*
                  </MuiTypography>
                </Grid>
                <Grid item sm={8} xs={12}>
                  <SelectDropDown name="status">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="active">Hoạt động</MenuItem>
                    <MenuItem value="de-active">Không hoạt động</MenuItem>
                  </SelectDropDown>
                </Grid>
              </Grid>
              <Grid container alignItems={'center'} py={1}>
                <Grid item sm={4} xs={12}>
                  <MuiTypography variant="subtitle2" pb={1}>
                    Nhóm quyền:*
                  </MuiTypography>
                </Grid>
                <Grid item sm={8} xs={12}>
                  <SelectDropDown name="role">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="sa">Super Admin</MenuItem>
                    <MenuItem value="operators">Vận hành</MenuItem>
                    <MenuItem value="operators">Sale</MenuItem>
                  </SelectDropDown>
                </Grid>
              </Grid>
            </FormProvider>
          </form>
        </Box>
      </MuiStyledModal>
    </Container>
  )
}
