import { http } from 'app/helpers/http-config'

export const getWards = async (districtId: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/district/${districtId}/wards`)
  return data
}

export const getDistricts = async (provinceId: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/province/${provinceId}/districts`)
  return data
}

export const getProvinces = async (): Promise<any> => {
  const { data } = await http.get<any>(`/api/provinces`)
  return data
}
