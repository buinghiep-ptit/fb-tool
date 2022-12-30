import { yupResolver } from '@hookform/resolvers/yup'
import {
  Avatar,
  Chip,
  Grid,
  Icon,
  IconButton,
  styled,
  Tooltip,
} from '@mui/material'
import { Box, Stack } from '@mui/system'
import {
  useInfiniteQuery,
  useQueries,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query'
import {
  customerSystemDefault,
  fetchCustomers,
} from 'app/apis/accounts/customer.service'
import {
  fetchActionsHistory,
  fetchFeedDetail,
  fetchListCommentFeed,
  fetchReportsDecline,
} from 'app/apis/feed/feed.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { ImageListView } from 'app/components/common/ImageListCustomize'
import { MediaViewItem } from 'app/components/common/MediaViewItem'
import { ModalFullScreen } from 'app/components/common/ModalFullScreen'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import { MuiRHFAutoComplete } from 'app/components/common/MuiRHFAutoComplete'
import MuiStyledPagination from 'app/components/common/MuiStyledPagination'
import MuiStyledTable from 'app/components/common/MuiStyledTable'
import { MuiSwitch } from 'app/components/common/MuiSwitch'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useApproveFeed,
  useBookmarkFeed,
  useDeleteFeed,
  useLikeFeed,
  usePostComment,
} from 'app/hooks/queries/useFeedsData'
import {
  IActionHistory,
  IComment,
  ICustomerDetail,
  ICustomerResponse,
  ICustomerTiny,
  IFeedDetail,
  Image,
  IMediaOverall,
  IReportDecline,
} from 'app/models'
import {
  columnsFeedLogsActions,
  columnsFeedLogsReports,
} from 'app/utils/columns'
import { ISODateTimeFormatter } from 'app/utils/formatters/dateTimeFormatters'
import { messages } from 'app/utils/messages'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { DiagLogConfirm } from '../orders/details/ButtonsLink/DialogConfirm'
import { CommentForm } from './detail/CommentForm'
import { CommentList } from './detail/CommentList'
import ReactionList from './detail/ReactionList'

export interface Props {}

type SchemaType = {
  customer?: any // idCustomer
}

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

  const [dialogData, setDialogData] = useState<{
    title?: string
    message?: string
    type?: string
    submitText?: string
    cancelText?: string
  }>({})

  const [openDialog, setOpenDialog] = useState(false)

  const [customersCmt, setCustomersCmt] = useState<ICustomerDetail[]>([])

  const [defaultValues] = useState<SchemaType>({})

  const validationSchema = Yup.object().shape({
    customer: Yup.object().nullable().required(messages.MSG1).nullable(),
  })

  const methods = useForm<SchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const customer = methods.watch('customer') as ICustomerDetail

  const { mutate: postCmt, isLoading: postLoading } = usePostComment(() =>
    onSuccess(null, 'Bình luận thành công'),
  )

  const { mutate: like } = useLikeFeed()

  const { mutate: bookmark } = useBookmarkFeed()

  const onPostComment = (message: string) => {
    postCmt({
      idCustomer: customer?.customerId,
      idParent: Number(feedId),
      comment: message,
      parentType: 1,
    })
  }

  const onLikeFeed = () => {
    like({
      feedId: Number(feedId),
      payload: { customerId: customer?.customerId ?? 0 },
    })
  }

  const onBookmark = () => {
    bookmark({
      feedId: Number(feedId),
      payload: { customerId: customer?.customerId ?? 0 },
    })
  }

  const queryResults = useQueries({
    queries: [
      {
        queryKey: ['feed', feedId, customer?.customerId],
        queryFn: () =>
          fetchFeedDetail(Number(feedId ?? 0), {
            customerId: customer?.customerId ?? 0,
          }),
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

  const { data: customerCampdi } = useQuery<ICustomerTiny, Error>(
    ['customer-campdi'],
    () => customerSystemDefault(),
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: customersFood } = useQuery<ICustomerResponse, Error>(
    ['customers-food'],
    () => fetchCustomers({ cusType: 3, size: 500, page: 0 }),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  )

  useEffect(() => {
    if (customerCampdi && customersFood && customersFood.content) {
      const customersMerge = [
        { ...customerCampdi, customerId: customerCampdi.id },
        ...customersFood.content,
      ] as ICustomerDetail[]
      methods.setValue('customer', {
        ...customerCampdi,
        customerId: customerCampdi.id,
      })
      setCustomersCmt(customersMerge)
    }
  }, [customerCampdi, customersFood])

  const [feed, reportsDecline, actionsHistory] = queryResults

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetching: isFetchingComments,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['comments', feedId, customer],
    ({ pageParam }) =>
      fetchListCommentFeed(Number(feedId ?? 0), {
        size: 10,
        index: pageParam ? (pageParam - 1) * 10 : 0,
        customerId: customer?.customerId ?? 0,
      }),
    {
      getNextPageParam: (_lastPage, pages) => {
        if (_lastPage.length) {
          return pages.length + 1
        } else {
          return undefined
        }
      },
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!feedId && !!customer,
      staleTime: 30 * 60 * 1000,
    },
  )

  const isLoading = queryResults.some(
    (query: UseQueryResult) => query.isLoading,
  )
  const isError = queryResults.some((query: UseQueryResult) => query.isError)
  const isFetching = queryResults.some(
    (query: UseQueryResult) => query.isFetching,
  )

  useEffect(() => {
    setMediasSrcPreviewer(
      feed.data?.images?.filter(img => img.mediaType === 3) ?? [],
    )
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

  const handleClose = () => {
    setOpen(false)
  }

  const onSuccess = (data: any, message: string) => {
    toastSuccess({
      message: message,
    })
    if (openDialog) setOpenDialog(false)
  }
  const { mutate: approve, isLoading: approveLoading } = useApproveFeed(() =>
    onSuccess(null, 'Duyệt bài thành công'),
  )
  const { mutate: deletedFeed, isLoading: deleteLoading } = useDeleteFeed(() =>
    onSuccess(null, 'Xoá bài thành công'),
  )

  const approveFeed = (feedId: number) => {
    approve(feedId)
  }

  const openDialogReactions = (type: string) => {
    setDialogData(prev => ({
      ...prev,
      title:
        'Danh sách ' +
        (type === 'view'
          ? 'lượt xem'
          : type === 'like'
          ? 'yêu thích'
          : 'đã lưu'),
      type: type,
      cancelText: 'Đóng',
    }))
    setOpenDialog(true)
  }

  const openDialogDelete = () => {
    setDialogData(prev => ({
      ...prev,
      title: 'Xoá bài đăng',
      message: 'Bạn có chắc chắn muốn xoá bài đăng?',
      type: 'delete',
      submitText: 'Xoá',
      cancelText: 'Huỷ',
    }))
    setOpenDialog(true)
  }
  const OnDeleteFeed = () => {
    deletedFeed(Number(feedId ?? 0))
  }

  const getColorByCusStatus = (status: number) => {
    switch (status) {
      case -3:
        return '#FF3D57'
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
      case -3:
        return 'Bị báo cáo'
      case -1:
        return 'Vi phạm'

      case 0:
        return 'Chờ hậu kiểm'

      default:
        return 'Xoá'
    }
  }

  const getTitleLinked = (type?: number | string) => {
    switch (type) {
      case 1:
        return 'Địa danh'
      case 2:
        return 'Điểm camp'
      case 4:
        return 'Sản phẩm'
      default:
        return 'Không liên kết'
    }
  }

  const interactRender = (feed?: IFeedDetail) => {
    return (
      <>
        <Stack direction={'row'} gap={1.5} alignItems="center">
          <IconButton onClick={() => openDialogReactions('like')}>
            <Tooltip title="Yêu thích" arrow>
              <Icon sx={{ fontSize: '32px!important' }}>favorite</Icon>
            </Tooltip>
            <MuiTypography ml={1.5}>{feed?.likeNum}</MuiTypography>
          </IconButton>
        </Stack>
        <Stack direction={'row'} gap={1.5} alignItems="center">
          <IconButton onClick={() => openDialogReactions('view')}>
            <Tooltip title="Lượt xem" arrow>
              <Icon sx={{ fontSize: '32px!important' }}>remove_red_eye</Icon>
            </Tooltip>
            <MuiTypography ml={1.5}>{feed?.viewNum}</MuiTypography>
          </IconButton>
        </Stack>
        <Stack direction={'row'} gap={1.5} alignItems="center">
          <IconButton onClick={() => {}}>
            <Tooltip title="Bình luận" arrow>
              <Icon sx={{ fontSize: '32px!important' }}>chat</Icon>
            </Tooltip>
            <MuiTypography ml={1.5}>{feed?.commentNum}</MuiTypography>
          </IconButton>
        </Stack>
        <Stack direction={'row'} gap={1.5} alignItems="center">
          <IconButton onClick={() => openDialogReactions('bookmark')}>
            <Tooltip title="Lưu" arrow>
              <Icon sx={{ fontSize: '32px!important' }}>bookmark</Icon>
            </Tooltip>
            <MuiTypography ml={1.5}>{feed?.bookmarkNum}</MuiTypography>
          </IconButton>
        </Stack>
      </>
    )
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
        {feed?.data?.status !== 1 && (
          <MuiButton
            title="Duyệt bài"
            variant="contained"
            color="primary"
            onClick={() => approveFeed(Number(feedId ?? 0))}
            loading={approveLoading}
            startIcon={<Icon>done</Icon>}
          />
        )}

        {(feed.data?.customerInfo?.type === 3 ||
          (feed.data?.customerInfo?.type === 1 &&
            feed.data?.customerInfo?.id === 0)) &&
          feed.data?.status !== -3 && (
            <MuiButton
              title="Chỉnh sửa"
              variant="contained"
              color="primary"
              onClick={() => navigate(`chinh-sua-feed`, {})}
              loading={approveLoading}
              startIcon={<Icon>edit</Icon>}
            />
          )}

        {feed?.data?.status !== -1 && feed?.data?.status !== -3 && (
          <MuiButton
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
        )}

        {feed?.data?.status !== -3 && (
          <MuiButton
            title="Xoá bài"
            variant="contained"
            color="error"
            onClick={openDialogDelete}
            loading={deleteLoading}
            startIcon={<Icon>delete</Icon>}
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
              <Grid item sm={8} xs={12}>
                <Stack flexDirection={'row'} gap={2}>
                  <Avatar
                    alt="avatar"
                    src={
                      feed.data?.customerInfo?.avatar
                        ? feed.data?.customerInfo?.avatar
                        : '/assets/images/app/avatar-default.svg'
                    }
                    sx={{ width: 56, height: 56 }}
                  />
                  <Stack flexDirection={'column'} gap={0.5}>
                    <MuiTypography variant="subtitle2">
                      {feed.data?.customerInfo?.fullName}
                    </MuiTypography>
                    <MuiTypography variant="body2">
                      {feed.data?.dateCreated
                        ? ISODateTimeFormatter(feed.data?.dateCreated)
                        : null}
                    </MuiTypography>
                  </Stack>
                </Stack>
                <Stack mt={3} gap={1.5}>
                  <Stack flexDirection={'row'} gap={1}>
                    <MuiTypography variant="subtitle2" fontStyle={'italic'}>
                      Liên kết với:
                    </MuiTypography>
                    <MuiTypography variant="body2">
                      {getTitleLinked(feed.data?.idSrcType ?? 0)}
                      {' - '}
                      {feed.data?.idSrcType == 4
                        ? feed.data?.webUrl
                        : feed.data?.idSrcType != 0
                        ? feed.data?.srcName
                        : ''}
                    </MuiTypography>
                  </Stack>
                  <Stack flexDirection={'row'} gap={3}>
                    <Stack flexDirection={'row'} gap={1}>
                      <MuiTypography variant="subtitle2" fontStyle={'italic'}>
                        Ai có thể xem:
                      </MuiTypography>
                      <MuiTypography variant="body2">
                        {feed.data?.viewScope === 1
                          ? 'Công khai'
                          : feed.data?.viewScope === 2
                          ? 'Những người theo dõi bạn'
                          : 'Chỉ mình tôi'}
                      </MuiTypography>
                    </Stack>
                    <Stack flexDirection={'row'} gap={1}>
                      <MuiTypography variant="subtitle2" fontStyle={'italic'}>
                        Cho phép bình luận:
                      </MuiTypography>
                      <MuiSwitch
                        checked={feed.data?.isAllowComment === 1 ? true : false}
                        sx={{ justifyContent: 'center' }}
                      />
                    </Stack>
                  </Stack>
                  <MuiTypography variant="body2" mt={1.5}>
                    {feed.data?.content}
                  </MuiTypography>
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

            <Stack direction={'row'} justifyContent={'center'} gap={3}>
              {feed.data?.type === 1 ? (
                <>
                  <Box width={'50%'} maxWidth={320}>
                    <MediaViewItem
                      media={feed.data.video as any}
                      orientation="vertical"
                    />
                  </Box>
                  <Stack justifyContent="flex-end" gap={1.5} mb={3}>
                    {interactRender(feed.data)}
                  </Stack>
                </>
              ) : (
                <>
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
                  <Stack justifyContent="flex-end" gap={1.5} mb={3}>
                    {interactRender(feed.data)}
                  </Stack>
                </>
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

        <SimpleCard title="Bình luận">
          <Stack gap={1.5} mb={3}>
            <Stack direction={'row'} justifyContent="space-between">
              {/* <form onSubmit={methods.handleSubmit(onSubmitHandler)}> */}
              <FormProvider {...methods}>
                <Stack direction={'row'} gap={1}>
                  <MuiTypography fontWeight={500} whiteSpace="nowrap">
                    Bình luận duới danh nghĩa:
                  </MuiTypography>

                  <Box width={250}>
                    <MuiRHFAutoComplete
                      name="customer"
                      label="Tài khoản post"
                      options={customersCmt ?? []}
                      optionProperty="fullName"
                      getOptionLabel={option => option.fullName ?? ''}
                      defaultValue=""
                    />
                  </Box>
                </Stack>
              </FormProvider>
              {/* </form> */}
              <Stack direction={'row'} gap={1.5}>
                <Stack direction={'row'} alignItems="center">
                  <MuiTypography>{feed.data?.likeNum}</MuiTypography>

                  <Tooltip
                    arrow
                    title={feed.data?.isLiked ? 'Bỏ thích' : 'Thích'}
                  >
                    <IconButton onClick={onLikeFeed}>
                      <Icon
                        sx={{
                          color: feed.data?.isLiked
                            ? 'hsl(235, 100%, 67%)'
                            : 'hsl(235, 25%, 67%)',
                        }}
                      >
                        favorite
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Stack direction={'row'} alignItems="center">
                  <MuiTypography>{feed.data?.bookmarkNum}</MuiTypography>
                  <Tooltip
                    arrow
                    title={feed.data?.isBookmarked ? 'Bỏ lưu' : 'Lưu'}
                  >
                    <IconButton onClick={onBookmark}>
                      <Icon
                        sx={{
                          color: feed.data?.isBookmarked
                            ? 'hsl(235, 100%, 67%)'
                            : 'hsl(235, 25%, 67%)',
                        }}
                      >
                        bookmark
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Stack>

            <CommentForm
              autoFocus
              initialValue={''}
              onSubmit={onPostComment}
              loading={postLoading}
              error={''}
            />
          </Stack>

          {comments && comments?.pages && comments.pages.length > 0 && (
            <CommentList
              comments={
                comments?.pages.map(group => group).flat() as IComment[]
              }
              customer={customer}
            />
          )}

          {hasNextPage && (
            <MuiButton
              onClick={() => fetchNextPage()}
              title={isFetchingComments ? 'Đang tải...' : `Tải thêm bình luận`}
              variant="text"
              color="primary"
              sx={{ flex: 1, textDecorationLine: 'underline' }}
              startIcon={<Icon>subdirectory_arrow_right</Icon>} //
            />
          )}
        </SimpleCard>
      </Stack>

      <DiagLogConfirm
        title={dialogData.title}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={dialogData.type !== 'delete' ? undefined : OnDeleteFeed}
        isLoading={deleteLoading}
        maxWidth={dialogData.type !== 'delete' ? 'lg' : 'sm'}
        submitText={dialogData.type !== 'delete' ? 'Lưu' : 'Xoá'}
        cancelText={dialogData.type !== 'delete' ? 'Đóng' : 'Huỷ'}
      >
        <>
          {dialogData.type !== 'delete' && (
            <ReactionList reactionType={dialogData.type ?? ''} />
          )}
          {dialogData.type === 'delete' && (
            <Stack py={5} justifyContent={'center'} alignItems="center">
              <MuiTypography variant="subtitle1">
                {dialogData.message ?? ''}
              </MuiTypography>
            </Stack>
          )}
        </>
      </DiagLogConfirm>
    </Container>
  )
}
