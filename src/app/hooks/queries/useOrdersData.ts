import { useQuery } from '@tanstack/react-query'
import { fetchActionsHistory } from 'app/apis/feed/feed.service'
import {
  fetchLogsActionDetail,
  fetchOrdersCancelRequests,
  fetchOrdersOverall,
  orderDetail,
} from 'app/apis/order/order.service'
import { IOrderResponse } from 'app/models/order'

export const useOrdersData = (
  filters: any,
  type?: number,
  onSuccess?: any,
  onError?: any,
) => {
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

export const useLogsActionOrderData = (
  filters: any,
  onSuccess?: any,
  onError?: any,
) => {
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
