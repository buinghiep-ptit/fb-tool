export const NEWS_TYPES = {
  MATCH: { id: 1, label: 'Trận đấu' },
  TEAM: { id: 2, label: 'Đội bóng' },
  INTERVIEW: { id: 3, label: 'Phỏng vấn' },
  PRODUCT: { id: 4, label: 'Sản phẩm' },
  MEMBERSHIP: { id: 5, label: 'Cổ động viên' },
  OTHER: { id: 6, label: 'Khác' },
}

export const findNewsType = (id: any) => {
  return Object.values(NEWS_TYPES).find(type => type.id === id)
}
