import { IPagingResponse } from './common'

export interface ICampAreaResponse extends IPagingResponse {
  content?: ICampArea[]
}

export interface ICampGroundResponse extends IPagingResponse {
  content?: ICampGround[]
}
export interface IUnlinkedCampgroundsResponse extends IPagingResponse {
  content?: IUnlinkedCampgrounds[]
}
export interface ICampArea {
  id?: number
  name?: string
  address?: string
  campGroundAmount?: number
  eventName?: string
  campType?: number
  imgUrl?: string
  status?: number
}

export interface ICampGround {
  id?: number
  name?: string
  address?: string
  campAreaName?: string
  merchantEmail?: string
  merchantMobilePhone?: string
  imageUrl?: string
  isSupportBooking?: boolean
  idMerchant?: number
  status?: number
}

export interface IUnlinkedCampgrounds extends ICampGround, ICampArea {}

export type TitleCampgrounds = keyof ICampGround | 'order' | 'action'
export type TitleUnlinkedCampgrounds =
  | keyof IUnlinkedCampgrounds
  | 'order'
  | 'action'
