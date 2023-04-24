import { http } from 'app/helpers/http-config'

export const getLeagues = async (params: any): Promise<any> => {
  const { data } = await http.get<any>('/api/leagues', {
    params,
  })
  return data
}
