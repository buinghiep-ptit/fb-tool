import { yupResolver } from '@hookform/resolvers/yup'
import { SearchSharp } from '@mui/icons-material'
import { Grid, Icon, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchHandbooks } from 'app/apis/handbook/handbook.service'
import { fetchKeywords } from 'app/apis/keyword/keyword.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useDeleteHandbook } from 'app/hooks/queries/useHandbooksData'
import {
  useDeleteKeyword,
  useTogglePinKeyword,
} from 'app/hooks/queries/useKeywordsData'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { IHandbookOverall, IHandbookResponse } from 'app/models/handbook'
import { IKeyword, IKeywordResponse } from 'app/models/keyword'
import { columnsHandbooks } from 'app/utils/columns/columnsHandbooks'
import { columnsTrendingKeywords } from 'app/utils/columns/columnsTrendingKeywords'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'
import { DiagLogConfirm } from '../orders/details/ButtonsLink/DialogConfirm'
import UnlinkedCampgrounds from './UnlinkedCampgrounds'

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
  title?: string
  page?: number
  size?: number
  sort?: string
}

export default function ListHandbook(props: Props) {
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
    title: queryParams.title ?? '',
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
    submitText?: string
    cancelText?: string
  }>({})
  const [openDialog, setOpenDialog] = useState(false)
  const [row, setRow] = useState<any>({})

  const validationSchema = Yup.object().shape({
    title: Yup.string()
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
  }: UseQueryResult<IHandbookResponse, Error> = useQuery<
    IHandbookResponse,
    Error
  >(['handbooks', filters], () => fetchHandbooks(filters), {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    keepPreviousData: true,
    enabled: !!filters,
  })
  const onRowUpdateSuccess = (data: any, message?: string) => {
    toastSuccess({ message: message ?? '' })
    setOpenDialog(false)
  }

  const { mutate: togglePin, isLoading: toggleLoading } = useTogglePinKeyword(
    () => onRowUpdateSuccess(null, 'Cập nhật thành công'),
  )
  const { mutate: deleteHandbook } = useDeleteHandbook(() =>
    onRowUpdateSuccess(null, 'Xoá thành công'),
  )

  const onSubmitDialog = () => {
    switch (dialogData.type) {
      case 'camps':
        deleteHandbook(row.id)
        break
        break
      case 'toggle-pin':
        togglePin(row.id)
        break

      case 'delete':
        deleteHandbook(row.id)
        break
        break

      default:
        break
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

  const onRowAdd = (cell: any, row: any) => {
    setDialogData(prev => ({
      ...prev,
      title: 'Điểm camping đã liên kết',
      type: 'camps',
      submitText: 'Lưu',
      cancelText: 'Huỷ',
    }))
    setOpenDialog(true)
    setRow(row)
  }

  const onRowDelete = (cell: any, row: any) => {
    setDialogData(prev => ({
      ...prev,
      title: 'Xoá cẩm nang',
      message: 'Bạn có chắc chắn muốn xoá cẩm nang',
      type: 'delete',
      submitText: 'Xoá',
      cancelText: 'Huỷ',
    }))
    setOpenDialog(true)
    setRow(row)
  }

  const onRowUpdate = (cell: any, row: any) => {
    navigation(`${row.id}/chi-tiet`, { state: { mode: 'update' } })
  }

  const onClickRow = (cell: any, row: any) => {
    if (cell.id === 'word') {
      navigation(`${row.id}/chi-tiet`, { state: { mode: 'update' } })
    }
  }

  const onResetFilters = () => {
    methods.reset({
      title: '',
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
        <Breadcrumb routeSegments={[{ name: 'Quản lý cẩm nang' }]} />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        <MuiButton
          title="Thêm mới cẩm nang"
          variant="contained"
          color="primary"
          onClick={() => navigation(`them-moi`, {})}
          startIcon={<Icon>control_point</Icon>}
        />
      </Stack>
      <Stack gap={3}>
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
                    label={'Tiêu đề'}
                    type="text"
                    name="title"
                    defaultValue=""
                    placeholder="Nhập tiêu đề"
                    fullWidth
                  />
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

        <SimpleCard>
          <MuiStyledTable
            rows={(data?.content as IHandbookOverall[]) ?? []}
            columns={columnsHandbooks}
            rowsPerPage={size}
            page={page}
            onClickRow={onClickRow}
            isFetching={isFetching}
            error={isError ? error : null}
            actions={[
              {
                icon: 'data_saver_on',
                color: 'primary',
                tooltip: 'Điểm camping đã liên kết',
                onClick: onRowAdd,
              },
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
        </SimpleCard>
      </Stack>

      <DiagLogConfirm
        title={dialogData.title ?? ''}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={dialogData.type === 'camps' ? undefined : onSubmitDialog}
        maxWidth={dialogData.type === 'camps' ? 'md' : 'sm'}
        submitText={
          dialogData.type === 'camps' ? undefined : dialogData.submitText
        }
        cancelText={dialogData.cancelText}
      >
        {dialogData.type === 'camps' ? (
          <UnlinkedCampgrounds handbook={row} isLinked={true} />
        ) : (
          <Stack py={5} justifyContent={'center'} alignItems="center">
            <MuiTypography variant="subtitle1">
              {dialogData.message ?? ''}
            </MuiTypography>
            <MuiTypography variant="subtitle1" color="primary">
              {row.name}
            </MuiTypography>
          </Stack>
        )}
      </DiagLogConfirm>
      {/* 
      {policyId && (
        <MuiStyledModal
          title={dialogData.title ?? ''}
          open={openDialog}
          maxWidth="md"
          onCloseModal={() => setOpenDialog(false)}
          isLoading={createLoading || updateLoading}
          cancelText="Quay lại"
        >
          <UnlinkedCampgrounds handbookId={}={Number(policyId)} />
        </MuiStyledModal>
      )} */}
    </Container>
  )
}
