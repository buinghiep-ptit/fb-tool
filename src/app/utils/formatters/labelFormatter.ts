export const LabelFormatter = (value?: number, key?: string) => {
  let formatter = ''
  if (key === 'accountType') {
    if (value === 1) {
      formatter = 'KOL'
    } else {
      formatter = 'Thường'
    }
  }
  return formatter
}
