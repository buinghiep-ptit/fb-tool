import { Avatar, Chip, Grid, Icon, styled } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useQueries, UseQueryResult } from '@tanstack/react-query'
import {
  fetchActionsHistory,
  fetchFeedDetail,
  fetchReportsDecline,
} from 'app/apis/feed/feed.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { CountdownTimer } from 'app/components/common/CountdownTimer'
import { ImageListView } from 'app/components/common/ImageListCustomize'
import { MediaViewItem } from 'app/components/common/MediaViewItem'
import { ModalFullScreen } from 'app/components/common/ModalFullScreen'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import { useApproveFeed, useDeleteFeed } from 'app/hooks/queries/useFeedsData'
import {
  IActionHistory,
  Image,
  IMediaOverall,
  IReportDecline,
} from 'app/models'
import {
  columnsFeedLogsActions,
  columnsFeedLogsReports,
} from 'app/utils/columns'
import { useEffect, useState } from 'react'
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

export default function FeedDetail(props: Props) {
  const navigate = useNavigate()
  const { feedId } = useParams()
  const [open, setOpen] = useState(false)
  const [initialIndexSlider, setInitialIndexSlider] = useState(0)
  const [mediasSrcPreviewer, setMediasSrcPreviewer] = useState<IMediaOverall[]>(
    [],
  )

  const [pageReports, setPageReports] = useState<number>(0)
  const [sizeReports, setSizeReports] = useState<number>(5)
  const [filtersReports, setFiltersReports] = useState({
    feedId: Number(feedId ?? 0),
    page: pageReports,
    size: sizeReports,
  })

  const [pageActions, setPageActions] = useState<number>(0)
  const [sizeActions, setSizeActions] = useState<number>(5)
  const [filtersActions, setFiltersActions] = useState({
    feedId: Number(feedId ?? 0),
    page: pageActions,
    size: sizeActions,
  })

  const [titleDialog, setTitleDialog] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState(1)

  const queryResults = useQueries({
    queries: [
      {
        queryKey: ['feed', feedId],
        queryFn: () => fetchFeedDetail(Number(feedId ?? 0)),
        refetchOnWindowFocus: false,
        enabled: !!feedId,
      },
      {
        queryKey: ['reports-decline', filtersReports],
        queryFn: () => fetchReportsDecline(filtersReports),
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        enabled: !!filtersReports,
      },
      {
        queryKey: ['actions-history', filtersActions],
        queryFn: () => fetchActionsHistory(filtersActions),
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        enabled: !!filtersActions,
      },
    ],
  })

  const [feed, reportsDecline, actionsHistory] = queryResults

  const isLoading = queryResults.some(
    (query: UseQueryResult) => query.isLoading,
  )
  const isError = queryResults.some((query: UseQueryResult) => query.isError)
  const isFetching = queryResults.some(
    (query: UseQueryResult) => query.isFetching,
  )

  useEffect(() => {
    setMediasSrcPreviewer(feed.data?.images ?? [])
  }, [JSON.stringify(feed)])

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

  const onRemoveMedia = (imgIndex?: number) => {
    mediasSrcPreviewer.splice(imgIndex ?? 0, 1)
    setMediasSrcPreviewer([...mediasSrcPreviewer])
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSuccess = (data: any) => {
    toastSuccess({
      message: dialogType === 1 ? 'Duyệt bài thành công' : 'Xoá bài thành công',
    })
    setOpenDialog(false)
  }
  const { mutate: approve, isLoading: approveLoading } =
    useApproveFeed(onSuccess)
  const { mutate: deletedFeed, isLoading: deleteLoading } =
    useDeleteFeed(onSuccess)

  const approveFeed = (feedId: number) => {
    approve(feedId)
  }
  const openDialogDelete = () => {
    setTitleDialog('Xoá bài đăng')
    setDialogType(-1)
    setOpenDialog(true)
  }
  const OnDeleteFeed = () => {
    deletedFeed(Number(feedId ?? 0))
  }

  const getColorByCusStatus = (status: number) => {
    switch (status) {
      case -2:
        return '#AAAAAA'
      case -1:
        return '#FF3D57'
      case 0:
        return '#ff9e43'
      case 1:
        return '#2F9B42'

      default:
        return '#AAAAAA'
    }
  }

  const getLabelByCusStatus = (status: number) => {
    switch (status) {
      case 1:
        return 'Hợp lệ'
      case -2:
        return 'Xoá'

      case -1:
        return 'Vi phạm'

      case 0:
        return 'Chờ hậu kiểm'

      default:
        return 'Xoá'
    }
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
            { name: 'Quản lý Feed', path: '/quan-ly-feeds' },
            { name: 'Chi tiết' },
          ]}
        />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 999 }}
      >
        <MuiButton
          disabled={feed?.data && feed?.data.status === 1}
          title="Duyệt bài"
          variant="contained"
          color="primary"
          onClick={() => approveFeed(Number(feedId ?? 0))}
          loading={approveLoading}
          startIcon={<Icon>done</Icon>}
        />
        <MuiButton
          title="Chỉnh sửa"
          variant="outlined"
          color="primary"
          disabled={
            feed.data?.customerInfo?.type !== 0 &&
            feed.data?.customerInfo?.type !== 3
          }
          onClick={() => navigate(`chinh-sua-feed`, {})}
          loading={approveLoading}
          startIcon={<Icon>edit</Icon>}
        />
        <MuiButton
          disabled={feed?.data && feed?.data.status === -1}
          title="Vi phạm"
          variant="contained"
          color="warning"
          onClick={() =>
            navigate(`vi-pham`, {
              state: { modal: true },
            })
          }
          startIcon={<Icon>report</Icon>}
        />

        <MuiButton
          disabled={feed?.data && feed?.data.status === -3}
          title="Xoá bài"
          variant="contained"
          color="error"
          onClick={openDialogDelete}
          loading={deleteLoading}
          startIcon={<Icon>clear</Icon>}
        />

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
              <Grid item sm={8} xs={12}>
                <Stack flexDirection={'row'} gap={2} alignItems="center">
                  <Avatar
                    alt="avatar"
                    src={
                      feed.data?.customerInfo?.avatar
                        ? feed.data?.customerInfo?.avatar
                        : '/assets/images/app/avatar-default.svg'
                    }
                    sx={{ width: 56, height: 56 }}
                  />
                  <Stack flexDirection={'column'}>
                    <MuiTypography variant="subtitle2">
                      {feed.data?.customerInfo?.fullName}
                    </MuiTypography>
                    <MuiTypography variant="body2">
                      {feed.data?.content}
                    </MuiTypography>
                  </Stack>
                </Stack>
                <Stack flexDirection={'row'} gap={1} my={2}>
                  {feed.data?.tags?.map(tag => (
                    <Chip
                      key={tag.id}
                      label={`#${tag.value}`}
                      size="small"
                      // color={true ? 'primary' : 'default'}
                      sx={{
                        px: 1,
                        backgroundColor: '#DDD',
                      }}
                    />
                  ))}
                </Stack>
              </Grid>

              <Grid
                item
                sm={4}
                xs={12}
                display="flex"
                justifyContent="flex-end"
              >
                <Chip
                  label={getLabelByCusStatus(feed.data?.status as number)}
                  size="small"
                  // color={true ? 'primary' : 'default'}
                  sx={{
                    px: 1,
                    backgroundColor: getColorByCusStatus(
                      feed.data?.status as number,
                    ),
                    color: '#FFFFFF',
                  }}
                />
              </Grid>
            </Grid>

            <Stack flexDirection={'row'} justifyContent={'center'}>
              {feed.data?.type === 1 ? (
                <Box width={'50%'} maxWidth={320}>
                  <MediaViewItem
                    media={feed.data.video as any}
                    orientation="vertical"
                  />
                </Box>
              ) : (
                <Box width={'75%'} maxWidth={{ md: '568px', xs: '568px' }}>
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
                        // onSubmit={onRemoveMedia}
                        initialIndexSlider={initialIndexSlider}
                      />
                    </>
                  )}
                </Box>
              )}
            </Stack>
          </Box>
        </SimpleCard>

        <SimpleCard title="Báo cáo vi phạm">
          <MuiStyledTable
            rows={reportsDecline?.data?.content as IReportDecline[]}
            columns={columnsFeedLogsReports as any}
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

        <SimpleCard title="Logs hành động">
          <MuiStyledTable
            rows={actionsHistory?.data?.content as IActionHistory[]}
            columns={columnsFeedLogsActions as any}
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
        title={titleDialog}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={OnDeleteFeed}
      >
        <Stack py={5} justifyContent={'center'} alignItems="center">
          <MuiTypography variant="subtitle1">
            Bạn có chắc chắn muốn xoá bài?
          </MuiTypography>
        </Stack>
      </DiagLogConfirm>
    </Container>
  )
}
