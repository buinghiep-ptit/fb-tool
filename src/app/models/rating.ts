import { IPagingResponse } from './common'
import { IMediaOverall } from './feed'
import { ICampground, ICustomerOrder } from './order'

export interface IRatingOverallResponse extends IPagingResponse {
  content?: IRatingOverall[]
}
export interface IRateReportResponse extends IPagingResponse {
  content?: IRateReport[]
}

export interface IRatingOverall {
  id?: number
  name?: string
  comment?: string
  reportDate?: string
  reportNum?: number
  cusEmail?: string
  cusMobilePhone?: string
  imgUrl?: string
  dateCreated?: string
  idCustomer?: number
  rating?: number
  cusName?: string
  status?: number
  customer?: string
}

export interface IRateDetail {
  id?: number
  idCampGround?: number
  campground?: ICampground
  idCustomer?: number
  customer?: ICustomerOrder
  rating?: number
  comment?: string
  isShowComment?: number
  status?: number
  imgs?: IMediaOverall[]
}

export interface IRateReport {
  id?: number
  cusMobilePhone?: string
  cusEmail?: string
  cusName?: string
  dateCreated?: string
  idCustomer?: number
  status?: number
  reason?: string
}

export type TitleRating = keyof IRatingOverall | 'order' | 'action'
export type TitleRateReports = keyof IRateReport | 'order' | 'action'
