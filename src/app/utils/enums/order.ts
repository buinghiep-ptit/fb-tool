export enum OrderStatusEnum {
  CHECK = 0,
  RECEIVED = 1,
  WAIT_PAY = 2,
  SUCCEEDED = 3,
  COMPLETED = 4,
  CANCELED = -1,

  WAIT_HANDLE = 0,
  HANDLE_COMPLETED = 1,
}
interface OrderStatusSpec {
  key?: number
  value?: number
  color?: string
  title?: string
  descriptions?: string
}
export const getOrderStatusSpec = (
  status: OrderStatusEnum,
  type?: number,
): OrderStatusSpec => {
  if (type === 2) {
    switch (status) {
      case OrderStatusEnum.CHECK:
        return { key: 0, value: 0, title: 'Kiểm tra' }
      case OrderStatusEnum.RECEIVED:
        return { key: 1, value: 1, title: 'Tiếp nhận' }
      case OrderStatusEnum.WAIT_PAY:
        return { key: 2, value: 2, title: 'Chờ thanh toán' }
      case OrderStatusEnum.SUCCEEDED:
        return { key: 3, value: 3, title: 'Thành công' }
      case OrderStatusEnum.COMPLETED:
        return { key: 4, value: 4, title: 'Đã sử dụng' }
      case OrderStatusEnum.CANCELED:
        return { key: -1, value: -1, title: 'Đã huỷ' }

      default:
        return {}
    }
  } else if (type === 1) {
    switch (status) {
      case OrderStatusEnum.CHECK:
        return { key: 0, value: 0, title: 'Kiểm tra' }
      case OrderStatusEnum.RECEIVED:
        return { key: 1, value: 1, title: 'Tiếp nhận' }
      case OrderStatusEnum.WAIT_PAY:
        return { key: 2, value: 2, title: 'Chờ thanh toán' }

      default:
        return {}
    }
  } else {
    switch (status) {
      case OrderStatusEnum.WAIT_HANDLE:
        return { key: 0, value: 0, title: 'Chờ xử lý' }
      case OrderStatusEnum.HANDLE_COMPLETED:
        return { key: 1, value: 1, title: 'Đã xử lý' }

      default:
        return {}
    }
  }
}
