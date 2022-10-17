import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createService,
  deleteService,
  ToggleStatus,
  updateService,
} from 'app/apis/services/services.service'
import { DetailService } from 'app/models/service'

export const useCreateService = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((payload: DetailService) => createService(payload), {
    onSettled: () => {
      queryClient.invalidateQueries(['camp-service'])
    },
    onSuccess,
  })
}
export const useDeleteService = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((serviceId: number) => deleteService(serviceId), {
    onSettled: () => {
      queryClient.invalidateQueries(['camp-service'])
    },
    onSuccess,
  })
}

export const useUpdateService = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (payload: Record<string, any>) => updateService(payload.serviceId, payload),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['camp-service'])
        queryClient.invalidateQueries(['campService'])
      },
      onSuccess,
    },
  )
}
export const useUpdateStatusService = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (payload: Record<string, any>) =>
      ToggleStatus(payload.serviceId, { status: payload.status }),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['camp-service'])
      },
      onSuccess,
    },
  )
}
