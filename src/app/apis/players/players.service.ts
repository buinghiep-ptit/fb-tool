import { http } from 'app/helpers/http-config'
import { PlayerResponse } from 'app/models'

export const getListPlayer = async (params: any): Promise<PlayerResponse> => {
  const { data } = await http.get<PlayerResponse>('/api/players', {
    params,
  })
  return data
}
