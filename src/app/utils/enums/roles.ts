export enum ROLES {
  ADMIN = 1,
  CONTENT_MANAGER = 2,
  OPERATOR = 3,
  MEMBERSHIP_MANAGER = 4,
}

export const getRoleLabel = (role: number) => {
  if (!role) return 'N/a'
  switch (role) {
    case 1:
      return 'Admin'
      break
    case 2:
      return 'NV quản lý nội dung'
      break
    case 3:
      return 'NV vận hành'
      break
    case 4:
      return 'NV quản lý hội viên'
      break
    default:
      return 'N/a'
  }
}

export const roleOptions = [
  { id: 1, label: 'Admin' },
  { id: 2, label: 'NV quản lý nội dung' },
  { id: 3, label: 'NV vận hành' },
  { id: 4, label: 'NV quản lý hội viên' },
]
