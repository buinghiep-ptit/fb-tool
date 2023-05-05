import { http } from 'app/helpers/http-config'

export const getVideos = async (params: any): Promise<any> => {
  const { data } = await http.get<any>('/api/videos', {
    params,
  })
  return data
}
