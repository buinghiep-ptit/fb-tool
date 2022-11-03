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
  Icon,
  IconButton,
  InputLabel,
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
import { MuiCheckBox } from 'app/components/common/MuiRHFCheckbox'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useApproveFeed } from 'app/hooks/queries/useFeedsData'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { IFeed, IFeedResponse, IFeedsFilters } from 'app/models'
import { columnFeeds } from 'app/utils/columns'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import React, { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
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

export interface Props {}

export default function ManagerFeed(props: Props) {
  const navigate = useNavigateParams()
  const navigation = useNavigate()
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])
  const [page, setPage] = useState<number>(
    queryParams.page ? +queryParams.page : 0,
  )
  const [size, setSize] = useState<number>(
    queryParams.size ? +queryParams.size : 20,
  )
  const [isReset, setIsReset] = useState<boolean>(false)

  const [defaultValues] = useState<IFeedsFilters>({
    status: queryParams.status ?? 'all',
    isCampdi: queryParams.isCampdi ? true : false,
    // isReported: queryParams.isReported ? true : false,
    search: queryParams.search ?? '',
    hashtag: queryParams.hashtag ?? '',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
  })

  const [filters, setFilters] = useState<IFeedsFilters>(
    extractMergeFiltersObject(defaultValues, {}),
  )

  const [titleDialog, setTitleDialog] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState(1)
  const [feedId, setFeedId] = useState(0)

  const validationSchema = Yup.object().shape({
    search: Yup.string()
      .min(0, 'email must be at least 0 characters')
      .max(255, 'email must be at almost 256 characters'),
    hashtag: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(255, 'hashtag must be at almost 256 characters'),
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
      page: 0,
      size: +event.target.value,
    } as any)
  }

  const onSubmitHandler: SubmitHandler<IFeedsFilters> = (
    values: IFeedsFilters,
  ) => {
    setPage(0)
    setSize(20)
    setIsReset(false)
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
    setIsReset(true)
    methods.reset({
      status: 'all',
      isCampdi: false,
      // isReported: false,
      search: '',
      hashtag: '',
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

  const onSuccess = (data: any) => {
    toastSuccess({
      message: dialogType === 1 ? 'Duyệt bài thành công' : '',
    })
    setOpenDialog(false)
  }
  const { mutate: approve, isLoading: approveLoading } =
    useApproveFeed(onSuccess)

  const approveConfirm = () => {
    approve(feedId)
  }

  const onRowUpdate = (cell: any, row: any) => {
    navigation(`${row.feedId}`, {})
  }

  const onRowApprove = (cell: any, row: any) => {
    setTitleDialog('Duyệt bài đăng')
    setFeedId(row.feedId)
    setOpenDialog(true)
  }
  const onRowReport = (cell: any, row: any) => {
    navigation(`ds/${row.feedId ?? 0}/vi-pham`, {
      state: { modal: true },
    })
  }

  const onClickRow = (cell: any, row: any) => {
    if (cell.id === 'account') {
      navigation(`${row.feedId}`, {})
    }
  }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý Feed' }]} />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        <MuiButton
          title="Thêm mới feed campdi"
          variant="contained"
          color="primary"
          type="submit"
          onClick={() => navigation(`them-moi-feed`, {})}
          startIcon={<Icon>control_point</Icon>}
        />
      </Stack>
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
                <Grid item sm={4} xs={12}>
                  <FormInputText
                    label={'Hashtag'}
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
                <Grid item sm={4} xs={12}>
                  <SelectDropDown name="status" label="Trạng thái">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="1">Hợp lệ</MenuItem>
                    <MenuItem value="0">Chờ hậu kiểm</MenuItem>
                    <MenuItem value="-1">Vi phạm</MenuItem>
                    <MenuItem value="-2">Bị báo cáo</MenuItem>
                    <MenuItem value="-3">Xoá</MenuItem>
                  </SelectDropDown>
                </Grid>
                {/* <Grid item sm={3} xs={12}>
                  <SelectDropDown name="range" disabled defaultValue={'all'}>
                    <MenuItem value="all">Công khai</MenuItem>
                    <MenuItem value="friends">Bạn bè</MenuItem>
                    <MenuItem value="me">Chỉ mình tôi</MenuItem>
                  </SelectDropDown>
                </Grid> */}
              </Grid>
              <Grid item sm={4} xs={12} pt={2}>
                <MuiCheckBox name="isCampdi" label="Feed Campdi" />
                {/* <MuiCheckBox name="isReported" label="Báo cáo vi phạm" /> */}
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
                    title="Làm mới"
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
                      onClick={() =>
                        navigation(`hau-kiem`, { state: { type: 1 } })
                      }
                      startIcon={<ArticleSharp />}
                    />
                    <Divider
                      orientation="vertical"
                      sx={{ backgroundColor: '#D9D9D9', mx: 2, my: 1 }}
                      flexItem
                    />
                    {/* <NavLink to={'/quan-ly-feeds/hau-kiem'}> */}
                    <MuiButton
                      title="Báo cáo vi phạm"
                      variant="text"
                      color="error"
                      onClick={() =>
                        navigation(`hau-kiem`, { state: { type: 2 } })
                      }
                      startIcon={<ReportSharp />}
                    />
                    {/* </NavLink> */}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </form>
        </SimpleCard>

        <SimpleCard>
          <MuiStyledTable
            rows={data ? (data?.content as IFeed[]) : []}
            columns={columnFeeds}
            rowsPerPage={size}
            page={page}
            onClickRow={onClickRow}
            isFetching={isFetching}
            error={isError ? error : null}
            actions={[
              {
                icon: 'edit',
                color: 'warning',
                tooltip: 'Chi tiết',
                onClick: onRowUpdate,
              },
              {
                icon: 'verified',
                color: 'primary',
                tooltip: 'Duyệt bài',
                onClick: onRowApprove,
                disableKey: 'status',
                disableActions: (status?: number) =>
                  [1, -3].includes(status ?? 0),
              },
              {
                icon: 'warning_amber',
                color: 'error',
                tooltip: 'Báo cáo vi phạm',
                onClick: onRowReport,
                disableKey: 'status',
                disableActions: (status?: number) =>
                  [-1, -3].includes(status ?? 0),
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

      <DiagLogConfirm
        title={titleDialog}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={approveConfirm}
      >
        <Stack py={5} justifyContent={'center'} alignItems="center">
          <MuiTypography variant="subtitle1">
            Đồng ý duyệt bài đăng?
          </MuiTypography>
        </Stack>
      </DiagLogConfirm>
    </Container>
  )
}
