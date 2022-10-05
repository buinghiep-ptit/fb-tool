import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createEvent,
  deleteEvent,
  updateEvent,
  updateEventStatus,
} from 'app/apis/events/event.service'
import { IEventDetail } from 'app/models'

export const useCreateEvent = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((payload: IEventDetail) => createEvent(payload), {
    onSettled: () => {
      queryClient.invalidateQueries(['events'])
    },
    onSuccess,
  })
}

export const useUpdateEvent = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (event: Record<string, any>) => updateEvent(event.eventId, event),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['events'])
        queryClient.invalidateQueries(['event'])
      },
      onSuccess,
    },
  )
}

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
