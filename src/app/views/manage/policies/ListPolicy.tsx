import { yupResolver } from '@hookform/resolvers/yup'
import { AddBoxSharp, SearchSharp } from '@mui/icons-material'
import { Grid, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchPolicies } from 'app/apis/policy/policy.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useDeleteEvent,
  useUpdateStatusEvent,
} from 'app/hooks/queries/useEventsData'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { IEventOverall } from 'app/models'
import { IPolicyOverall, IPolicyResponse } from 'app/models/policy'
import { columnsPolicies } from 'app/utils/columns/columnsPolicies'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import { DDMMYYYYFormatter } from 'app/utils/formatters/dateTimeFormatters'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
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

type ISearchFilters = {
  name?: string
  page?: number
  size?: number
  sort?: string
}

const newEvents = (events: IEventOverall[]) => {
  return events.map(event => ({
    ...event,
    dateActive: `${DDMMYYYYFormatter(
      event.startDate ?? '',
    )} - ${DDMMYYYYFormatter(event.endDate ?? '')}`,
  }))
}

export default function ListPolicy(props: Props) {
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
  const [defaultValues] = useState<ISearchFilters>({
    name: queryParams.name ?? '',
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
  }>({})
  const [openDialog, setOpenDialog] = useState(false)
  const [row, setRow] = useState<any>({})

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(0, 'hashtag must be at least 0 characters')
      .max(255, 'hashtag must be at almost 255 characters'),
  })

  const methods = useForm<ISearchFilters>({
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
  }: UseQueryResult<IPolicyResponse, Error> = useQuery<IPolicyResponse, Error>(
    ['policies', filters],
    () => fetchPolicies(filters),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      keepPreviousData: true,
      enabled: !!filters,
    },
  )
  const onRowUpdateSuccess = (data: any) => {
    toastSuccess({ message: `${dialogData.title ?? ''} thành công` })
    setOpenDialog(false)
  }
  const { mutate: updateStatus } = useUpdateStatusEvent(onRowUpdateSuccess)
  const { mutate: deleteEvent } = useDeleteEvent(onRowUpdateSuccess)

  const onSubmitDialog = () => {
    if (dialogData.type === 'toggle-status') {
      updateStatus({
        eventId: row.id,
        status: row.status * -1,
      })
    } else {
      deleteEvent(row.id)
    }
  }

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
      page: 0,
      size: parseInt(event.target.value, 10),
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

  const onRowUpdate = (cell: any, row: any) => {
    navigation(`${row.id}/chinh-sua`, { state: { mode: 'update' } })
  }

  const onRowDelete = (cell: any, row: any) => {
    setDialogData(prev => ({
      ...prev,
      title: 'Xoá sự kiện',
      message: 'Bạn có chắc chắn muốn xoá sự kiện',
      type: 'delete',
    }))
    setOpenDialog(true)
    setRow(row)
  }

  const onClickRow = (cell: any, row: any) => {
    if (cell.id === 'name') {
      navigation(`${row.id}/chi-tiet`, { state: { mode: 'update' } })
    } else if (cell.id === 'status') {
      setDialogData(prev => ({
        ...prev,
        title: row.status === 1 ? 'Ẩn sự kiện' : 'Mở sự kiện',
        message:
          row.status === 1
            ? 'Bạn có chắc chắn muốn ẩn sự kiện'
            : 'Bạn có đồng ý mở lại sự kiện',
        type: 'toggle-status',
      }))
      setOpenDialog(true)
      setRow(row)
    }
  }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý chính sách' }]} />
      </Box>
      <Stack gap={3}>
        <SimpleCard>
          <form
            onSubmit={methods.handleSubmit(onSubmitHandler)}
            noValidate
            autoComplete="off"
          >
            <FormProvider {...methods}>
              <Grid container spacing={2}>
                <Grid item sm={3} xs={12}>
                  <FormInputText
                    label={'Tên chính sách'}
                    type="text"
                    name="areaNameOrAddress"
                    defaultValue=""
                    placeholder="Nhập tên chính sách"
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
                    onClick={() =>
                      navigation(`them-moi-su-chinh-sach-rieng`, {
                        state: { mode: 'add' },
                      })
                    }
                    title="Thêm mới chính sách riêng"
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
            rows={(data?.content as IPolicyOverall[]) ?? []}
            columns={columnsPolicies}
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
                icon: 'delete',
                color: 'error',
                tooltip: 'Xoá',
                onClick: onRowDelete,
                disableKey: 'scope',
                disableActions: (scope?: number) => scope === 2,
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
        submitText={'Xoá'}
        cancelText={'Huỷ'}
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