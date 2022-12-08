import { yupResolver } from '@hookform/resolvers/yup'
import { SearchSharp } from '@mui/icons-material'
import { Grid, Icon, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchLinkedCampgrounds } from 'app/apis/policy/policy.service'
import { SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { ICampGround, IUnlinkedCampgroundsResponse } from 'app/models/camp'
import { columnsCampgroundsPolicy } from 'app/utils/columns/columnsCampgroundsPolicy'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'

export interface Props {
  policyId?: number
}

type ISearchFilters = {
  name?: string
  page?: number
  size?: number
  sort?: string
}

export default function ListCampgroundsPolicy({ policyId }: Props) {
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
    name: queryParams.name ?? '',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
  })

  const [filters, setFilters] = useState<ISearchFilters>(
    extractMergeFiltersObject(defaultValues, {}),
  )

  const validationSchema = Yup.object().shape({
    name: Yup.string().max(255, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<ISearchFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })
  const {
    data: campGrounds,
    isFetching,
    isError,
    error,
  }: UseQueryResult<IUnlinkedCampgroundsResponse, Error> = useQuery<
    IUnlinkedCampgroundsResponse,
    Error
  >(
    ['linked-campgrounds', policyId, filters],
    () => fetchLinkedCampgrounds(Number(policyId ?? 0), filters),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      keepPreviousData: true,
      enabled: !!filters && !!policyId,
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
    window.open(`/chi-tiet-diem-camp/${row.id}`, '_blank')
  }

  const onClickRow = (cell: any, row: any) => {
    if (cell.id === 'name') {
      window.open(`/chi-tiet-diem-camp/${row.id}`, '_blank')
    }
  }

  const onResetFilters = () => {
    methods.reset({
      name: '',
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
    <Stack gap={3}>
      <Box sx={{ position: 'sticky', top: -16, zIndex: 9999 }}>
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
                    label={'Tên điểm camp'}
                    type="text"
                    name="name"
                    defaultValue=""
                    placeholder="Nhập tên điểm camp"
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
          rows={(campGrounds?.content as ICampGround[]) ?? []}
          columns={columnsCampgroundsPolicy}
          rowsPerPage={size}
          page={page}
          onClickRow={onClickRow}
          isFetching={isFetching}
          error={isError ? error : null}
          actions={[
            {
              icon: 'double_arrow',
              color: 'action',
              tooltip: 'Xem chi tiết',
              onClick: onRowDetail,
            },
          ]}
        />
        <MuiStyledPagination
          component="div"
          rowsPerPageOptions={[20, 50, 100]}
          count={campGrounds ? (campGrounds?.totalElements as number) : 0}
          rowsPerPage={size}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </SimpleCard>
    </Stack>
  )
}
