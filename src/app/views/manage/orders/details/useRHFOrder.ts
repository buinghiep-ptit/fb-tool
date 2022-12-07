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

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .required(messages.MSG1)
      .max(255, 'Nội dung không được vượt quá 255 ký tự'),
    mobilePhone: Yup.string()
      .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
      .min(10, 'Số điện thoại chứa ít nhất 10 chữ số')
      .max(10, 'Số điện thoại vượt quá 10 chữ số')
      .required(messages.MSG1),
    email: Yup.string()
      .email(messages.MSG12)
      .max(255, 'Nội dung không được vượt quá 255 ký tự'),
    note: Yup.string().max(255, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<SchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  return [methods as any] as const
}
