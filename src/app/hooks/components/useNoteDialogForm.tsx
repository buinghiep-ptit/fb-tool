import { yupResolver } from '@hookform/resolvers/yup'
import { Stack } from '@mui/material'
import { BoxWrapperDialog } from 'app/components/common/BoxWrapperDialog'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { messages } from 'app/utils/messages'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

type SchemaType = {
  note?: string
}

const useNoteDialogForm = (name = 'note', required = false) => {
  const validationSchema = Yup.object().shape({
    note: required
      ? Yup.string()
          .required(messages.MSG1)
          .max(255, 'Nội dung không được vượt quá 255 ký tự')
      : Yup.string().max(255, 'Nội dung không được vượt quá 255 ký tự'),
  })

  const methods = useForm<SchemaType>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const getContent = (isLoading?: boolean) => {
    return (
      <BoxWrapperDialog>
        <>
          <FormProvider {...methods}>
            <Stack gap={1.5}>
              <MuiTypography variant="subtitle2">Ghi chú*:</MuiTypography>
              <FormTextArea
                name={name}
                defaultValue={''}
                placeholder="Nội dung"
              />
            </Stack>
          </FormProvider>
        </>
      </BoxWrapperDialog>
    )
  }
  return [getContent, methods] as any
}

export default useNoteDialogForm
