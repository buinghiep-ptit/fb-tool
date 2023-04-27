import { http } from 'app/helpers/http-config'

export const getNews = async (params: any): Promise<any> => {
  const { data } = await http.get<any>('/api/news', {
    params,
  })
  return data
}
