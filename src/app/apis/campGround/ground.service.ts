import { http } from 'app/helpers/http-config'

export const getListCampGround = async (params: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/camp-grounds`, {
    params,
  })
  return data
}

export const updateCampGroundStatus = async (
  id: any,
  status: any,
): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/camp-grounds/${id}/change-status?status=${status}`,
  )
  return data
}

export const getDetailCampGround = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/camp-grounds/${id}`)
  return data
}

export const deleteCampGround = async (id: any): Promise<any> => {
  const { data } = await http.delete<any>(`/api/camp-grounds/${id}/delete`)
  return data
}
