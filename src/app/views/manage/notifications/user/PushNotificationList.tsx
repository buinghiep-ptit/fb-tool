import { yupResolver } from '@hookform/resolvers/yup'
import { ChangeCircleSharp, SearchSharp } from '@mui/icons-material'
import { Grid, Icon, MenuItem, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import { fetchNotificationsUser } from 'app/apis/notifications/users/notificationsUser.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useDeleteNotificationUser,
  useSendNotificationUser,
} from 'app/hooks/queries/useNotificationsData'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { IFeed } from 'app/models'
import { INotification, INotificationResponse } from 'app/models/notification'
import { columnsNotifications } from 'app/utils/columns/columnsNotifications'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import React, { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'
import { DiagLogConfirm } from '../../orders/details/ButtonsLink/DialogConfirm'

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
type ISearchFilters = {
  search?: string
  status?: string
  page?: number
  size?: number
  sort?: string
}

export interface Props {}

export default function PushNotificationList(props: Props) {
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

  const [defaultValues] = useState<ISearchFilters>({
    status: queryParams.status ?? 'all',
    search: queryParams.search ?? '',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
  })

  const [filters, setFilters] = useState<ISearchFilters>(
    extractMergeFiltersObject(defaultValues, {}),
  )

  const [dialogData, setDialogData] = useState<{
    title?: string
    message?: string
    type?: string
    isLinked?: number
    submitText?: string
    cancelText?: string
  }>({})
  const [openDialog, setOpenDialog] = useState(false)
  const [row, setRow] = useState<any>({})

  const validationSchema = Yup.object().shape({
    search: Yup.string()
      .min(0, 'email must be at least 0 characters')
      .max(255, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<ISearchFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { data, isLoading, isFetching, isError, error } = useQuery<
    INotificationResponse,
    Error
  >(['notifications-user', filters], () => fetchNotificationsUser(filters), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: !!filters,
  })

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

  const onSubmitHandler: SubmitHandler<ISearchFilters> = (
    values: ISearchFilters,
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
      search: '',
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

  const onRowUpdateSuccess = (data: any, message?: string) => {
    toastSuccess({ message: message ?? '' })
    setOpenDialog(false)
  }

  const { mutate: sendNoti, isLoading: sendLoading } = useSendNotificationUser(
    () => onRowUpdateSuccess(null, 'Gửi thành công'),
  )
  const { mutate: deleteNoti, isLoading: deleteLoading } =
    useDeleteNotificationUser(() => onRowUpdateSuccess(null, 'Xoá thành công'))

  const onRowUpdate = (cell: any, row: any) => {
    navigation(`${row.id}/chi-tiet`, {})
  }

  const onRowApprove = (cell: any, row: any) => {
    setDialogData(prev => ({
      ...prev,
      title: 'Gửi thông báo',
      type: 'send',
      message:
        'Sau khi bật, thông báo sẽ được hiển thị ngay khi KH mở ứng dụng. Bạn có chắc muốn bật?',
      submitText: 'Có',
      cancelText: 'Không',
    }))
    setOpenDialog(true)
    setRow(row)
  }
  const onRowDelete = (cell: any, row: any) => {
    setDialogData(prev => ({
      ...prev,
      title: 'Xoá thông báo',
      message:
        'Sau khi xóa, thông báo sẽ không còn được hiển thị cho khách hàng. Bạn có chắc muốn xóa?',
      type: 'delete',
      submitText: 'Có',
      cancelText: 'Không',
    }))
    setOpenDialog(true)
    setRow(row)
  }

  const onClickRow = (cell: any, row: any) => {
    if (cell.id === 'title') {
      navigation(`${row.id}/chi-tiet`, {})
    }
  }

  const onSubmitDialog = () => {
    switch (dialogData.type) {
      case 'send':
        sendNoti(row.id)

        break

      case 'delete':
        deleteNoti(row.id)
        break

      default:
        break
    }
  }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Gửi thông báo người dùng' }]} />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        <MuiButton
          title="Thêm thông báo"
          variant="contained"
          color="primary"
          type="submit"
          onClick={() => navigation(`them-moi`, {})}
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
                    label={'Tiêu đề'}
                    type="text"
                    name="search"
                    size="small"
                    placeholder="Nhập tiêu đề"
                    fullWidth
                    defaultValue=""
                  />
                </Grid>
                <Grid item sm={4} xs={12}>
                  <SelectDropDown name="status" label="Trạng thái">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="0">Chưa gửi</MenuItem>
                    <MenuItem value="1">Đã gửi</MenuItem>
                    <MenuItem value="-3">Dừng sử dụng</MenuItem>
                  </SelectDropDown>
                </Grid>

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
              </Grid>
            </FormProvider>
          </form>
        </SimpleCard>

        <SimpleCard>
          <MuiStyledTable
            rows={data ? (data?.content as INotification[]) : []}
            columns={columnsNotifications}
            rowsPerPage={size}
            page={page}
            onClickRow={onClickRow}
            isFetching={isFetching}
            error={isError ? error : null}
            actions={[
              {
                icon: 'send',
                color: 'primary',
                tooltip: 'Gửi',
                onClick: onRowApprove,
              },
              {
                icon: 'edit',
                color: 'action',
                tooltip: 'Chi tiết',
                onClick: onRowUpdate,
              },
              {
                icon: 'delete',
                color: 'error',
                tooltip: 'Xoá',
                onClick: onRowDelete,
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
        title={dialogData.title ?? ''}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={onSubmitDialog}
        submitText={dialogData.submitText}
        cancelText={dialogData.cancelText}
        isLoading={sendLoading || deleteLoading}
      >
        <Stack py={5} justifyContent={'center'} alignItems="center">
          <MuiTypography variant="subtitle1" textAlign={'center'}>
            {dialogData.message}
          </MuiTypography>
        </Stack>
      </DiagLogConfirm>
    </Container>
  )
}
