import { http } from 'app/helpers/http-config'
import { OrderResponse } from 'app/models'

export const getListOrder = async (params: any): Promise<OrderResponse> => {
  const { data } = await http.get<OrderResponse>('/api/orders', {
    params,
  })
  return data
}
