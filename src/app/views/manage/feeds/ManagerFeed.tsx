import { yupResolver } from '@hookform/resolvers/yup'
import {
  ArticleSharp,
  ChangeCircleSharp,
  ClearOutlined,
  ReportSharp,
  SearchSharp,
} from '@mui/icons-material'
import {
  Autocomplete,
  Divider,
  Grid,
  Icon,
  IconButton,
  MenuItem,
  Stack,
  styled,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchFeeds } from 'app/apis/feed/feed.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import { MuiRHFAutocompleteMultiple } from 'app/components/common/MuiRHFAutocompleteMultiple'
import { MuiCheckBox } from 'app/components/common/MuiRHFCheckbox'
import { MuiRHFDatePicker } from 'app/components/common/MuiRHFDatePicker'
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
import { messages } from 'app/utils/messages'
import { format } from 'date-fns'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'
import { DiagLogConfirm } from '../orders/details/ButtonsLink/DialogConfirm'
import { dateDefault } from '../orders/OrdersHistory'

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

const extractFeeds = (feeds?: IFeed[]) => {
  if (!feeds || !feeds.length) return []
  return feeds.map(feed =>
    Object.assign(feed, {
      customerType:
        feed.customerType === 2 ? 'KOL' : feed.customerId ? 'Thường' : 'Campdi',
    }),
  )
}

const optionsStatus = [
  { name: 'Chờ hậu kiểm', value: 0 },
  { name: 'Hợp lệ', value: 1 },
  { name: 'Vi phạm', value: -1 },
  { name: 'Bị báo cáo', value: -3 },
  { name: 'Xoá', value: -2 },
]

const convertOptionToValues = (options: { name: string; value: number }[]) => {
  return options.map(o => o.value).join(',')
}

const convertValuesToOptions = (values: string[]) => {
  return values.map(v => {
    if (Number(v) == 0) return { name: 'Chờ hậu kiểm', value: 0 }
    else if (Number(v) == 1) return { name: 'Hợp lệ', value: 1 }
    else if (Number(v) == -1) return { name: 'Vi phạm', value: -1 }
    else if (Number(v) == -3) return { name: 'Bị báo cáo', value: -3 }
    else return { name: 'Xoá', value: -2 }
  })
}

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
    // status: queryParams.status ?? 'all',
    isCampdi: queryParams.isCampdi ? true : false,
    isReported: queryParams.isReported ? true : false,
    // viewScope: 1,
    from:
      queryParams.from ??
      (dateDefault() as any).startDate?.format('YYYY-MM-DD'),
    to: queryParams.to ?? (dateDefault() as any).endDate?.format('YYYY-MM-DD'),
    search: queryParams.search ?? '',
    hashtag: queryParams.hashtag ?? '',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
    sort: 'dateCreated,desc',
    status: queryParams.status
      ? convertValuesToOptions(queryParams.status.split(','))
      : [
          { name: 'Chờ hậu kiểm', value: 0 },
          { name: 'Hợp lệ', value: 1 },
          { name: 'Vi phạm', value: -1 },
          { name: 'Bị báo cáo', value: -3 },
        ],
  })

  const [filters, setFilters] = useState<IFeedsFilters>(
    extractMergeFiltersObject(
      { ...defaultValues, status: convertOptionToValues(defaultValues.status) },
      {},
    ),
  )

  const [titleDialog, setTitleDialog] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState(1)
  const [feedId, setFeedId] = useState(0)

  const validationSchema = Yup.object().shape(
    {
      search: Yup.string()
        .min(0, 'email must be at least 0 characters')
        .max(255, 'Nội dung không được vượt quá 255 ký tự'),
      hashtag: Yup.string()
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

  const methods = useForm<IFeedsFilters>({
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
        ...extractMergeFiltersObject(prevFilters, {
          ...values,
          from: format(new Date(values.from ?? ''), 'yyyy-MM-dd'),
          to: format(new Date(values.to ?? ''), 'yyyy-MM-dd'),
          status: convertOptionToValues(values.status),
        }),
        page: 0,
        size: 20,
      }
    })

    navigate('', {
      ...extractMergeFiltersObject(filters, {
        ...values,
        from: format(new Date(values.from ?? ''), 'yyyy-MM-dd'),
        to: format(new Date(values.to ?? ''), 'yyyy-MM-dd'),
        status: convertOptionToValues(values.status),
      }),
      page: 0,
      size: 20,
    } as any)
  }

  const onResetFilters = () => {
    setIsReset(true)
    methods.reset({
      isCampdi: false,
      isReported: false,
      search: '',
      hashtag: '',
      // viewScope: 1,
      page: 0,
      size: 20,
      from: (dateDefault() as any).startDate?.toISOString(),
      to: (dateDefault() as any).endDate.toISOString(),
      sort: 'dateCreated,desc',
      status: defaultValues.status,
    })

    setPage(0)
    setSize(20)

    setFilters({
      page: 0,
      size: 20,
      from: (dateDefault() as any).startDate?.format('YYYY-MM-DD'),
      to: (dateDefault() as any).endDate?.format('YYYY-MM-DD'),
      sort: 'dateCreated,desc',
      status: convertOptionToValues(defaultValues.status),
    })

    navigate('', {
      page: 0,
      size: 20,
      sort: 'dateCreated,desc',
      status: convertOptionToValues(defaultValues.status),
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

  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
  ]

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
                <Grid item sm={6} xs={12}>
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
                <Grid item sm={6} xs={12}>
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
                {/* <Grid item sm={3} xs={12}>
                  <SelectDropDown name="status" label="Trạng thái">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="1">Hợp lệ</MenuItem>
                    <MenuItem value="0">Chờ hậu kiểm</MenuItem>
                    <MenuItem value="-1">Vi phạm</MenuItem>
                    <MenuItem value="-3">Bị báo cáo</MenuItem>
                    <MenuItem value="-2">Xoá</MenuItem>
                  </SelectDropDown>
                </Grid> */}
                <Grid item sm={6} xs={12}>
                  <Controller
                    control={methods.control}
                    name={`status`}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        value={value || null}
                        multiple
                        limitTags={3}
                        id="multiple-limit-tags"
                        options={optionsStatus}
                        getOptionLabel={option => option.name}
                        onChange={(event, item) => {
                          const result = item.reduce((unique, o) => {
                            if (
                              !unique.some((obj: any) => obj.value === o.value)
                            ) {
                              unique.push(o)
                            }
                            return unique
                          }, [])
                          onChange(result)
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label="Trạng thái"
                            placeholder="Trạng thái"
                          />
                        )}
                        sx={{ width: '100%' }}
                      />
                    )}
                  />
                </Grid>

                {/* <Grid item sm={3} xs={12}>
                  <Stack>
                    <SelectDropDown name="viewScope" label="Ai có thể xem">
                      <MenuItem value="1">Mọi người</MenuItem>
                      <MenuItem value="2">Những người theo dõi bạn</MenuItem>
                      <MenuItem value="3">Chỉ mình tôi</MenuItem>
                    </SelectDropDown>
                  </Stack>
                </Grid> */}

                <Grid item sm={6} xs={12}>
                  <SelectDropDown name="sort" label="Sắp xếp theo">
                    <MenuItem value="dateCreated,desc">Ngày đăng</MenuItem>
                    <MenuItem value="viewNum,desc">Lượt xem</MenuItem>
                    <MenuItem value="likeNum,desc">Lượt thích</MenuItem>
                    <MenuItem value="commentNum,desc">Lượt bình luận</MenuItem>
                    <MenuItem value="bookMarkNum,desc">Lượt bookmark</MenuItem>
                  </SelectDropDown>
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid item sm={4} xs={12} mt={-1}>
                    <MuiRHFDatePicker name="from" label="Từ ngày" />
                  </Grid>
                  <Grid item sm={4} xs={12} mt={-1}>
                    <MuiRHFDatePicker name="to" label="Đến ngày" />
                  </Grid>
                  <Grid item sm={4} xs={12} mt={2}>
                    <MuiCheckBox name="isCampdi" label="Feed Campdi" />
                    <MuiCheckBox name="isReported" label="Báo cáo vi phạm" />
                  </Grid>
                </LocalizationProvider>
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
            rows={data ? extractFeeds(data?.content as IFeed[]) : []}
            columns={columnFeeds}
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
        isLoading={approveLoading}
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
