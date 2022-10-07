import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  approveFeed,
  createFeed,
  deleteFeed,
  violateFeed,
} from 'app/apis/feed/feed.service'
import { IFeedDetail } from 'app/models'
import { extractFromObject } from './useUsersData'

export const useCreateFeed = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((payload: IFeedDetail) => createFeed(payload), {
    onSettled: () => {
      queryClient.invalidateQueries(['feeds'])
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
    },
    onSuccess,
  })
}

export const useDeleteFeed = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((feedId: number) => deleteFeed(feedId), {
    onSettled: () => {
      queryClient.invalidateQueries(['feed'])
    },
    onSuccess,
  })
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
      },
      onSuccess,
    },
  )
}
