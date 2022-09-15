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
    } else {
      formatter = 'User'
    }
  }
  return formatter
}
