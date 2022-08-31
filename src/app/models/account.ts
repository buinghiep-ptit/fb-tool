import { IPagingResponse } from './'

export interface IAccountResponse extends IPagingResponse {
  content?: IAccount[]
}
export interface ICustomerResponse extends IPagingResponse {
  content?: ICustomer[]
}
export interface IAccount {
  id?: number
  account?: string
  email?: string
  role?: number
  dateUpdated?: number
  userUpdated?: string
  status?: number
}

export interface ICustomer {
  id?: number
  phoneNumber?: string
  displayName?: string
  email?: string
  accountType?: 0 | 1
  dateCreated?: number
  dateUpdated?: number
  status?: number
}

export type TitleAccounts = keyof IAccount | 'order' | 'action'
export type TitleCustomers = keyof ICustomer | 'order' | 'action'
