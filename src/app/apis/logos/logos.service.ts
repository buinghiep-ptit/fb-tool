import { http } from 'app/helpers/http-config'

export const getLogos = async (params: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/donors`, {
    params,
  })
  return data
}

export const getLogoDetail = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/donors/${id}`)
  return data
}

export const createLogo = async (params: any): Promise<any> => {
  const { data } = await http.post<any>(`/api/donors`, params)
  return data
}

export const updateLogo = async (id: any, params: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/donors/${id}`, params)
  return data
}

export const deleteLogo = async (id: any): Promise<any> => {
  const { data } = await http.delete<any>(`/api/donors/${id}`)
  return data
}

export const updateLogoOrder = async (params: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/donors/priority`, params)
  return data
}
