import { http } from 'app/helpers/http-config'

export const getListCampGround = async (params: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/camp-grounds`, {
    params,
  })
  return data
}

export const updateCampGroundStatus = async (
  id: any,
  status: any,
): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/camp-grounds/${id}/change-status?status=${status}`,
  )
  return data
}

export const getDetailCampGround = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/camp-grounds/${id}`)
  return data
}

export const deleteCampGround = async (id: any): Promise<any> => {
  const { data } = await http.delete<any>(`/api/camp-grounds/${id}/delete`)
  return data
}

export const getListCampGroundService = async (
  id: any,
  params: any,
): Promise<any> => {
  const { data } = await http.get<any>(
    `/api/camp-grounds/${id}/camp-rental-list`,
    {
      params,
    },
  )
  return data
}

export const updateCampGround = async (id: any, params: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/camp-grounds/${id}`, params)
  return data
}

export const createCampGround = async (params: any): Promise<any> => {
  const { data } = await http.post<any>(`/api/camp-grounds/`, params)
  return data
}

// Service

export const updateCampGroundServiceStatus = async (id: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/camp-service/${id}/toggle-status`)
  return data
}

export const deleteCampGroundService = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/camp-service/${id}/delete`)
  return data
}

// untility

export const getListUnlinkedUtility = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(
    `/api/camp-grounds/${id}/unlinked-utility`,
  )
  return data
}

export const getListUtility = async (): Promise<any> => {
  const { data } = await http.get<any>(`/api/camp-grounds/utility-list-select`)
  return data
}

// camp area

export const getListCampArea = async (): Promise<any> => {
  const { data } = await http.get<any>(`/api/camp-areas/select-list`)
  return data
}

export const getListCampAreaWithoutProvince = async (): Promise<any> => {
  const { data } = await http.get<any>(
    `/api/camp-areas/select-list-without-province`,
  )
  return data
}

// list merchant
export const getListMerchant = async (): Promise<any> => {
  const { data } = await http.get<any>(`/api/camp-grounds/merchant-list`)
  return data
}

// handbook
export const getListHandBookLinked = async (
  id: any,
  params: any,
): Promise<any> => {
  const { data } = await http.get<any>(`/api/camp-grounds/${id}/handbook`, {
    params,
  })
  return data
}

export const getListHandBookUnLinked = async (
  id: any,
  params: any,
): Promise<any> => {
  const { data } = await http.get<any>(
    `/api/camp-grounds/${id}/unlinked-handbook`,
    {
      params,
    },
  )
  return data
}

export const removeHandBookWithCamp = async (params: any): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/camp-grounds/remove-handbook`,
    params,
  )
  return data
}

export const addHandBookToCamp = async (params: any): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/camp-grounds/add-handbook`,
    params,
  )
  return data
}
