import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createHandbook,
  deleteHandbook,
  toggleLinkCamps,
  updateHandbook,
} from 'app/apis/handbook/handbook.service'
import { IHandbookDetail } from 'app/models/handbook'

export const useCreateHandbook = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((payload: IHandbookDetail) => createHandbook(payload), {
    onSettled: () => {
      queryClient.invalidateQueries(['handbooks'])
    },
    onSuccess,
  })
}

export const useUpdateHandbook = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (params: any) => updateHandbook(params.id, { ...params }),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['handbooks'])
        queryClient.invalidateQueries(['handbook'])
      },
      onSuccess,
    },
  )
}

export const useDeleteHandbook = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((handbookId: number) => deleteHandbook(handbookId), {
    onSettled: () => {
      queryClient.invalidateQueries(['handbooks'])
    },
    onSuccess,
  })
}

export const useToggleLinkCampsHandbook = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((payload: any) => toggleLinkCamps(payload), {
    onSettled: () => {
      queryClient.invalidateQueries(['handbooks'])
      queryClient.invalidateQueries(['handbook'])
    },
    onSuccess,
  })
}
