import { IPagingResponse } from './common'

export interface INotificationResponse extends IPagingResponse {
  content?: INotification[]
}

export interface INotification {
  id?: number
  lastSendDate?: string
  title?: string
  dateUpdated?: string
  lastModifiedBy?: string
  srcType?: string
  status?: number
  scope?: string
}

export interface INotificationDetail {
  id?: number
  scope?: number
  srcType?: number | null
  idSrc?: number | null
  webUrl?: string | null
  imgUrl?: string | null
  title?: string
  content?: string | null
  status?: number
  dateUpdated?: string
  dateCreated?: string
}

export type TitleNotifications = keyof INotification | 'order' | 'action'
