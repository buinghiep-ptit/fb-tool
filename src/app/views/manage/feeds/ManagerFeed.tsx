import { yupResolver } from '@hookform/resolvers/yup'
import { ArticleSharp, ReportSharp, SearchSharp } from '@mui/icons-material'
import { Grid, MenuItem, styled } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchFeeds } from 'app/apis/feed/feed.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import { MuiCheckBox } from 'app/components/common/MuiCheckbox'
import FormInputText from 'app/components/common/MuiInputText'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { SelectDropDown } from 'app/components/common/MuiSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { IFeed, IFeedResponse } from 'app/models'
import { columnFeeds } from 'app/utils/columns/columnsFeeds'
import { useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { NavLink, useSearchParams } from 'react-router-dom'
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
  email?: string
  hashtag?: string
  status?: string
  range?: string
  feedcamp?: boolean
  page?: number
  rowsPerPage?: number
}

export default function ManagerFeed(props: Props) {
  const navigate = useNavigateParams()
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const [defaultValues] = useState<ISearchFilters>({
    status: 'all',
    range: 'public',
    feedcamp: false,
  })

  const [filters, setFilters] = useState<ISearchFilters>(defaultValues)

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .min(0, 'email must be at least 0 characters')
      .max(256, 'email must be at almost 256 characters'),
    hashtag: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(256, 'hashtag must be at almost 256 characters'),
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
      navigate(`${row.id}`, {})
    }
    console.log('cell:', cell, 'row:', row)
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
  // if (!isLoading && !(data as IFeedResponse).content?.length)
  //   return (
  //     <Box my={2} textAlign="center">
  //       <MuiTypography variant="h1">No Data Found</MuiTypography>
  //     </Box>
  //   )

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý Feed' }]} />
      </Box>
      <SimpleCard title="Quản lý Feed">
        <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
          <FormProvider {...methods}>
            <Grid container spacing={2}>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Email, SĐT, Tên hiển thị
                </MuiTypography>
                <FormInputText
                  type="text"
                  name="email"
                  size="small"
                  placeholder="Nhập email, sđt, tên"
                  fullWidth
                  // focused
                  // required
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Hashtag
                </MuiTypography>
                <FormInputText
                  type="text"
                  name="hashtag"
                  placeholder="Nhập hashtag"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Trạng thái
                </MuiTypography>
                <SelectDropDown name="status">
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="approved">Đã duyệt</MenuItem>
                  <MenuItem value="pending">Chờ hậu kiểm</MenuItem>
                  <MenuItem value="infringe">Vi phạm</MenuItem>
                  <MenuItem value="remove">Xoá</MenuItem>
                </SelectDropDown>
              </Grid>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Phạm vi
                </MuiTypography>
                <SelectDropDown name="range" disabled>
                  <MenuItem value="public">Công khai</MenuItem>
                  <MenuItem value="friends">Bạn bè</MenuItem>
                  <MenuItem value="me">Chỉ mình tôi</MenuItem>
                </SelectDropDown>
              </Grid>

              <Grid item sm={3} xs={12}>
                <MuiCheckBox name="feedcamp" />
              </Grid>
            </Grid>
          </FormProvider>
          <Box py={2}>
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
              <Grid item sm={3} xs={12}></Grid>
              <Grid item sm={3} xs={12}>
                <MuiButton
                  title="Hậu kiểm"
                  variant="outlined"
                  color="secondary"
                  type="submit"
                  sx={{ width: '100%' }}
                  startIcon={<ArticleSharp />}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <NavLink to={'/quan-ly-feeds/bao-cao-vi-pham'}>
                  <MuiButton
                    title="Báo cáo vi phạm"
                    variant="outlined"
                    color="error"
                    type="submit"
                    sx={{ width: '100%' }}
                    startIcon={<ReportSharp />}
                  />
                </NavLink>
              </Grid>
            </Grid>
          </Box>
        </form>
        <Box mt={2}>
          <MuiStyledTable
            rows={data?.content as IFeed[]}
            columns={columnFeeds}
            onClickRow={onClickRow}
            isFetching={isFetching}
          />
          <MuiStyledPagination
            component="div"
            rowsPerPageOptions={[10, 25, 100]}
            count={data?.totalElements as number}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </SimpleCard>
    </Container>
  )
}
