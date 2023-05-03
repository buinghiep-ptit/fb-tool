import { http } from 'app/helpers/http-config'

export const getMemberRegistrations = async (params: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/memberships`, {
    params,
  })
  return data
}

export const getMemberDetail = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/memberships/${id}`)
  return data
}

export const getMemberLogs = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/memberships/${id}/action-history`)
  return data
}

export const approveMember = async (id: any, params: any): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/memberships/${id}/approve`,
    params,
  )
  return data
}

export const rejectMember = async (id: any, params: any): Promise<any> => {
  const { data } = await http.post<any>(`/api/memberships/${id}/reject`, params)
  return data
}

export const getMembershipSettings = async (): Promise<any> => {
  const { data } = await http.get<any>(`/api/memberships/membership-setting`)
  return data
}

export const updateMembershipSettings = async (params: any): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/memberships/membership-setting`,
    params,
  )
  return data
}
