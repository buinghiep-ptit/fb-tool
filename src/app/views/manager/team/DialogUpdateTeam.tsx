import { yupResolver } from '@hookform/resolvers/yup'
import { AddPhotoAlternate } from '@mui/icons-material'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Button,
  Checkbox,
  DialogActions,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Box } from '@mui/system'
import { getTeamDetail, updateTeam } from 'app/apis/teams/teams.service'
import handleUploadImage from 'app/helpers/handleUploadImage'
import { toastSuccess } from 'app/helpers/toastNofication'
import * as React from 'react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  refresh: () => void
  teamId: number
}

const DialogUpdateTeam = React.forwardRef((props: Props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [file, setFile] = useState<any>()
  const [previewImage, setPreviewImage] = useState<string>('')
  const [team, setTeam] = useState<any>()

  React.useImperativeHandle(ref, () => ({
    handleClickOpen: () => {
      setOpen(true)
    },
    handleClose: () => {
      setOpen(false)
    },
  }))

  const handleClose = () => {
    setOpen(false)
    methods.reset()
  }

  const initDefaultValues = (team: any) => {
    const defaultValues: any = {}
    defaultValues.name = team.name
    defaultValues.shortName = team.shortName
    defaultValues.homeField = team.homeField || ''
    defaultValues.logo = team.logo
    defaultValues.status = team.status
    defaultValues.type = team.type
    defaultValues.isMain = team.isMain
    defaultValues.file = team.logo
    setPreviewImage(team.logo)
    methods.reset({ ...defaultValues })
  }

  const schema = yup
    .object({
      name: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .max(255, 'Tối đa 255 ký tự'),
      shortName: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .max(255, 'Tối đa 255 ký tự'),
      homeField: yup.string().trim().max(255, 'Tối đa 255 ký tự'),
      status: yup.number().required('Giá trị bắt buộc'),
      type: yup.number().required('Giá trị bắt buộc'),
      file: yup
        .mixed()
        .required('Giá trị bắt buộc')
        .test('fileType', 'File không hợp lệ', value => {
          if (value && value.name)
            return ['png', 'jpg', 'jpeg'].includes(
              value?.name?.split('.').pop(),
            )
          else return true
        })
        .test('fileSize', 'Dung lượng file <= 10MB', value => {
          if (value?.size) return Math.floor(value?.size / 1000000) <= 10
          else return true
        }),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      shortName: '',
      homeField: '',
      status: 1,
      type: 2,
      file: null,
    },
  })

  const onSubmit = async (data: any) => {
    props.setIsLoading(true)
    let logo: any = ''
    if (file) {
      logo = await handleUploadImage(file, 'png')
    } else {
      logo = previewImage
    }

    const payload: any = {
      id: props.teamId,
      name: data.name,
      shortName: data.shortName,
      homeField: data.homeField ? data.homeField : null,
      status: data.status,
      type: data.type,
      logo: logo,
    }

    await updateTeam(props.teamId, payload)
      .then(() => {
        toastSuccess({
          message: 'Cập nhật thành công',
        })
        props.refresh()
        handleClose()
      })
      .catch(() => {})
      .finally(() => {
        props.setIsLoading(false)
      })
  }

  const fetchTeamDetail = async () => {
    await getTeamDetail(props.teamId)
      .then(res => {
        setTeam(res)
        initDefaultValues(res)
      })
      .catch(() => {})
  }

  React.useEffect(() => {
    if (open && props.teamId) fetchTeamDetail()
  }, [open])

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
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
            <div>Cập nhật thông tin đội bóng</div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Controller
            name="name"
            control={methods.control}
            render={({ field }) => (
              <TextField
                error={!!methods.formState.errors?.name}
                helperText={methods.formState.errors?.name?.message}
                {...field}
                label="Tên đội bóng*"
                variant="outlined"
                margin="normal"
                fullWidth
              />
            )}
          />
          <Controller
            name="shortName"
            control={methods.control}
            render={({ field }) => (
              <TextField
                error={!!methods.formState.errors?.shortName}
                helperText={methods.formState.errors?.shortName?.message}
                {...field}
                label="Tên viết tắt*"
                variant="outlined"
                margin="normal"
                fullWidth
              />
            )}
          />
          <Controller
            name="homeField"
            control={methods.control}
            render={({ field }) => (
              <TextField
                error={!!methods.formState.errors?.homeField}
                helperText={methods.formState.errors?.homeField?.message}
                {...field}
                label="Sân nhà"
                variant="outlined"
                margin="normal"
                fullWidth
              />
            )}
          />
          <Box sx={{ mb: 2 }}>
            <FormLabel error={!!methods.formState.errors?.file}>
              Logo*:
            </FormLabel>
            <input
              type="file"
              accept="image/png,image/jpg,image/jpeg"
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
                width: 130,
                height: 130,
                border: '2px dashed gray',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {!file && previewImage?.length === 0 && (
                <AddPhotoAlternate fontSize="large" />
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
                        width="100px"
                        height="100px"
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
            name="status"
            control={methods.control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Trạng thái*
                </InputLabel>
                <Select
                  fullWidth
                  {...field}
                  onChange={field.onChange as any}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Trạng thái*"
                >
                  <MenuItem value={1}>Hoạt động</MenuItem>
                  <MenuItem value={-1}>Không hoạt động</MenuItem>
                </Select>
                {!!methods.formState.errors?.status?.message && (
                  <FormHelperText>
                    {methods.formState.errors?.status.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="type"
            control={methods.control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={methods.getValues('type') === 1 ? true : false}
                    {...field}
                    onChange={e => {
                      methods.setValue('type', e.target.checked ? 1 : 2)
                    }}
                  />
                }
                label="Thuộc CAHN"
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ textAlign: 'center' }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={
              props.isLoading ||
              JSON.stringify(team) === JSON.stringify(schema.default)
            }
          >
            Đóng
          </Button>
          <Button
            onClick={methods.handleSubmit(onSubmit)}
            autoFocus
            variant="contained"
            disabled={props.isLoading}
          >
            {props.isLoading ? 'Đang cập nhật...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

export default DialogUpdateTeam
