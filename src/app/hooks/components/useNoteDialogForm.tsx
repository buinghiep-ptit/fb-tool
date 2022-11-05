import { yupResolver } from '@hookform/resolvers/yup'
import { LinearProgress, Stack } from '@mui/material'
import { BoxWrapperDialog } from 'app/components/common/BoxWrapperDialog'
import FormTextArea from 'app/components/common/MuiRHFTextarea'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { messages } from 'app/utils/messages'
import { FormProvider, useForm } from 'react-hook-form'
import * as Yup from 'yup'

type SchemaType = {
  note?: string
}

const useNoteDialogForm = (name = 'note') => {
  const validationSchema = Yup.object().shape({
    note: Yup.string().required(messages.MSG1),
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
          {isLoading && <LinearProgress />}
        </>
      </BoxWrapperDialog>
    )
  }
  return [getContent, methods] as any
}

export default useNoteDialogForm
