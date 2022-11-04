import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  changeAudioIsDefault,
  changeAudioStatus,
  checkExistedName,
  createAudio,
  deleteAudio,
  updateAudio,
} from 'app/apis/audio/audio.service'
import { IAudioOverall } from 'app/models/audio'

export const useCreateAudio = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((payload: IAudioOverall) => createAudio(payload), {
    onSettled: () => {
      queryClient.invalidateQueries(['audios'])
    },
    onSuccess,
  })
}

export const useUpdateAudio = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((params: any) => updateAudio(params.id, params.payload), {
    onSettled: () => {
      queryClient.invalidateQueries(['audios'])
      queryClient.invalidateQueries(['audio'])
    },
    onSuccess,
  })
}

export const useChangeIsDefaultAudio = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((audioId?: number) => changeAudioIsDefault(audioId), {
    onSettled: () => {
      queryClient.invalidateQueries(['audios'])
      queryClient.invalidateQueries(['audio'])
    },
    onSuccess,
  })
}

export const useChangeStatusAudio = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((audioId?: number) => changeAudioStatus(audioId), {
    onSettled: () => {
      queryClient.invalidateQueries(['audios'])
      queryClient.invalidateQueries(['audio'])
    },
    onSuccess,
  })
}

export const useDeleteAudio = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((audioId: number) => deleteAudio(audioId), {
    onSettled: () => {
      queryClient.invalidateQueries(['audios'])
      queryClient.invalidateQueries(['audio'])
    },
    onSuccess,
  })
}

// export const useCheckExistedName = (nameAudios?: string) => {
//   return useQuery(
//     ['check-name', nameAudios],
//     () => checkExistedName({ nameAudios }),
//     {
//       enabled: !!nameAudios,
//       staleTime: 0,
//       cacheTime: 0,
//     },
//   )
// }
