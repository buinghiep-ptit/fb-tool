import { IPagingResponse } from './common'

export interface Order {
  id?: number
  customerId?: number
  quantity?: number // số lượng sản phẩm
  createdDate?: string
  customerEmail?: string
  customerPhone?: string
  orderCode?: string
  amount?: number // tổng số tiền đơn hàng
  note?: string
  status?: number // 0: hủy, 1: chờ xử lý, 2: hoàn thành
}
export interface OrderResponse extends IPagingResponse {
  content?: Order[]
}

export interface IOrderDetail {
  id?: number
  customerId?: number
  customerEmail?: string
  customerPhone?: string
  orderCode?: string
  quantity?: number
  createdDate?: string
  status?: number
  amount?: number
  orderDetails?: OrdersDetail[]
  delivery?: Delivery
}

export interface OrdersDetail {
  productId?: number
  customerId?: number
  quantity?: number
  amount?: number
  code?: string
  name?: string
  fullName?: string
  productType?: number
  imgUrl?: string[] | undefined
}

export interface Delivery {
  fullName?: string
  phone?: string
  email?: string
  districtId?: number
  districtName?: string
  wardId?: number
  wardName?: string
  address?: string
  note?: string
}
