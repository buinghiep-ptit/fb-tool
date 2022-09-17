import { http } from 'app/helpers/http-config'
import {
  IActionHistoryResponse,
  IFeedDetail,
  IFeedResponse,
  IReportDeclineResponse,
} from 'app/models'

type Props = {
  feedId?: number
  page?: number
  size?: number
}

export const fetchFeeds = async (params: any): Promise<IFeedResponse> => {
  const { data } = await http.get<IFeedResponse>('/api/feed', {
    params,
  })
  return data
}

export const fetchFeedDetail = async (feedId: number): Promise<IFeedDetail> => {
  const { data } = await http.get<IFeedDetail>(`/api/feed/${feedId}`)
  return data
}

export const fetchReportsDecline = async ({
  feedId,
  page,
  size,
}: Props): Promise<IReportDeclineResponse> => {
  const params = {
    page,
    size,
  }
  const { data } = await http.get<IReportDeclineResponse>(
    `/api/feed/${feedId}/reports`,
    { params },
  )
  return data
}

export const fetchActionsHistory = async ({
  feedId,
  page,
  size,
}: Props): Promise<IActionHistoryResponse> => {
  const params = {
    page,
    size,
  }
  const { data } = await http.get<IActionHistoryResponse>(
    `/api/feed/${feedId}/action-history`,
    {
      params,
    },
  )
  return data
}
