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

export const updateCustomer = async (
  customerId: number,
  payload: ICustomerDetail,
): Promise<any> => {
  const { data } = await http.put<any>(
    `/api/customer/${customerId}/update`,
    payload,
  )
  return data
}

export const lockCustomer = async (
  customerId: number,
  payload: {
    lockType?: number
    lockDuration?: number
    reason?: string
  },
): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/customer/${customerId}/lock`,
    payload,
  )
  return data
}

export const unLockCustomer = async (
  customerId: number,
  payload: {
    reason?: string
  },
): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/customer/${customerId}/unlock`,
    payload,
  )
  return data
}
