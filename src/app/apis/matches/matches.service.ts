import { http } from 'app/helpers/http-config'

export const getMatches = async (params: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/matches`, {
    params,
  })
  return data
}

export const getMatchDetail = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/matches/${id}`)
  return data
}

export const updateMatch = async (params: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/matches`, params)
  return data
}

export const getMatchProcesses = async (id: any, params: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/matches/${id}/match-process`, {
    params,
  })
  return data
}

export const updateMatchProcess = async (
  id: any,
  params: any,
): Promise<any> => {
  const { data } = await http.put<any>(`/api/match-process/${id}`, params)
  return data
}

export const deleteMatchProcess = async (id: any): Promise<any> => {
  const { data } = await http.delete<any>(`/api/match-process/${id}`)
  return data
}
