import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteEvent, updateEventStatus } from 'app/apis/events/event.service'
import { extractFromObject } from './useUsersData'

export const useUpdateStatusEvent = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (payload: Record<string, any>) =>
      updateEventStatus(payload.eventId, { status: payload.status }),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['events'])
      },
      onSuccess,
    },
  )
}

export const useDeleteEvent = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((eventId: number) => deleteEvent(eventId), {
    onSettled: () => {
      queryClient.invalidateQueries(['events'])
    },
    onSuccess,
  })
}
