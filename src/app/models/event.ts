import { IPagingResponse } from './common'
import { IMediaDetail, IMediaOverall, ITags } from './feed'

export interface IEventResponse extends IPagingResponse {
  content?: IEventOverall[]
}

export interface IEventOverall {
  name?: 'string'
  tags: ITags
  mediaUrl?: string
  startDate?: string
  endDate?: string
  status?: number
}

export interface IEventDetail {
  id?: number
  name?: string
  medias?: IMediaOverall[]
  content?: string
  isEveryYear?: 0 | 1
  startDate?: string // YYYY-MM-DD
  endDate?: string
  amount?: number
  status?: number // -1 1
  tags: ITags[]
}

export type TitleEvents = keyof IEventOverall | 'order' | 'action'
