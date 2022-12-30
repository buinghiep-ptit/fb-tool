import { yupResolver } from '@hookform/resolvers/yup'
import { ChangeCircleSharp, SearchSharp } from '@mui/icons-material'
import { Grid, Icon, MenuItem, Stack, styled } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import { fetchConfigs } from 'app/apis/config/config.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useChangeIsDefaultAudio,
  useChangeStatusAudio,
  useDeleteAudio,
} from 'app/hooks/queries/useAudiosData'
import { useNavigateParams } from 'app/hooks/useNavigateParams'
import { IConfigOverall } from 'app/models/config'
import { columnsAudios } from 'app/utils/columns/columnsAudios'
import { columnsConfigs } from 'app/utils/columns/columnsConfig'
import { extractMergeFiltersObject } from 'app/utils/extraSearchFilters'
import React, { useState } from 'react'
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

export interface IAudiosFilters {
  search?: string
  status?: 0 | 1 | 'all' | string | undefined //  0:Chờ hậu kiểm 1:Đã duyệt -1:Vi phạm  -2:Bị báo cáo -3:Đã xóa
  isDefault?: 0 | 1 | 'all' | string | undefined //
  page?: number | 0
  size?: number | 20
  sort?: string
}

export interface Props {}

export default function ConfigList(props: Props) {
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

  const [defaultValues] = useState<IAudiosFilters>({
    search: queryParams.search ?? '',
    status: queryParams.status ?? 'all',
    isDefault: queryParams.isDefault ?? 'all',
    page: queryParams.page ? +queryParams.page : 0,
    size: queryParams.size ? +queryParams.size : 20,
  })

  const [filters, setFilters] = useState<IAudiosFilters>(
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
  const [audioId, setAudioId] = useState(0)

  const validationSchema = Yup.object().shape({
    search: Yup.string()
      .min(0, 'email must be at least 0 characters')
      .max(255, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<IAudiosFilters>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { data, isLoading, isFetching, isError, error } = useQuery<
    IConfigOverall[],
    Error
  >(['configs', filters], () => fetchConfigs(filters), {
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

  const onSubmitHandler: SubmitHandler<IAudiosFilters> = (
    values: IAudiosFilters,
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
      isDefault: 'all',
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
    toastSuccess({
      message: message ?? '',
    })
    setOpenDialog(false)
  }

  const { mutate: changeStatus, isLoading: updateLoading } =
    useChangeStatusAudio(() => onRowUpdateSuccess(null, 'Cập nhật thành công'))

  const { mutate: changeIsDefault, isLoading: defaultLoading } =
    useChangeIsDefaultAudio(() =>
      onRowUpdateSuccess(null, 'Cập nhật thành công'),
    )

  const { mutate: deleteAudio, isLoading: deleteLoading } = useDeleteAudio(() =>
    onRowUpdateSuccess(null, 'Xoá nhạc nền thành công'),
  )

  const submitDialog = () => {
    switch (dialogData.type) {
      case 'toggle-status':
        changeStatus(audioId)
        break
      case 'toggle-isDefault':
        changeIsDefault(audioId)
        break
      case 'delete':
        deleteAudio(audioId)
        break

      default:
        break
    }
  }

  const onRowUpdate = (cell: any, row: any) => {
    navigation(`${row.id_CONFIG}/chi-tiet`, {
      state: { modal: true, data: row },
    })
  }

  const onClickRow = (cell: any, row: any) => {
    if (['edit', 'account'].includes(cell.id)) {
      navigation(`${row.configId}`, {})
    }
  }

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Quản lý cấu hình' }]} />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 9 }}
      >
        <MuiButton
          title="Thêm cấu hình"
          variant="contained"
          color="primary"
          type="submit"
          onClick={() =>
            navigation('them-moi', {
              state: { modal: true },
            })
          }
          startIcon={<Icon>control_point</Icon>}
        />
      </Stack>
      <Stack gap={3}>
        {/* <SimpleCard>
          <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
            <FormProvider {...methods}>
              <Grid container spacing={2}>
                <Grid item sm={4} xs={12}>
                  <FormInputText
                    label={'Tến bài hát/Người thể hiện/Tác giả'}
                    type="text"
                    name="search"
                    size="small"
                    placeholder="Nhập từ khoá"
                    fullWidth
                    defaultValue=""
                  />
                </Grid>

                <Grid item sm={4} xs={12}>
                  <SelectDropDown name="status" label="Trạng thái">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="1">Hoạt động</MenuItem>
                    <MenuItem value="0">Không hoạt động</MenuItem>
                  </SelectDropDown>
                </Grid>

                <Grid item sm={4} xs={12}>
                  <SelectDropDown name="isDefault" label="Thể loại">
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="1">Nhạc hay</MenuItem>
                    <MenuItem value="0">Nhạc thường</MenuItem>
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
        </SimpleCard> */}

        <SimpleCard>
          <MuiStyledTable
            rows={data ? (data as IConfigOverall[]) : []}
            columns={columnsConfigs}
            rowsPerPage={size}
            page={page}
            onClickRow={onClickRow}
            isFetching={isFetching}
            error={isError ? error : null}
            actions={[
              {
                icon: 'edit',
                color: 'action',
                tooltip: 'Chi tiết',
                onClick: onRowUpdate,
              },
            ]}
          />
          {/* <MuiStyledPagination
            component="div"
            rowsPerPageOptions={[20, 50, 100]}
            count={data ? (data?.length as number) : 0}
            rowsPerPage={size}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </SimpleCard>
      </Stack>

      {/* <DiagLogConfirm
        title={dialogData.title}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={submitDialog}
        submitText={dialogData.submitText}
        cancelText={dialogData.cancelText}
        isLoading={updateLoading || deleteLoading || defaultLoading}
      >
        <Stack py={5} justifyContent={'center'} alignItems="center">
          <MuiTypography variant="subtitle1">
            {dialogData.message}
          </MuiTypography>
        </Stack>
      </DiagLogConfirm> */}
    </Container>
  )
}
