import { http } from 'app/helpers/http-config'
import { IActionHistoryResponse } from 'app/models'
import {
  IRateDetail,
  IRateReportResponse,
  IRatingOverallResponse,
} from 'app/models/rating'

type Props = {
  rateId?: number
  page?: number
  size?: number
}

export const fetchListRatingAll = async (
  params: any,
): Promise<IRatingOverallResponse> => {
  const { data } = await http.get<IRatingOverallResponse>(
    '/api/camp-rating/all',
    {
      params,
    },
  )
  return data
}

export const fetchListRatingReported = async (
  params: any,
): Promise<IRatingOverallResponse> => {
  const { data } = await http.get<IRatingOverallResponse>(
    '/api/camp-rating/reported',
    {
      params,
    },
  )
  return data
}

export const fetchRateDetail = async (rateId: number): Promise<IRateDetail> => {
  const { data } = await http.get<IRateDetail>(`/api/camp-rating/${rateId}`)
  return data
}

export const toggleRateStatus = async (
  rateId: number,
  payload: { note?: string },
): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/camp-rating/${rateId}/toggle-status`,
    payload,
  )
  return data
}

export const fetchRateDetailReports = async ({
  rateId,
  page,
  size,
}: Props): Promise<IRateReportResponse> => {
  const params = {
    page,
    size,
  }
  const { data } = await http.get<IRateReportResponse>(
    `/api/camp-rating/${rateId}/reports`,
    { params },
  )
  return data
}

export const fetchRateDetailActionsHistory = async ({
  rateId,
  page,
  size,
}: Props): Promise<IActionHistoryResponse> => {
  const params = {
    page,
    size,
  }
  const { data } = await http.get<IActionHistoryResponse>(
    `/api/camp-rating/${rateId}/action-history`,
    {
      params,
    },
  )
  return data
}
