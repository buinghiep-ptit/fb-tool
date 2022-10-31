import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  availableOrder,
  cancelOrder,
  fetchLogsActionDetail,
  fetchOrdersCancelRequests,
  fetchOrdersOverall,
  initCancelOrder,
  orderDetail,
  orderNote,
  orderUsed,
  paymentConfirm,
  reassignOrder,
  receiveCancelOrder,
  receiveOrder,
  refundOrder,
  unavailableOrder,
} from 'app/apis/order/order.service'
import { IOrderResponse } from 'app/models/order'

export const useOrdersData = (filters: any, type?: number) => {
  const isPending = type === 0 ? 1 : 0
  return useQuery<IOrderResponse, Error>(
    ['orders', filters, type],
    () =>
      type === 2
        ? fetchOrdersCancelRequests(filters)
        : fetchOrdersOverall({ ...filters, isPending }),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!filters,
    },
  )
}

export const useLogsActionOrderData = (filters: any) => {
  return useQuery<IOrderResponse, Error>(
    ['logs-order', filters],
    () => fetchLogsActionDetail(filters),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!filters,
    },
  )
}

export const useOrderDetailData = (orderId: number) => {
  return useQuery(['order-detail', orderId], () => orderDetail(orderId))
}

export const useReceiveOrder = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((orderId: number) => receiveOrder(orderId), {
    onSettled: () => {
      queryClient.invalidateQueries(['order-detail'])
      queryClient.invalidateQueries(['orders'])
      queryClient.invalidateQueries(['logs-order'])
    },
    onSuccess,
  })
}

export const useAvailableOrder = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((orderId: number) => availableOrder(orderId), {
    onSettled: () => {
      queryClient.invalidateQueries(['order-detail'])
      queryClient.invalidateQueries(['orders'])
      queryClient.invalidateQueries(['logs-order'])
    },
    onSuccess,
  })
}

export const useUnAvailableOrder = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((orderId: number) => unavailableOrder(orderId), {
    onSettled: () => {
      queryClient.invalidateQueries(['order-detail'])
      queryClient.invalidateQueries(['orders'])
      queryClient.invalidateQueries(['logs-order'])
    },
    onSuccess,
  })
}

export const useCancelOrder = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (payload: { orderId?: number; note?: string }) =>
      cancelOrder(payload.orderId ?? 0, { note: payload.note }),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['order-detail'])
        queryClient.invalidateQueries(['orders'])
        queryClient.invalidateQueries(['logs-order'])
      },
      onSuccess,
    },
  )
}

export const useReassignOrder = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (payload: { orderId?: number; userId?: number }) =>
      reassignOrder(payload.orderId ?? 0, payload.userId ?? 0),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['order-detail'])
        queryClient.invalidateQueries(['orders'])
        queryClient.invalidateQueries(['logs-order'])
      },
      onSuccess,
    },
  )
}

export const usePaymentConfirmOrder = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (params: { orderId?: number; payload?: any }) =>
      paymentConfirm(params.orderId ?? 0, params.payload),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['order-detail'])
        queryClient.invalidateQueries(['orders'])
        queryClient.invalidateQueries(['logs-order'])
      },
      onSuccess,
    },
  )
}

export const useOrderUsed = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((orderId: number) => orderUsed(orderId), {
    onSettled: () => {
      queryClient.invalidateQueries(['order-detail'])
      queryClient.invalidateQueries(['orders'])
      queryClient.invalidateQueries(['logs-order'])
    },
    onSuccess,
  })
}

export const useInitCancelOrder = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (params: { orderId?: number; payload?: any }) =>
      initCancelOrder(params.orderId ?? 0, params.payload),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['order-detail'])
        queryClient.invalidateQueries(['orders'])
        queryClient.invalidateQueries(['logs-order'])
      },
      onSuccess,
    },
  )
}

export const useReceiveCancelOrder = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation((orderId: number) => receiveCancelOrder(orderId), {
    onSettled: () => {
      queryClient.invalidateQueries(['order-detail'])
      queryClient.invalidateQueries(['orders'])
      queryClient.invalidateQueries(['logs-order'])
    },
    onSuccess,
  })
}

export const useRefundOrder = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (params: { orderId?: number; payload?: any }) =>
      refundOrder(params.orderId ?? 0, params.payload),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['order-detail'])
        queryClient.invalidateQueries(['orders'])
        queryClient.invalidateQueries(['logs-order'])
      },
      onSuccess,
    },
  )
}

export const useNoteOrder = (onSuccess?: any, onError?: any) => {
  const queryClient = useQueryClient()
  return useMutation(
    (payload: { orderId?: number; note?: string }) =>
      orderNote(payload.orderId ?? 0, { note: payload.note }),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['order-detail'])
        queryClient.invalidateQueries(['orders'])
        queryClient.invalidateQueries(['logs-order'])
      },
      onSuccess,
    },
  )
}
