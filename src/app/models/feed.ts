import { IPagingResponse } from './'

export interface IFeedResponse extends IPagingResponse {
  content?: IFeed[]
}

export interface IFeed {
  id?: number
  productLogo?: string
  productName?: string
  slugName?: string
  description?: string
  price?: number
  priceSale?: number
  discount?: number
}

export type TitleFeeds = keyof IFeed | 'order' | 'action'

// type Title =
//   | 'order'
//   | 'account'
//   | 'content'
//   | 'accountType'
//   | 'datePublished'
//   | 'type'
//   | 'status'
//   | 'reciever'
//   | 'action'

// interface Data {
//   id: number
//   account: string
//   content: string
//   accountType: number
//   datePublished: number
//   type: number
//   status: number
//   reciever: string
//
