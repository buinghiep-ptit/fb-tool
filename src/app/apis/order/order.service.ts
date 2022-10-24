import { http } from 'app/helpers/http-config'
import { IOrderDetail, IOrderResponse } from 'app/models/order'

export const fetchOrdersOverall = async (
  params: any,
): Promise<IOrderResponse> => {
  const { data } = await http.get<IOrderResponse>('/api/order', {
    params,
  })
  return data
}

export const fetchOrdersCancelRequests = async (
  params: any,
): Promise<IOrderResponse> => {
  const { data } = await http.get<IOrderResponse>(
    '/api/order/cancel-requests',
    {
      params,
    },
  )
  return data
}

export const receiveOrder = async (orderId: number): Promise<any> => {
  const { data } = await http.post<any>(`/api/order/${orderId}/receive`)
  return data
}

export const orderDetail = async (orderId: number): Promise<IOrderDetail> => {
  const { data } = await http.get<IOrderDetail>(`/api/order/${orderId}`)
  return data
}

export const updateOrder = async (
  orderId: number,
  payload: any,
): Promise<IOrderDetail> => {
  const { data } = await http.put<IOrderDetail>(
    `/api/order/${orderId}/update`,
    payload,
  )
  return data
}

export const availableOrder = async (orderId: number): Promise<any> => {
  const { data } = await http.post<any>(`/api/order/${orderId}/available`)
  return data
}

export const unavailableOrder = async (orderId: number): Promise<any> => {
  const { data } = await http.post<any>(`/api/order/${orderId}/unavailable`)
  return data
}

export const reassignOrder = async (
  orderId: number,
  userId: number,
): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/order/${orderId}/reassign/${userId}`,
  )
  return data
}

export const orderNote = async (
  orderId: number,
  payload: { note?: string },
): Promise<any> => {
  const { data } = await http.post<any>(`/api/order/${orderId}/note`, payload)
  return data
}

export const fetchLogsActionDetail = async ({
  orderId,
  page,
  size,
}: any): Promise<any> => {
  const params = {
    page,
    size,
  }

  const { data } = await http.get<any>(`/api/order/${orderId}/action-history`, {
    params,
  })
  return data
}
