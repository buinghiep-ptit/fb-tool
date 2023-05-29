import { Box } from '@mui/system'
import { Breadcrumb, Container } from 'app/components'
import * as React from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import BackupIcon from '@mui/icons-material/Backup'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
  getCoachDetail,
  getCoachPosition,
  updateCoach,
} from 'app/apis/coachs/coachs.service'
import { getTeams } from 'app/apis/players/players.service'
import { MuiRHFDatePicker } from 'app/components/common/MuiRHFDatePicker'
import RHFWYSIWYGEditor from 'app/components/common/RHFWYSIWYGEditor'
import handleUploadImage from 'app/helpers/handleUploadImage'
import {
  toastError,
  toastSuccess,
  toastWarning,
} from 'app/helpers/toastNofication'
import moment from 'moment'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'
export interface Props {}

export default function CoachDetail(props: Props) {
  const [teams, setTeams] = useState<any[]>([])
  const [positions, setPositions] = useState<any[]>([])
  const [isLoading, setIsloading] = useState(false)
  const [file, setFile] = useState<any>()
  const [previewImage, setPreviewImage] = useState<string>('')
  const [coach, setCoach] = useState<any>()
  const [idPosition, setIdPosition] = React.useState<any>(false)
  const params = useParams()
  const navigate = useNavigate()

  const initDefaultValues = (coach: any) => {
    const defaultValues: any = {}
    defaultValues.nameCoach = coach?.fullName || ''
    defaultValues.homeTown = coach?.placeOfOrigin || ''
    defaultValues.dateOfBirth = coach?.dateOfBirth || ''

    defaultValues.gatheringDay =
      coach.dateJoined || moment(Date.now()).format('YYYY-MM-DD')
    defaultValues.teams = coach.teams

    defaultValues.position = coach.mainPosition
    defaultValues.clothesNumber = coach.jerseyNo
    defaultValues.height = coach.height || 0
    defaultValues.weight = coach.weight || 0
    defaultValues.sizeShoes = coach.shoseSize || 0
    defaultValues.sizeSpikeShoes = coach.nailShoseSize || 0
    defaultValues.sizeClothes = coach.shirtSize || ''
    defaultValues.achiveSummy = coach.achiveSummy
    defaultValues.yellowCard = coach.yellowCardNo || 0
    defaultValues.redCard = coach.redCardNo || 0
    defaultValues.editor_content = coach.biography
    defaultValues.oldClub = coach.oldClub
    defaultValues.position = coach.position
    defaultValues.status = coach.status
    setPreviewImage(coach.imageUrl)
    setIdPosition(coach.position)
    methods.reset({ ...defaultValues })
  }

  const schema = yup
    .object({
      nameCoach: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .max(255, 'Tối đa 255 ký tự'),
      homeTown: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .max(255, 'Tên đối tác không được vượt quá 255 ký tự'),
      dateOfBirth: yup.string().required('Gía trị bắt buộc'),
      gatheringDay: yup
        .date()
        .nullable()
        .typeError('Nhập đúng định dạng ngày hợp lệ'),
      teams: yup.array().min(1, 'Giá trị bắt buộc'),
      position: yup.string().nullable().required('Giá trị bắt buộc'),
      height: yup
        .string()
        .matches(/^[0-9\s]*$/, 'Nhập số lơn hơn hoặc bằng 0')
        .max(4, 'Nhập không quá 4 kí tự')
        .typeError('Nhập số'),
      weight: yup
        .string()
        .matches(/^[0-9\s]*$/, 'Nhập số lơn hơn hoặc bằng 0')
        .max(4, 'Nhập không quá 4 kí tự')
        .typeError('Nhập số'),
      sizeShoes: yup
        .string()
        .matches(/^(?:\d{1,2}(?:\.\d{0,6})?)?$/, 'Nhập size giày')
        .max(4, 'Nhập không quá 4 kí tự')
        .nullable(),
      sizeSpikeShoes: yup
        .string()
        .matches(/^(?:\d{1,2}(?:\.\d{0,6})?)?$/, 'Nhập size giày')
        .max(4, 'Nhập không quá 4 kí tự')
        .nullable(),
      sizeClothes: yup.string().nullable().max(4, 'Nhập không quá 4 kí tự'),
      countTeam: yup
        .string()
        .matches(/^[0-9\s]*$/, 'Nhập số')
        .max(4, 'Nhập không quá 4 kí tự')
        .nullable(),
      cleanMatch: yup
        .string()
        .matches(/^[0-9\s]*$/, 'Nhập số')
        .max(4, 'Nhập không quá 4 kí tự')
        .nullable(),
      countCup: yup
        .string()
        .matches(/^[0-9\s]*$/, 'Nhập số')
        .max(4, 'Nhập không quá 4 kí tự')
        .nullable(),
      yellowCard: yup
        .string()
        .matches(/^[0-9\s]*$/, 'Nhập số')
        .max(4, 'Nhập không quá 4 kí tự')
        .nullable(),
      redCard: yup
        .string()
        .matches(/^[0-9\s]*$/, 'Nhập số')
        .max(4, 'Nhập không quá 4 kí tự')
        .nullable(),
      oldClub: yup
        .string()
        .trim()
        .max(255, 'Câu lạc bộ cũ không được vượt quá 255 ký tự')
        .nullable(),
      achiveSummy: yup
        .string()
        .trim()
        .max(255, 'Tóm tắc thành tích  không được vượt quá 500 ký tự')
        .nullable()
        .required('Giá trị bắt buộc'),
      editor_content: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .test('notEmpty', 'Giá trị bắt buộc', value => {
          return value !== '<p></p>'
        })
        .nullable(),
      status: yup.string().required('Giá trị bát buộc'),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nameCoach: '',
      homeTown: '',
      dateOfBirth: '',
      gatheringDay: moment(Date.now()).format('YYYY-MM-DD') || null,
      teams: [],
      position: '',
      height: 0,
      weight: 0,
      sizeShoes: 0,
      sizeSpikeShoes: 0,
      sizeClothes: '',
      countTeam: 0,
      countCup: 0,
      countMatch: 0,
      cleanMatch: 0,
      yellowCard: 0,
      redCard: 0,
      editor_content: '',
      oldClub: '',
      status: 1,
      achiveSummy: '',
    },
  })

  const onSubmit = async (data: any) => {
    console.log(data)
    setIsloading(true)
    let imageUrl: any = ''
    try {
      if (file) {
        imageUrl = await handleUploadImage(file, 'png')
      } else {
        imageUrl = previewImage
      }
      if (previewImage.length === 0) {
        toastWarning({ message: 'Thêm ảnh' })
        setIsloading(false)
        return
      }
      const payload: any = {
        name: data.nameCoach,
        fullName: data.nameCoach,

        placeOfOrigin: data.homeTown,
        teams: data.teams.map((team: any) => {
          const obj = { id: team.id }
          return obj
        }),
        dateOfBirth:
          moment(data.dateOfBirth).format('YYYY-MM-DD') === 'Invalid date'
            ? null
            : moment(data.dateOfBirth).format('YYYY-MM-DD'),
        dateJoined:
          moment(data.gatheringDay).format('YYYY-MM-DD') === 'Invalid date'
            ? null
            : moment(data.gatheringDay).format('YYYY-MM-DD'),
        shirtSize: data.sizeClothes,
        shoseSize: data.sizeShoes,
        nailShoseSize: data.sizeSpikeShoes,
        height: data.height,
        weight: data.weight,
        imageUrl: imageUrl,
        yellowCardNo: data.yellowCard,
        redCardNo: data.redCard,
        oldClub: data.oldClub,
        biography: data.editor_content,
        cupNo: data.countCup,
        status: data.status,
        achiveSummy: data.achiveSummy,
        mainPosition: data.position,
        position: parseInt(idPosition),
        id: params.id,
      }
      const res = await updateCoach(payload)
      if (res) {
        toastSuccess({
          message: 'Cập nhật thành công',
        })
        setIsloading(false)
        navigate('/coachs')
      }
    } catch (e) {
      toastError({
        message: 'Cập nhật thất bại',
      })
      setIsloading(false)
    }
  }

  const fetchPositions = async () => {
    const res = await getCoachPosition({ page: 0, size: 100, status: 1 })
    setPositions(res?.content)
  }

  const fetchTeams = async () => {
    const res = await getTeams()
    setTeams(res)
  }

  const fetchCoachDetail = async () => {
    const res = await getCoachDetail(params.id)
    setCoach(res)
    initDefaultValues(res)
  }

  React.useEffect(() => {
    fetchPositions()
    fetchTeams()
    fetchCoachDetail()
  }, [])

  return (
    <Container>
      {isLoading && (
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
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Quản lý ban huấn luyện', path: '/coachs' },
            { name: 'Chi tiết ban huấn luyện' },
          ]}
        />
      </Box>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          <Accordion
            expanded={true}
            // onChange={handleChange('panel1')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography variant="h4" gutterBottom>
                Thông tin chung
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="nameCoach"
                        control={methods.control}
                        render={({ field }) => (
                          <TextField
                            error={!!methods.formState.errors?.nameCoach}
                            helperText={
                              methods.formState.errors?.nameCoach?.message
                            }
                            {...field}
                            label="Họ và tên*"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                          />
                        )}
                      />
                      <Controller
                        name="homeTown"
                        control={methods.control}
                        render={({ field }) => (
                          <TextField
                            error={!!methods.formState.errors?.homeTown}
                            helperText={
                              methods.formState.errors?.homeTown?.message
                            }
                            {...field}
                            label="Quê quán*"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MuiRHFDatePicker
                          name="dateOfBirth"
                          label="Ngày sinh*"
                          inputFormat={'DD/MM/YYYY'}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6} style={{ paddingLeft: '10%' }}>
                  <Typography>Ảnh chân dung*:</Typography>
                  <input
                    type="file"
                    id="uploadImage"
                    style={{ display: 'none' }}
                    onChange={(e: any) => {
                      if (e.target.files[0].size > 52428800) {
                        toastSuccess({
                          message: 'Quá dung lượng cho phép',
                        })
                        return
                      }
                      setFile(e.target.files[0])
                      setPreviewImage(
                        window.URL.createObjectURL(e.target.files[0]),
                      )
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
                      width: '80%',
                      height: '300px',
                      border: '2px dashed black',
                      textAlign: 'center',
                    }}
                  >
                    {!file && previewImage?.length === 0 && (
                      <div style={{ marginTop: '100px' }}>
                        <div>Chọn ảnh để tải lên</div>
                        <div>Hoặc kéo và thả tập tin</div>
                        <BackupIcon fontSize="large" />
                        <div>PNG/JPEG hoặc JPG</div>
                        <div>Dung lượng không quá 50mb</div>
                        <div>(Tỷ lệ ảnh phù hợp: 3:4)</div>
                      </div>
                    )}
                    {previewImage?.length !== 0 && (
                      <>
                        {file && (
                          <div style={{ textAlign: 'right' }}>
                            <IconButton
                              aria-label="delete"
                              size="large"
                              style={{ position: 'relative' }}
                              onClick={event => {
                                setFile(null)
                                setPreviewImage(coach?.imageUrl)
                                event.stopPropagation()
                              }}
                            >
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                          </div>
                        )}

                        <img
                          src={previewImage}
                          width="30%"
                          height="40%"
                          style={{ objectFit: 'contain' }}
                        ></img>
                      </>
                    )}
                  </div>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography variant="h4" gutterBottom>
                Thông số
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MuiRHFDatePicker
                      name="gatheringDay"
                      label="Ngày tập trung"
                      inputFormat={'DD/MM/YYYY'}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    name="teams"
                    control={methods.control}
                    render={({ field }) => (
                      <Autocomplete
                        disablePortal
                        {...field}
                        multiple
                        options={teams}
                        getOptionLabel={option => option.shortName}
                        onChange={(_, data) => {
                          field.onChange(data)
                        }}
                        renderInput={params => (
                          <TextField
                            error={!!methods?.formState?.errors.teams}
                            helperText={
                              methods?.formState?.errors.teams
                                ? 'Vui lòng chọn đội'
                                : ''
                            }
                            {...params}
                            label="Đội tham gia huấn luyện*"
                            margin="dense"
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="position"
                    control={methods.control}
                    render={({ field }) => (
                      <FormControl
                        margin="dense"
                        fullWidth
                        error={!!methods.formState.errors?.position}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Vị trí*
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Vị trí"
                          value={idPosition}
                          onChange={e => {
                            setIdPosition(e.target.value.toString())
                            methods.setValue(
                              'position',
                              e.target.value.toString(),
                            )
                          }}
                        >
                          {(positions || []).map(position => (
                            <MenuItem value={position.id} key={position.id}>
                              {position.description}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!methods.formState.errors?.position?.message && (
                          <FormHelperText>
                            {methods.formState.errors?.position.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Controller
                    name="height"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.height}
                        helperText={methods.formState.errors?.height?.message}
                        id=""
                        label="Chiều cao(cm)*"
                        type="number"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Controller
                    name="weight"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.weight}
                        helperText={methods.formState.errors?.weight?.message}
                        id="time"
                        label="Cân nặng(kg)*"
                        type="number"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Controller
                    name="sizeShoes"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.sizeShoes}
                        helperText={
                          methods.formState.errors?.sizeShoes?.message
                        }
                        id="time"
                        label="Size giầy"
                        type="number"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Controller
                    name="sizeSpikeShoes"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.sizeSpikeShoes}
                        helperText={
                          methods.formState.errors?.sizeSpikeShoes?.message
                        }
                        id="time"
                        label="Giầy đinh"
                        type="number"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    name="sizeClothes"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.sizeClothes}
                        helperText={
                          methods.formState.errors?.sizeClothes?.message
                        }
                        id="outlined-basic"
                        label="Size quần áo"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={2}>
                  <Controller
                    name="countTeam"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.countTeam}
                        helperText={
                          methods.formState.errors?.countTeam?.message
                        }
                        id="time"
                        label="Số đội tham gia"
                        type="number"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Controller
                    name="countCup"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.countCup}
                        helperText={methods.formState.errors?.countCup?.message}
                        id="time"
                        label="Số CUP"
                        type="number"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={2}>
                  <Controller
                    name="yellowCard"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.yellowCard}
                        helperText={
                          methods.formState.errors?.yellowCard?.message
                        }
                        id="time"
                        label="Số thẻ vàng"
                        type="number"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Controller
                    name="redCard"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.redCard}
                        helperText={methods.formState.errors?.redCard?.message}
                        id="time"
                        label="Số thẻ đỏ"
                        type="number"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="oldClub"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.oldClub}
                        helperText={methods.formState.errors?.oldClub?.message}
                        id="time"
                        label="CLB cũ"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="achiveSummy"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.achiveSummy}
                        helperText={
                          methods.formState.errors?.achiveSummy?.message
                        }
                        id="time"
                        multiline
                        rows={2}
                        label="Tóm tắt thành tích*"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Tiểu sử*:</Typography>
                  <RHFWYSIWYGEditor name="editor_content"></RHFWYSIWYGEditor>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="status"
                    control={methods.control}
                    render={({ field }) => (
                      <FormControl style={{ width: '200px' }}>
                        <InputLabel id="demo-simple-select-label">
                          Trạng thái
                        </InputLabel>
                        <Select
                          autoWidth
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Trạng thái"
                        >
                          <MenuItem value={-2}>Không hoạt động</MenuItem>
                          <MenuItem value={1}>Hoạt động</MenuItem>
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
                      navigate('/coachs')
                    }}
                  >
                    Quay lại
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </FormProvider>
      </form>
    </Container>
  )
}
