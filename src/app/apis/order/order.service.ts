import { http } from 'app/helpers/http-config'
import { IOrderDetail, OrderResponse } from 'app/models'

export const getListOrder = async (params: any): Promise<OrderResponse> => {
  const { data } = await http.get<OrderResponse>('/api/orders', {
    params,
  })
  return data
}
export const getOrderDetail = async (orderID: any): Promise<IOrderDetail> => {
  const { data } = await http.get<IOrderDetail>(`/api/orders/${orderID}`)
  return data
}
