import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createNotiUser,
  deleteNotiUser,
  editNotiUser,
  sendNotiUser,
} from 'app/apis/notifications/users/notificationsUser.service'
import { INotificationDetail } from 'app/models/notification'

export const useCreateNotiUser = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (payload: INotificationDetail) => createNotiUser(payload),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['notifications-user'])
      },
      onSuccess,
    },
  )
}

export const useUpdateNotiUser = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((payload: any) => editNotiUser(payload.id, payload), {
    onSettled: () => {
      queryClient.invalidateQueries(['notifications-user'])
      queryClient.invalidateQueries(['noti-user'])
    },
    onSuccess,
  })
}

export const useSendNotificationUser = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((notiId: number) => sendNotiUser(notiId), {
    onSettled: () => {
      queryClient.invalidateQueries(['notifications-user'])
      queryClient.invalidateQueries(['noti-user'])
    },
    onSuccess,
  })
}

export const useDeleteNotificationUser = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((notiId: number) => deleteNotiUser(notiId), {
    onSettled: () => {
      queryClient.invalidateQueries(['notifications-user'])
      queryClient.invalidateQueries(['noti-user'])
    },
    onSuccess,
  })
}
