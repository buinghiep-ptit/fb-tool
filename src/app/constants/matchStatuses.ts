export const MATCH_STATUSES = {
  NOT_START: {
    id: 0,
    label: 'Chưa diễn ra',
    background: 'orange',
    color: 'white',
  },
  WAIT_UPDATE: {
    id: 5,
    label: 'Chờ cập nhật',
    background: 'orange',
    color: 'white',
  },
  STARTING: {
    id: 1,
    label: 'Đang diễn ra',
    background: 'limegreen',
    color: 'white',
  },
  ENDED: { id: 2, label: 'Kết thúc', background: 'royalBlue', color: 'white' },
  PENDING: { id: 3, label: 'Hoãn', background: 'gray', color: 'white' },
  CANCEL: { id: 4, label: 'Hủy', background: 'red', color: 'white' },
}

export const findMatchStatus = (id: any) => {
  return Object.values(MATCH_STATUSES).find(type => type.id === id)
}
