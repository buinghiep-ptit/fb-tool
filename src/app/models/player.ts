import { IPagingResponse } from './common'
export interface TitlePlayer {
  name?: string
  id?: number
  idTeam?: number
  priority?: number
  position?: string
  height?: number
  dateJoined?: string
  dateOfBirth?: string
  capacity?: number
  status?: number
}
export type TitleServices = keyof TitlePlayer | 'order' | 'action'

export interface PlayerResponse extends IPagingResponse {
  content?: TitlePlayer[]
}
