export interface Banner {
  id?: number
  priority?: number // vị trí hiển thị trên Home
  titlePosition?: number // 0: không hiển thị, 1: trái, 2: giữa, 3: phải
  status?: number
  type?: number // 1: ảnh, 2: video
  butonPosition?: number
  title?: string
  titleColor?: string // mã màu
  dateCreated?: string
  mediaUrl?: string
  url?: string
  buttonContent?: string
  butonColor?: string
}
export interface BannerDetail {
  id?: number
  title?: string
  titlePosition?: number // 0: không hiển thị, 1: trái, 2: giữa, 3: phải
  titleColor?: string // mã màu
  buttonContent?: string
  butonColor?: string
  type?: number // 1: ảnh, 2: video
  butonPosition?: number
  mediaUrl?: string
  url?: string
}
