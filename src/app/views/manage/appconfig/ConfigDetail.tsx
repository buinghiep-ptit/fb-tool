import { yupResolver } from '@hookform/resolvers/yup'
import { Grid, Stack } from '@mui/material'
import { BoxWrapperDialog } from 'app/components/common/BoxWrapperDialog'
import FormInputText from 'app/components/common/MuiRHFInputText'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useCreateConfig,
  useUpdateConfig,
} from 'app/hooks/queries/useConfigsData'
import { IConfigOverall } from 'app/models/config'
import { messages } from 'app/utils/messages'
import React, { useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type Props = {
  title: string
}

type SchemaType = {
  idConfig?: string
  value?: string
  description?: string
  status?: number
}

export default function ConfigDetail({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const config = (location.state?.data as IConfigOverall) ?? {}
  const { configId } = useParams()

  const [defaultValues] = useState<SchemaType>({
    status: 1,
  })

  useEffect(() => {
    if (config && !!Object.keys(config).length) {
      defaultValues.idConfig = config.id_CONFIG
      defaultValues.value = config.str_VALUE ?? ''
      defaultValues.description = config.str_DESCRIPTION ?? ''
      methods.reset({ ...defaultValues })
    }
  }, [config])

  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    navigate(-1)
  }

  const validationSchema = Yup.object().shape({
    idConfig: Yup.string()
      .max(255, 'Nội dung không được vượt quá 255 ký tự')
      .required(messages.MSG1),
    value: Yup.string().max(255, 'Nội dung không được vượt quá 255 ký tự'),
    description: Yup.string().max(
      255,
      'Nội dung không được vượt quá 255 ký tự',
    ),
  })

  const methods = useForm<SchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const { mutate: create, isLoading: createLoading } = useCreateConfig(() =>
    onSuccess(null, 'Thêm thành công'),
  )

  const { mutate: update, isLoading: updateLoading } = useUpdateConfig(() =>
    onSuccess(null, 'Cập nhật thành công'),
  )

  const onSubmitHandler: SubmitHandler<SchemaType> = async (
    values: SchemaType,
  ) => {
    const payload = {
      value: values.value || undefined,
      description: values.description || undefined,
    }

    if (configId) {
      update({ configId: configId ?? '', payload: payload })
    } else {
      create({ ...payload, idConfig: values.idConfig } as any)
    }
  }

  const handleClose = () => {
    navigate(-1)
  }

  const getContent = () => {
    return (
      <BoxWrapperDialog>
        <FormProvider {...methods}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack my={3} gap={3}>
                <FormInputText
                  type="text"
                  label={'id_CONFIG'}
                  name="idConfig"
                  placeholder="Nhập id_CONFIG"
                  defaultValue=""
                  required
                  disabled={!!configId}
                  clearIcon={!configId}
                />

                <FormInputText
                  type="text"
                  label={'Giá trị'}
                  name="value"
                  placeholder="Nhập giá trị"
                  defaultValue=""
                />
                <FormInputText
                  type="text"
                  label={'Mô tả'}
                  name="description"
                  placeholder="Nhập mô tả"
                  defaultValue=""
                />
              </Stack>
            </Grid>
          </Grid>
        </FormProvider>
      </BoxWrapperDialog>
    )
  }

  return (
    <React.Fragment>
      <MuiStyledModal
        title={title}
        open={isModal}
        onCloseModal={handleClose}
        isLoading={createLoading || updateLoading}
        maxWidth={'sm'}
        onSubmit={methods.handleSubmit(onSubmitHandler)}
        submitText="Lưu"
        cancelText="Quay lại"
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
