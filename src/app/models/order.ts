import { ICampArea } from './camp'
import { IPagingResponse } from './common'

export interface IOrderResponse extends IPagingResponse {
  content?: IOrderOverall[]
}
export interface IOrderOverall {
  campGroundRepresent?: string
  cusAccount?: string
  campGroundName?: string
  paymentAmnt?: number
  adminNote?: string
  orderId?: number
  campGroundId?: number
  handledBy?: string
  dateCreated?: string
  amount?: number
  cancelRequestStatus?: number
  status?: number
}

export interface IOrderDetail {
  id?: number
  dateStart?: string
  dateEnd?: string
  dateCreated?: string
  orderCode?: string
  paymentMethod?: number
  paymentType?: 1 | 2
  amount?: number
  deposit?: number
  status?: number
  note?: string
  customer?: ICustomerOrder
  contact?: IContact
  services?: IService[]
  orderProcess?: IOrderProcess[]
  handledBy?: number | null
  handleExpireTime?: string | null
  cancelRequest?: {
    requester: {
      id?: number
      userType?: number
      fullName?: string
      email?: string
      mobilePhone?: string
    }
    reason?: string
    refundType?: number
    note?: string
    status?: number
    idOrder?: number
    handleExpireTime?: string
  }
  transactions?: ITransaction[]
  paymentTrans?: IPaymentTrans
  campGround?: ICampground
}
export interface IPaymentTrans {
  id?: number
  txnCode?: string
  paymentTrnsCode?: string
  paymentMethod?: number
  paymentDate?: string
  type?: number
  accountNumber?: string
  urlFile?: string
  amount?: number
  status?: number
  dateCreated?: string
  dateUpdated?: string
}
export interface ICustomerOrder {
  id?: number
  userType?: number
  fullName?: string
  email?: string
  mobilePhone?: string
}

export interface IContact {
  id?: number | null
  userType?: number | null
  fullName?: string
  email?: string
  mobilePhone?: string
}

export interface IService {
  idService?: number
  name?: string
  type?: number
  quantity?: number
  amount?: number
  imgUrl?: string
}

export interface IOrderProcess {
  account?: string
  status?: number
  dateCreated?: string
  note?: string | null
}

export interface ICampground {
  id?: number
  name?: string
  description?: string
  merchant?: IMerchant
  policy?: null
  note?: null
  noteTopography?: null
  idMerchant?: 2
  idTopography?: 1
  idProvince?: 1
  idDistrict?: 1
  isSupportBooking?: 1
  contact?: null
  idWard?: 1
  openTime?: null
  closeTime?: null
  address?: string
  capacity?: 5
  latitude?: 9.618203
  longitude?: 105.593244
  isPopular?: 1
  status?: -1
  medias?: []
  campAreas?: ICampArea[]
  tags?: []
  campTypes?: null
  campGroundSeasons?: []
  campGroundInternets?: []
  campGroundUtilities?: []
  campGroundVehicles?: []
  freeParking?: false
}

export interface IMerchant {
  id?: number
  userType?: number
  fullName?: string
  email?: string
  mobilePhone?: string
}

export interface ITransaction {
  id?: number
  txnCode?: string
  type?: number
  amount?: number
  status?: number
  dateCreated?: string
  dateUpdated?: string
}

export type TitleOrders = keyof IOrderOverall | 'order' | 'action'
