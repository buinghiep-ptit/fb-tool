export const VIDEO_TYPES = {
  HIGHLIGHT: { id: 1, label: 'Highligh' },
  TEAM: { id: 2, label: 'Đội bóng' },
  PLAYER: { id: 3, label: 'Cầu thủ' },
  PRODUCT: { id: 4, label: 'Sản phẩm' },
  OTHER: { id: 5, label: 'Khác' },
}

export const findVideoType = (id: any) => {
  return Object.values(VIDEO_TYPES).find(type => type.id === id)
}
