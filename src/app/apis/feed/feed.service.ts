import { http } from 'app/helpers/http-config'
import {
  IActionHistoryResponse,
  IComment,
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

export const fetchPostsReported = async (): Promise<IFeedDetail[]> => {
  const { data } = await http.get<IFeedDetail[]>(`/api/feed/reported`)
  return data
}

export const approveFeed = async (feedId: number): Promise<any> => {
  const { data } = await http.post<any>(`/api/feed/${feedId}/approve`)
  return data
}

export const violateFeed = async (
  feedId: number,
  payload: { reason?: string },
): Promise<any> => {
  const { data } = await http.post<any>(`/api/feed/${feedId}/violate`, payload)

  return data
}

export const unLockCustomer = async (
  customerId: number,
  payload: {
    reason?: string
  },
): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/customer/${customerId}/unlock`,
    payload,
  )
  return data
}

export const fetchCampAreas = async (
  params: any,
): Promise<ICampAreaResponse> => {
  const { data } = await http.get<ICampAreaResponse>(
    `/api/camp-areas/select-list-with-filter`,
    { params },
  )
  return data
}

export const fetchCampGrounds = async (
  params: any,
): Promise<ICampGroundResponse> => {
  const { data } = await http.get<ICampGroundResponse>(`/api/camp-grounds`, {
    params,
  })
  return data
}

export const createFeed = async (payload: IFeedDetail): Promise<any> => {
  const { data } = await http.post<IFeedDetail>(`/api/feed`, payload)
  return data
}

export const deleteFeed = async (feedId: number): Promise<any> => {
  const { data } = await http.delete<IFeedDetail>(`/api/feed/${feedId}`)
  return data
}

export const editFeed = async (feedId: number, payload: any): Promise<any> => {
  const { data } = await http.put<IFeedDetail>(`/api/feed/${feedId}`, payload)
  return data
}

export const likeFeed = async (
  feedId: number,
  payload: { customerId: number },
): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/feed/${feedId}/like?customerId=${payload?.customerId}`,
  )
  return data
}

export const bookmarkFeed = async (
  feedId: number,
  payload: { customerId: number },
): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/feed/${feedId}/bookmark?customerId=${payload?.customerId}`,
  )
  return data
}

export const fetchListCommentFeed = async (
  feedId: number,
  params?: { index?: number; size?: number; customerId?: number },
): Promise<IComment[]> => {
  const { data } = await http.get<IComment[]>(`/api/feed/${feedId}/comments`, {
    params,
  })
  return data
}

export const fetchListChildCommentFeed = async (
  commentId: number,
  params?: { index?: number; size?: number; customerId?: number },
): Promise<IComment[]> => {
  const { data } = await http.get<IComment[]>(
    `/api/feed/comments/${commentId}/child`,
    {
      params,
    },
  )
  return data
}

export const postComment = async (payload: any): Promise<any> => {
  const { data } = await http.post<any>(`/api/feed/comments`, payload)
  return data
}

export const editComment = async (
  commentId: number,
  payload: any,
): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/feed/comments/${commentId}/edit`,
    payload,
  )
  return data
}

export const toggleLike = async (
  commentId: number,
  payload?: { customerId: number },
): Promise<any> => {
  console.log('commentId:', commentId)
  const { data } = await http.post<any>(
    `/api/feed/comments/${commentId}/like?customerId=${payload?.customerId}`,
  )
  return data
}

export const pinComment = async (commentId: number): Promise<any> => {
  const { data } = await http.post<any>(`/api/feed/comments/${commentId}/pin`)
  return data
}

export const deleteComment = async (commentId: number): Promise<any> => {
  const { data } = await http.delete<any>(`/api/feed/comments/${commentId}`)
  return data
}
