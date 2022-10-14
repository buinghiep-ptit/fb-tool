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

export const orderDetail = async (orderId: number): Promise<IOrderDetail> => {
  const { data } = await http.get<IOrderDetail>(`/api/order/${orderId}`)
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
