export const MEMBER_STATUSES = {
  PENDING: { id: 0, label: 'Chờ xử lý', color: 'royalBlue' },
  APPROVED: { id: 1, label: 'Hoàn thành', color: 'limegreen' },
  REJECTED: { id: -1, label: 'Hủy', color: 'red' },
}

export const findMemberStatus = (id: any) => {
  return Object.values(MEMBER_STATUSES).find(type => type.id === id)
}
