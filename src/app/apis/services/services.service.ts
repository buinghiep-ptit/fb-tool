import { http } from 'app/helpers/http-config'
import { DetailService, ServiceResponse } from 'app/models/service'

export const getListServices = async (
  params: any,
): Promise<ServiceResponse> => {
  const { data } = await http.get<ServiceResponse>('/api/camp-service', {
    params,
  })
  return data
}

export const getServiceDetail = async (
  serviceId: number,
): Promise<DetailService> => {
  const { data } = await http.get<DetailService>(
    `/api/camp-service/${serviceId}`,
  )
  return data
}

export const createService = async (payload: any): Promise<any> => {
  const { data } = await http.post<any>(`/api/camp-service`, payload)
  return data
}

export const deleteService = async (serviceId: number): Promise<any> => {
  const { data } = await http.delete<any>(
    `/api/camp-service/${serviceId}/delete`,
  )
  return data
}

export const updateService = async (serviceId: number): Promise<any> => {
  const { data } = await http.put<any>(`/api/camp-service/${serviceId}`)
  return data
}

export const ToggleStatus = async (
  serviceId: number,
  params: { status: number },
): Promise<any> => {
  const { data } = await http.put<any>(
    `/api/camp-service/${serviceId}/toggle-status?status=${params.status}`,
  )
  return data
}
