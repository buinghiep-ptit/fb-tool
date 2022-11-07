import { yupResolver } from '@hookform/resolvers/yup'
import {
  Grid,
  Icon,
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
  styled,
} from '@mui/material'
import { Box } from '@mui/system'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { getHandbookDetail } from 'app/apis/handbook/handbook.service'
import { Breadcrumb, SimpleCard } from 'app/components'
import { MuiButton } from 'app/components/common/MuiButton'
import MuiLoading from 'app/components/common/MuiLoadingApp'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import { MuiTypography } from 'app/components/common/MuiTypography'
import RHFWYSIWYGEditor from 'app/components/common/RHFWYSIWYGEditor'
import { toastSuccess } from 'app/helpers/toastNofication'
import {
  useCreateHandbook,
  useDeleteHandbook,
  useUpdateHandbook,
} from 'app/hooks/queries/useHandbooksData'
import { IHandbookDetail } from 'app/models/handbook'
import { messages } from 'app/utils/messages'
import { useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { DiagLogConfirm } from '../orders/details/ButtonsLink/DialogConfirm'
import UnlinkedCampgrounds from './UnlinkedCampgrounds'

export interface Props {}

type SchemaType = {
  title?: string
  status?: number
  editor_content?: string
}

const Container = styled('div')<Props>(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))

export default function AddEvent(props: Props) {
  const navigate = useNavigate()
  const { handbookId } = useParams()

  const [dialogData, setDialogData] = useState<{
    title?: string
    message?: string
    type?: string
    isLinked?: number
    submitText?: string
    cancelText?: string
  }>({})
  const [openDialog, setOpenDialog] = useState(false)

  const [defaultValues] = useState<SchemaType>({
    status: 1,
  })

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required(messages.MSG1)
      .max(255, 'Nội dung không được vượt quá 255 ký tự'),
    editor_content: Yup.string().required(messages.MSG1),
  })

  const methods = useForm<SchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const {
    data: handbook,
    isLoading,
    fetchStatus,
    isError,
    error,
  }: UseQueryResult<IHandbookDetail, Error> = useQuery<IHandbookDetail, Error>(
    ['handbook', handbookId],
    () => getHandbookDetail(Number(handbookId ?? 0)),
    {
      enabled: !!handbookId,
      staleTime: 5 * 60 * 1000,
    },
  )

  useEffect(() => {
    initDefaultValues(handbook)
  }, [handbook])

  const initDefaultValues = (handbook?: IHandbookDetail) => {
    if (handbook) {
      defaultValues.title = handbook.title
      defaultValues.status = handbook.status
      defaultValues.editor_content = handbook.content
    }
    methods.reset({ ...defaultValues })
  }

  const onSubmitHandler: SubmitHandler<SchemaType> = (values: SchemaType) => {
    const payload: IHandbookDetail = {
      title: values.title,
      status: Number(values.status),
      content: values.editor_content,
    }
    if (handbookId) {
      edit({ ...payload, id: Number(handbookId) })
    } else {
      add(payload)
    }
  }
  const onRowUpdateSuccess = (data: any, message?: string) => {
    toastSuccess({ message: message ?? '' })
    navigate(-1)
    methods.reset()
  }
  const { mutate: add, isLoading: createLoading } = useCreateHandbook(() =>
    onRowUpdateSuccess(null, 'Thêm mới thành công'),
  )

  const { mutate: edit, isLoading: editLoading } = useUpdateHandbook(() =>
    onRowUpdateSuccess(null, 'Cập nhật thành công'),
  )

  const { mutate: deleteHandbook } = useDeleteHandbook(() =>
    onRowUpdateSuccess(null, 'Xoá thành công'),
  )

  const openDeleteDialog = () => {
    setDialogData(prev => ({
      ...prev,
      title: 'Xoá cẩm nang',
      message: 'Bạn có chắc chắn muốn xoá cẩm nang?',
      type: 'delete',
    }))
    setOpenDialog(true)
  }

  const openLinkedCampgrounds = () => {
    setDialogData(prev => ({
      ...prev,
      title: 'Điểm camping đã liên kết',
      type: 'linked',
      isLinked: 1,
      submitText: 'Lưu',
      cancelText: 'Huỷ',
    }))
    setOpenDialog(true)
  }

  const openUnlinkedCampgrounds = () => {
    setDialogData(prev => ({
      ...prev,
      title: 'Thêm điểm camp',
      type: 'unlinked',
      isLinked: handbook ? 0 : -1,
      submitText: 'Lưu',
      cancelText: 'Huỷ',
    }))
    setOpenDialog(true)
  }

  const onSubmitDialog = () => {
    switch (dialogData.type) {
      case 'linked':
        // deleteHandbook(row.id)
        break
        break
      case 'toggle-pin':
        // togglePin(row.id)
        break

      case 'delete':
        deleteHandbook(Number(handbookId))
        break
        break

      default:
        break
    }
  }

  if (isLoading && fetchStatus === 'fetching') return <MuiLoading />

  if (isError)
    return (
      <Box my={2} textAlign="center">
        <MuiTypography variant="h5">
          Have an errors: {error.message}
        </MuiTypography>
      </Box>
    )
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý cẩm nang', path: '/quan-ly-cam-nang' },
            { name: handbookId ? 'Chi tiết cẩm nang' : 'Thêm mới cẩm nang' },
          ]}
        />
      </Box>
      <Stack
        flexDirection={'row'}
        gap={2}
        sx={{ position: 'fixed', right: '48px', top: '80px', zIndex: 999 }}
      >
        <MuiButton
          title="Lưu"
          variant="contained"
          color="primary"
          onClick={methods.handleSubmit(onSubmitHandler)}
          loading={createLoading || editLoading}
          startIcon={<Icon>done</Icon>}
        />
        <MuiButton
          title="Huỷ"
          variant="contained"
          color="warning"
          onClick={() => handbook && initDefaultValues(handbook)}
          startIcon={<Icon>cached</Icon>}
        />

        {handbookId && (
          <MuiButton
            title="Xoá"
            variant="contained"
            color="error"
            onClick={openDeleteDialog}
            startIcon={<Icon>delete</Icon>}
          />
        )}

        <MuiButton
          title="Quay lại"
          variant="contained"
          color="inherit"
          onClick={() => navigate(-1)}
          startIcon={<Icon>keyboard_return</Icon>}
        />
      </Stack>

      <SimpleCard>
        <form
          onSubmit={methods.handleSubmit(onSubmitHandler)}
          noValidate
          autoComplete="off"
        >
          <FormProvider {...methods}>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <Stack gap={3}>
                  {(createLoading || editLoading) && (
                    <LinearProgress sx={{ mt: 0.5 }} />
                  )}

                  <Stack>
                    <FormInputText
                      type="text"
                      name="title"
                      label={'Tiêu đề'}
                      defaultValue=""
                      placeholder="Nhập tiêu đề cẩm nang"
                      fullWidth
                      required
                    />
                  </Stack>
                </Stack>
              </Grid>

              <Grid item sm={3}>
                <SelectDropDown name="status" label="Trạng thái">
                  <MenuItem value="1">Hoạt động</MenuItem>
                  <MenuItem value="0">Khoá</MenuItem>
                </SelectDropDown>
              </Grid>
            </Grid>
            <Stack
              direction={'row'}
              my={1.5}
              gap={1.5}
              justifyContent="space-between"
            >
              <MuiButton
                title="Xem điểm camping đã liên kết"
                variant="text"
                color="primary"
                onClick={() => openLinkedCampgrounds()}
                endIcon={<Icon>double_arrow</Icon>}
              />
              <MuiButton
                title="Thêm điểm camping"
                variant="text"
                color="primary"
                onClick={() => openUnlinkedCampgrounds()}
                startIcon={<Icon>add</Icon>}
              />
            </Stack>
            <Stack>
              <MuiTypography variant="subtitle2" pb={1}>
                Nội dung*
              </MuiTypography>
              <RHFWYSIWYGEditor name="editor_content" />
            </Stack>
          </FormProvider>
        </form>
      </SimpleCard>

      <DiagLogConfirm
        title={dialogData.title ?? ''}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={dialogData.type !== 'delete' ? undefined : onSubmitDialog}
        maxWidth={dialogData.type !== 'delete' ? 'md' : 'sm'}
        submitText={dialogData.type !== 'delete' ? undefined : 'Xoá'}
        cancelText={'Huỷ'}
      >
        {dialogData.type !== 'delete' ? (
          <UnlinkedCampgrounds
            handbook={handbook}
            isLinked={dialogData.isLinked}
          />
        ) : (
          <Stack py={5} justifyContent={'center'} alignItems="center">
            <MuiTypography variant="subtitle1">
              {dialogData.message ?? ''}
            </MuiTypography>
            <MuiTypography variant="subtitle1" color="primary">
              {handbook?.title}
            </MuiTypography>
          </Stack>
        )}
      </DiagLogConfirm>
    </Container>
  )
}
