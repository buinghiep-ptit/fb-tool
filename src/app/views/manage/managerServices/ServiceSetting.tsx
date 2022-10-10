import * as React from 'react'
import { Grid, MenuItem, styled } from '@mui/material'
import { Box } from '@mui/system'
import { Breadcrumb, SimpleCard } from 'app/components'
import * as Yup from 'yup'
import { values } from 'lodash'
import { useEffect, useState } from 'react'
// import StatusSelect from './StatusSelect'
// import TypeSelect from './TypeSelect'
import { NavLink, useSearchParams } from 'react-router-dom'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ServicesFilters } from 'app/models'
import { getListServices } from 'app/apis/services/services.service'
import { toastSuccess } from 'app/helpers/toastNofication'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { MuiButton } from 'app/components/common/MuiButton'
import { AddBoxSharp, SearchSharp } from '@mui/icons-material'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { columnsServices } from 'app/utils/columns/columnsServices'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import {
  useDeleteService,
  useUpdateService,
} from 'app/hooks/queries/useServicesData'
import { ServiceResponse, TitleService } from 'app/models/service'

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

  const onRowUpdateSuccess = (data: any) => {
    toastSuccess({ message: 'Cập nhật thành công' })
  }
  const { mutate: updateService } = useUpdateService(onRowUpdateSuccess)
  const { mutate: deleteService } = useDeleteService(onRowUpdateSuccess)

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

  const onClickRow = (cell: any, row: any) => {
    if (cell.action) {
      if (cell.id === 'name') {
        navigate(`${row.id}/chi-tiet`, {})
      } else if (cell.id === 'status') {
        console.log('status')
        updateService({
          serviceId: row.id,
          status: row.status * -1,
        })
      } else if (cell.id === 'edit') {
        navigate(`${row.id}/chinh-sua`, {})
        console.log('edit')
      } else if (cell.id === 'delete') {
        deleteService(row.id)
      }
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
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý dịch vụ ' }]} />
      </Box>

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
              <Grid item sm={7} xs={12}></Grid>

              <Grid item sm={3} xs={12}>
                <MuiButton
                  onClick={() => navigate(`chi-tiet-dich-vu`, {})}
                  title="Thêm mới dịch vụ"
                  variant="contained"
                  color="primary"
                  sx={{ width: '100%' }}
                  startIcon={<AddBoxSharp />}
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
