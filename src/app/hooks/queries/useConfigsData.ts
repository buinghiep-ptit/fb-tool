import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createConfig, updateConfig } from 'app/apis/config/config.service'

export const useCreateConfig = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((payload: any) => createConfig(payload), {
    onSettled: () => {
      queryClient.invalidateQueries(['configs'])
    },
    onSuccess,
  })
}

export const useUpdateConfig = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (params: any) => updateConfig(params.configId, params.payload),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['configs'])
      },
      onSuccess,
    },
  )
}
