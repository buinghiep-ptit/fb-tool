import { http } from 'app/helpers/http-config'
import { TeamResponse } from 'app/models'

export const getListTeam = async (params: any): Promise<TeamResponse> => {
  const { data } = await http.get<TeamResponse>('/api/teams', {
    params,
  })
  return data
}
