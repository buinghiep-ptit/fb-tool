import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createKeyword,
  deleteKeyword,
  updatePinKeyword,
} from 'app/apis/keyword/keyword.service'

export const useCreateKeyword = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (payload: { search: string[] }) => createKeyword(payload),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['keywords'])
      },
      onSuccess,
    },
  )
}

export const useTogglePinKeyword = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((wordId: number) => updatePinKeyword(wordId), {
    onSettled: () => {
      queryClient.invalidateQueries(['keywords'])
    },
    onSuccess,
  })
}

export const useDeleteKeyword = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((wordId: number) => deleteKeyword(wordId), {
    onSettled: () => {
      queryClient.invalidateQueries(['keywords'])
    },
    onSuccess,
  })
}
