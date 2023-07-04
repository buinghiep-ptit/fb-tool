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
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
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
  createPlayer,
  getPositions,
  getTeams,
} from 'app/apis/players/players.service'
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

export default function PlayerDetail(props: Props) {
  const [teams, setTeams] = useState<any[]>([])
  const [positions, setPositions] = useState<any[]>([])
  const [isLoading, setIsloading] = useState(false)
  const [file, setFile] = useState<any>()
  const [previewImage, setPreviewImage] = useState<string>('')
  const [player, setPlayer] = useState<any>()
  const [idTeam, setIdTeam] = React.useState<any>(false)
  const [disabledViewPosition, setDisableViewPosition] =
    React.useState<any>(true)
  const [idPosition, setIdPosition] = React.useState<any>(false)
  const params = useParams()
  const navigate = useNavigate()

  const schema = yup
    .object({
      namePlayer: yup
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
      gatheringDay: yup.string(),
      team: yup.string().required('Giá trị bát buộc').nullable(),
      position: yup.string().nullable().required('Giá trị bắt buộc'),
      dominantFoot: yup.string().nullable(),
      clothersNumber: yup
        .string()
        .matches(/^[0-9\s]*$/, 'Nhập số')
        .max(2, 'Nhập không quá 2 kí tự')
        .nullable()
        .max(2, 'Nhấp không quá 2 ký tự'),
      height: yup
        .string()
        .matches(/^[0-9\s]*$/, 'Nhập số lơn hơn hoặc bằng 0')
        .required('Giá trị bắt buộc')
        .max(4, 'Nhập không quá 4 kí tự')
        .typeError('Nhập số'),
      weight: yup
        .string()
        .matches(/^[0-9\s]*$/, 'Nhập số lơn hơn hoặc bằng 0')
        .required('Giá trị bắt buộc')
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
      sizeClothers: yup.string().nullable().max(4, 'Nhập không quá 4 kí tự'),
      viewPosition: !disabledViewPosition
        ? yup.string().nullable().required('Giá trị bắt buộc')
        : yup.string().nullable(),
      countMatch: yup
        .string()
        .matches(/^[0-9\s]*$/, 'Nhập số')
        .max(4, 'Nhập không quá 4 kí tự')
        .nullable(),
      cleanMatch: yup
        .string()
        .matches(/^[0-9\s]*$/, 'Nhập số')
        .max(4, 'Nhập không quá 4 kí tự')
        .nullable(),
      goal: yup
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
      editor_content: yup
        .string()
        .required('Giá trị bắt buộc')
        .trim()
        .test('notEmpty', 'Giá trị bắt buộc', value => {
          return value !== '<p></p>'
        }),
      status: yup.string().required('Giá trị bát buộc'),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      namePlayer: '',
      homeTown: '',
      dateOfBirth: '',
      gatheringDay: moment(Date.now()).format('YYYY-MM-DD') || null,
      team: '',
      position: '',
      dominantFoot: '',
      clothersNumber: null,
      height: '',
      weight: '',
      sizeShoes: 0,
      sizeSpikeShoes: 0,
      sizeClothers: null,
      viewPosition: '',
      countMatch: 0,
      cleanMatch: 0,
      goal: 0,
      yellowCard: 0,
      redCard: 0,
      editor_content: '',
      oldClub: '',
      prioritize: false,
      status: 1,
    },
  })

  const onSubmit = async (data: any) => {
    console.log(data)
    setIsloading(true)
    try {
      let imageUrl: any = ''
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
        name: data.namePlayer,
        fullName: data.namePlayer,
        placeOfOrigin: data.homeTown,
        idTeam: data.team,
        dateOfBirth:
          moment(data.dateOfBirth).format('YYYY-MM-DD') === 'Invalid date'
            ? null
            : moment(data.dateOfBirth).format('YYYY-MM-DD'),
        dateJoined:
          moment(data.gatheringDay).format('YYYY-MM-DD') === 'Invalid date'
            ? null
            : moment(data.gatheringDay).format('YYYY-MM-DD'),
        shirtSize: data.sizeClothers,
        shoseSize: data.sizeShoes,
        nailShoseSize: data.sizeSpikeShoes,
        height: data.height,
        weight: data.weight,
        imageUrl: imageUrl,
        jerseyNo: data.clothersNumber,
        dominantFoot: data.dominantFoot,
        cleanSheetNo: data.cleanMatch,
        matchPlayedNo: data.countMatch,
        yellowCardNo: data.yellowCard,
        redCardNo: data.redCard,
        oldClub: data.oldClub,
        biography: data.editor_content,
        isDisplayHome: data.prioritize ? 1 : 0,
        priority: data.prioritize ? data.viewPosition : null,
        status: data.status,
        mainPosition: data.position,
        position: null,
        goalFor: data.goal,
      }

      const res = await createPlayer(payload)
      if (res) {
        toastSuccess({
          message: 'Tạo thành công',
        })
        setIsloading(false)
        navigate('/players')
      }
    } catch (e) {
      toastError({
        message: 'Tạo thất bại',
      })
      setIsloading(false)
    }
  }

  const fetchPositions = async () => {
    const res = await getPositions({ size: 100, page: 0 })
    setPositions(res)
  }

  const fetchTeams = async () => {
    const res = await getTeams()
    setTeams(res)
  }

  React.useEffect(() => {
    fetchPositions()
    fetchTeams()
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
            { name: 'Quản lý cầu thủ', path: '/players' },
            { name: 'Thông tin cầu thủ' },
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
                        name="namePlayer"
                        control={methods.control}
                        render={({ field }) => (
                          <TextField
                            error={!!methods.formState.errors?.namePlayer}
                            helperText={
                              methods.formState.errors?.namePlayer?.message
                            }
                            {...field}
                            label="Tên cầu thủ*"
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
                                console.log(player)
                                setPreviewImage(player.imageUrl)
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
                Thông số cầu thủ
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
                    name="team"
                    control={methods.control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        margin="dense"
                        error={!!methods.formState.errors?.team?.message}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Đội thi đấu*
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Đội thi đấu*"
                          {...field}
                          value={idTeam}
                          onChange={e => {
                            if (e.target.value.toString() === '1') {
                              setDisableViewPosition(true)
                              methods.setValue('prioritize', false)
                            }
                            setIdTeam(e.target.value)
                            methods.setValue('team', e.target.value.toString())
                          }}
                        >
                          {teams.map((team, index) => (
                            <MenuItem value={team.id} key={index}>
                              {team.shortName}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!methods.formState.errors?.team?.message && (
                          <FormHelperText>
                            {methods.formState.errors?.team.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
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
                          Vị trí thi đấu*
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Vị trí thi đấu chính"
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
                    name="dominantFoot"
                    control={methods.control}
                    render={({ field }) => (
                      <FormControl
                        style={{ width: '100%' }}
                        margin="dense"
                        error={!!methods.formState.errors?.dominantFoot}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Chân thuận
                        </InputLabel>
                        <Select
                          autoWidth
                          {...field}
                          onChange={field.onChange as any}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Chân thuận"
                        >
                          <MenuItem value={3}>Cả hai chân</MenuItem>
                          <MenuItem value={2}>Trái</MenuItem>
                          <MenuItem value={1}>Phải</MenuItem>
                        </Select>
                        {!!methods.formState.errors?.dominantFoot?.message && (
                          <FormHelperText>
                            {methods.formState.errors?.dominantFoot.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={1}>
                  <Controller
                    name="clothersNumber"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.clothersNumber}
                        helperText={
                          methods.formState.errors?.clothersNumber?.message
                        }
                        id="clothersNumber"
                        label="Số áo"
                        type="number"
                        margin="dense"
                      />
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
                <Grid item xs={1}>
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
                <Grid item xs={1}>
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
                <Grid item xs={2}>
                  <Controller
                    name="sizeClothers"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.sizeClothers}
                        helperText={
                          methods.formState.errors?.sizeClothers?.message
                        }
                        id="outlined-basic"
                        label="Size quần áo"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                {idTeam.toString() === '1' && (
                  <Grid item xs={4}>
                    <Controller
                      name="prioritize"
                      control={methods.control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={methods.getValues('prioritize')}
                              {...field}
                              onChange={e => {
                                setDisableViewPosition(!e.target.checked)
                                methods.setValue('prioritize', e.target.checked)
                                if (!e.target.checked) {
                                  methods.setValue('viewPosition', '')
                                }
                              }}
                            />
                          }
                          label="Ưu tiên"
                        />
                      )}
                    />
                    <Controller
                      name="viewPosition"
                      control={methods.control}
                      render={({ field }) => (
                        <FormControl
                          style={{ width: '200px' }}
                          error={!!methods.formState.errors?.viewPosition}
                        >
                          <InputLabel id="demo-simple-select-label">
                            Vị trí hiển thị
                          </InputLabel>
                          <Select
                            autoWidth
                            {...field}
                            onChange={field.onChange as any}
                            disabled={disabledViewPosition}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Vị trí hiển thị"
                          >
                            {Array(11)
                              .fill('')
                              .map((item, index) => (
                                <MenuItem value={index + 1} key={index}>
                                  {index + 1}
                                </MenuItem>
                              ))}
                          </Select>
                          {!!methods.formState.errors?.viewPosition
                            ?.message && (
                            <FormHelperText>
                              {methods.formState.errors?.viewPosition.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                    <div>
                      Lưu ý: Sau khi chọn, vị trí hiển thị của cầu thủ trên
                      trang chủ sẽ được hiển thị đúng vị trí trong danh sách, và
                      thay thế vào vị trí đã chọn
                    </div>
                  </Grid>
                )}

                <Grid item xs={2}>
                  <Controller
                    name="countMatch"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.countMatch}
                        helperText={
                          methods.formState.errors?.countMatch?.message
                        }
                        id="time"
                        label="Số trận đã đá"
                        type="number"
                      />
                    )}
                  />
                </Grid>
                {idPosition.toString() === '1' && (
                  <Grid item xs={2}>
                    <Controller
                      name="cleanMatch"
                      control={methods.control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          error={!!methods.formState.errors?.cleanMatch}
                          helperText={
                            methods.formState.errors?.cleanMatch?.message
                          }
                          type="number"
                          id="outlined-basic"
                          style={{ marginLeft: '15px', width: '150px' }}
                          label="Số trận giữ sạch lưới"
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                )}
                <Grid item xs={2}>
                  <Controller
                    name="goal"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.goal}
                        helperText={methods.formState.errors?.goal?.message}
                        id="time"
                        label="Số bàn thắng"
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
                <Grid item xs={3}>
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
                          onChange={field.onChange as any}
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
                      navigate('/players')
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
