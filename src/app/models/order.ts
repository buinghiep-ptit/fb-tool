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
