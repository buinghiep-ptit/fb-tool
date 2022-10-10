import { http } from 'app/helpers/http-config'
import {
  IAuthPayload,
  IErrorResponse,
  ISuccessResponse,
  IUserProfile,
} from 'app/models'
import { AxiosResponse } from 'axios'

export const loginUser = async (
  payload: IAuthPayload,
): Promise<{ accessToken?: string }> => {
  const { data } = await http.post<
    any,
    AxiosResponse<{ accessToken?: string }>
  >('/api/authenticate', payload)
  return data
}

export const getProfile = async (): Promise<IUserProfile> => {
  const { data } = await http.get<IUserProfile>('/api/account')
  return data
}

export const resetPasswordInit = async (payload: {
  email: string
}): Promise<ISuccessResponse | IErrorResponse> => {
  const { data } = await http.post<
    any,
    AxiosResponse<ISuccessResponse | IErrorResponse>
  >('/api/account/reset-password/init', payload)
  return data
}

export const resetPasswordCheck = async (params: {
  key: string
}): Promise<ISuccessResponse | IErrorResponse> => {
  const { data } = await http.get<
    any,
    AxiosResponse<ISuccessResponse | IErrorResponse>
  >('/api/account/reset-password/check', { params })
  return data
}

export const resetPasswordFinish = async (payload: {
  key: string
  newPassword: string
}): Promise<ISuccessResponse | IErrorResponse> => {
  const { data } = await http.post<
    any,
    AxiosResponse<ISuccessResponse | IErrorResponse>
  >('/api/account/reset-password/finish', payload)
  return data
}

export const changePassword = async (payload: {
  currentPassword?: string
  newPassword?: string
}): Promise<any> => {
  const { data } = await http.post<any>(`/api/account/change-password`, payload)
  return data
}
