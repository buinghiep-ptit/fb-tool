import { IPagingResponse } from './'

export interface IFeedResponse extends IPagingResponse {
  content?: IFeed[]
}
export interface IReportDeclineResponse extends IPagingResponse {
  content?: IReportDecline[]
}

export interface IActionHistoryResponse extends IPagingResponse {
  content?: IActionHistory[]
}

export interface IFeed {
  content?: string
  reportedNum?: number
  feedId?: number
  customerType?: 1 | 2
  account?: string
  dateCreated?: string
  status?: 0 | 1 | -1 | -2
}

export interface IFeedDetail {
  id?: number
  idSrcType?: number // Liên kết với 1:Địa danh 2:Điểm camp 4:Sản phẩm
  idSrc?: number
  webUrl?: string | null
  idCustomer?: number
  viewScope?: number // Phạm vi hiển thị 1:Công khai 2:Bạn bè 3:Chỉ mình tôi
  isAllowComment?: number // Cho phép comment 0:Không 1:Có
  content?: string
  status?: number
  medias?: IMediaOverall[]
  tags?: ITags[]
  createdBy?: number
  lastModifiedBy?: number
  dateCreated?: string
  dateUpdated?: string
  handledBy?: number
  handleExpireTime?: string | null
}

export interface IMediaOverall {
  id?: number
  idSrc?: number
  srcType?: number
  mediaType?: number // 1:Ảnh đại diện 2:Ảnh bìa 3:Ảnh mô tả 4:Hợp đồng 5:Giấy tờ
  mediaFormat?: number // 1:Video 2:Ảnh 3:Khác
  url?: string
  status?: number
  detail?: IMediaDetail
}

export interface IMediaDetail {
  id?: number
  coverImgUrl?: string
  description?: string | null
  duration?: number | null
  height?: number | null
  width?: number | null
}

export interface ITags {
  id?: number
  value?: string
}

export interface IActionHistory {
  processName?: string
  actionDate?: string
  requestStatus?: string
  note?: string
  email?: string
}

export interface IReportDecline {
  reporter?: string
  reportDate?: string
  status?: number
  reason?: string
}

export type TitleFeeds = keyof IFeed | 'order' | 'action'
export type TitleReportsDecline = keyof IReportDecline | 'order' | 'action'
export type TitleActionsHistory = keyof IActionHistory | 'order' | 'action'
