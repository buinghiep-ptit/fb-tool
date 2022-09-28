import * as Yup from 'yup'

export const baseSchema = Yup.object().shape({
  id: Yup.string().required(),
  name: Yup.string().required(),
})
