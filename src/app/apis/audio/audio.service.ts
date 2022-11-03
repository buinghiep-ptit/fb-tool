import { http } from 'app/helpers/http-config'
import { IAudioOverall, IAudioResponse } from 'app/models/audio'

export const fetchAudios = async (params: any): Promise<IAudioResponse> => {
  const { data } = await http.get<IAudioResponse>('/api/common-audios', {
    params,
  })
  return data
}

export const createAudio = async (payload: any): Promise<IAudioOverall> => {
  const { data } = await http.post<IAudioOverall>('/api/common-audios', payload)
  return data
}

export const updateAudio = async (
  audioId?: number,
  payload?: any,
): Promise<any> => {
  const { data } = await http.put<any>(`/api/common-audios/${audioId}`, payload)
  return data
}

export const changeAudioStatus = async (audioId?: number): Promise<any> => {
  const { data } = await http.put<any>(
    `/api/common-audios/${audioId}/change-status`,
  )
  return data
}

export const changeAudioIsDefault = async (audioId?: number): Promise<any> => {
  const { data } = await http.put<any>(
    `/api/common-audios/${audioId}/change-is-default`,
  )
  return data
}

export const deleteAudio = async (audioId?: number): Promise<any> => {
  const { data } = await http.delete<any>(`/api/common-audios/${audioId}`)
  return data
}

export const checkExistedName = async (payload?: {
  nameAudios?: string
}): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/common-audios/check-name`,
    payload,
  )
  return data
}
