import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateOrder } from 'app/apis/order/order.service'

export const useUpdateOrder = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (payload: Record<string, any>) => updateOrder(payload.id, payload),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['order'])
        queryClient.invalidateQueries(['orders'])
      },
      onSuccess,
    },
  )
}
