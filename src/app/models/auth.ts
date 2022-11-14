export interface IAuthPayload {
  email?: string
  password?: string
  rememberMe?: boolean
}

export interface IProfile {
  id?: number
  email?: string
  userType?: number
  status?: number
  langKey?: string
  createdBy?: number
  lastModifiedBy?: number
  dateCreated?: string
  dateUpdated?: string
  authorities?: number[]
}
