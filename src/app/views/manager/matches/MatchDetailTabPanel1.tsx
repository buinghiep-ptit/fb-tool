import { yupResolver } from '@hookform/resolvers/yup'
import MinimizeIcon from '@mui/icons-material/Minimize'
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { SimpleCard } from 'app/components'
import DialogSelectNews from 'app/components/DialogSelect/DialogSelectNews'
import DialogSelectVideo from 'app/components/DialogSelect/DialogSelectVideo'
import MultipleNewsSelect from 'app/components/DynamicAutocomplete/MultipleNewsSelect'
import MultipleVideosSelect from 'app/components/DynamicAutocomplete/MultipleVideosSelect'
import RHFWYSIWYGEditor from 'app/components/common/RHFWYSIWYGEditor'
import { MATCH_STATUSES } from 'app/constants/matchStatuses'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import './style.css'

MatchDetailTabPanel1.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  match: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
}

export default function MatchDetailTabPanel1(props: any) {
  const { value, index, match, isLoading, setIsLoading, refresh, ...other } =
    props

  const navigate = useNavigate()

  const dialogRelatedNewsRef = useRef<any>(null)
  const dialogRelatedVideosRef = useRef<any>(null)

  const [relatedNews, setRelatedNews] = useState([])
  const [relatedVideos, setRelatedVideos] = useState([])

  useEffect(() => {
    console.log(relatedVideos)
  }, [relatedVideos])

  const schema = yup.object({
    status: yup.number().required('Giá trị bắt buộc'),
    dateStart: yup
      .date()
      .when('status', (status, schema) => {
        // bắt buộc nếu k hoãn, hủy
        if (
          ![MATCH_STATUSES.PENDING.id, MATCH_STATUSES.CANCEL.id].includes(
            status,
          )
        )
          return schema.required('Giá trị bắt buộc')
        else return schema
      })
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr)),
    stadium: yup
      .string()
      .required('Giá trị bắt buộc')
      .trim()
      .max(255, 'Tối đa 255 ký tự'),
    preMatchSummary: yup.string(),
    team1Goal: yup
      .number()
      .min(0, 'Số dương')
      .integer('Số nguyên')
      .when('status', (status, schema) => {
        // bắt buộc nếu đang diễn ra/kết thúc
        if (
          [MATCH_STATUSES.STARTING.id, MATCH_STATUSES.ENDED.id].includes(status)
        )
          return schema.required('Giá trị bắt buộc')
        else return schema
      })
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr)),
    team2Goal: yup
      .number()
      .min(0, 'Số dương')
      .integer('Số nguyên')
      .when('status', (status, schema) => {
        // bắt buộc nếu đang diễn ra/kết thúc
        if (
          [MATCH_STATUSES.STARTING.id, MATCH_STATUSES.ENDED.id].includes(status)
        )
          return schema.required('Giá trị bắt buộc')
        else return schema
      })
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr)),
  })

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 0,
      dateStart: '',
      stadium: '',
      preMatchSummary: '',
      team1Goal: '',
      team2Goal: '',
    },
  })

  const initDefaultValues = (match: any) => {
    const defaultValues: any = {}
    defaultValues.status = match.status
    defaultValues.dateStart = match.dateStart ?? ''
    defaultValues.stadium = match.stadium ?? ''
    defaultValues.preMatchSummary = match.preMatchSummary ?? ''
    defaultValues.team1Goal = match.team1Goal ?? ''
    defaultValues.team2Goal = match.team2Goal ?? ''
    methods.reset({ ...defaultValues })
  }

  React.useEffect(() => {
    // TODO pending api, init related lists
    if (match) initDefaultValues(match)
  }, [])

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    const payload: any = {
      status: data.status,
      dateStart: data.dateStart,
      stadium: data.stadium,
      preMatchSummary: data.preMatchSummary,
      team1Goal: data.team1Goal,
      team2Goal: data.team2Goal,
    }
    // TODO consume api
    setIsLoading(false)
  }

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <SimpleCard>
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
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <FormProvider {...methods}>
                <TextField
                  label="Giải đấu"
                  variant="standard"
                  margin="normal"
                  value={match.leagueName}
                  fullWidth
                  disabled
                />

                <TextField
                  label="Đội bóng tham gia"
                  variant="standard"
                  margin="normal"
                  fullWidth
                  disabled
                  value={match.teamName}
                />

                <Controller
                  name="status"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="demo-simple-select-label">
                        Trạng thái*
                      </InputLabel>
                      <Select
                        variant="outlined"
                        sx={{ width: '50%' }}
                        {...field}
                        onClose={() =>
                          methods.trigger().then(() => methods.clearErrors())
                        }
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Trạng thái*"
                      >
                        {Object.values(MATCH_STATUSES).map((type, index) => {
                          return (
                            <MenuItem key={index} value={type.id}>
                              {type.label}
                            </MenuItem>
                          )
                        })}
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
                  name="dateStart"
                  control={methods.control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        {...field}
                        label={`Thời gian diễn ra${
                          methods.getValues('status') === 3 ? '' : '*'
                        }:`}
                        ampm={false}
                        renderInput={(params: any) => (
                          <FormControl fullWidth margin="normal">
                            <TextField
                              {...params}
                              error={!!methods.formState.errors?.dateStart}
                              helperText={
                                methods.formState.errors?.dateStart?.message
                              }
                              InputLabelProps={{ shrink: true }}
                              sx={{ width: '50%' }}
                              variant="outlined"
                              autoComplete="bday"
                            />
                          </FormControl>
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <Controller
                  name="stadium"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <TextField
                        error={!!methods.formState.errors?.stadium}
                        helperText={methods.formState.errors?.stadium?.message}
                        {...field}
                        label="Sân vận động*"
                        variant="outlined"
                        sx={{ width: '50%' }}
                      />
                    </FormControl>
                  )}
                />
                <FormControl fullWidth margin="normal">
                  <Typography color="grey">
                    Tổng thuật trước trận đấu:
                  </Typography>
                  <RHFWYSIWYGEditor name="preMatchSummary"></RHFWYSIWYGEditor>
                </FormControl>

                <MultipleVideosSelect
                  label="Video liên quan"
                  selectedArr={relatedVideos}
                  setSelectedArr={setRelatedVideos}
                />
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  color="info"
                  onClick={() =>
                    dialogRelatedVideosRef?.current.handleClickOpen()
                  }
                >
                  Chọn video liên quan
                </Button>
                <br />
                <MultipleNewsSelect
                  label="Tin tức liên quan"
                  selectedArr={relatedNews}
                  setSelectedArr={setRelatedNews}
                />
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  color="info"
                  onClick={() =>
                    dialogRelatedNewsRef?.current.handleClickOpen()
                  }
                >
                  Chọn tin tức liên quan
                </Button>

                <FormControl fullWidth margin="normal">
                  <Typography color="grey">Kết quả:</Typography>
                  <Stack direction="row" alignItems="start" gap={2}>
                    <Controller
                      name="team1Goal"
                      control={methods.control}
                      render={({ field }) => (
                        <TextField
                          error={!!methods.formState.errors?.team1Goal}
                          helperText={
                            methods.formState.errors?.team1Goal?.message
                          }
                          {...field}
                          label={`${match?.team1Name ?? 'Đội 1'}${
                            [1, 2].includes(methods.getValues('status'))
                              ? '*'
                              : ''
                          }`}
                          type="number"
                          variant="outlined"
                          margin="normal"
                        />
                      )}
                    />
                    {/* // TODO pending api */}
                    <MinimizeIcon sx={{ mt: '20px' }} />
                    <Controller
                      name="team2Goal"
                      control={methods.control}
                      render={({ field }) => (
                        <TextField
                          error={!!methods.formState.errors?.team2Goal}
                          helperText={
                            methods.formState.errors?.team2Goal?.message
                          }
                          {...field}
                          label={`${match?.team2Name ?? 'Đội 2'}${
                            [1, 2].includes(methods.getValues('status'))
                              ? '*'
                              : ''
                          }`}
                          type="number"
                          variant="outlined"
                          margin="normal"
                        />
                      )}
                    />
                  </Stack>
                </FormControl>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    m: 1,
                  }}
                >
                  <Button
                    color="primary"
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{ mx: 1 }}
                  >
                    Lưu
                  </Button>
                  <Button
                    variant="contained"
                    disabled={isLoading}
                    onClick={() => {
                      navigate(-1)
                    }}
                    sx={{ mx: 1 }}
                  >
                    Quay lại
                  </Button>
                </Box>
              </FormProvider>
            </form>

            <DialogSelectNews
              ref={dialogRelatedNewsRef}
              label="Chọn tin tức liên quan"
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              selectedList={relatedNews}
              setSelectedList={setRelatedNews}
            />
            <DialogSelectVideo
              label="Chọn video liên quan"
              ref={dialogRelatedVideosRef}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              selectedList={relatedVideos}
              setSelectedList={setRelatedVideos}
            />
          </SimpleCard>
        </Box>
      )}
    </div>
  )
}
