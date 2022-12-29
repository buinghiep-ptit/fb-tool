import { http } from 'app/helpers/http-config'
import { IConfigOverall } from 'app/models/config'

export const fetchConfigs = async (params: any): Promise<IConfigOverall[]> => {
  const { data } = await http.get<IConfigOverall[]>('/api/config', {
    params,
  })
  return data
}

export const createConfig = async (payload: any): Promise<IConfigOverall> => {
  const { data } = await http.post<IConfigOverall>('/api/config', payload)
  return data
}

export const updateConfig = async (
  configId?: number,
  payload?: any,
): Promise<any> => {
  const { data } = await http.put<any>(`/api/config/${configId}`, payload)
  return data
}
