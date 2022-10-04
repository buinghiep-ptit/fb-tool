import { ApprovalSharp, ReportSharp } from '@mui/icons-material'
import { Chip, Grid, styled } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useQueries, UseQueryResult } from '@tanstack/react-query'
import {
  fetchActionsHistory,
  fetchFeedDetail,
  fetchReportsDecline,
} from 'app/apis/feed/feed.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { ImageListView } from 'app/components/common/ImageListCustomize'
import { MediaViewItem } from 'app/components/common/MediaViewItem'
import { ModalFullScreen } from 'app/components/common/ModalFullScreen'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { IActionHistory, Image, IReportDecline } from 'app/models'
import {
  columnsFeedLogsActions,
  columnsFeedLogsReports,
} from 'app/utils/columns'
import { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'

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
  const { feedId } = useParams()
  const [open, setOpen] = useState(false)
  const [initialIndexSlider, setInitialIndexSlider] = useState(0)

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
    console.log('onClickMedia: ', imgIndex)
    if (imgIndex === 4) setInitialIndexSlider(0)
    else setInitialIndexSlider(imgIndex ?? 0)
    setOpen(true)
  }

  const onRemoveMedia = (imgIndex?: number) => {
    console.log('onRemoveMedia: ', imgIndex)
  }

  const handleClose = () => {
    setOpen(false)
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
        return 'Đã duyệt'
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
      <Stack gap={3}>
        <SimpleCard title="Chi tiết Feed">
          <Box>
            <Grid container spacing={2} mb={2}>
              <Grid item sm={2} xs={12}>
                <MuiButton
                  title="Duyệt"
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ width: '100%' }}
                  startIcon={<ApprovalSharp />}
                />
              </Grid>
              <Grid item sm={2} xs={12}>
                <NavLink to={'/quan-ly-feeds/bao-cao-vi-pham'}>
                  <MuiButton
                    title="Vi phạm"
                    variant="outlined"
                    color="error"
                    type="submit"
                    sx={{ width: '100%' }}
                    startIcon={<ReportSharp />}
                  />
                </NavLink>
              </Grid>
              <Grid
                item
                sm={8}
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

            <Grid container spacing={2}>
              <Grid item sm={6} xs={12}>
                <Box>
                  <MuiTypography variant="subtitle2">[Nội dung]</MuiTypography>
                  <MuiTypography variant="body2">
                    {feed.data?.content}
                  </MuiTypography>
                </Box>
                <Box mt={1}>
                  <MuiTypography variant="subtitle2">[Hashtag]</MuiTypography>
                  <Stack flexDirection={'row'} gap={1} my={1}>
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
                </Box>
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
                  <ImageListView
                    medias={feed.data?.images as Image[]}
                    onClickMedia={onClickMedia}
                  />
                  <ModalFullScreen
                    data={feed.data?.images as Image[]}
                    open={open}
                    onCloseModal={handleClose}
                    onSubmit={onRemoveMedia}
                    initialIndexSlider={initialIndexSlider}
                  />
                </Box>
              )}
            </Stack>
          </Box>
        </SimpleCard>

        <SimpleCard title="Báo cáo vi phạm">
          <MuiStyledTable
            rows={reportsDecline?.data?.content as IReportDecline[]}
            columns={columnsFeedLogsReports as any}
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
    </Container>
  )
}
