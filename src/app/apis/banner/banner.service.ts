import { http } from 'app/helpers/http-config'
import { BannerDetail } from 'app/models'

export const getListBanner = async (): Promise<any> => {
  const { data } = await http.get<any>('/api/banners')
  return data
}
export const sortBanner = async (params: any): Promise<any> => {
  const { data } = await http.put<any>('/api/banners/priority', params)
  return data
}
export const deleteBannerI = async (id: any): Promise<any> => {
  const { data } = await http.delete<any>(`/api/banners/${id}`)
  return data
}
export const createBannerI = async (params: any): Promise<any> => {
  const { data } = await http.post<any>(`/api/banners`, params)
  return data
}
export const getBannerDetail = async (bannerID: any): Promise<BannerDetail> => {
  const { data } = await http.get<BannerDetail>(`/api/banners/${bannerID}`)
  return data
}

export const updateBannerDetail = async (
  bannerID: any,
  params: any,
): Promise<BannerDetail> => {
  const { data } = await http.put<BannerDetail>(
    `/api/banners/${bannerID}`,
    params,
  )
  return data
}
