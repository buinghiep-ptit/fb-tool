import { http } from 'app/helpers/http-config'

export const getCoachs = async (params: any): Promise<any> => {
  const { data } = await http.get<any>('/api/coaches', {
    params,
  })
  return data
}

export const getCoachDeatail = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/coaches/${id}`)
  return data
}
