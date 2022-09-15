import { IPagingResponse } from './'

export interface IUserResponse extends IPagingResponse {
  content?: IUser[]
}
export interface ICustomerResponse extends IPagingResponse {
  content?: ICustomer[]
}

export interface ILogsCustomerResponse extends IPagingResponse {
  content?: ILogsActionCustomer[]
}

export interface IUser {
  userId?: number
  email?: string
  role?: number
  updateDate?: number
  updateBy?: string
  status?: number
}

export interface ICustomer {
  id?: number
  mobilePhone?: string
  displayName?: string
  email?: string
  customerType?: number
  dateCreated?: number
  dateUpdated?: number
  status?: number
}

export interface ICustomerDetail {
  email?: string
  mobilePhone?: string
  fullName?: string
  registeredBy?: string | null
  lastLoginDate?: string | null
  referralCode: string | null
  avatar?: string
  following?: number
  followers?: number
  type?: number
  status?: number
  otpCount?: OtpCount[]
}

export type OtpCount = {
  type?: number
  numToday?: number
  maxPerDay?: number
}

export interface ILogsActionCustomer {
  id?: number
  processName?: string
  actionDate?: string
  note?: string
  requestStatus?: string
  email?: string
}

export type TitleUsers = keyof IUser | 'order' | 'action'
export type TitleCustomers = keyof ICustomer | 'order' | 'action'
export type TitleLogCustomers = keyof ILogsActionCustomer | 'order' | 'action'
