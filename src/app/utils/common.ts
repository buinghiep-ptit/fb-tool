export const getColorByCusStatus = (status: number) => {
  switch (status) {
    case 1:
      return '#ED1E24'
    case -1:
      return '#AAAAAA'

    case -2:
      return '#FF3D57'

    case -3:
      return '#ff9e43'

    default:
      return '#AAAAAA'
  }
}

export const regexImgUrl =
  /^http[^ \!@\$\^&\(\)\+\=]+(\.png|\.jpeg|\.gif|\.jpg)$/

export const getDifferenceInDays = (date1: string, date2: string) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffInMs = d2.getTime() - d1.getTime()
  if (diffInMs <= 0) return 0
  return diffInMs / (1000 * 60 * 60 * 24)
}

export function timeSince(dateStr: number) {
  const date = new Date(dateStr)
  const intervals = [
    { label: 'năm', seconds: 31536000 },
    { label: 'tháng', seconds: 2592000 },
    { label: 'ngày', seconds: 86400 },
    { label: 'giờ', seconds: 3600 },
    { label: 'phút', seconds: 60 },
    { label: 'giây', seconds: 1 },
  ]

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const interval = intervals.find(i => i.seconds < seconds)
  if (!interval) return
  const count = Math.floor(seconds / interval.seconds)
  return `${count} ${interval.label} trước`
}

export const convertDateToUTC = (date: string) => {
  const [day, month, year] = date.split('/')
  const d = new Date(
    Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)),
  )
  const result = d.toISOString()

  return result
}
