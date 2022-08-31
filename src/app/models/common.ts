import { ReactElement } from 'react'

export interface IUserProfile {
  id?: number
  email?: string
  fullName?: string
  firstName?: string
  lastName?: string
  mobilePhone?: string
  gender?: string
  birthday?: string
  imageUrl?: string
  provinceId?: number
  provinceName?: string
  districtId?: number
  districtName?: string
  wardId?: number
  wardName?: string
  wardLevel?: number
  address: string
}

export interface IPagingResponse {
  pageable?: {
    sort?: {
      unsorted?: boolean
      sorted?: boolean
      empty?: boolean
    }
    pageSize?: number
    pageNumber?: number
    offset?: number
    unpaged?: boolean
    paged?: boolean
  }
  totalPages?: number
  totalElements?: number
  last?: boolean
  sort?: {
    unsorted?: boolean
    sorted?: boolean
    empty?: boolean
  }
  numberOfElements?: number
  first?: boolean
  size?: number
  number?: number
  empty?: boolean
}

export interface TableColumn<T> {
  id: T | string
  label: string
  minWidth?: number
  align?: 'center' | 'right' | 'left'
  status?: (param?: any) => ReactElement
  action?: (param?: any) => ReactElement
  format?: (param: number) => string
}
