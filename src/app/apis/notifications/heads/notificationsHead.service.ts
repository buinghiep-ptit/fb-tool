import { http } from 'app/helpers/http-config'
import {
  INotification,
  INotificationDetail,
  INotificationResponse,
} from 'app/models/notification'

export const fetchNotificationsHeadPage = async (
  params: any,
): Promise<INotificationResponse> => {
  const { data } = await http.get<INotificationResponse>(
    '/api/manual-popup-noti',
    {
      params,
    },
  )
  return data
}

export const notiHeadPageDetail = async (
  notiId: number,
): Promise<INotificationDetail> => {
  const { data } = await http.get<INotificationDetail>(
    `/api/manual-popup-noti/${notiId}`,
  )
  return data
}

export const createNotiHeadPage = async (
  payload: INotificationDetail,
): Promise<any> => {
  const { data } = await http.post<INotificationDetail>(
    `/api/manual-popup-noti`,
    payload,
  )
  return data
}

export const editNotiHeadPage = async (
  notiId: number,
  payload: any,
): Promise<any> => {
  const { data } = await http.put<any>(
    `/api/manual-popup-noti/${notiId}`,
    payload,
  )
  return data
}

export const deleteNotiHeadPage = async (notiId: number): Promise<any> => {
  const { data } = await http.delete<any>(`/api/manual-popup-noti/${notiId}`)
  return data
}

export const toggleStatusNotiHeadPage = async (
  notiId: number,
): Promise<any> => {
  const { data } = await http.post<any>(`/api/manual-popup-noti/${notiId}`)
  return data
}

export const checkExistActivePopup = async (): Promise<any> => {
  const { data } = await http.get<any>(
    `/api/manual-popup-noti/exist-active-popup`,
  )
  return data
}
