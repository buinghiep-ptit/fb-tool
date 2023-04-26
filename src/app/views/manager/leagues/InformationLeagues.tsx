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
import {
  createLeagues,
  editLeagues,
  getLeaguesById,
} from 'app/apis/leagues/leagues.service'
import { Container, SimpleCard } from 'app/components'
import { MuiCheckBox } from 'app/components/common/MuiRHFCheckbox'
import handleUploadImage from 'app/helpers/handleUploadImage'
import { toastError, toastSuccess } from 'app/helpers/toastNofication'
import { useEffect, useRef, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'
import DialogPickTeam from './DialogPickTeam'
export interface Props {}
export default function InfomationLeagues(props: Props) {
  const navigate = useNavigate()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState()
  const [teamPicked, setTeamPicked] = useState([])
  const [logo, setLogo] = useState('')
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
      teamList: yup.array().required('Giá trị bắt buộc'),
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

  const onSubmit = async (data: any) => {
    console.log(data)
    data.isDisplayRank = data.isDisplayRank ? 1 : 0
    data.isDisplaySchedule = data.isDisplaySchedule ? 1 : 0
    let urlLogo: any = ''
    if (file) {
      urlLogo = await handleUploadImage(file)
    }
    try {
      if (params?.id) {
        const res = await editLeagues(
          {
            ...data,
            logo: urlLogo,
            teamList: teamPicked,
          },
          params?.id,
        )
        if (res) {
          toastSuccess({ message: 'Lưu thành công' })
          navigate('/leagues')
        }
      } else {
        const res = await createLeagues({
          ...data,
          logo: urlLogo,
          teamList: teamPicked,
        })
        if (res) {
          toastSuccess({ message: 'Tạo thành công' })
          navigate('/leagues')
        }
      }
    } catch (e) {
      toastError({ message: ' Tạo thất bại' })
    }
  }

  const initDefaultValues = (league: any) => {
    const defaultValues: any = {}
    defaultValues.shortName = league.shortName
    defaultValues.name = league.name
    defaultValues.status = league.status
    defaultValues.type = league.type
    defaultValues.category = league.category
    defaultValues.isDisplayRank = league.displayRank === 0 ? false : true
    defaultValues.isDisplaySchedule =
      league.displaySchedule === 0 ? false : true
    defaultValues.teamList = league.teamList.map((item: any) => item.id)
    setTeamPicked(league.teamList.map((item: any) => item.id))
    setLogo(league.logo || '')
    methods.reset({ ...defaultValues })
  }

  const fetchDetailLeague = async () => {
    const res = await getLeaguesById(params.id)
    initDefaultValues(res)
  }

  useEffect(() => {
    if (params.id) {
      fetchDetailLeague()
    }
  }, [])

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
                        <MenuItem value={5}>Phong trào cộng đồng</MenuItem>
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
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Thể Loại*"
                      >
                        <MenuItem value={1}>Leagues</MenuItem>
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
                        objectFit: 'cover',
                        width: '100px',
                        height: '100px',
                      }}
                      src={window.URL.createObjectURL(file)}
                    ></img>
                  )}
                  {logo.length !== 0 && (
                    <img
                      style={{
                        objectFit: 'cover',
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
                        <MenuItem value={-1}>Kết thúc</MenuItem>
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
                  Chọn đội tham gia giải
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
                <MuiCheckBox
                  name="isDisplayRank"
                  label="Hiển thị BXH trên tràng chủ*"
                />
                <MuiCheckBox
                  name="isDisplaySchedule"
                  label="Hiển thị lịch đấu trên website*"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  color="primary"
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  style={{ padding: '12px 20px' }}
                >
                  Lưu
                </Button>
                <Button
                  style={{ marginLeft: '15px', padding: '12px 20px' }}
                  color="primary"
                  variant="contained"
                  disabled={isLoading}
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
      <DialogPickTeam
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        ref={DialogPickTeamRef}
        setTeamPicked={setTeamPicked}
        setValue={methods.setValue}
        teamPicked={teamPicked}
      />
    </Container>
  )
}
