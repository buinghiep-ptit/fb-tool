import { Controller, useFormContext } from 'react-hook-form'
import WYSIWYGEditor from './WYSIWYGEditor'
// import { stripHtml } from 'string-strip-html'

type Props = {
  name: string
  defaultValue?: any
  resetEditor?: (x: boolean) => void
}

const RHFWYSIWYGEditor = ({ name, resetEditor, ...props }: Props) => {
  const {
    formState: { errors },
    control,
  } = useFormContext()

  return (
    <Controller
      render={({ field }) => <WYSIWYGEditor {...field} />}
      name={name}
      control={control}
      defaultValue=""
      // rules={{
      //   validate: {
      //     required: v =>
      //       (v && stripHtml(v).result.length > 0) || 'Description is required',
      //     maxLength: v =>
      //       (v && stripHtml(v).result.length <= 2000) ||
      //       'Maximum character limit is 2000',
      //   },
      // }}
    />
  )
}

export default RHFWYSIWYGEditor
