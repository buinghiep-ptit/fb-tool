import { useMutation } from '@tanstack/react-query'
import { changePasswordCustomer } from 'app/apis/accounts/customer.service'

export const useUpdatePasswordCustomer = (onSuccess?: any, onError?: any) => {
  return useMutation(
    (params: {
      payload: { newPassword: string }
      customerId: number | string
    }) => changePasswordCustomer(params.customerId, params.payload),
    {
      onSuccess,
    },
  )
}
