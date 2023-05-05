import { http } from 'app/helpers/http-config'

export const getVideos = async (params: any): Promise<any> => {
  const { data } = await http.get<any>('/api/videos', {
    params,
  })
  return data
}

export const getVideoDetail = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/videos/${id}`)
  return data
}

export const createVideo = async (params: any): Promise<any> => {
  const { data } = await http.post<any>(`/api/videos`, params)
  return data
}

export const updateVideo = async (id: any, params: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/videos/${id}`, params)
  return data
}

export const deleteVideo = async (id: any): Promise<any> => {
  const { data } = await http.delete<any>(`/api/videos/${id}`)
  return data
}

export const checkVideoPriority = async (params: any): Promise<any> => {
  const { data } = await http.post<any>(`/api/videos/check-priority`, params)
  return data
}
