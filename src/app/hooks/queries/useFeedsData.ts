import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  approveFeed,
  bookmarkFeed,
  createFeed,
  deleteComment,
  deleteFeed,
  editComment,
  editFeed,
  fetchPostsCheck,
  fetchPostsReported,
  likeFeed,
  pinComment,
  postComment,
  toggleLike,
  violateFeed,
} from 'app/apis/feed/feed.service'
import { IFeedDetail } from 'app/models'
import { extractFromObject } from './useUsersData'

export const usePostsCheckData = (type?: number) => {
  return useQuery<IFeedDetail[], Error>(
    ['posts-check', type],
    () => (type === 1 ? fetchPostsCheck() : fetchPostsReported()),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  )
}

export const useCreateFeed = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((payload: IFeedDetail) => createFeed(payload), {
    onSettled: () => {
      queryClient.invalidateQueries(['feeds'])
      queryClient.invalidateQueries(['actions-history'])
    },
    onSuccess,
  })
}

export const useApproveFeed = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((feedId: number) => approveFeed(feedId), {
    onSettled: () => {
      queryClient.invalidateQueries(['posts-check'])
      queryClient.invalidateQueries(['feed'])
      queryClient.invalidateQueries(['feeds'])
      queryClient.invalidateQueries(['actions-history'])
    },
    onSuccess,
  })
}

export const useDeleteFeed = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((feedId: number) => deleteFeed(feedId), {
    onSettled: () => {
      queryClient.invalidateQueries(['feed'])
      queryClient.invalidateQueries(['feeds'])
      queryClient.invalidateQueries(['actions-history'])
    },
    onSuccess,
  })
}

export const useUpdateFeed = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (payload: Record<string, any>) => editFeed(payload.id, payload),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['feed'])
        queryClient.invalidateQueries(['feeds'])
        queryClient.invalidateQueries(['actions-history'])
      },
      onSuccess,
    },
  )
}

export const useViolateFeed = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()

  return useMutation(
    (payload: Record<string, any>) =>
      violateFeed(
        payload.feedId,
        extractFromObject(payload, ['reason']) as any,
      ),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['posts-check'])
        queryClient.invalidateQueries(['feed'])
        queryClient.invalidateQueries(['feeds'])
        queryClient.invalidateQueries(['actions-history'])
      },
      onSuccess,
    },
  )
}

export const useLikeFeed = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (params: { feedId: number; payload: any }) =>
      likeFeed(params.feedId, params.payload),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['feed'])
        queryClient.invalidateQueries(['feeds'])
        queryClient.invalidateQueries(['actions-history'])
      },
      onSuccess,
    },
  )
}

export const useBookmarkFeed = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (params: { feedId: number; payload: any }) =>
      bookmarkFeed(params.feedId, params.payload),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['feed'])
        queryClient.invalidateQueries(['feeds'])
        queryClient.invalidateQueries(['actions-history'])
      },
      onSuccess,
    },
  )
}

export const usePostComment = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((payload: any) => postComment(payload), {
    onSettled: () => {
      queryClient.invalidateQueries(['feeds'])
      queryClient.invalidateQueries(['feed'])
      queryClient.invalidateQueries(['comments'])
      queryClient.invalidateQueries(['comments-child'])
      queryClient.invalidateQueries(['actions-history'])
    },
    onSuccess,
  })
}

export const useEditComment = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (params: { commentId: number; payload: any }) =>
      editComment(params.commentId, params.payload),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['feeds'])
        queryClient.invalidateQueries(['feed'])
        queryClient.invalidateQueries(['comments'])
        queryClient.invalidateQueries(['comments-child'])
        queryClient.invalidateQueries(['actions-history'])
      },
      onSuccess,
    },
  )
}

export const useToggleLikeComment = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (params: { commentId: number; payload: { customerId: number } }) =>
      toggleLike(params.commentId, params.payload),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['feeds'])
        queryClient.invalidateQueries(['feed'])
        queryClient.invalidateQueries(['comments'])
        queryClient.invalidateQueries(['comments-child'])
        queryClient.invalidateQueries(['actions-history'])
      },
      onSuccess,
    },
  )
}

export const useDeleteComment = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((commentId: number) => deleteComment(commentId), {
    onSettled: () => {
      queryClient.invalidateQueries(['feeds'])
      queryClient.invalidateQueries(['feed'])
      queryClient.invalidateQueries(['comments'])
      queryClient.invalidateQueries(['comments-child'])
      queryClient.invalidateQueries(['actions-history'])
    },
    onSuccess,
  })
}

export const usePinComment = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((commentId: number) => pinComment(commentId), {
    onSettled: () => {
      queryClient.invalidateQueries(['feeds'])
      queryClient.invalidateQueries(['feed'])
      queryClient.invalidateQueries(['comments'])
      queryClient.invalidateQueries(['comments-child'])
      queryClient.invalidateQueries(['actions-history'])
    },
    onSuccess,
  })
}
