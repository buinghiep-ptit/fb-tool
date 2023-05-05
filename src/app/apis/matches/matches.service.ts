import { http } from 'app/helpers/http-config'

export const getMatches = async (params: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/matches`, {
    params,
  })
  return data
}

export const getMatchDetail = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/match/${id}`)
  return data
}

export const updateMatch = async (params: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/match`, params)
  return data
}

export const getMatchStats = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/matches/${id}/statistic`)
  return data
}

export const updateMatchStats = async (id: any, params: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/matches/${id}/statistic`, params)
  return data
}

export const getMatchProcesses = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/matches/${id}/match-process`)
  return data
}

export const updateMatchProcess = async (params: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/match-process`, params)
  return data
}

export const getMatchProcessDetail = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/match-process/${id}`)
  return data
}

export const deleteMatchProcess = async (id: any): Promise<any> => {
  const { data } = await http.delete<any>(`/api/match-process/${id}`)
  return data
}
