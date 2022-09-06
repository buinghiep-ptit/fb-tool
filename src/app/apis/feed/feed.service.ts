import { http } from 'app/helpers/http-config'
import { IFeedResponse } from 'app/models'

export const fetchFeeds = async (params: any): Promise<IFeedResponse> => {
  const { data } = await http.get<IFeedResponse>(
    '/product/api/public/search/province/1',
    { params },
  )
  return data
}
