import { Box } from '@mui/system'
import * as React from 'react'
import { Breadcrumb, SimpleCard, Container } from 'app/components'

import {
  Grid,
  Button,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Checkbox,
  FormControlLabel,
} from '@mui/material'

import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import BackupIcon from '@mui/icons-material/Backup'
import RHFWYSIWYGEditor from 'app/components/common/RHFWYSIWYGEditor'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { Controller, useForm, FormProvider } from 'react-hook-form'
import {
  getPlayer,
  getPositions,
  getTeams,
  updatePlayer,
} from 'app/apis/players/players.service'
import { useNavigate, useParams } from 'react-router-dom'
import handleUploadImage from 'app/helpers/handleUploadImage'
import { toastSuccess } from 'app/helpers/toastNofication'
export interface Props {}

export default function PlayerDetail(props: Props) {
  const [teams, setTeams] = useState<any[]>([])
  const [positions, setPositions] = useState<any[]>([])
  const [isLoading, setIsloading] = useState(false)
  const [file, setFile] = useState<any>()
  const [previewImage, setPreviewImage] = useState<string>()
  const [player, setPlayer] = useState<any>()
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const params = useParams()
  const navigate = useNavigate()
  // const handleChange =
  //   (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
  //     setExpanded(isExpanded ? panel : false)
  //   }

  const initDefaultValues = (player: any) => {
    const defaultValues: any = {}
    defaultValues.namePlayer = player.fullName
    defaultValues.homeTown = player.placeOfOrigin
    defaultValues.phone = player.mobilePhone
    defaultValues.dateOfBirth = player.dateOfBirth
    defaultValues.married = player.maritalStatus
    defaultValues.citizenIdentification = player.citizenIdCard
    defaultValues.dateRange = player.dateCitizenId
    defaultValues.passPortDateRange = player.datePassport
    defaultValues.passPort = player.passport
    defaultValues.expirationDate = player.dateExpirePassport
    defaultValues.gatheringDay = player.dateJoined
    defaultValues.team = player.idTeam
    defaultValues.position = player.mainPosition
    defaultValues.dominantFoot = player.dominantFoot
    defaultValues.clothersNumber = player.jerseyNo
    defaultValues.height = player.height
    defaultValues.weight = player.weight
    defaultValues.sizeShoes = player.shoseSize
    defaultValues.sizeSpikeShoes = player.nailShoseSize
    defaultValues.sizeClothers = player.shirtSize
    defaultValues.viewPosition = player.isDisplayHome
    defaultValues.countMatch = player.matchPlayedNo
    defaultValues.cleanMatch = player.cleanSheetNo
    defaultValues.goal = player.goalFor
    defaultValues.yellowCard = player.yellowCardNo
    defaultValues.redCard = player.redCardNo
    defaultValues.editor_content = player.biography
    defaultValues.oldClub = player.oldClub
    defaultValues.prioritize = player.priority
    defaultValues.status = player.status
    setPreviewImage(player.imageUrl)
    methods.reset({ ...defaultValues })
  }

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
      phone: yup
        .string()
        .matches(/^[0-9]*$/, 'Chỉ nhập số')
        .max(10, 'Số điện thoại không được vượt quá 10 ký tự'),
      dateOfBirth: yup.string().required('Gía trị bắt buộc'),
      passPortDateRange: yup.string().nullable(),
      married: yup.number().typeError('Nhâp số'),
      citizenIdentification: yup.string(),
      dateRange: yup.string().nullable(),
      expirationDate: yup.string().nullable(),
      gatheringDay: yup.string(),
      team: yup.string().required('Giá trị bát buộc'),
      position: yup.string().required('Giá trị bắt buộc'),
      dominantFoot: yup.string(),
      clothersNumber: yup.number().typeError('Nhâp số').nullable(),
      height: yup.number().typeError('Nhâp số'),
      weight: yup.number().typeError('Nhập số'),
      sizeShoes: yup.number().typeError('Nhâp số').nullable(),
      sizeSpikeShoes: yup.number().typeError('Nhâp số').nullable(),
      sizeClothers: yup.string(),
      viewPosition: yup.number().typeError('Nhâp số').nullable(),
      countMatch: yup.number().typeError('Nhâp số').nullable(),
      cleanMatch: yup.number().typeError('Nhâp số').nullable(),
      goal: yup.number().typeError('Nhâp số').nullable(),
      yellowCard: yup.number().typeError('Nhâp số').nullable(),
      redCard: yup.number().typeError('Nhâp số').nullable(),
      oldClub: yup.string().required('Giá trị bắt buộc'),
      editor_content: yup.string().required('Giá trị bắt buộc'),
      status: yup.string().required('Giá trị bát buộc'),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      namePlayer: '',
      homeTown: '',
      phone: '',
      dateOfBirth: '',
      married: 0,
      citizenIdentification: '',
      dateRange: '',
      passPortDateRange: '',
      passPort: '',
      expirationDate: '',
      gatheringDay: '',
      team: '',
      position: '',
      dominantFoot: '',
      clothersNumber: 0,
      height: '',
      weight: '',
      sizeShoes: 0,
      sizeSpikeShoes: 0,
      sizeClothers: '',
      viewPosition: '',
      countMatch: '',
      cleanMatch: '',
      goal: '',
      yellowCard: '',
      redCard: '',
      editor_content: '',
      oldClub: '',
      prioritize: '',
      status: 1,
    },
  })

  const onSubmit = async (data: any) => {
    setIsloading(true)
    let imageUrl: any = ''
    if (file) {
      imageUrl = await handleUploadImage(file)
    } else {
      imageUrl = previewImage
    }
    const payload: any = {
      id: params.id,
      name: data.namePlayer,
      fullName: data.namePlayer,
      mobilePhone: data.phone,
      citizenIdCard: data.citizenIdentification,
      dateCitizenId: data.dateRange,
      passport: data.passPort,
      datePassport: data.passPortDateRange,
      dateExpirePassport: data.expirationDate,
      placeOfOrigin: data.homeTown,
      idTeam: data.team,
      dateOfBirth: data.dateOfBirth,
      dateJoined: data.gatheringDay,
      maritalStatus: data.married,
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
      priority: data.viewPosition,
      status: data.status,
      mainPosition: data.position,
      position: null,
    }

    const res = await updatePlayer(payload)
    if (res) {
      toastSuccess({
        message: 'Cập nhật thành công',
      })
      navigate('/players')
    }
    setIsloading(false)
  }

  const fetchPositions = async () => {
    const res = await getPositions({ size: 100, page: 0 })
    setPositions(res)
  }

  const fetchTeams = async () => {
    const res = await getTeams()
    setTeams(res)
  }

  const fetchPlayer = async () => {
    const res = await getPlayer(params.id)
    setPlayer(res)
    initDefaultValues(res)
  }

  React.useEffect(() => {
    fetchPositions()
    fetchTeams()
    fetchPlayer()
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
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
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
                      <Controller
                        name="phone"
                        control={methods.control}
                        render={({ field }) => (
                          <TextField
                            error={!!methods.formState.errors?.phone}
                            helperText={
                              methods.formState.errors?.phone?.message
                            }
                            {...field}
                            label="Số điện thoại"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name="dateOfBirth"
                        control={methods.control}
                        render={({ field }) => (
                          <TextField
                            error={!!methods.formState.errors?.dateOfBirth}
                            helperText={
                              methods.formState.errors?.dateOfBirth?.message
                            }
                            {...field}
                            style={{ marginRight: '15px' }}
                            id="date"
                            label="Ngày sinh*"
                            type="date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name="married"
                        control={methods.control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Tình trạng hôn nhân
                            </InputLabel>
                            <Select
                              {...field}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Tình trạng hôn nhân"
                            >
                              <MenuItem value={0}>Độc thân</MenuItem>
                              <MenuItem value={1}>Đã kết hôn</MenuItem>
                            </Select>
                            {!!methods.formState.errors?.married?.message && (
                              <FormHelperText>
                                {methods.formState.errors?.married.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name="citizenIdentification"
                        control={methods.control}
                        render={({ field }) => (
                          <TextField
                            error={
                              !!methods.formState.errors?.citizenIdentification
                            }
                            helperText={
                              methods.formState.errors?.citizenIdentification
                                ?.message
                            }
                            {...field}
                            label="Số CCCD"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name="dateRange"
                        control={methods.control}
                        render={({ field }) => (
                          <TextField
                            error={!!methods.formState.errors?.dateRange}
                            helperText={
                              methods.formState.errors?.dateRange?.message
                            }
                            {...field}
                            style={{ marginRight: '15px' }}
                            margin="normal"
                            id="date"
                            label="Ngày cấp"
                            type="date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Controller
                        name="passPort"
                        control={methods.control}
                        render={({ field }) => (
                          <TextField
                            error={!!methods.formState.errors?.passPort}
                            helperText={
                              methods.formState.errors?.passPort?.message
                            }
                            {...field}
                            label="Số hộ chiếu"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name="passPortDateRange"
                        control={methods.control}
                        render={({ field }) => (
                          <TextField
                            error={
                              !!methods.formState.errors?.passPortDateRange
                            }
                            helperText={
                              methods.formState.errors?.passPortDateRange
                                ?.message
                            }
                            {...field}
                            style={{ marginRight: '15px' }}
                            margin="normal"
                            id="date"
                            label="Ngày cấp"
                            type="date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Controller
                        name="expirationDate"
                        control={methods.control}
                        render={({ field }) => (
                          <TextField
                            error={!!methods.formState.errors?.expirationDate}
                            helperText={
                              methods.formState.errors?.expirationDate?.message
                            }
                            {...field}
                            style={{ marginRight: '15px' }}
                            margin="normal"
                            id="date"
                            label="Ngày hết hạn"
                            type="date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6} style={{ paddingLeft: '10%' }}>
                  <Typography>Ảnh chân dung*:</Typography>
                  <input
                    type="file"
                    id="uploadImage"
                    style={{ display: 'none' }}
                    onChange={(event: any) => {
                      setFile(event.target.files[0])
                      setPreviewImage(
                        window.URL.createObjectURL(event.target.files[0]),
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
                      width: 500,
                      height: 400,
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
                        <div>(Tỷ lệ ảnh phù hợp)</div>
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
                          width="480px"
                          height="270px"
                          style={{ objectFit: 'contain' }}
                        ></img>
                      </>
                    )}

                    {/* {file?.type.startsWith('image/') && (
                      <img
                        src={window.URL.createObjectURL(file)}
                        width="480px"
                        height="270px"
                      ></img>
                    )} */}
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
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                Thông số cầu thủ
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Controller
                    name="gatheringDay"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        error={!!methods.formState.errors?.gatheringDay}
                        helperText={
                          methods.formState.errors?.gatheringDay?.message
                        }
                        {...field}
                        style={{ marginRight: '15px' }}
                        id="date"
                        label="Ngày tập trung"
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    name="team"
                    control={methods.control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!methods.formState.errors?.team?.message}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Đội thi đấu*
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Đội thi đấu*"
                        >
                          {teams.map((team, index) => (
                            <MenuItem value={team.id}>
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
                        fullWidth
                        error={!!methods.formState.errors?.position}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Vị trí thi đấu chính
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Vị trí thi đấu chính"
                        >
                          {(positions || []).map(position => (
                            <MenuItem value={position.id}>
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
                <Grid item xs={3}>
                  <Controller
                    name="dominantFoot"
                    control={methods.control}
                    render={({ field }) => (
                      <FormControl style={{ width: '200px' }}>
                        <InputLabel id="demo-simple-select-label">
                          Chân thuận
                        </InputLabel>
                        <Select
                          autoWidth
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Chân thuận"
                        >
                          <MenuItem value={0}>Cả hai chân</MenuItem>
                          <MenuItem value={0}>Trái</MenuItem>
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
                        style={{ marginLeft: '15px', width: '100px' }}
                        id=""
                        label="Số áo"
                        type="number"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    name="height"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        style={{ width: '150px' }}
                        {...field}
                        error={!!methods.formState.errors?.height}
                        helperText={methods.formState.errors?.height?.message}
                        id=""
                        label="Chiều cao(cm)*"
                        type="number"
                      />
                    )}
                  />
                  <Controller
                    name="weight"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        style={{ width: '150px', marginLeft: '15px' }}
                        error={!!methods.formState.errors?.weight}
                        helperText={methods.formState.errors?.weight?.message}
                        id="time"
                        label="Cân nặng(kg)*"
                        type="number"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
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
                        style={{ width: '150px', marginRight: '15px' }}
                        id="time"
                        label="Size giầy"
                        type="number"
                      />
                    )}
                  />
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
                        style={{ width: '150px' }}
                        id="time"
                        label="Giầy đinh"
                        type="number"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
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
                <Grid item xs={3}>
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
                        style={{ width: '150px' }}
                        id="time"
                        label="Số trận đã đá"
                        type="number"
                      />
                    )}
                  />
                  {player?.mainPosition === 1 && (
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
                          label="Số trận giữ sạch lướt"
                          variant="outlined"
                        />
                      )}
                    />
                  )}
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    name="goal"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={!!methods.formState.errors?.goal}
                        helperText={methods.formState.errors?.goal?.message}
                        style={{ width: '150px' }}
                        id="time"
                        label="Số bàn thắng"
                        type="number"
                      />
                    )}
                  />
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
                        style={{ marginLeft: '25px', width: '150px' }}
                        id="time"
                        label="Số thể vàng"
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
                        style={{ marginLeft: '25px', width: '150px' }}
                        id="time"
                        label="Số thẻ đỏ"
                        type="number"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Controller
                    name="prioritize"
                    control={methods.control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={true}
                            {...field}
                            onChange={e => {}}
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
                      <FormControl style={{ width: '200px' }}>
                        <InputLabel id="demo-simple-select-label">
                          Vị trí hiển thị
                        </InputLabel>
                        <Select
                          autoWidth
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Vị trí hiển thị"
                        >
                          {Array(11)
                            .fill('')
                            .map((item, index) => (
                              <MenuItem value={index + 1}>{index + 1}</MenuItem>
                            ))}
                        </Select>
                        {!!methods.formState.errors?.viewPosition?.message && (
                          <FormHelperText>
                            {methods.formState.errors?.viewPosition.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                  <div>
                    Lưu ý: Sau khi chọn, vị trí hiển thị của cầu thủ trên trang
                    chủ sẽ được hiển thị đúng vị trí trong danh sách, và thay
                    thế vào vị trí đã chọn
                  </div>
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
                  <Typography>Tiểu xử*:</Typography>
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
                          <MenuItem value={-2}>Khóa</MenuItem>
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
                    size="large"
                  >
                    Lưu
                  </Button>
                  <Button
                    style={{ marginLeft: '15px' }}
                    color="primary"
                    variant="contained"
                    disabled={isLoading}
                    size="large"
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
