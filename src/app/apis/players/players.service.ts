import { http } from 'app/helpers/http-config'
import { TitlePlayer } from 'app/models'

export const getListPlayer = async (params: any): Promise<TitlePlayer[]> => {
  const { data } = await http.get<TitlePlayer[]>('/api/players', {
    params,
  })
  return data
}
