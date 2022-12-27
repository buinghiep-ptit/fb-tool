import { Avatar, Icon, IconButton, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchListChildCommentFeed } from 'app/apis/feed/feed.service'
import { MuiButton } from 'app/components/common/MuiButton'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useDeleteComment,
  useEditComment,
  usePinComment,
  usePostComment,
  useToggleLikeComment,
} from 'app/hooks/queries/useFeedsData'
import { IComment, ICustomerDetail } from 'app/models'
import { timeSince } from 'app/utils/common'
import { useState } from 'react'
import { DiagLogConfirm } from '../../orders/details/ButtonsLink/DialogConfirm'
import { CommentForm } from './CommentForm'
import { CommentList } from './CommentList'

type IProps = {
  commentDetail: IComment
  isChildren?: boolean
  customer?: ICustomerDetail
}

export function Comment({ commentDetail, isChildren, customer }: IProps) {
  const {
    commentId,
    comment,
    userCommentImage,
    userCommentId,
    dateCreated,
    commentLikeCount,
    totalChildComment,
    isAuthor,
    isCommentPinned,
    userCommentName,
    isCurUserLike,
    customerType,
    dateUpdated,
  } = commentDetail
  const [areChildrenHidden, setAreChildrenHidden] = useState(true)
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [enabled, setEnabled] = useState(false)

  const [dialogData, setDialogData] = useState<{
    title?: string
    message?: string
    type?: string
    submitText?: string
    cancelText?: string
  }>({})
  const [openDialog, setOpenDialog] = useState(false)

  const {
    data: childComments,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    ['comments-child', commentId, enabled, customer?.customerId],
    ({ pageParam }) =>
      fetchListChildCommentFeed(Number(commentId ?? 0), {
        size: 10,
        index: pageParam ? (pageParam - 1) * 10 : 0,
        customerId: customer?.customerId ?? 0,
      }),
    {
      getNextPageParam: (_lastPage, pages) => {
        if (pages.length < (totalChildComment ?? 0) / 10) {
          return pages.length + 1
        } else {
          return undefined
        }
      },
      enabled: enabled,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  )

  const onSuccess = (data: any, message: string) => {
    toastSuccess({
      message: message,
    })
    if (openDialog) setOpenDialog(false)
  }

  const { mutate: postCmt, isLoading: postLoading } = usePostComment(() =>
    onSuccess(null, 'Bình luận thành công'),
  )

  const { mutate: editCmt, isLoading: editLoading } = useEditComment(() =>
    onSuccess(null, 'Sửa thành công'),
  )

  const { mutate: toggleLike } = useToggleLikeComment()

  const { mutate: deleteCmt, isLoading: deleteLoading } = useDeleteComment(() =>
    onSuccess(null, 'Xoá bình luận thành công'),
  )

  const { mutate: pimCmt, isLoading: pinLoading } = usePinComment(() =>
    onSuccess(
      null,
      isCommentPinned
        ? 'Bỏ ghim bình luận thành công'
        : 'Ghim bình luận thành công',
    ),
  )

  const openDeleteDialog = () => {
    setDialogData(prev => ({
      ...prev,
      title: 'Xoá bình luận',
      message: 'Bạn có chắc muốn xóa bình luận?',
      type: 'delete',
      submitText: 'Có',
      cancelText: 'Không',
    }))
    setOpenDialog(true)
  }

  const openToggleDialog = () => {
    setDialogData(prev => ({
      ...prev,
      title: 'Ghim bình luận',
      message: isCommentPinned
        ? 'Bạn có chắc muốn bỏ ghim bình luận?'
        : 'Hành động này sẽ thay thế bình luận đã được ghim trước đó. Bạn có chắc muốn ghim bình luận?',
      type: 'toggle-pin',
      submitText: 'Có',
      cancelText: 'Không',
    }))
    setOpenDialog(true)
  }

  const onSubmitDialog = () => {
    switch (dialogData.type) {
      case 'toggle-pin':
        onTogglePinComment()
        break
      case 'delete':
        onCommentDelete()
        break
      default:
        break
    }
  }

  function onCommentReply(message: string) {
    postCmt({
      idCustomer: customer?.customerId,
      idParent: Number(commentId),
      comment: message,
      parentType: 2,
    })
  }

  function onCommentUpdate(message: string) {
    editCmt({
      commentId: Number(commentId),
      payload: {
        idCustomer: 0,
        comment: message,
      },
    })
    setIsEditing(false)
  }

  function onCommentDelete() {
    deleteCmt(Number(commentId))
  }

  function onToggleCommentLike() {
    toggleLike({
      commentId: Number(commentId),
      payload: { customerId: customer?.customerId ?? 0 },
    })
  }

  function onTogglePinComment() {
    pimCmt(Number(commentId))
  }

  return (
    <>
      <div className="comment">
        <div className="top">
          <Stack direction={'row'} gap={1} alignItems="center">
            <Avatar
              alt="avatar"
              src={
                userCommentImage
                  ? userCommentImage
                  : '/assets/images/app/avatar-default.svg'
              }
              sx={{ width: 32, height: 32 }}
            />
            <span className="name">{userCommentName}</span>
          </Stack>

          <span className="date">{timeSince((dateCreated ?? 0) * 1000)}</span>
        </div>
        {isEditing ? (
          <CommentForm
            autoFocus
            initialValue={comment}
            onSubmit={onCommentUpdate}
            loading={editLoading}
            error={''}
            mode="edit"
          />
        ) : (
          <div className="message">{comment}</div>
        )}
        <Stack direction={'row'} justifyContent="space-between">
          <Stack direction={'row'}>
            <IconButton onClick={onToggleCommentLike}>
              <MuiTypography
                sx={{
                  fontSize: '0.75rem',
                  color: isCurUserLike
                    ? 'hsl(235, 100%, 67%)'
                    : 'hsl(235, 50%, 67%)',
                }}
              >
                {isCurUserLike ? 'Bỏ thích' : 'Thích'}
              </MuiTypography>
            </IconButton>
            {!isChildren && (
              <IconButton
                size="small"
                onClick={() => setIsReplying(prev => !prev)}
              >
                <MuiTypography
                  sx={{
                    fontSize: '0.75rem',
                    color: 'hsl(235, 50%, 67%)',
                  }}
                >
                  Trả lời
                </MuiTypography>
              </IconButton>
            )}

            {/* {userCommentId === (currentUser as any)?.id && ( */}
            <>
              {((customerType === 1 && userCommentId == 0) ||
                customerType === 3) && (
                <IconButton
                  size="small"
                  onClick={() => setIsEditing(prev => !prev)}
                >
                  <MuiTypography
                    sx={{
                      fontSize: '0.75rem',
                      color: isEditing
                        ? 'hsl(235, 100%, 67%)'
                        : 'hsl(235, 50%, 67%)',
                    }}
                  >
                    {isEditing ? 'Huỷ chỉnh sửa' : 'Chỉnh sửa'}
                  </MuiTypography>
                </IconButton>
              )}

              <IconButton size="small" onClick={openToggleDialog}>
                <MuiTypography
                  sx={{
                    fontSize: '0.75rem',
                    color: isCommentPinned
                      ? 'hsl(235, 100%, 67%)'
                      : 'hsl(235, 50%, 67%)',
                  }}
                >
                  {isCommentPinned ? 'Bỏ ghim' : 'Ghim'}
                </MuiTypography>
              </IconButton>

              <IconButton size="small" onClick={openDeleteDialog}>
                <MuiTypography
                  sx={{
                    fontSize: '0.75rem',
                    color: 'hsl(235, 50%, 67%)',
                  }}
                >
                  Xoá
                </MuiTypography>
              </IconButton>
            </>
          </Stack>
          <Stack direction={'row'} alignItems="center" gap={0.5}>
            <MuiTypography
              sx={{
                fontSize: '0.875rem',
                color: 'hsl(235, 50%, 67%)',
              }}
            >
              {commentLikeCount ?? 0}
            </MuiTypography>
            <Icon sx={{ fontSize: '20px!important' }}>favorite_border</Icon>
          </Stack>
        </Stack>
      </div>
      {isReplying && (
        <Box mt={1.5} ml={1}>
          <CommentForm
            autoFocus
            onSubmit={onCommentReply}
            loading={postLoading}
            error={''}
          />
        </Box>
      )}
      {totalChildComment && totalChildComment > 0 && (
        <MuiButton
          onClick={() => {
            if (areChildrenHidden) setEnabled(true)
            setAreChildrenHidden(!areChildrenHidden)
          }}
          title={`${totalChildComment} phản hồi`}
          variant="text"
          color="primary"
          sx={{ flex: 1, my: 0.5 }}
          startIcon={
            <Icon>{areChildrenHidden ? 'expand_more' : 'expand_less'}</Icon>
          } //
        />
      )}

      {childComments && childComments.pages && childComments?.pages.length > 0 && (
        <div
          className={`nested-comments-stack ${areChildrenHidden ? 'hide' : ''}`}
        >
          <button
            className="collapse-line"
            aria-label="Hide Replies"
            onClick={() => setAreChildrenHidden(true)}
          />
          <div className="nested-comments">
            <CommentList
              isChildren={true}
              comments={
                childComments?.pages.map(group => group).flat() as IComment[]
              }
              customer={customer}
            />
          </div>
        </div>
      )}

      {!areChildrenHidden && hasNextPage && (
        <MuiButton
          onClick={() => fetchNextPage()}
          title={isFetching ? 'Đang tải...' : `Hiện thêm bình luận`}
          variant="text"
          color="primary"
          sx={{ flex: 1, my: 0.5 }}
          startIcon={<Icon>subdirectory_arrow_right</Icon>} //
        />
      )}

      <DiagLogConfirm
        title={dialogData.title}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={onSubmitDialog}
        isLoading={deleteLoading || pinLoading}
        submitText={dialogData.submitText}
        cancelText={dialogData.cancelText}
      >
        <Stack py={5} justifyContent={'center'} alignItems="center">
          <MuiTypography variant="subtitle1" textAlign={'center'}>
            {dialogData.message}
          </MuiTypography>
        </Stack>
      </DiagLogConfirm>
    </>
  )
}
