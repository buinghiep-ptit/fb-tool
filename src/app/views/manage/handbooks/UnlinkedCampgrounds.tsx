import { yupResolver } from '@hookform/resolvers/yup'
import { SearchSharp } from '@mui/icons-material'
import { Grid, Icon, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchUnlinkedCampgrounds } from 'app/apis/handbook/handbook.service'
import { SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import {
  IUnlinkedCampgrounds,
  IUnlinkedCampgroundsResponse,
} from 'app/models/camp'
import { IHandbookOverall } from 'app/models/handbook'
import { columnsUnlinkedCampgrounds } from 'app/utils/columns/columnsUnlinkedCampgrounds'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'

export interface Props {
  handbook?: IHandbookOverall
  isLinked?: boolean
}

type ISearchFilters = {
  search?: string
  page?: number
  size?: number
  sort?: string
}

export default function UnlinkedCampgrounds({
  handbook,
  isLinked = true,
}: Props) {
  console.log(isLinked, handbook)
  const navigation = useNavigate()
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])
  const [page, setPage] = useState<number>(
    queryParams.page ? +queryParams.page : 0,
  )
  const [size, setSize] = useState<number>(
    queryParams.size ? +queryParams.size : 20,
  )
  const [defaultValues] = useState<ISearchFilters>({
    search: queryParams.search ?? '',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
  })

  const [filters, setFilters] = useState<ISearchFilters>(
    extractMergeFiltersObject(defaultValues, {}),
  )

  const validationSchema = Yup.object().shape({
    search: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(255, 'hashtag must be at almost 255 characters'),
  })

  const methods = useForm<ISearchFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const {
    data: unLinkedCampGrounds,
    isFetching,
    isError,
    error,
  }: UseQueryResult<IUnlinkedCampgroundsResponse, Error> = useQuery<
    IUnlinkedCampgroundsResponse,
    Error
  >(
    ['unlinked-campgrounds', handbook, filters],
    () => fetchUnlinkedCampgrounds(Number(handbook?.id ?? 0), filters),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      keepPreviousData: true,
      enabled: !!filters && !!handbook && !isLinked,
    },
  )

  const {
    data: linkedCampGrounds,
  }: UseQueryResult<IUnlinkedCampgroundsResponse, Error> = useQuery<
    IUnlinkedCampgroundsResponse,
    Error
  >(
    ['linked-campgrounds', handbook, filters],
    () =>
      fetchUnlinkedCampgrounds(Number(handbook?.id ?? 0), {
        ...filters,
        search: 'test',
      }),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      keepPreviousData: true,
      enabled: !!filters && !!handbook && isLinked,
    },
  )

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        page: newPage,
      }
    })
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
  }

  const onRowDetail = (cell: any, row: any) => {
    window.open(`/chi-tiet-dia-danh/${row.id}`, '_blank')
  }

  const onClickRow = (cell: any, row: any) => {
    if (cell.id === 'name') {
      navigation(`${row.id}/chi-tiet`, { state: { mode: 'update' } })
    }
  }

  const onResetFilters = () => {
    methods.reset({
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
  }

  return (
    <Stack gap={3} position="relative">
      <MuiTypography variant="h6">{handbook?.title}</MuiTypography>

      <Box sx={{ position: 'sticky', top: 0, zIndex: 9999 }}>
        <SimpleCard>
          <form
            onSubmit={methods.handleSubmit(onSubmitHandler)}
            noValidate
            autoComplete="off"
          >
            <FormProvider {...methods}>
              <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>
                  <FormInputText
                    label={'Địa điêm camping, địa danh'}
                    type="text"
                    name="search"
                    defaultValue=""
                    placeholder="Nhập tên địa điểm camping, địa danh..."
                    fullWidth
                  />
                </Grid>
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
                <Grid item sm={3} xs={12}>
                  <MuiButton
                    title="Làm mới"
                    variant="outlined"
                    color="primary"
                    onClick={onResetFilters}
                    sx={{ width: '100%' }}
                    startIcon={<Icon>cached</Icon>}
                  />
                </Grid>
              </Grid>
            </FormProvider>
          </form>
        </SimpleCard>
      </Box>

      <SimpleCard>
        <MuiStyledTable
          rows={
            isLinked
              ? (linkedCampGrounds?.content as IUnlinkedCampgrounds[]) ?? []
              : (unLinkedCampGrounds?.content as IUnlinkedCampgrounds[]) ?? []
          }
          columns={columnsUnlinkedCampgrounds}
          rowsPerPage={size}
          page={page}
          onClickRow={onClickRow}
          isFetching={isFetching}
          error={isError ? error : null}
          actions={[
            {
              icon: 'data_saver_on',
              color: 'primary',
              tooltip: 'Thêm',
              onClick: onRowDetail,
            },
          ]}
        />
        <MuiStyledPagination
          component="div"
          rowsPerPageOptions={[20, 50, 100]}
          count={
            isLinked
              ? linkedCampGrounds?.totalElements ?? 0
              : unLinkedCampGrounds?.totalElements ?? 0
          }
          rowsPerPage={size}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </SimpleCard>
    </Stack>
  )
}
