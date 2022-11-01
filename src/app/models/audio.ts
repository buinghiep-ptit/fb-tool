import { IPagingResponse } from './common'

export interface IAudioResponse extends IPagingResponse {
  content?: IAudioOverall[]
}
export interface IAudioOverall {
  name?: string
  id?: number
  isDefault?: 0 | 1
  urlAudio?: string
  duration?: number | null
  urlImage?: string | null
  author?: string | null
  performer?: string | null
  status?: number
}

export type TitleAudios = keyof IAudioOverall | 'order' | 'action'
