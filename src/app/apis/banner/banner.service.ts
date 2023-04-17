import { http } from 'app/helpers/http-config'
import { Banner } from 'app/models'

export const getListBanner = async (params: any): Promise<Banner[]> => {
  const { data } = await http.get<Banner[]>('/api/banners', {
    params,
  })
  return data
}
