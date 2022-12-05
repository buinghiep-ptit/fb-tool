import { IPagingResponse } from './common'

export interface IPolicyResponse extends IPagingResponse {
  content?: IPolicyOverall[]
}

export interface IPolicyOverall {
  id?: number
  name?: string
  campGroundNames?: string
  dateUpdated?: string
  scaleAmount?: number
  minAmount?: number | null
  maxAmount?: number | null
  scope?: number
  content?: string | null
}

export type TitlePolicies = keyof IPolicyOverall | 'order' | 'action'
