import { yupResolver } from '@hookform/resolvers/yup'
import { ChangeCircleSharp, SearchSharp } from '@mui/icons-material'
import { Grid, MenuItem, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { UseQueryResult } from '@tanstack/react-query'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import useNoteDialogForm from 'app/hooks/components/useNoteDialogForm'
import {
  useRatingData,
  useToggleRateStatus,
} from 'app/hooks/queries/useRatingData'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { IRatingOverall, IRatingOverallResponse } from 'app/models/rating'
import {
  columnsRatingAll,
  columnsRatingReported,
} from 'app/utils/columns/columnsRatings'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'
import { DiagLogConfirm } from '../orders/details/ButtonsLink/DialogConfirm'
import { NavTabs } from './NavTabs'

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export const navOrdersHistory = {
  rootName: 'Quản lý đánh giá',
  path: 'quan-ly-danh-gia',
  items: [
    {
      scope: 'reported',
      label: 'Báo cáo vi phạm',
    },
    {
      scope: 'overall',
      label: 'Tất cả',
    },
  ],
}

const convertRatings = (ratings: IRatingOverall[]) => {
  return ratings.map(rate => ({
    ...rate,
    customer: `${rate.cusMobilePhone ? rate.cusMobilePhone + '-' : ''}${
      rate.cusEmail ? rate.cusEmail + '-' : ''
    }${rate.cusName}`,
  }))
}

type ISearchFilters = {
  scope?: string
  search?: string
  star?: string
  status?: string | number
  page?: number
  size?: number
  sort?: string
}

export interface Props {}

export default function ListRating() {
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

  const [dialogData, setDialogData] = useState<{
    title?: string
    message?: string | ReactElement | any
    type?: string
    submitText?: string
    cancelText?: string
  }>({})
  const [openDialog, setOpenDialog] = useState(false)
  const [row, setRow] = useState<IRatingOverall>({})

  const [defaultValues] = useState<ISearchFilters>({
    search: queryParams.search ?? '',
    status: queryParams.status ?? 1,
    star: queryParams.star ?? 'all',
    scope: queryParams.scope ?? 'reported',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
  })
  const [filters, setFilters] = useState<ISearchFilters>(
    extractMergeFiltersObject(defaultValues, {}),
  )
  const { orderId: id } = useParams() ?? 0

  const tabRef = useRef<number>(-1)

  const getCurrentTabIndex = (scope: string) => {
    const index = navOrdersHistory.items.findIndex(item =>
      scope.includes(item.scope),
    )
    if (index === -1) {
      return 0
    } else {
      return index
    }
  }

  const [tabName, setTabName] = useState(navOrdersHistory.items[0].label)
  const [currentTab, setCurrentTab] = useState<number>(
    getCurrentTabIndex(queryParams.scope ?? ''),
  )

  useEffect(() => {
    navigate('', {
      search: queryParams.search ?? '',
      status: queryParams.status ?? 1,
      star: queryParams.star ?? 'all',
      scope: queryParams.scope ?? 'reported',
      page: queryParams.page ? +queryParams.page : 0,
      size: queryParams.size ? +queryParams.size : 20,
    } as any)
    tabRef.current = currentTab
    setTabName(navOrdersHistory.items[currentTab].label)
    setCurrentTab(getCurrentTabIndex(queryParams.scope ?? ''))
    methods.reset({
      search: queryParams.search ?? '',
      status: queryParams.status ?? 1,
      star: queryParams.star ?? 'all',
      scope: queryParams.scope ?? 'reported',
      page: queryParams.page ? +queryParams.page : 0,
      size: queryParams.size ? +queryParams.size : 20,
    })
  }, [queryParams.scope])

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  }: UseQueryResult<IRatingOverallResponse, Error> = useRatingData(
    filters,
    queryParams.scope ?? 'reported',
  )

  const validationSchema = Yup.object().shape({
    search: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(255, 'Nội dung không được vượt quá 255 ký tự'),
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
        scope: queryParams.scope,
        page: +newPage,
      }
    })
    navigate('', {
      ...filters,
      scope: queryParams.scope,
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
        scope: queryParams.scope,
        size: +event.target.value,
      }
    })
    navigate('', {
      ...filters,
      page: 0,
      scope: queryParams.scope,
      size: +event.target.value,
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

  const onResetFilters = () => {
    methods.reset({
      search: '',
      status: queryParams.scope === 'overall' ? 1 : 'all',
      star: 'all',
      scope: queryParams.scope,
      page: 0,
      size: 20,
    })

    setPage(0)
    setSize(20)
    setFilters({
      ...extractMergeFiltersObject(
        {},
        { status: queryParams.scope === 'overall' ? 1 : 'all' },
      ),

      page: 0,
      size: 20,
    })

    navigate('', {
      scope: queryParams.scope,
      ...extractMergeFiltersObject(
        {},
        { status: queryParams.scope === 'overall' ? 1 : 'all' },
      ),
      page: 0,
      size: 20,
    } as any)
  }

  const [getContentNote, methodsNote] = useNoteDialogForm('note')

  const { mutate: toggle, isLoading: toggleLoading } = useToggleRateStatus(() =>
    onSuccess(null, 'Cập nhật thành công'),
  )

  const onRowUpdate = (cell: any, row: any) => {
    navigation(`${row.id}/chi-tiet`, {})
  }

  const onToggleStatus = (cell: any, row: any) => {
    setDialogData(prev => ({
      ...prev,
      title: row.status === 1 ? 'Chặn' : 'Hợp lệ',
      message: (toggleLoading?: boolean) => getContentNote(toggleLoading),
      type: 'toggle-status',
      submitText: row.status === 1 ? 'Chặn' : 'Hợp lệ',
      cancelText: 'Huỷ',
    }))
    setRow(row)
    setOpenDialog(true)
  }

  const onClickRow = (cell: any, row: any) => {
    if (cell.id === 'customer') {
      window.open(
        `/quan-ly-tai-khoan-khach-hang/${row?.idCustomer}/thong-tin`,
        '_blank',
      )
    } else if (cell.id === 'name') {
      window.open(`/chi-tiet-dia-danh/${row?.campGroundId}`, '_blank')
    }
  }
  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    setOpenDialog(false)
  }

  const onSubmitDialogHandler: SubmitHandler<{
    note?: string
  }> = (values: { note?: string }) => {
    toggle({
      rateId: Number(row.id ?? 0),
      note: values.note || undefined,
    })
  }

  const onSubmitDialog = (type?: string) => {
    switch (type) {
      case 'toggle-status':
        methodsNote.handleSubmit(onSubmitDialogHandler)()
        break

      default:
        break
    }
  }

  const approveDialog = (cell: any, row: any) => {
    setDialogData(prev => ({
      ...prev,
      title: 'Bỏ qua',
      message: (dialogLoading?: boolean) => getContentNote(dialogLoading),
      type: 'toggle-status',
      submitText: 'Có',
      cancelText: 'Không',
    }))
    setRow(row)
    setOpenDialog(true)
  }

  const rejectDialog = (cell: any, row: any) => {
    setDialogData(prev => ({
      ...prev,
      title: 'Vi phạm',
      message: (dialogLoading?: boolean) => getContentNote(dialogLoading),
      type: 'toggle-status',
      submitText: 'Có',
      cancelText: 'Không',
    }))
    setRow(row)
    setOpenDialog(true)
  }

  if (isLoading) return <MuiLoading />

  if (isError)
    return (
      <Box my={2} textAlign="center">
        <MuiTypography variant="h5">{error.message}</MuiTypography>
      </Box>
    )

  return (
    <Container>
      <React.Fragment>
        <Box className="breadcrumb">
          <Breadcrumb
            routeSegments={[
              {
                name: navOrdersHistory.rootName,
                path: `/${navOrdersHistory.path}`,
              },
              { name: tabName },
            ]}
          />
        </Box>
        <Stack mt={-2} gap={3}>
          <NavTabs
            navInfo={navOrdersHistory}
            id={id ?? 0}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            data={data ?? []}
          />
          <SimpleCard>
            <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
              <FormProvider {...methods}>
                <Grid container spacing={2}>
                  <Grid item sm={4} xs={12}>
                    <FormInputText
                      label={'SĐT, Email, tên hiển thị, điểm camp, nội dung'}
                      type="text"
                      name="search"
                      defaultValue=""
                      placeholder="Nhập SĐT, Email, tên hiển thị, điểm camp, nội dung"
                      fullWidth
                    />
                  </Grid>
                  <Grid item sm={2} xs={12}>
                    <SelectDropDown name="star" label="Số sao">
                      <MenuItem value="all">Tất cả</MenuItem>
                      <MenuItem value="1">1 sao</MenuItem>
                      <MenuItem value="2">2 sao</MenuItem>
                      <MenuItem value="3">3 sao</MenuItem>
                      <MenuItem value="4">4 sao</MenuItem>
                      <MenuItem value="5">5 sao</MenuItem>
                    </SelectDropDown>
                  </Grid>
                  {currentTab === 1 && (
                    <Grid item sm={2} xs={12}>
                      <SelectDropDown name="status" label="Trạng thái">
                        <MenuItem value="1">Hoạt động</MenuItem>
                        <MenuItem value="-1">Đã chặn</MenuItem>
                      </SelectDropDown>
                    </Grid>
                  )}

                  <Grid item sm={2} xs={12}>
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
                  <Grid item sm={2} xs={12}>
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
              rows={
                data ? convertRatings(data?.content as IRatingOverall[]) : []
              }
              columns={getColumns(currentTab)}
              rowsPerPage={size}
              page={page}
              onClickRow={onClickRow}
              isFetching={isFetching}
              error={isError ? error : null}
              actions={
                currentTab === 0
                  ? [
                      {
                        icon: 'warning_amber',
                        color: 'error',
                        tooltip: 'Vi phạm',
                        onClick: rejectDialog,
                        disableKey: 'status',
                      },
                      {
                        icon: 'close',
                        color: 'primary',
                        tooltip: 'Bỏ qua',
                        onClick: approveDialog,
                      },
                      {
                        icon: 'edit',
                        color: 'action',
                        tooltip: 'Chi tiết',
                        onClick: onRowUpdate,
                      },
                    ]
                  : [
                      {
                        icon: 'push_pin',
                        color: 'primary',
                        tooltip: 'Chặn',
                        onClick: onToggleStatus,
                        disableKey: 'status',
                        disableActions: (status?: number) =>
                          status === 1 ? false : true,
                        contrastIcon: {
                          icon: (
                            <img
                              src={'/assets/images/app/pin_off_icon.svg'}
                              style={{
                                width: 24,
                                height: 24,
                                color: '#FFB020',
                                filter:
                                  'invert(85%) sepia(53%) saturate(5926%) hue-rotate(339deg) brightness(100%) contrast(103%)',
                              }}
                              loading="lazy"
                              alt="icon"
                            />
                          ),
                          tooltip: 'Hợp lệ',
                        },
                      },
                      {
                        icon: 'edit',
                        color: 'action',
                        tooltip: 'Chi tiết',
                        onClick: onRowUpdate,
                      },
                    ]
              }
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
      <DiagLogConfirm
        title={dialogData.title}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={() => onSubmitDialog(dialogData.type)}
        submitText={dialogData.submitText}
        cancelText={dialogData.cancelText}
        isLoading={toggleLoading}
      >
        <Stack>
          {dialogData?.message && dialogData?.message(toggleLoading)}
        </Stack>
      </DiagLogConfirm>
    </Container>
  )
}

const getColumns = (tabIndex: number) => {
  switch (tabIndex) {
    case 0:
      return columnsRatingReported

    case 1:
      return columnsRatingAll

    default:
      return columnsRatingReported
  }
}
