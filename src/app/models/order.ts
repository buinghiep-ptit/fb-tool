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
  status?: number
}

export interface IOrderDetail {
  id?: number
  dateStart?: string
  dateEnd?: string
  dateCreated?: string
  orderCode?: string
  amount?: number
  deposit?: number
  status?: number
  note?: string
  customer?: ICustomerOrder
  contact?: IContact
  services?: IService[]
  orderProcess?: IOrderProcess[]
  cancelRequest?: {
    requester: {
      id: 2
      userType: 2
      fullName: null
      email: 'giangcm@fpt.com.vn'
      mobilePhone: null
    }
    reason: 'dev tạo yc hủy'
    refundType: 2
    note: 'dev hoan tien'
    status: 1
    idOrder: null
  }
  transactions?: [
    {
      id: 1
      txnCode: 'DEV001000001'
      type: 1
      amount: 2000000
      status: 3
      dateCreated: '2022-09-29T10:17:16Z'
      dateUpdated: '2022-09-29T10:17:18Z'
    },
    {
      id: 2
      txnCode: 'RF954F1E705041'
      type: 2
      amount: 1000000
      status: 3
      dateCreated: '2022-09-29T10:24:10Z'
      dateUpdated: '2022-09-29T10:24:10Z'
    },
  ]
  campGround?: ICampground
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
  serviceId?: number
  name?: string
  type?: number
  quantity?: number
  amount?: number
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

export type TitleOrders = keyof IOrderOverall | 'order' | 'action'
