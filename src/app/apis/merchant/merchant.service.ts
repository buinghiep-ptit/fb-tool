import { http } from 'app/helpers/http-config'

export const getListMerchant = async (params: any): Promise<any> => {
  const { data } = await http.get<any>('/api/merchant', { params })
  return data
}

export const getDetailMerchant = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/merchant/${id}`)
  return data
}

export const updateDetailMerchant = async (
  id: any,
  params: any,
): Promise<any> => {
  const { data } = await http.put<any>(`/api/merchant/${id}`, params)
  return data
}

export const createMerchant = async (params: any): Promise<any> => {
  const { data } = await http.post<any>('/api/merchant', params)
  return data
}

export const deleteMerchant = async (id: any): Promise<any> => {
  const { data } = await http.delete<any>(`/api/merchant/${id}/delete`)
  return data
}

export const updateMerchantStatus = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/merchant/${id}/lock/toggle`)
  return data
}
