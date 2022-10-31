import { http } from 'app/helpers/http-config'
import { IAudioResponse } from 'app/models/audio'

export const fetchAudios = async (params: any): Promise<IAudioResponse> => {
  const { data } = await http.get<IAudioResponse>('/api/common-audios', {
    params,
  })
  return data
}
