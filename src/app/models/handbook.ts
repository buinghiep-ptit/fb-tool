import { IPagingResponse } from './common'

export interface IHandbookResponse extends IPagingResponse {
  content?: IHandbookOverall[]
}
export interface IHandbookOverall {
  id?: number
  amountLinkedCampGround?: number
  userName?: string
  title?: string
  userId?: number
  status?: number
}

export interface IHandbookDetail {
  id?: number
  title?: string
  content?: string
  status?: number
}

export type TitleHandbooks = keyof IHandbookOverall | 'order' | 'action'
