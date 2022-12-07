import { Chip, Grid, Icon, styled } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useQueries, UseQueryResult } from '@tanstack/react-query'
import {
  fetchRateDetail,
  fetchRateDetailActionsHistory,
  fetchRateDetailReports,
} from 'app/apis/rating/rating.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { ImageListView } from 'app/components/common/ImageListCustomize'
import { ModalFullScreen } from 'app/components/common/ModalFullScreen'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import useNoteDialogForm from 'app/hooks/components/useNoteDialogForm'
import { useApproveFeed, useDeleteFeed } from 'app/hooks/queries/useFeedsData'
import { useToggleRateStatus } from 'app/hooks/queries/useRatingData'
import { IActionHistory, Image, IMediaOverall, IRateReport } from 'app/models'
import { ICustomerOrder } from 'app/models/order'
import {
  columnsRateDetailActionsHistory,
  columnsRateDetailReports,
} from 'app/utils/columns/columnsRatings'
import { ReactElement, useEffect, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { DiagLogConfirm } from '../orders/details/ButtonsLink/DialogConfirm'

export interface Props {}

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export const convertDisplayCustomer = (
  customer?: ICustomerOrder,
  splitChar?: string,
) => {
  if (!customer) return ''
  const displayText = `${
    customer.fullName ? customer.fullName + splitChar + ' ' : ''
  }${customer.mobilePhone ? customer.mobilePhone + splitChar + ' ' : ''}${
    customer.email
  }`
  return displayText
}

const convertReports = (reports: IRateReport[]) => {
  return reports.map(report => ({
    ...report,
    customer: `${report.cusMobilePhone ? report.cusMobilePhone + '-' : ''}${
      report.cusEmail ? report.cusEmail + '-' : ''
    }${report.cusName}`,
  }))
}

export default function RateDetail(props: Props) {
  const navigate = useNavigate()
  const { rateId } = useParams()
  const [open, setOpen] = useState(false)
  const [initialIndexSlider, setInitialIndexSlider] = useState(0)
  const [mediasSrcPreviewer, setMediasSrcPreviewer] = useState<IMediaOverall[]>(
    [],
  )

  const [pageReports, setPageReports] = useState<number>(0)
  const [sizeReports, setSizeReports] = useState<number>(5)
  const [filtersReports, setFiltersReports] = useState({
    rateId: Number(rateId ?? 0),
    page: pageReports,
    size: sizeReports,
  })

  const [pageActions, setPageActions] = useState<number>(0)
  const [sizeActions, setSizeActions] = useState<number>(5)
  const [filtersActions, setFiltersActions] = useState({
    rateId: Number(rateId ?? 0),
    page: pageActions,
    size: sizeActions,
  })

  const [dialogData, setDialogData] = useState<{
    title?: string
    message?: string | ReactElement | any
    type?: string
    submitText?: string
    cancelText?: string
  }>({})
  const [openDialog, setOpenDialog] = useState(false)

  const queryResults = useQueries({
    queries: [
      {
        queryKey: ['rate', rateId],
        queryFn: () => fetchRateDetail(Number(rateId ?? 0)),
        refetchOnWindowFocus: false,
        enabled: !!rateId,
      },
      {
        queryKey: ['rate-reports', filtersReports],
        queryFn: () => fetchRateDetailReports(filtersReports),
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        enabled: !!filtersReports,
      },
      {
        queryKey: ['rate-actions-history', filtersActions],
        queryFn: () => fetchRateDetailActionsHistory(filtersActions),
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        enabled: !!filtersActions,
      },
    ],
  })

  const [rate, reportsDecline, actionsHistory] = queryResults

  const isLoading = queryResults.some(
    (query: UseQueryResult) => query.isLoading,
  )
  const isError = queryResults.some((query: UseQueryResult) => query.isError)
  const isFetching = queryResults.some(
    (query: UseQueryResult) => query.isFetching,
  )

  useEffect(() => {
    setMediasSrcPreviewer(
      rate.data?.imgs?.filter(img => img.mediaType === 3) ?? [],
    )
  }, [JSON.stringify(rate)])

  const handleChangePageReports = (event: unknown, newPage: number) => {
    setPageReports(newPage)
    setFiltersReports((prevFilters: any) => {
      return {
        ...prevFilters,
        page: newPage,
      }
    })
  }

  const handleChangeRowsPerPageReports = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSizeReports(+event.target.value)
    setPageReports(0)
    setFiltersReports((prevFilters: any) => {
      return {
        ...prevFilters,
        page: 0,
        size: parseInt(event.target.value, 10),
      }
    })
  }

  const handleChangePageActions = (event: unknown, newPage: number) => {
    setPageActions(newPage)
    setFiltersActions((prevFilters: any) => {
      return {
        ...prevFilters,
        page: newPage,
      }
    })
  }

  const handleChangeRowsPerPageActions = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSizeActions(+event.target.value)
    setPageActions(0)
    setFiltersActions((prevFilters: any) => {
      return {
        ...prevFilters,
        page: 0,
        size: parseInt(event.target.value, 10),
      }
    })
  }

  const onClickMedia = (imgIndex?: number) => {
    setInitialIndexSlider(imgIndex ?? 0)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    setOpenDialog(false)
  }
  const { mutate: toggleStatus, isLoading: dialogLoading } =
    useToggleRateStatus(() => onSuccess(null, 'Cập nhật thành công'))

  const [getContentNote, methodsNote] = useNoteDialogForm('note')

  const onSubmitDialogHandler: SubmitHandler<{
    note?: string
  }> = (values: { note?: string }) => {
    console.log('vao day')
    toggleStatus({
      rateId: Number(rateId ?? 0),
      note: values.note || undefined,
    })
  }

  const onSubmitDialog = () => {
    methodsNote.handleSubmit(onSubmitDialogHandler)()
  }

  const approveDialog = () => {
    setDialogData(prev => ({
      ...prev,
      title: 'Hợp lệ',
      message: (dialogLoading?: boolean) => getContentNote(dialogLoading),
      type: 'toggle-status',
      submitText: 'Hợp lệ',
      cancelText: 'Huỷ',
    }))
    setOpenDialog(true)
  }

  const rejectDialog = () => {
    setDialogData(prev => ({
      ...prev,
      title: 'Chặn',
      message: (dialogLoading?: boolean) => getContentNote(dialogLoading),
      type: 'toggle-status',
      submitText: 'Chặn',
      cancelText: 'Huỷ',
    }))
    setOpenDialog(true)
  }

  if (isLoading) return <MuiLoading />

  if (isError)
    return (
      <Box my={2} textAlign="center">
        <MuiTypography variant="h5">Have an errors</MuiTypography>
      </Box>
    )

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý đánh giá', path: '/quan-ly-danh-gia' },
            { name: 'Chi tiết' },
          ]}
        />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 999 }}
      >
        {rate.data?.status === 1 && (
          <MuiButton
            title="Chặn"
            variant="contained"
            color="warning"
            onClick={rejectDialog}
            startIcon={<Icon>clear</Icon>}
          />
        )}

        {rate.data?.status === -1 && (
          <MuiButton
            title="Hợp lệ"
            variant="contained"
            color="primary"
            onClick={approveDialog}
            loading={false}
            startIcon={<Icon>done</Icon>}
          />
        )}

        <MuiButton
          title="Quay lại"
          variant="contained"
          color="inherit"
          onClick={() => navigate(-1)}
          startIcon={<Icon>keyboard_return</Icon>}
        />
      </Stack>
      <Stack gap={3}>
        <SimpleCard>
          <Box>
            <Grid container spacing={2}>
              <Grid item sm={10} xs={12}>
                <Stack flexDirection={'column'} gap={2} alignItems="flex-start">
                  <Stack flexDirection={'row'} gap={1}>
                    <MuiTypography variant="subtitle2">
                      Điểm camp:
                    </MuiTypography>
                    <MuiTypography variant="body2" flex={1}>
                      {rate.data?.campground?.name}
                    </MuiTypography>
                  </Stack>
                  <Stack flexDirection={'row'} gap={1}>
                    <MuiTypography variant="subtitle2">
                      Người đánh giá:
                    </MuiTypography>
                    <MuiTypography variant="body2" flex={1}>
                      {convertDisplayCustomer(rate.data?.customer, ',')}
                    </MuiTypography>
                  </Stack>
                  <Stack flexDirection={'row'} gap={1}>
                    <MuiTypography variant="subtitle2">
                      Nội dung đánh giá:
                    </MuiTypography>
                    <MuiTypography variant="body2" flex={1}>
                      {rate.data?.comment}
                    </MuiTypography>
                  </Stack>
                  <Stack flexDirection={'row'} gap={1}>
                    {[1, 2, 3, 4, 5].map(num => (
                      <Icon
                        key={num}
                        color={
                          num <= (rate.data?.rating ?? 0)
                            ? 'primary'
                            : 'disabled'
                        }
                      >
                        star
                      </Icon>
                    ))}
                  </Stack>
                </Stack>
              </Grid>
              <Grid
                item
                sm={2}
                xs={12}
                display="flex"
                justifyContent="flex-end"
              >
                <Chip
                  label={rate.data?.status === 1 ? 'Hoạt động' : 'Đã chặn'}
                  size="small"
                  color={rate.data?.status === 1 ? 'primary' : 'default'}
                  sx={{
                    px: 1,
                  }}
                />
              </Grid>
            </Grid>

            <Stack flexDirection={'row'} justifyContent={'center'}>
              <Box
                width={{
                  xs: '100%',
                  sm: '50%',
                  md: '25%',
                }}
              >
                {!!mediasSrcPreviewer.length && (
                  <>
                    <ImageListView
                      medias={mediasSrcPreviewer as Image[]}
                      onClickMedia={onClickMedia}
                    />
                    <ModalFullScreen
                      mode="view"
                      data={mediasSrcPreviewer as Image[]}
                      open={open}
                      onCloseModal={handleClose}
                      initialIndexSlider={initialIndexSlider}
                    />
                  </>
                )}
              </Box>
            </Stack>
          </Box>
        </SimpleCard>

        <SimpleCard title="Khiếu nại">
          <MuiStyledTable
            rows={
              reportsDecline.data
                ? convertReports(reportsDecline.data?.content as IRateReport[])
                : []
            }
            columns={columnsRateDetailReports as any}
            rowsPerPage={sizeReports}
            page={pageReports}
            onClickRow={() => {}}
            isFetching={isFetching}
          />
          <MuiStyledPagination
            component="div"
            rowsPerPageOptions={[5, 10, 20]}
            count={reportsDecline?.data?.totalElements as number}
            rowsPerPage={sizeReports}
            page={pageReports}
            onPageChange={handleChangePageReports}
            onRowsPerPageChange={handleChangeRowsPerPageReports}
          />
        </SimpleCard>

        <SimpleCard title="Log hành động">
          <MuiStyledTable
            rows={actionsHistory?.data?.content as IActionHistory[]}
            columns={columnsRateDetailActionsHistory as any}
            rowsPerPage={sizeActions}
            page={pageActions}
            onClickRow={() => {}}
            isFetching={isFetching}
          />
          <MuiStyledPagination
            component="div"
            rowsPerPageOptions={[5, 10, 20]}
            count={actionsHistory?.data?.totalElements as number}
            rowsPerPage={sizeActions}
            page={pageActions}
            onPageChange={handleChangePageActions}
            onRowsPerPageChange={handleChangeRowsPerPageActions}
          />
        </SimpleCard>
      </Stack>

      <DiagLogConfirm
        title={dialogData.title}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={() => onSubmitDialog()}
        submitText={dialogData.submitText}
        cancelText={dialogData.cancelText}
      >
        <Stack>
          {dialogData?.message && dialogData?.message(dialogLoading)}
        </Stack>
      </DiagLogConfirm>
    </Container>
  )
}
