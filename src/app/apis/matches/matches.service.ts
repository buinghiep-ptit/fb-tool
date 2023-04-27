import { http } from 'app/helpers/http-config'

export const getMatches = async (params: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/matches`, {
    params,
  })
  return data
}
