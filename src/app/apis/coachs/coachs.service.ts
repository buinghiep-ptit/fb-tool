import { http } from 'app/helpers/http-config'

export const getCoachs = async (params: any): Promise<any> => {
  const { data } = await http.get<any>('/api/coaches', {
    params,
  })
  return data
}

export const getCoachDetail = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/coaches/${id}`)
  return data
}

export const deleteCoachPosition = async (id: any): Promise<any> => {
  const { data } = await http.delete<any>(`/api/coaches/position/${id}`)
  return data
}

export const getCoachPosition = async (params: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/coaches/position`, { params })
  return data
}

export const updateCoach = async (params: any): Promise<any> => {
  const { data } = await http.put<any>('/api/coaches', params)
  return data
}

export const createCoach = async (params: any): Promise<any> => {
  const { data } = await http.post<any>('/api/coaches', params)
  return data
}

export const createCoachPosition = async (params: any): Promise<any> => {
  const { data } = await http.post<any>('/api/coaches/position', params)
  return data
}

export const editCoachPosition = async (params: any): Promise<any> => {
  const { data } = await http.put<any>('/api/coaches/position', params)
  return data
}
