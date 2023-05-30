import { yupResolver } from '@hookform/resolvers/yup'
import BackupIcon from '@mui/icons-material/Backup'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Button,
  DialogActions,
  FormHelperText,
  FormLabel,
  IconButton,
  LinearProgress,
  TextField,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Box } from '@mui/system'
import { createLogo } from 'app/apis/logos/logos.service'
import handleUploadImage from 'app/helpers/handleUploadImage'
import { toastSuccess } from 'app/helpers/toastNofication'
import { isUrl } from 'app/utils/utils'
import * as React from 'react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

export interface Props {
  type: number
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  refresh: () => void
}

const DialogCreateLogo = React.forwardRef((props: Props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [file, setFile] = useState<any>()
  const [previewImage, setPreviewImage] = useState<string>('')

  React.useImperativeHandle(ref, () => ({
    handleClickOpen: () => {
      setOpen(true)
    },
    handleClose: () => {
      setOpen(false)
      methods.reset()
      setFile(null)
      setPreviewImage('')
    },
  }))

  const handleClose = () => {
    setOpen(false)
    methods.reset()
    setFile(null)
    setPreviewImage('')
  }

  const schema = yup
    .object({
      strUrl: yup
        .string()
        .trim()
        .test('url', 'Link không hợp lệ', value => {
          if (value) return isUrl(value)
          else return true
        }),
      file: yup
        .mixed()
        .required('Giá trị bắt buộc')
        .test('fileType', 'File không hợp lệ', value => {
          if (value && value.name)
            return ['svg', 'svgz'].includes(value?.name?.split('.').pop())
          else return true
        })
        .test('fileSize', 'Dung lượng file <= 10MB', value => {
          return Math.floor(value?.size / 1000000) <= 50
        }),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      strUrl: '',
      file: null,
    },
  })

  const onSubmit = async (data: any) => {
    props.setIsLoading(true)
    let logo: any = ''
    if (file) {
      logo = await handleUploadImage(file, 'png')
    }

    const payload: any = {
      strUrl: data.strUrl,
      logo: logo,
      status: 1,
      type: props.type,
    }

    await createLogo(payload)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
        props.refresh()
        handleClose()
      })
      .catch(() => {})
      .finally(() => {
        props.setIsLoading(false)
      })
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        {props.isLoading && (
          <Box
            sx={{
              width: '100%',
              position: 'fixed',
              top: '0',
              left: '0',
              zIndex: '1000',
            }}
          >
            <LinearProgress />
          </Box>
        )}
        <DialogTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              {props.type === 1
                ? 'Thêm mới logo nhà tài trợ chính'
                : 'Thêm mới logo nhà tài trợ thường'}
            </div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <FormLabel error={!!methods.formState.errors?.file}>
              Logo*:
            </FormLabel>
            <input
              type="file"
              accept="image/svg+xml"
              id="uploadImage"
              style={{ display: 'none' }}
              onChange={(event: any) => {
                methods.setValue('file', event.target.files[0])
                methods.trigger('file')
                if (!!event.target.files[0]) {
                  setFile(event.target.files[0])
                  setPreviewImage(
                    window.URL.createObjectURL(event.target.files[0]),
                  )
                }
              }}
            />
            <div
              onClick={() => {
                const inputUploadImage = document.getElementById(
                  'uploadImage',
                ) as HTMLInputElement | null
                inputUploadImage?.click()
              }}
              style={{
                width: '100%',
                minHeight: '300px',
                border: '2px dashed gray',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: previewImage?.length === 0 ? '' : 'tomato',
              }}
            >
              {!file && previewImage?.length === 0 && (
                <div
                  style={{
                    marginTop: '10px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div>Chọn ảnh để tải lên</div>
                  <BackupIcon fontSize="large" />
                  <div>Định dạng: SVG</div>
                  <div>Lưu ý logo cần để màu trắng</div>
                </div>
              )}
              {previewImage?.length !== 0 && (
                <>
                  <div style={{ textAlign: 'right' }}>
                    <IconButton
                      aria-label="delete"
                      size="large"
                      style={{ position: 'relative' }}
                      // onClick={event => {
                      //   setFile(null)
                      //   setPreviewImage('')
                      //   methods.setValue('file', null)
                      //   methods.trigger('file')
                      //   event.stopPropagation()
                      // }}
                    >
                      <img
                        src={previewImage}
                        width="100%"
                        style={{ objectFit: 'contain' }}
                      ></img>
                    </IconButton>
                  </div>
                </>
              )}
            </div>
            {!!methods.formState.errors?.file?.message && (
              <FormHelperText error={true}>
                {methods.formState.errors?.file.message}
              </FormHelperText>
            )}
          </Box>

          <Controller
            name="strUrl"
            control={methods.control}
            render={({ field }) => (
              <TextField
                error={!!methods.formState.errors?.strUrl}
                helperText={methods.formState.errors?.strUrl?.message}
                {...field}
                label="Link"
                variant="outlined"
                margin="normal"
                fullWidth
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ textAlign: 'center' }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={props.isLoading}
          >
            Đóng
          </Button>
          <Button
            onClick={methods.handleSubmit(onSubmit)}
            autoFocus
            variant="contained"
            disabled={props.isLoading}
          >
            {props.isLoading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

export default DialogCreateLogo
