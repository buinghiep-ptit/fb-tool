import { http } from 'app/helpers/http-config'
import { PlaceCamp } from 'app/models/place'

export const getListPlace = async (params: any): Promise<PlaceCamp> => {
  const { data } = await http.get<PlaceCamp>('/api/camp-areas', { params })
  return data
}

export const getListPlaceProvince = async (params: any): Promise<PlaceCamp> => {
  const { data } = await http.get<PlaceCamp>(
    '/api/camp-areas/default-camp-areas',
    { params },
  )
  return data
}

export const updatePlace = async (id: any, place: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/camp-areas/${id}`, place)
  return data
}

export const deletePlace = async (id: any): Promise<any> => {
  const { data } = await http.delete<any>(`/api/camp-areas/${id}/delete`)
  return data
}

export const updatePlaceStatus = async (id: any, status: any): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/camp-areas/${id}/change-status?status=${status}`,
  )
  return data
}

export const getDetailPlace = async (id: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/camp-areas/${id}`)
  return data
}

export const updateDetailPlace = async (id: any, prams: any): Promise<any> => {
  const { data } = await http.put<any>(`/api/camp-areas/${id}`, prams)
  return data
}

export const createPlace = async (prams: any): Promise<any> => {
  const { data } = await http.post<any>(`/api/camp-areas`, prams)
  return data
}

// Event Api

export const getListEvent = async (id: any, params: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/camp-areas/${id}/campevent-list`, {
    params,
  })
  return data
}

export const removeEventOnPlace = async (
  idArea: any,
  idEvent: any,
): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/camp-areas/${idArea}/campevent-list/${idEvent}/remove`,
  )
  return data
}

export const getListEventUnlinked = async (
  idPlace: any,
  params: any,
): Promise<any> => {
  const { data } = await http.get<any>(
    `/api/camp-areas/${idPlace}/campevent-unlinked-list`,
    { params },
  )
  return data
}

interface LinkEventBody {
  idCampArea: number
  idCampEvent: number
}

export const linkEvent = async (params: LinkEventBody): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/camp-areas/link-camp-event`,
    params,
  )
  return data
}

// Camp Api

export const getListCamp = async (id: any, params: any): Promise<any> => {
  const { data } = await http.get<any>(
    `/api/camp-areas/${id}/campground-list`,
    {
      params,
    },
  )
  return data
}

export const removeCampOnPlace = async (
  idArea: any,
  idEvent: any,
): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/camp-areas/${idArea}/campground-list/${idEvent}/remove`,
  )
  return data
}

export const getListCampUnlinked = async (
  idPlace: any,
  params: any,
): Promise<any> => {
  const { data } = await http.get<any>(
    `/api/camp-areas/${idPlace}/campground-unlinked-list`,
    { params },
  )
  return data
}

interface LinkCampBody {
  idCampArea: number
  idCampGround: number
}

export const linkCamp = async (params: LinkCampBody): Promise<any> => {
  const { data } = await http.post<any>(
    `/api/camp-areas/link-camp-ground`,
    params,
  )
  return data
}

export const checkNamePlaceExist = async (params: any): Promise<any> => {
  const { data } = await http.get<any>(
    `/api/camp-areas/validate-camp-area-name`,
    { params },
  )
  return data
}
