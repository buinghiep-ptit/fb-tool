import { yupResolver } from '@hookform/resolvers/yup'
import { SearchSharp } from '@mui/icons-material'
import { Grid, Icon, MenuItem, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import { fetchCampAreas } from 'app/apis/feed/feed.service'
import { SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { ICampArea, ICampAreaResponse } from 'app/models/camp'
import { columnsCampAreas } from 'app/utils/columns'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'

export interface Props {
  setSelectedCamps?: (items: readonly ICampArea[]) => void
}

type ISearchFilters = {
  isProvince?: number | string
  name?: string
  page?: number
  size?: number
  sort?: string
}

export default function CampAreaList({ setSelectedCamps }: Props) {
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
    name: queryParams.search ?? '',
    isProvince: queryParams.isProvince ?? 'all',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
  })

  const [filters, setFilters] = useState<ISearchFilters>(
    extractMergeFiltersObject(defaultValues, {}),
  )

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(255, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<ISearchFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const {
    data: campAreas,
    isFetching,
    isError,
    error,
  } = useQuery<ICampAreaResponse, Error>(
    ['camp-areas', filters],
    () =>
      fetchCampAreas({
        ...filters,
      }),
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
    // if (cell.id === 'name') {
    //   navigation(`${row.id}/chi-tiet`, { state: { mode: 'update' } })
    // }
  }

  const onResetFilters = () => {
    methods.reset({
      name: '',
      isProvince: 'all',
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
                    label={'Địa danh'}
                    type="text"
                    name="name"
                    defaultValue=""
                    placeholder="Nhập tên địa danh"
                    fullWidth
                  />
                </Grid>
                <Grid item sm={2} xs={12}>
                  <SelectDropDown name="isProvince" label="Loại">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="1">Tỉnh thành</MenuItem>
                    <MenuItem value="0">Địa danh</MenuItem>
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
          rows={(campAreas?.content as ICampArea[]) ?? []}
          columns={columnsCampAreas as any}
          rowsPerPage={size}
          page={page}
          onClickRow={onClickRow}
          isFetching={isFetching}
          error={isError ? error : null}
          actions={[
            {
              type: 1,
            },
            {
              icon: 'double_arrow',
              color: 'action',
              tooltip: 'Xem điểm chi tiết địa điểm',
              onClick: onRowDetail,
            },
          ]}
          setSelectedItems={setSelectedCamps}
          multipleSelect={false}
        />
        <MuiStyledPagination
          component="div"
          rowsPerPageOptions={[20, 50, 100]}
          count={campAreas?.totalElements ?? 0}
          rowsPerPage={size}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </SimpleCard>
    </Stack>
  )
}
