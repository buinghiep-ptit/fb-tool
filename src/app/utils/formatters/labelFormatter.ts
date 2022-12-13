export const LabelFormatter = (value?: number, key?: string) => {
  let formatter = ''

  switch (key) {
    case 'customerType':
      if (value === 2) {
        formatter = 'KOL'
      } else if (value === 1) {
        formatter = 'Thường'
      } else if (value === 3) {
        formatter = 'Campdi(food)'
      }
      break

    case 'rentalType':
      if (value === 1) {
        formatter = 'Gói dịch vụ'
      } else if (value === 2) {
        formatter = 'Gói lưu trú'
      } else if (value === 3) {
        formatter = 'Khác'
      }
      break

    case 'role':
      if (value === 1) {
        formatter = 'Admin'
      } else if (value === 2) {
        formatter = 'CS'
      } else if (value === 3) {
        formatter = 'Sale'
      } else if (value === 4) {
        formatter = 'MKT'
      }
      break

    case 'feed':
      if (value === 0) {
        formatter = 'Chờ hậu kiểm'
      } else if (value === 1) {
        formatter = 'Hợp lệ'
      } else if (value === -1) {
        formatter = 'Vi phạm'
      } else if (value === -2) {
        formatter = 'Bị báo cáo'
      } else if (value === -3) {
        formatter = 'Xóa'
      }

      break

    case 'feed-reports':
      if (value === 1) {
        formatter = 'Đã xử lý'
      } else {
        formatter = 'Chưa xử lý'
      }

      break

    default:
      formatter = ''
      break
  }
  return formatter
}

export const labelFeedStatus = (value?: number) => {
  if (value === 0) {
    return {
      title: 'Chờ hậu kiểm',
      textColor: '#FFFFFF',
      bgColor: '#475985',
    }
  } else if (value === 1) {
    return {
      title: 'Hợp lệ',
      textColor: '#2F9B42',
      bgColor: '#EDFDEF',
    }
  } else if (value === -1) {
    return {
      title: 'Vi phạm',
      textColor: '#FF4141',
      bgColor: '#FFF5F5',
    }
  } else if (value === -2) {
    return {
      title: 'Bị báo cáo',
      textColor: '#FB7800',
      bgColor: '#FCF5ED',
    }
  } else if (value === -3) {
    return {
      title: 'Xóa',
      textColor: '#FFFFFF',
      bgColor: '#AAAAAA',
    }
  }
  return { title: 'Chờ hậu kiểm', textColor: '#FFFFFF', bgColor: '#475985' }
}

export const convertOtpToLabel = (type: number) => {
  switch (type) {
    case 1:
      return 'OTP đăng ký'
    case 2:
      return 'OTP quên mật khẩu'

    case 3:
      return 'OTP đăng nhập'

    case 4:
      return 'OTP đổi SĐT'

    default:
      return 'OTP đăng ký'
  }
}

export const getLabelByCusStatus = (status: number) => {
  switch (status) {
    case 1:
      return 'Hoạt động'
    case -4:
      return 'Xoá'

    case -2:
      return 'Khoá'

    case -3:
      return 'Khoá tạm thời'

    default:
      return 'Không hoạt động'
  }
}
