export const LabelFormatter = (value?: number, key?: string) => {
  let formatter = ''

  if (key === 'customerType') {
    if (value === 2) {
      formatter = 'KOL'
    } else if (value === 1) {
      formatter = 'Thường'
    } else {
      formatter = ''
    }
  } else if (key === 'role') {
    if (value === 1) {
      formatter = 'Admin'
    } else if (value === 2) {
      formatter = 'CS'
    } else if (value === 3) {
      formatter = 'Sale'
    } else {
      formatter = ''
    }
  } else if (key === 'feed') {
    if (value === 0) {
      formatter = 'Chờ hậu kiểm'
    } else if (value === 1) {
      formatter = 'Đã duyệt'
    } else if (value === -1) {
      formatter = 'Vi phạm'
    } else if (value === -2) {
      formatter = 'Đã xóa'
    } else {
      formatter = ''
    }
  }
  return formatter
}
