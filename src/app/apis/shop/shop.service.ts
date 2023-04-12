import { http } from 'app/helpers/http-config'

export const getProductCategories = async (): Promise<any> => {
  const { data } = await http.get<any>(`/api/product-categories`)
  return data
}

export const getCategoriesSort = async (): Promise<any> => {
  const { data } = await http.get<any>(`/api/product-categories/sort`)
  return data
}

export const updateCategoriesSort = async (params: any): Promise<any> => {
  const { data } = await http.get<any>(`/api/product-categories/sort`, params)
  return data
}

export const getProducts = async (params: any, id: any): Promise<any> => {
  const { data } = await http.get<any>(
    `/api/product-categories/${id}/info`,
    params,
  )
  return data
}
