import { IPagingResponse } from './common'

export interface IAudioResponse extends IPagingResponse {
  content?: IConfigOverall[]
}
export interface IConfigOverall {
  id_CONFIG?: string
  str_VALUE?: string
  str_DESCRIPTION?: string
  status?: number
}

export type TitleConfigs = keyof IConfigOverall | 'order' | 'action'
