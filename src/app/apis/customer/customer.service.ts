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
