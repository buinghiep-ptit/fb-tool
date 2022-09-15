import { http } from 'app/helpers/http-config'
import { IUserResponse } from 'app/models/account'

export const fetchUsers = async (params: any): Promise<IUserResponse> => {
  const { data } = await http.get<IUserResponse>('/api/user', { params })
  return data
}

export const updateUser = async (
  userId: number,
  payload: any,
): Promise<IUserResponse> => {
  const { data } = await http.put<IUserResponse>(`/api/user/${userId}`, payload)
  return data
}

export const createUser = async (payload: any): Promise<IUserResponse> => {
  const { data } = await http.post<IUserResponse>(`/api/user`, payload)
  return data
}
