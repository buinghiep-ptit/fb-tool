import { yupResolver } from '@hookform/resolvers/yup'
import {
  ArticleSharp,
  ChangeCircleSharp,
  ClearOutlined,
  ReportSharp,
  SearchSharp,
} from '@mui/icons-material'
import {
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  styled,
} from '@mui/material'
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
import { IFeed, IFeedResponse, IFeedsFilters } from 'app/models'
import { columnFeeds } from 'app/utils/columns'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import React, { useState } from 'react'
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

export default function ManagerFeed(props: Props) {
  const navigate = useNavigateParams()
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(20)
  const [isReset, setIsReset] = useState<boolean>(false)

  const [defaultValues] = useState<IFeedsFilters>({
    status: queryParams.status ?? 'all',
    isCampdi: queryParams.isCampdi ? true : false,
    isReported: queryParams.isReported ? true : false,
    search: queryParams.search ?? '',
    hashtag: queryParams.hashtag ?? '',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
  })

  const [filters, setFilters] = useState<IFeedsFilters>(
    extractMergeFiltersObject(defaultValues, {}),
  )

  const validationSchema = Yup.object().shape({
    search: Yup.string()
      .min(0, 'email must be at least 0 characters')
      .max(256, 'email must be at almost 256 characters'),
    hashtag: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(256, 'hashtag must be at almost 256 characters'),
  })

  const methods = useForm<IFeedsFilters>({
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
  }: UseQueryResult<IFeedResponse, Error> = useQuery<IFeedResponse, Error>(
    ['feeds', filters],
    () => fetchFeeds(filters),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!filters,
    },
  )

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
      size: +event.target.value,
    } as any)
  }

  const onSubmitHandler: SubmitHandler<IFeedsFilters> = (
    values: IFeedsFilters,
  ) => {
    setIsReset(false)
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
    setIsReset(true)
    methods.reset({
      status: 'all',
      isCampdi: false,
      isReported: false,
      search: '',
      hashtag: '',
      page: 0,
      size: 20,
    })
    setFilters({
      page,
      size,
    })

    navigate('', {
      page,
      size,
    } as any)
  }

  const onClickRow = (cell: any, row: any) => {
    if (cell.action) {
      navigate(`${14 ?? row.feedId}`, {})
    }
    console.log('cell:', cell, 'row:', row)
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
                  name="search"
                  size="small"
                  placeholder="Nhập email, sđt, tên"
                  fullWidth
                  defaultValue=""
                  iconEnd={
                    methods.watch('search')?.length ? (
                      <IconButton
                        onClick={() => methods.setValue('search', '')}
                        edge="end"
                      >
                        <ClearOutlined fontSize="small" />
                      </IconButton>
                    ) : (
                      <React.Fragment />
                    )
                  }
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
                  defaultValue=""
                  iconEnd={
                    methods.watch('hashtag')?.length ? (
                      <IconButton
                        onClick={() => methods.setValue('hashtag', '')}
                        edge="end"
                      >
                        <ClearOutlined fontSize="small" />
                      </IconButton>
                    ) : (
                      <React.Fragment />
                    )
                  }
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <MuiTypography variant="subtitle2" pb={1}>
                  Trạng thái
                </MuiTypography>
                <SelectDropDown name="status">
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="1">Đã duyệt</MenuItem>
                  <MenuItem value="0">Chờ hậu kiểm</MenuItem>
                  <MenuItem value="-1">Vi phạm</MenuItem>
                  <MenuItem value="-2">Xoá</MenuItem>
                </SelectDropDown>
              </Grid>
              <Grid item sm={3} xs={12}>
                <MuiTypography
                  variant="subtitle2"
                  pb={1}
                  sx={{ opacity: 0.35 }}
                >
                  Phạm vi
                </MuiTypography>
                <FormControl
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-root': {
                      height: 40,
                    },
                  }}
                >
                  <Select defaultValue={'all'} name="range" disabled>
                    <MenuItem value="all">Công khai</MenuItem>
                    <MenuItem value="friends">Bạn bè</MenuItem>
                    <MenuItem value="me">Chỉ mình tôi</MenuItem>
                  </Select>
                </FormControl>

                {/* <SelectDropDown name="range" disabled defaultValue={'all'}>
                  <MenuItem value="all">Công khai</MenuItem>
                  <MenuItem value="friends">Bạn bè</MenuItem>
                  <MenuItem value="me">Chỉ mình tôi</MenuItem>
                </SelectDropDown> */}
              </Grid>
            </Grid>
            <Grid item sm={4} xs={12} pt={2}>
              <MuiCheckBox name="isCampdi" label="Feed Campdi" />
              <MuiCheckBox name="isReported" label="Báo cáo vi phạm" />
            </Grid>
          </FormProvider>

          <Box pt={3}>
            <Grid container spacing={2}>
              <Grid item sm={2} xs={12}>
                <MuiButton
                  loading={!isReset && isFetching}
                  title="Tìm kiếm"
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ width: '100%' }}
                  startIcon={<SearchSharp />}
                />
              </Grid>
              <Grid item sm={2} xs={12}>
                <MuiButton
                  loading={isReset && isFetching}
                  title="Tạo lại"
                  variant="outlined"
                  color="primary"
                  onClick={onResetFilters}
                  sx={{ width: '100%' }}
                  startIcon={<ChangeCircleSharp />}
                />
              </Grid>
              <Grid item sm={8} xs={12}>
                <Stack flexDirection={'row'} justifyContent={'flex-end'}>
                  <MuiButton
                    title="Hậu kiểm"
                    variant="text"
                    color="secondary"
                    onClick={() => navigate(`hau-kiem`, {})}
                    startIcon={<ArticleSharp />}
                  />
                  <Divider
                    orientation="vertical"
                    sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 1 }}
                    flexItem
                  />
                  <NavLink to={'/quan-ly-feeds/bao-cao-vi-pham'}>
                    <MuiButton
                      title="Báo cáo vi phạm"
                      variant="text"
                      color="error"
                      type="submit"
                      sx={{ flex: 1 }}
                      startIcon={<ReportSharp />}
                    />
                  </NavLink>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </form>
        <Box mt={3}>
          <MuiStyledTable
            rows={data?.content as IFeed[]}
            columns={columnFeeds}
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
