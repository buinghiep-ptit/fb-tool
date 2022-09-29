import { IPagingResponse } from './common'

export interface ICampAreaResponse extends IPagingResponse {
  content?: ICampArea[]
}

export interface ICampGroundResponse extends IPagingResponse {
  content?: ICampGround[]
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
