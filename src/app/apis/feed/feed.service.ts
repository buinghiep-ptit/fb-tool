import { http } from 'app/helpers/http-config'
import {
  IActionHistoryResponse,
  IFeedDetail,
  IFeedResponse,
  IReportDeclineResponse,
} from 'app/models'
import { ICampAreaResponse, ICampGroundResponse } from 'app/models/camp'

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

export const fetchPostsCheck = async (): Promise<IFeedDetail[]> => {
  const { data } = await http.get<IFeedDetail[]>(`/api/feed/post-check`)
  return data
}

export const fetchCampAreas = async (params: {
  page?: number
  size?: number
}): Promise<ICampAreaResponse> => {
  const { data } = await http.get<ICampAreaResponse>(`/api/camp-areas`, {
    params,
  })
  return data
}

export const fetchCampGrounds = async (params: {
  page?: number
  size?: number
}): Promise<ICampGroundResponse> => {
  const { data } = await http.get<ICampGroundResponse>(`/api/camp-grounds`, {
    params,
  })
  return data
}
