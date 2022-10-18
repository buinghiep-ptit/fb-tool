import { toast } from 'react-toastify'
enum StatusCode {
  Unauthorized = 401,
  BadRequest = 400,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}
export const toastError = (error: {
  data?: any
  response?: any
  message?: string
  request?: any
  code?: any
}) => {
  let message = null
  if (error.data) {
    message = error.data.errorDescription ?? ''
  } else if (error.code) {
    if (error.code === 'ECONNABORTED')
      message = 'Không có phản hồi phía máy chủ'
  } else if (error.response) {
    const { status } = error.response
    switch (status) {
      case StatusCode.Unauthorized:
        message = 'Phiên đăng nhập đã hết hạn'
        break
      case StatusCode.BadRequest:
        message = 'Yêu cầu không hợp lệ'
        break
      case StatusCode.InternalServerError:
        message = 'Có lỗi xảy ra phía máy chủ'
        break
      default:
        message =
          '[Response Error] Đã có lỗi không mong muốn. Vui lòng thử lại sau'
        break
    }
  } else if (error.message) {
    ;({ message: message } = error)
    if (message === 'Network Error') {
      message = 'Không thể kết nối tới máy chủ'
    }
  } else {
    // error.request
    message = `${error.request}` as string
  }

  toast.error(message, { toastId: 'custom-error-id' })
}
export const toastSuccess = (success: { message: string }) => {
  let message = null
  ;({ message: message } = success)

  toast.success(message, { toastId: 'custom-success-id' })
}
export const toastWarning = (warning: { message: string }) => {
  toast.warning(warning.message, { toastId: 'custom-warning-id' })
}
