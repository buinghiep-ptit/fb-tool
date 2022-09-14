import { http } from 'app/helpers/http-config'
import {
  ICustomerDetail,
  ICustomerResponse,
  ILogsCustomerResponse,
} from 'app/models/account'

export const fetchCustomers = async (
  params: any,
): Promise<ICustomerResponse> => {
  const { data } = await http.get<ICustomerResponse>('/api/customer', {
    params,
  })
  return data
}

export const getCustomerDetail = async (
  customerId: number | string,
): Promise<ICustomerDetail> => {
  const { data } = await http.get<ICustomerDetail>(
    `/api/customer/${customerId}`,
  )
  return data
}

export const fetchLogsCustomer = async (
  customerId: number | string,
): Promise<ILogsCustomerResponse> => {
  const { data } = await http.get<ILogsCustomerResponse>(
    `/api/customer/${customerId}/action-history`,
  )
  return data
}

export const changePasswordCustomer = async (
  customerId: number | string,
  payload: { newPassword: string },
): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/customer/${customerId}/change-password`,
    payload,
  )
  return data
}
