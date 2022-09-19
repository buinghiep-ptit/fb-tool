export const LabelFormatter = (value?: number, key?: string) => {
  let formatter = ''

  switch (key) {
    case 'customerType':
      if (value === 2) {
        formatter = 'KOL'
      } else if (value === 1) {
        formatter = 'Thường'
      }
      break

    case 'role':
      if (value === 1) {
        formatter = 'Admin'
      } else if (value === 2) {
        formatter = 'CS'
      } else if (value === 3) {
        formatter = 'Sale'
      }
      break

    case 'feed':
      if (value === 0) {
        formatter = 'Chờ hậu kiểm'
      } else if (value === 1) {
        formatter = 'Đã duyệt'
      } else if (value === -1) {
        formatter = 'Vi phạm'
      } else if (value === -2) {
        formatter = 'Đã xóa'
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
