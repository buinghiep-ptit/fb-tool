import { yupResolver } from '@hookform/resolvers/yup'
import { IOrderDetail } from 'app/models/order'
import { messages } from 'app/utils/messages'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

type SchemaType = {
  fullName?: string
  mobilePhone?: string
  email?: string
  note?: string
  paymentType?: 1 | 2
}

export const useRHFOrder = (order: IOrderDetail) => {
  useEffect(() => {
    if (order) {
      defaultValues.fullName = order.contact?.fullName
      defaultValues.mobilePhone = order.contact?.mobilePhone
      defaultValues.email = order.contact?.email ?? ''
      defaultValues.note = order.note ?? ''
      defaultValues.paymentType = order.paymentType

      methods.reset({ ...defaultValues })
    }
  }, [order])

  const [defaultValues] = useState<SchemaType>({})

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required(messages.MSG1)
      .max(255, 'Nội dung không được vượt quá 255 ký tự'),
    mobilePhone: Yup.string()
      .required(messages.MSG1)
      .test('check valid', 'Số điện thoại không hợp lệ', phone => {
        const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
        if (!phone) {
          return true
        }
        return regex.test(phone as string)
      }),
    email: Yup.string().email(messages.MSG12),
    note: Yup.string().max(255, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<SchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  return [methods as any] as const
}
