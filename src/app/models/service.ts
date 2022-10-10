import { IPagingResponse } from './common'

export interface TitleService {
  name?: string
  id?: number
  campGroundName?: string
  image?: string
  rentalType?: number
  capacity?: number
  status?: number
}

export interface DetailService {
  id?: number
  campGroundId?: number
  name?: string
  rentalType?: number
  capacity?: number
  description?: string
  status?: number
  weekdayPrices: {
    amount: number
  }
  images?: string
  dateCreated?: string
  dateUpdated?: string
}
export type TitleServices = keyof TitleService | 'order' | 'action'

export interface ServiceResponse extends IPagingResponse {
  content?: TitleService[]
}
