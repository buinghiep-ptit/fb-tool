import { yupResolver } from '@hookform/resolvers/yup'
import BackupIcon from '@mui/icons-material/Backup'
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { createLeagues, editLeagues } from 'app/apis/leagues/leagues.service'
import { Container, SimpleCard } from 'app/components'
import { MuiCheckBox } from 'app/components/common/MuiRHFCheckbox'
import handleUploadImage from 'app/helpers/handleUploadImage'
import {
  toastError,
  toastSuccess,
  toastWarning,
} from 'app/helpers/toastNofication'
import { useRef, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'
import DialogPickTeamCreate from './DialogPickTeamCreate'
export interface Props {
  isLoading: any
  setIsLoading: any
}
export default function InfomationLeaguesCreate(props: Props) {
  const navigate = useNavigate()
  const params = useParams()

  const [file, setFile] = useState()
  const [teamPicked, setTeamPicked] = useState<any>([])
  const [logo, setLogo] = useState('')
  const [typeLeague, setTypeLeague] = useState<any>('')
  const DialogPickTeamRef = useRef<any>(null)
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
      status: yup
        .number()
        .required('Gía trị bắt buộc')
        .typeError('Giá trị bắt buộc'),
      type: yup
        .number()
        .required('Giá trị bắt buộc')
        .typeError('Giá trị bắt buộc'),
      category: yup
        .number()
        .required('Giá trị bắt buộc')
        .typeError('Giá trị bắt buộc'),
      teamList: yup
        .array()
        .required('Giá trị bắt buộc')
        .min(2, 'Chọn ít nhất 2 đội'),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      shortName: '',
      type: params.id ? 0 : null,
      category: params.id ? 0 : null,
      status: params.id ? 0 : null,
      isDisplayRank: false,
      isDisplaySchedule: false,
      teamList: null,
    },
  })

  const validateLogo = (file: any) => {
    if (file.size > 10000000) return false
    return true
  }

  const onSubmit = async (data: any) => {
    props.setIsLoading(true)
    data.teamList = teamPicked

    data.isDisplayRank = data.isDisplayRank ? 1 : 0
    data.isDisplaySchedule = data.isDisplaySchedule ? 1 : 0
    let urlLogo: any = ''
    if (file) {
      urlLogo = await handleUploadImage(file, 'png')
    } else {
      urlLogo = logo
    }

    try {
      if (params?.id) {
        const res = await editLeagues(
          {
            ...data,
            logo: urlLogo,
          },
          params?.id,
        )
        if (res) {
          toastSuccess({ message: 'Lưu thành công' })
          props.setIsLoading(false)
          navigate('/leagues')
        }
      } else {
        const res = await createLeagues({
          ...data,
          logo: urlLogo,
        })
        if (res) {
          props.setIsLoading(false)
          toastSuccess({ message: 'Tạo thành công' })
          navigate(`/leagues/${res?.id}`)
        }
      }
    } catch (e) {
      props.setIsLoading(false)
      toastError({ message: ' Tạo thất bại' })
    }
  }

  return (
    <Container>
      <SimpleCard title="Thêm thông tin giải đấu">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormProvider {...methods}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      error={!!methods.formState.errors?.name}
                      helperText={methods.formState.errors?.name?.message}
                      {...field}
                      label="Tên giải đấu*"
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
                  name="type"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      margin="dense"
                      error={!!methods.formState.errors?.type}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Loại giải*
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Loại giải*"
                      >
                        <MenuItem value={1}>Bóng đá nam</MenuItem>
                        <MenuItem value={2}>Bóng đá nữ</MenuItem>
                        <MenuItem value={3}>Futsal</MenuItem>
                        <MenuItem value={4}>Bóng đá bãi biển</MenuItem>
                        <MenuItem value={5}>Phong trào - Cộng đồng</MenuItem>
                        <MenuItem value={6}>Khác</MenuItem>
                      </Select>
                      {!!methods.formState.errors?.type && (
                        <FormHelperText>
                          {methods.formState.errors?.type.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
                <Controller
                  name="category"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      margin="dense"
                      error={!!methods.formState.errors?.category}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Thể Loại*
                      </InputLabel>
                      <Select
                        {...field}
                        disabled={!!params.id}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Thể Loại*"
                        value={typeLeague}
                        onChange={(e: any) => {
                          setTypeLeague(e.target.value)
                          methods.setValue('category', e.target.value)
                        }}
                      >
                        <MenuItem value={1}>League</MenuItem>
                        <MenuItem value={2}>Cup</MenuItem>
                        <MenuItem value={3}>Khác</MenuItem>
                      </Select>
                      {!!methods.formState.errors?.category?.message && (
                        <FormHelperText>
                          {methods.formState.errors?.category.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />

                <InputLabel id="demo-simple-select-label">Logo</InputLabel>
                <input
                  type="file"
                  id="uploadImage"
                  style={{ display: 'none' }}
                  onChange={(e: any) => {
                    if (
                      !(
                        e.target.files[0].type.endsWith('png') ||
                        e.target.files[0].type.endsWith('jpg') ||
                        e.target.files[0].type.endsWith('jpeg')
                      )
                    ) {
                      toastWarning({
                        message: 'Định dạng cho phép: JPG, JPEG, PNG',
                      })
                      return
                    }
                    if (!validateLogo(e.target.files[0])) {
                      toastWarning({
                        message: 'Giới hạn dung lượng tối đa 10mb',
                      })
                      return
                    }
                    setFile(e.target.files[0])
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
                    width: '100px',
                    height: '100px',
                    border: '2px dashed black',
                    textAlign: 'center',
                    lineHeight: '100px',
                    cursor: 'pointer',
                    margin: '15px',
                  }}
                >
                  {!file && logo.length === 0 && (
                    <BackupIcon fontSize="large" />
                  )}
                  {file && (
                    <img
                      style={{
                        objectFit: 'contain',
                        width: '100px',
                        height: '100px',
                      }}
                      src={window.URL.createObjectURL(file)}
                    ></img>
                  )}
                  {logo.length !== 0 && !file && (
                    <img
                      style={{
                        objectFit: 'contain',
                        width: '100px',
                        height: '100px',
                      }}
                      src={logo}
                    ></img>
                  )}
                </div>

                <Controller
                  name="status"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      margin="dense"
                      error={!!methods.formState.errors?.status}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Trạng thái*
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Trạng thái*"
                      >
                        <MenuItem value={0}>Chưa diễn ra</MenuItem>
                        <MenuItem value={1}>Đang diễn ra</MenuItem>
                        <MenuItem value={2}>Kết thúc</MenuItem>
                      </Select>
                      {!!methods.formState.errors?.status?.message && (
                        <FormHelperText>
                          {methods.formState.errors?.status.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid
                item
                xs={12}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <InputLabel id="demo-simple-select-label">
                  Danh sách các đội bóng tham gia giải đấu*
                </InputLabel>
                <Button
                  variant="contained"
                  style={{ marginLeft: '20px' }}
                  onClick={() => DialogPickTeamRef.current.handleClickOpen()}
                >
                  Chọn đội bóng tham gia giải đấu
                </Button>
              </Grid>
              {methods.formState.errors?.teamList && (
                <FormHelperText style={{ color: 'red', paddingLeft: '20px' }}>
                  Chọn ít nhất 2 đội
                </FormHelperText>
              )}
              <Grid
                item
                xs={12}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <InputLabel id="demo-simple-select-label">
                  Số lượng đội bóng tham gia:
                </InputLabel>
                <Typography style={{ marginLeft: '20px' }}>
                  {teamPicked.length}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {typeLeague === 1 && (
                  <MuiCheckBox
                    name="isDisplayRank"
                    label="Hiển thị BXH trên trang chủ"
                  />
                )}
                <MuiCheckBox
                  name="isDisplaySchedule"
                  label="Hiển thị lịch đấu trên website"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  color="primary"
                  type="submit"
                  variant="contained"
                  disabled={props.isLoading}
                  style={{ padding: '12px 20px' }}
                >
                  Lưu
                </Button>
                <Button
                  style={{ marginLeft: '15px', padding: '12px 20px' }}
                  color="primary"
                  variant="contained"
                  disabled={props.isLoading}
                  onClick={() => {
                    navigate('/leagues')
                  }}
                >
                  Quay lại
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </form>
      </SimpleCard>

      <DialogPickTeamCreate
        isLoading={props.isLoading}
        setIsLoading={props.setIsLoading}
        ref={DialogPickTeamRef}
        setTeamPicked={setTeamPicked}
        setValue={methods.setValue}
        teamPicked={teamPicked}
      />
    </Container>
  )
}
