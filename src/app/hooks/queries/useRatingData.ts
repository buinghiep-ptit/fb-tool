import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchListRatingAll,
  fetchListRatingReported,
  toggleRateStatus,
} from 'app/apis/rating/rating.service'
import { IRatingOverallResponse } from 'app/models/rating'

export const useRatingData = (filters: any, scope?: string) => {
  return useQuery<IRatingOverallResponse, Error>(
    ['ratings', filters, scope],
    () =>
      scope === 'reported'
        ? fetchListRatingReported(filters)
        : fetchListRatingAll(filters),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!filters,
    },
  )
}

export const useToggleRateStatus = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (payload: { rateId?: number; note?: string }) =>
      toggleRateStatus(payload.rateId ?? 0, { note: payload.note }),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['ratings'])
        queryClient.invalidateQueries(['rate'])
      },
      onSuccess,
    },
  )
}
