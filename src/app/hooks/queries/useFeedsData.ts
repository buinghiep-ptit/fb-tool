import { useMutation, useQueryClient } from '@tanstack/react-query'
import { approveFeed, violateFeed } from 'app/apis/feed/feed.service'
import { extractFromObject } from './useUsersData'

export const useUsersData = (filters: any, onSuccess?: any, onError?: any) => {
  //   return useQuery<IUserResponse, Error>(
  //     ['users', filters],
  //     () => fetchUsers(filters),
  //     {
  //       refetchOnWindowFocus: false,
  //       keepPreviousData: true,
  //       enabled: !!filters,
  //     },
  //   )
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
