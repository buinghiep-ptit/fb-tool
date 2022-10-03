import { yupResolver } from '@hookform/resolvers/yup'
import { IOrderDetail, IService } from 'app/models/order'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import * as Yup from 'yup'

type SchemaType = {
  dateStart?: string
  dateEnd?: string
  fullName?: string
  mobilePhone?: string
  email?: string
  services?: IService[]
}

export const useRHFOrder = (order: IOrderDetail) => {
  useEffect(() => {
    if (order) {
      defaultValues.dateStart = order.dateStart
      defaultValues.dateEnd = order.dateEnd
      defaultValues.fullName = order.contact.fullName
      defaultValues.mobilePhone = order.contact.mobilePhone
      defaultValues.email = order.contact.email
      defaultValues.services = order.services

      methods.reset({ ...defaultValues })
    }
  }, [order])

  const [defaultValues] = useState<SchemaType>({})

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Tên không được bỏ trống'),
    dateStart: Yup.date()
      .typeError('Sai dịnh dạng.')
      .nullable()
      .required('Chọn ngày bắt đầu'),
    dateEnd: Yup.date()
      .when('startDate', (startDate, yup) => {
        if (startDate && startDate != 'Invalid Date') {
          const dayAfter = new Date(startDate.getTime() + 86400000)
          return yup.min(dayAfter, 'Ngày kết thúc phải lớn hơn ngày đắt đầu')
        }
        return yup
      })
      .typeError('Sai định dạng.')
      .nullable()
      .required('Chọn ngày kết thúc.'),
    services: Yup.lazy(() =>
      Yup.array().of(
        Yup.object().shape({
          quantity: Yup.number().required('Quantity is required'),
          // prop1: yup.string().required(), // validate each object's entry
          // prop2: yup.number().required(), // independently
        }),
      ),
    ),
  })

  const methods = useForm<SchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { fields, append, remove } = useFieldArray<SchemaType>({
    name: 'services',
    control: methods.control,
  })

  useEffect(() => {
    const currentProp = order?.services.length || 0
    const previousProp = fields.length
    if (currentProp > previousProp) {
      for (let i = previousProp; i < currentProp; i++) {
        append({ quantity: 0 })
      }
    } else {
      for (let i = previousProp; i > currentProp; i--) {
        remove(i - 1)
      }
    }
  }, [order?.services, fields])

  return [methods as any, fields as any] as const
}
