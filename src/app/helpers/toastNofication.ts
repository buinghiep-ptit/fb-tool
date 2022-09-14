import { toast } from 'react-toastify'
enum StatusCode {
  Unauthorized = 401,
  BadRequest = 400,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}
export const toastError = (error: {
  response?: any
  message?: string
  request?: any
  code?: any
}) => {
  let message = null
  console.log(error.message)
  if (error.code) {
    if (error.code === 'ECONNABORTED')
      message = '[Lỗi Server] Không có phản hồi phía máy chủ'
  } else if (error.response) {
    const { status } = error.response
    switch (status) {
      case StatusCode.Unauthorized:
        message = '[Response Error] Phiên đăng nhập đã hết hạn'
        break
      case StatusCode.BadRequest:
        message = '[Response Error] Yêu cầu không hợp lệ'
        break
      case StatusCode.InternalServerError:
        message = '[Response Error] Có lỗi xảy ra phía máy chủ'
        break
      default:
        message =
          '[Response Error] Đã có lỗi không mong muốn. Vui lòng thử lại sau'
        break
    }
  } else if (error.message) {
    ;({ message: message } = error)
    if (message === 'Network Error') {
      message = '[Response Error] Không có kết nối Internet'
    }
  } else {
    // error.request
    message = `[Response Error] ${error.request}` as string
  }

  toast.error(message)
}
export const toastSuccess = (success: { message: string }) => {
  let message = null
  ;({ message: message } = success)

  toast.success(message)
}
export const toastWarning = (warning: { message: string }) => {}
