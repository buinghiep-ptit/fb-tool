import { http } from 'app/helpers/http-config'
import { IKeywordResponse } from 'app/models/keyword'
import { IPolicyOverall } from 'app/models/policy'

export const fetchKeywords = async (params: any): Promise<IKeywordResponse> => {
  const { data } = await http.get<IKeywordResponse>('/api/trending-keyword', {
    params,
  })
  return data
}

export const createKeyword = async (payload: any): Promise<any> => {
  const { data } = await http.post<any>('/api/trending-keyword', payload)
  return data
}

export const updatePinKeyword = async (wordId: number): Promise<any> => {
  const { data } = await http.put<any>(`/api/trending-keyword/${wordId}`)
  return data
}

export const deleteKeyword = async (wordId?: number): Promise<any> => {
  const { data } = await http.delete<any>(`/api/trending-keyword/${wordId}`)
  return data
}
