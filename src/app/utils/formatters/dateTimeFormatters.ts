import moment from 'moment'

export const ISODateTimeFormatter = (dateISOString: string) => {
  const formatted = moment(dateISOString).format('DD/MM/YYYY HH:mm:ss')

  // const t = new Date(dateISOString)
  // const formatted =
  //   ('0' + t.getDate()).slice(-2) +
  //   '/' +
  //   ('0' + (t.getMonth() + 1)).slice(-2) +
  //   '/' +
  //   t.getFullYear() +
  //   ' (' +
  //   ('0' + t.getHours()).slice(-2) +
  //   ':' +
  //   ('0' + t.getMinutes()).slice(-2) +
  //   ':' +
  //   ('0' + t.getMilliseconds()).slice(-2) +
  //   ')'

  return formatted
}

export const DDMMFormatter = (dateISOString: string) => {
  const formatted = moment(dateISOString).format('DD/MM')

  return formatted
}

export const DDMMYYYYFormatter = (dateISOString: string) => {
  const formatted = moment(dateISOString).format('DD/MM/YYYY')

  return formatted
}

export const DateTimeFullConverter = (unixTimestamp: number) => {
  const t = new Date(unixTimestamp)
  const formatted =
    ('0' + t.getDate()).slice(-2) +
    '/' +
    ('0' + (t.getMonth() + 1)).slice(-2) +
    '/' +
    t.getFullYear() +
    ' (' +
    ('0' + t.getHours()).slice(-2) +
    ':' +
    ('0' + t.getMinutes()).slice(-2) +
    ')'

  return formatted
}

export const GtmToYYYYMMDD = (gtmTime: string) => {
  const formattedStr = moment(new Date(gtmTime)).format('DD/MM/YYYY')
  return formattedStr
}
