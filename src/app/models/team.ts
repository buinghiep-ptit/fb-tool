import { IPagingResponse } from './common'

export interface Team {
  name?: string
  id?: number
  logo?: string
  type?: number
  status?: number
}
export interface TeamResponse extends IPagingResponse {
  content?: Team[]
}
