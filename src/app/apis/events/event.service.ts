import { http } from 'app/helpers/http-config'
import { IEventDetail, IEventResponse } from 'app/models'

export const fetchEvents = async (params: any): Promise<IEventResponse> => {
  const { data } = await http.get<IEventResponse>('/api/events', {
    params,
  })
  return data
}

export const getEventDetail = async (
  eventId: number,
): Promise<IEventDetail> => {
  const { data } = await http.get<IEventDetail>(`/api/events/${eventId}`)
  return data
}

export const createEvent = async (payload: any): Promise<any> => {
  const { data } = await http.post<any>(`/api/events`, payload)
  return data
}
export const updateEvent = async (
  eventId: number,
  payload: any,
): Promise<any> => {
  const { data } = await http.put<any>(`/api/events/${eventId}`, payload)
  return data
}

export const updateEventStatus = async (
  eventId: number,
  params: { status: number },
): Promise<any> => {
  const { data } = await http.put<any>(
    `/api/events/${eventId}/change-status?status=${params.status}`,
  )
  return data
}

export const deleteEvent = async (eventId: number): Promise<any> => {
  const { data } = await http.delete<any>(`/api/events/${eventId}/delete`)
  return data
}
