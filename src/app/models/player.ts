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
  status?: number
}
export type TitleServices = keyof TitlePlayer | 'order' | 'action'
