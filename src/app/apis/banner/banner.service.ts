import { http } from 'app/helpers/http-config'
import { Banner } from 'app/models'

export const getListBanner = async (): Promise<Banner[]> => {
  const { data } = await http.get<Banner[]>('/api/banners')
  return data
}
export const sortBanner = async (params: any): Promise<any> => {
  const { data } = await http.put<any>('/api/banners/priority', params)
  return data
}
