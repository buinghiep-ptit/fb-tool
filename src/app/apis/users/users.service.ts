import { http } from 'app/helpers/http-config'

export const getUsers = async (params: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/user`, {
    params,
  })
  return data
}

export const createUser = async (params: any): Promise<any> => {
  const { data } = await http.post<any>(`/api/user`, params)
  return data
}

export const updateUser = async (id: any, params: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/user/${id}`, params)
  return data
}
