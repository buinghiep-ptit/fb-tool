import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  approveFeed,
  createFeed,
  violateFeed,
} from 'app/apis/feed/feed.service'
import { IFeedDetail } from 'app/models'
import { extractFromObject } from './useUsersData'

export const useCreateFeed = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((payload: IFeedDetail) => createFeed(payload), {
    onSettled: () => {
      queryClient.invalidateQueries(['events'])
    },
    onSuccess,
  })
}

export const useApproveFeed = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((feedId: number) => approveFeed(feedId), {
    onSettled: () => {
      queryClient.invalidateQueries(['posts-check'])
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
      },
      onSuccess,
    },
  )
}
