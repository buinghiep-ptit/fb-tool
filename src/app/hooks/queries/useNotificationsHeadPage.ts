import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createNotiHeadPage,
  deleteNotiHeadPage,
  editNotiHeadPage,
  toggleStatusNotiHeadPage,
} from 'app/apis/notifications/heads/notificationsHead.service'
import { INotificationDetail } from 'app/models/notification'

export const useCreateNotiHeadPage = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (payload: INotificationDetail) => createNotiHeadPage(payload),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['notifications-user'])
      },
      onSuccess,
    },
  )
}

export const useUpdateNotiHeadPage = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((payload: any) => editNotiHeadPage(payload.id, payload), {
    onSettled: () => {
      queryClient.invalidateQueries(['notifications-head'])
      queryClient.invalidateQueries(['noti-head'])
    },
    onSuccess,
  })
}

export const useDeleteNotificationHeadPage = (
  onSuccess?: any,
  onError?: any,
) => {
  const queryClient = useQueryClient()
  return useMutation((notiId: number) => deleteNotiHeadPage(notiId), {
    onSettled: () => {
      queryClient.invalidateQueries(['notifications-head'])
      queryClient.invalidateQueries(['noti-head'])
    },
    onSuccess,
  })
}

export const useToggleStatusHeadPage = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((notiId: number) => toggleStatusNotiHeadPage(notiId), {
    onSettled: () => {
      queryClient.invalidateQueries(['notifications-head'])
      queryClient.invalidateQueries(['noti-head'])
    },
    onSuccess,
  })
}
