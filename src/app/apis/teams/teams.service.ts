import { http } from 'app/helpers/http-config'
import { TeamResponse } from 'app/models'

export const getListTeam = async (params: any): Promise<TeamResponse> => {
  const { data } = await http.get<TeamResponse>('/api/teams', {
    params,
  })
  return data
}

export const getTeams = async (params: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/teams`, {
    params,
  })
  return data
}

export const getTeamDetail = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/teams/${id}`)
  return data
}

export const createTeam = async (params: any): Promise<any> => {
  const { data } = await http.post<any>(`/api/teams`, params)
  return data
}

export const updateTeam = async (id: any, params: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/teams/${id}`, params)
  return data
}

export const deleteTeam = async (id: any): Promise<any> => {
  const { data } = await http.delete<any>(`/api/teams/${id}`)
  return data
}
