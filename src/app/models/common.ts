import { ReactElement } from 'react'
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
export interface IErrorResponse {
  code?: string
  error?: string
  errorDescription?: string
}
export interface ISuccessResponse {
  verify?: string
  response?: string
  status?: string
  accessToken?: string
  expiresIn?: number
  created?: number
  tokenType?: string
  url?: string
}
export interface TableColumn<T> {
  id: T | string
  label: string
  minWidth?: number
  maxWidth?: number
  width?: number
  align?: 'center' | 'right' | 'left'
  status?: (param?: any) => ReactElement | string
  actions?: (x?: any) => any
  action?: (param?: any) => ReactElement
  format?: (param: any) => string | null | ReactElement
  media?: (param: any) => string | null | ReactElement
  link?: (param: any) => string | null | ReactElement
  sticky?: any
}

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

export interface IFeedsFilters {
  search?: string
  hashtag?: string
  status?: 0 | 1 | -1 | -2 | -3 | 'all' | string | undefined | any //  0:Chờ hậu kiểm 1:Đã duyệt -1:Vi phạm  -2:Bị báo cáo -3:Đã xóa
  isCampdi?: 1 | number | boolean | string | undefined
  isReported?: 1 | number | boolean | string | undefined
  page?: number | 0
  size?: number | 20
  from?: string
  to?: string
  sort?: string
  viewScope?: number
  stt?: any
}

export interface PlayersFilters {
  name?: string
  position?: string
  status?: 1 | -1 | 'all' | string | undefined //   1:Hoạt động -1:Không hoạt động
  page?: number | 0
  size?: number | 20
  sort?: string
  team?: string
  from?: string
  to?: string
}
export interface OrdersFilters {
  name?: string
  status?: 2 | 1 | 0 | string | undefined
  page?: number | 0
  size?: number | 20
  from?: string
  to?: string
}
