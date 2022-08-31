import { IPagingResponse } from './'

export interface IAccountResponse extends IPagingResponse {
  content?: IAccount[]
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

export type TitleAccounts = keyof IAccount | 'order' | 'action'
