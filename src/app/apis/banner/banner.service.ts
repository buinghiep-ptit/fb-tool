import { http } from 'app/helpers/http-config'
import { Banner } from 'app/models'

export const getListBanner = async (params: any): Promise<Banner[]> => {
  const { data } = await http.get<Banner[]>('/api/banners', {
    params,
  })
  return data
}
export const sortBanner = async (params: any): Promise<Banner[]> => {
  const { data } = await http.put<Banner[]>('/api/banners/priority', params)
  return data
}
