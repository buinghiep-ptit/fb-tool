export enum OrderStatusEnum {
  CHECK = 0,
  RECEIVED = 1,
  WAIT_PAY = 2,
  SUCCEEDED = 3,
  COMPLETED = 4,
  CANCELED = -1,

  WAIT_HANDLE = 0,
  HANDLE_COMPLETED = 2,
}
interface OrderStatusSpec {
  key?: number
  value?: number
  textColor?: string | '#FFFFFF'
  bgColor?: string | '#475985'
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
        return {
          key: 0,
          value: 0,
          title: 'Kiểm tra',
          textColor: '#FFFFFF',
          bgColor: '#475985',
        }
      case OrderStatusEnum.RECEIVED:
        return {
          key: 1,
          value: 1,
          title: 'Đã tiếp nhận',
          textColor: '#475985',
          bgColor: '#EFF4FB',
        }
      case OrderStatusEnum.WAIT_PAY:
        return {
          key: 2,
          value: 2,
          title: 'Chờ thanh toán',
          textColor: '#FB7800',
          bgColor: '#FCF5ED',
        }
      case OrderStatusEnum.SUCCEEDED:
        return {
          key: 3,
          value: 3,
          title: 'Đặt thành công',
          textColor: '#ED1E24',
          bgColor: '#EDFDEF',
        }
      case OrderStatusEnum.COMPLETED:
        return {
          key: 4,
          value: 4,
          title: 'Đã sử dụng',
          textColor: '#466FFF',
          bgColor: '#F0F4FF',
        }
      case OrderStatusEnum.CANCELED:
        return {
          key: -1,
          value: -1,
          title: 'Đã huỷ',
          textColor: '#FF4141',
          bgColor: '#FFF5F5',
        }

      default:
        return {
          key: 0,
          value: 0,
          title: 'Kiểm tra',
          textColor: '#FFFFFF',
          bgColor: '#475985',
        }
    }
  } else if (type === 1) {
    switch (status) {
      case OrderStatusEnum.CHECK:
        return {
          key: 0,
          value: 0,
          title: 'Kiểm tra',
          textColor: '#FFFFFF',
          bgColor: '#475985',
        }
      case OrderStatusEnum.RECEIVED:
        return {
          key: 1,
          value: 1,
          title: 'Đã tiếp nhận',
          textColor: '#475985',
          bgColor: '#EFF4FB',
        }
      case OrderStatusEnum.WAIT_PAY:
        return {
          key: 2,
          value: 2,
          title: 'Chờ thanh toán',
          textColor: '#FB7800',
          bgColor: '#FCF5ED',
        }
      case OrderStatusEnum.SUCCEEDED:
        return {
          key: 3,
          value: 3,
          title: 'Đặt thành công',
          textColor: '#ED1E24',
          bgColor: '#EDFDEF',
        }

      default:
        return {
          key: 0,
          value: 0,
          title: 'Kiểm tra',
          textColor: '#FFFFFF',
          bgColor: '#475985',
        }
    }
  } else {
    switch (status) {
      case OrderStatusEnum.WAIT_HANDLE:
        return {
          key: 0,
          value: 0,
          title: 'Chờ xử lý',
          textColor: '#FFFFFF',
          bgColor: '#475985',
        }
      case OrderStatusEnum.RECEIVED:
        return {
          key: 1,
          value: 1,
          title: 'Đã tiếp nhận yêu cầu huỷ',
          textColor: '#475985',
          bgColor: '#EFF4FB',
        }
      case OrderStatusEnum.HANDLE_COMPLETED:
        return {
          key: 2,
          value: 2,
          title: 'Đã xử lý',
          textColor: '#466FFF',
          bgColor: '#F0F4FF',
        }

      default:
        return {
          key: 0,
          value: 0,
          title: 'Kiểm tra',
          textColor: '#FFFFFF',
          bgColor: '#475985',
        }
    }
  }
}

export const getServiceNameByType = (type?: number) => {
  switch (type) {
    case 1:
      return 'Gói trải nghiệm'
    case 2:
      return 'Lưu trú'
    case 3:
      return 'Khác'

    default:
      return 'Khác'
  }
}
