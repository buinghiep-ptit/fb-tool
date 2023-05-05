export const MATCH_PROCESS_TYPES = {
  START: { id: 1, label: 'Bắt đầu trận đấu' },
  INJURY: { id: 2, label: 'Chấn thương' },
  RED_CARD: { id: 3, label: 'Thẻ đỏ' },
  YELLOW_CARD: { id: 4, label: 'Thẻ vàng' },
  END_ROUND1: { id: 5, label: 'Hết hiệp 1' },
  OPPOTUNITY: { id: 6, label: 'Cơ hội' },
  SCORED: { id: 7, label: 'Vào' },
  SUBSTITUTE: { id: 8, label: 'Thay cầu thủ' },
  COMMENT: { id: 9, label: 'Bình luận' },
  START_ROUND2: { id: 10, label: 'Bắt đầu hiệp 2' },
  END: { id: 11, label: 'Trận đấu kết thúc' },
}

export const findMatchProcessType = (id: any) => {
  return Object.values(MATCH_PROCESS_TYPES).find(type => type.id === id)
}
