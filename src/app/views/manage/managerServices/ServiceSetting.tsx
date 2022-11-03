import { Grid, Icon, MenuItem, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as React from 'react'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
// import StatusSelect from './StatusSelect'
// import TypeSelect from './TypeSelect'
import { yupResolver } from '@hookform/resolvers/yup'
import { ChangeCircleSharp, SearchSharp } from '@mui/icons-material'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getListServices } from 'app/apis/services/services.service'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useDeleteService,
  useUpdateService,
  useUpdateStatusService,
} from 'app/hooks/queries/useServicesData'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { ServicesFilters } from 'app/models'
import { ServiceResponse, TitleService } from 'app/models/service'
import { columnsServices } from 'app/utils/columns/columnsServices'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DiagLogConfirm } from '../orders/details/ButtonsLink/DialogConfirm'

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

// const StyledTable = styled(Table)(({ theme }) => ({
//   whiteSpace: 'pre',
//   '& thead': {
//     '& tr': { '& th': { paddingLeft: 0, paddingRight: 0 } },
//   },
//   '& tbody': {
//     '& tr': { '& td': { paddingLeft: 0, textTransform: 'capitalize' } },
//   },
// }))

export interface Props {}

export default function ServiceSetting(props: Props) {
  const navigate = useNavigateParams()
  const navigation = useNavigate()
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(20)

  const [defaultValues] = useState<ServicesFilters>({
    status: queryParams.status ?? 'all',
    search: queryParams.search ?? '',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
    rentalType: queryParams.rentalType ?? 'all',
  })
  const [filters, setFilters] = useState<ServicesFilters>(
    extractMergeFiltersObject(defaultValues, {}),
  )

  const [dialogData, setDialogData] = useState<{
    title?: string
    message?: string
    type?: string
    submitText?: string
    cancelText?: string
  }>({})
  const [openDialog, setOpenDialog] = useState(false)
  const [row, setRow] = useState<any>({})

  const validationSchema = Yup.object().shape({
    search: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(256, 'hashtag must be at almost 256 characters'),
  })

  const methods = useForm<ServicesFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  useEffect(() => {
    if (searchParams) {
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
  }: UseQueryResult<ServiceResponse, Error> = useQuery<ServiceResponse, Error>(
    ['camp-service', filters],
    () => getListServices(filters),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!filters,
    },
  )

  const onRowUpdateSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    setOpenDialog(false)
  }
  const { mutate: updateService } = useUpdateService(onRowUpdateSuccess)
  const { mutate: deleteService } = useDeleteService(() =>
    onRowUpdateSuccess(null, 'Xoá dịch vụ thành công'),
  )
  const { mutate: updateStatusService } = useUpdateStatusService(() =>
    onRowUpdateSuccess(null, 'Cập nhật thành công'),
  )

  const onSubmitHandler: SubmitHandler<ServicesFilters> = (
    values: ServicesFilters,
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

  const onRowUpdate = (cell: any, row: any) => {
    navigation(`${row.id}/chinh-sua`, { state: { mode: 'update' } })
  }

  const onRowDelete = (cell: any, row: any) => {
    setDialogData(prev => ({
      ...prev,
      title: 'Xoá dịch vụ',
      message: 'Bạn có chắc chắn muốn xoá dịch vụ',
      type: 'delete',
      submitText: 'Xoá',
      cancelText: 'Huỷ',
    }))
    setOpenDialog(true)
    setRow(row)
  }

  const onSubmitDialog = () => {
    if (dialogData.type === 'toggle-status') {
      updateStatusService({
        serviceId: row.id,
        status: row.status * -1,
      })
    } else {
      deleteService(row.id)
    }
  }

  const onClickRow = (cell: any, row: any) => {
    if (cell.id === 'name') {
      navigation(`${row.id}/chi-tiet`, { state: { mode: 'update' } })
    } else if (cell.id === 'status') {
      setDialogData(prev => ({
        ...prev,
        title: row.status === 1 ? 'Ẩn dich vụ' : 'Mở dịch vụ',
        message:
          row.status === 1
            ? 'Bạn có chắc chắn muốn ẩn dịch vụ'
            : 'Bạn có đồng ý mở lại dịch vụ',
        type: 'toggle-status',
        submitText: 'Xác nhận',
        cancelText: 'Huỷ',
      }))
      setOpenDialog(true)
      setRow(row)
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

  const handleChangePage = (service: unknown, newPage: number) => {
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

  const onResetFilters = () => {
    methods.reset({
      search: '',
      rentalType: 'all',
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
        <Breadcrumb routeSegments={[{ name: 'Quản lý dịch vụ ' }]} />
      </Box>

      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        <MuiButton
          title="Thêm mới dịch vụ"
          variant="contained"
          color="primary"
          type="submit"
          onClick={() => navigation(`chi-tiet-dich-vu`, {})}
          startIcon={<Icon>control_point</Icon>}
        />
      </Stack>

      <SimpleCard>
        <form
          onSubmit={methods.handleSubmit(onSubmitHandler)}
          noValidate
          autoComplete="off"
        >
          <FormProvider {...methods}>
            <Grid container spacing={2}>
              <Grid item sm={4} xs={12}>
                <FormInputText
                  label={'Nhập tên thông tin cần tìm'}
                  type="text"
                  name="search"
                  defaultValue=""
                  placeholder="Tên điểm camping/ dịch vụ"
                  fullWidth
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <SelectDropDown name="rentalType" label="Loại dịch vụ">
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="1">Gói dịch vụ</MenuItem>
                  <MenuItem value="2">Gói lưu trú</MenuItem>
                  <MenuItem value="3">Khác</MenuItem>
                </SelectDropDown>
              </Grid>
              <Grid item sm={4} xs={12}>
                <SelectDropDown name="status" label="Trạng thái">
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="1">Hiệu lực</MenuItem>
                  <MenuItem value="-1">Không hiệu lực</MenuItem>
                </SelectDropDown>
              </Grid>

              <Grid item sm={2} xs={12}>
                <MuiButton
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

        <Box mt={3}>
          <MuiStyledTable
            rows={data?.content as TitleService[]}
            columns={columnsServices}
            onClickRow={onClickRow}
            isFetching={isFetching}
            rowsPerPage={size}
            page={page}
            actions={[
              {
                icon: 'edit',
                color: 'warning',
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
        </Box>
      </SimpleCard>
      <DiagLogConfirm
        title={dialogData.title ?? ''}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={onSubmitDialog}
        submitText={dialogData.submitText ?? 'Xác nhận'}
        cancelText={dialogData.cancelText ?? 'Huỷ'}
      >
        <Stack py={5} justifyContent={'center'} alignItems="center">
          <MuiTypography variant="subtitle1">
            {dialogData.message ?? ''}
          </MuiTypography>
          <MuiTypography variant="subtitle1" color="primary">
            {row.name}
          </MuiTypography>
        </Stack>
      </DiagLogConfirm>
    </Container>
  )
}
