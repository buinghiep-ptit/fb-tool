import { http } from 'app/helpers/http-config'

export const getCustomers = async (params: any): Promise<any> => {
  const { data } = await http.get<any>('/api/customers', {
    params,
  })
  return data
}

export const getLogs = async (params: any, id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/customers/${id}/log`, {
    params,
  })
  return data
}

export const getCustomer = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/customers/${id}`)
  return data
}

export const updateCustomer = async (id: any, params: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/customers/${id}`, params)
  return data
}

export const lockCustomer = async (id: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/customers/${id}`)
  return data
}
