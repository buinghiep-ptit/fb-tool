export const DateTimeConverter = (unixTimestamp: number) => {
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
