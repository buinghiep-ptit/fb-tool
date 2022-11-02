import { IPagingResponse } from './common'

export interface IKeywordResponse extends IPagingResponse {
  content?: IKeyword[]
}
export interface IKeyword {
  id?: number
  word?: string
  createdBy?: string
  dateCreated?: string
  isRequired?: number
}

export type TitleKeywords = keyof IKeyword | 'order' | 'action'
