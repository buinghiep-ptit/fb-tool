import { http } from 'app/helpers/http-config'

export const getListBanner = async (): Promise<any> => {
  const { data } = await http.get<any>('/api/banners')
  return data
}
export const sortBanner = async (params: any): Promise<any> => {
  const { data } = await http.put<any>('/api/banners/priority', params)
  return data
}
