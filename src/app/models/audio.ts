import { IPagingResponse } from './common'

export interface IAudioResponse extends IPagingResponse {
  content?: IAudioOverall[]
}
export interface IAudioOverall {
  name?: string
  id?: number
  isDefault?: 0 | 1
  urlAudio?: string
  urlImage?: string
  author?: string
  performer?: string
  status?: 0 | 1
}

export type TitleAudios = keyof IAudioOverall | 'order' | 'action'
