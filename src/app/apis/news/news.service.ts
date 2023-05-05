import { http } from 'app/helpers/http-config'

export const getNews = async (params: any): Promise<any> => {
  const { data } = await http.get<any>('/api/news', {
    params,
  })
  return data
}

export const getNewsDetail = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/news/${id}`)
  return data
}

export const createNews = async (params: any): Promise<any> => {
  const { data } = await http.post<any>(`/api/news`, params)
  return data
}

export const updateNews = async (params: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/news`, params)
  return data
}

export const deleteNews = async (id: any): Promise<any> => {
  const { data } = await http.delete<any>(`/api/news/${id}`)
  return data
}
