import { http } from 'app/helpers/http-config'
import { IUnlinkedCampgroundsResponse } from 'app/models/camp'
import { IHandbookDetail, IHandbookResponse } from 'app/models/handbook'

export const fetchHandbooks = async (
  params: any,
): Promise<IHandbookResponse> => {
  const { data } = await http.get<IHandbookResponse>('/api/handbooks', {
    params,
  })
  return data
}

export const fetchUnlinkedCampgrounds = async (
  params: any,
): Promise<IUnlinkedCampgroundsResponse> => {
  const { data } = await http.get<IUnlinkedCampgroundsResponse>(
    `/api/handbooks/campgrounds-list`,
    {
      params,
    },
  )
  return data
}

export const getHandbookDetail = async (
  handbookId: number,
): Promise<IHandbookDetail> => {
  const { data } = await http.get<IHandbookDetail>(
    `/api/handbooks/${handbookId}`,
  )
  return data
}

export const createHandbook = async (payload: any): Promise<any> => {
  const { data } = await http.post<any>('/api/handbooks', payload)
  return data
}

export const updateHandbook = async (
  handbookId: number,
  payload: any,
): Promise<any> => {
  const { data } = await http.put<any>(`/api/handbooks/${handbookId}`, payload)
  return data
}

export const deleteHandbook = async (handbookId?: number): Promise<any> => {
  const { data } = await http.delete<any>(`/api/handbooks/${handbookId}/delete`)
  return data
}

export const toggleLinkCamps = async (payload: any): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/handbooks/toggle-handbook`,
    payload,
  )
  return data
}

export const checkExistedNameHandbook = async (params?: {
  idHandbook?: number
  name?: string
}): Promise<any> => {
  const { data } = await http.get<any>(
    `/api/handbooks/validate-handbook-name`,
    { params },
  )
  return data
}
