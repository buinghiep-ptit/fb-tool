import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPolicy, updatePolicy } from 'app/apis/policy/policy.service'
import { IPolicyOverall } from 'app/models/policy'

export const useCreatePolicy = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((payload: IPolicyOverall) => createPolicy(payload), {
    onSettled: () => {
      queryClient.invalidateQueries(['policies'])
    },
    onSuccess,
  })
}

export const useUpdatePolicy = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (params: any) =>
      updatePolicy(params.id, { ...params.payload, id: params.id }),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['policies'])
        queryClient.invalidateQueries(['policy'])
      },
      onSuccess,
    },
  )
}
