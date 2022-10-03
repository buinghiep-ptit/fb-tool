import { yupResolver } from '@hookform/resolvers/yup'
import { AddBoxSharp, SearchSharp } from '@mui/icons-material'
import { Grid, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchEvents } from 'app/apis/events/event.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useDeleteEvent,
  useUpdateStatusEvent,
} from 'app/hooks/queries/useEventsData'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { IEventOverall, IEventResponse } from 'app/models'
import { columnsEvents } from 'app/utils/columns/columnsEvents'
import { useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
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

type ISearchFilters = {
  areaNameOrAddress?: string
  page?: number
  size?: number
  sort?: string[]
}

export default function ManagerEvents(props: Props) {
  const navigate = useNavigateParams()
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(20)
  const [defaultValues] = useState<ISearchFilters>({})
  const [filters, setFilters] = useState<ISearchFilters>({
    page,
    size,
  })

  const validationSchema = Yup.object().shape({
    areaNameOrAddress: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(256, 'hashtag must be at almost 256 characters'),
  })

  const methods = useForm<ISearchFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  useEffect(() => {
    if (searchParams) {
      const queryParams = Object.fromEntries([...searchParams])
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
  }: UseQueryResult<IEventResponse, Error> = useQuery<IEventResponse, Error>(
    ['events', filters],
    () => fetchEvents(filters),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!filters,
    },
  )
  const onRowUpdateSuccess = (data: any) => {
    toastSuccess({ message: 'Cập nhật thành công' })
  }
  const { mutate: updateStatus } = useUpdateStatusEvent(onRowUpdateSuccess)
  const { mutate: deleteEvent } = useDeleteEvent(onRowUpdateSuccess)

  const handleChangePage = (event: unknown, newPage: number) => {
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

  const onSubmitHandler: SubmitHandler<ISearchFilters> = (
    values: ISearchFilters,
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
        updateStatus({
          eventId: row.id,
          status: row.status * -1,
        })
      } else if (cell.id === 'edit') {
        navigate(`${row.id}/chinh-sua`, {})
        console.log('edit')
      } else if (cell.id === 'delete') {
        deleteEvent(row.id)
      }
    }
  }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý sự kiện' }]} />
      </Box>
      <Stack gap={3}>
        <SimpleCard title="Quản lý sự kiện">
          <form
            onSubmit={methods.handleSubmit(onSubmitHandler)}
            noValidate
            autoComplete="off"
          >
            <FormProvider {...methods}>
              <Grid container spacing={2}>
                <Grid item sm={3} xs={12}>
                  <FormInputText
                    label={'Tên sự kiện/Địa chỉ'}
                    type="text"
                    name="areaNameOrAddress"
                    defaultValue=""
                    placeholder="Nhập tên sự kiện, địa chỉ"
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
                <Grid item sm={3} xs={12}></Grid>
                <Grid item sm={3} xs={12}>
                  <MuiButton
                    onClick={() => navigate(`them-moi-su-kien`, {})}
                    title="Tạo mới sự kiện"
                    variant="contained"
                    color="primary"
                    sx={{ width: '100%' }}
                    startIcon={<AddBoxSharp />}
                  />
                </Grid>
              </Grid>
            </FormProvider>
          </form>
        </SimpleCard>

        <SimpleCard>
          <MuiStyledTable
            rows={data ? (data?.content as IEventOverall[]) : []}
            columns={columnsEvents}
            onClickRow={onClickRow}
            isFetching={isFetching}
            error={isError ? error : null}
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
    </Container>
  )
}
