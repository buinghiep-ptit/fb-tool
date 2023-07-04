import { yupResolver } from '@hookform/resolvers/yup'
import MinimizeIcon from '@mui/icons-material/Minimize'
import {
  Button,
  CardActions,
  CardContent,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { Box, Stack } from '@mui/system'
import { updateMatchProcess } from 'app/apis/matches/matches.service'
import { SimpleCard } from 'app/components'
import RHFWYSIWYGEditor from 'app/components/common/RHFWYSIWYGEditor'
import { toastSuccess } from 'app/helpers/toastNofication'
import React, { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { MATCH_PROCESS_TYPES } from '../../../constants/matchProcessTypes'
import DialogDeleteProcess from './MatchProcessDelete'

export default function MatchProcess(props: any) {
  const { match, matchProcess, isLoading, setIsLoading, refresh } = props
  const [editable, setEditable] = useState(false)

  const dialogDeleteProcessRef = React.useRef<any>(null)

  const schema = yup.object({
    type: yup.number(),
    time: yup
      .string()
      .required('Giá trị bắt buộc')
      .trim()
      .max(255, 'Tối đa 255 ký tự'),
    idTeam: yup
      .number()
      .when('type', (type, schema) => {
        // vào
        if ([MATCH_PROCESS_TYPES.SCORED.id].includes(type))
          return schema.required('Giá trị bắt buộc')
        else return schema
      })
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr)),
    player: yup
      .string()
      .trim()
      .max(255, 'Tối đa 255 ký tự')
      .when('type', (type, schema) => {
        // thẻ đỏ, vàng, vào
        if (
          [
            MATCH_PROCESS_TYPES.RED_CARD.id,
            MATCH_PROCESS_TYPES.YELLOW_CARD.id,
            MATCH_PROCESS_TYPES.SCORED.id,
          ].includes(type)
        )
          return schema.required('Giá trị bắt buộc')
        else return schema
      }),
    description: yup
      .string()
      .required('Giá trị bắt buộc')
      .trim()
      .test('notEmpty', 'Giá trị bắt buộc', value => {
        return value !== '<p></p>'
      }),
    team1Goal: yup
      .number()
      .min(0, 'Số dương')
      .integer('Số nguyên')
      .max(9999, 'Tối đa 4 chữ số')
      .when('type', (type, schema) => {
        // kết thúc hiệp 1/ kết thúc trận đấu
        if ([MATCH_PROCESS_TYPES.END_ROUND1.id].includes(type))
          return schema.required('Giá trị bắt buộc')
        else return schema
      })
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr)),
    team2Goal: yup
      .number()
      .min(0, 'Số dương')
      .integer('Số nguyên')
      .max(9999, 'Tối đa 4 chữ số')
      .when('type', (type, schema) => {
        // bắt buộc nếu cập nhật tỷ số hiệp 1/ kết thúc trận đấu
        if ([MATCH_PROCESS_TYPES.END_ROUND1.id].includes(type))
          return schema.required('Giá trị bắt buộc')
        else return schema
      })
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr)),
  })

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 1,
      time: '',
      idTeam: '',
      player: '',
      description: '',
      team1Goal: '',
      team2Goal: '',
    },
  })

  const initDefaultValues = (matchProcess: any) => {
    const defaultValues: any = {}
    defaultValues.type = matchProcess?.type
    defaultValues.time = matchProcess?.time ?? ''
    defaultValues.idTeam = matchProcess?.scoredTeam ?? ''
    defaultValues.player = matchProcess?.player ?? ''
    defaultValues.description = matchProcess?.description ?? ''
    defaultValues.team1Goal = matchProcess?.team1Goal ?? ''
    defaultValues.team2Goal = matchProcess?.team2Goal ?? ''
    methods.reset({ ...defaultValues })
  }

  React.useEffect(() => {
    if (matchProcess) {
      initDefaultValues(matchProcess)
    }
  }, [matchProcess])

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    setEditable(false)
    const payload: any = {
      id: matchProcess.id,
      idMatch: matchProcess.idMatch,
      type: data.type,
      time: data.time,
      idTeam: data.idTeam ?? null,
      player: data.player ?? null,
      team1Goal: data.team1Goal ?? null,
      team2Goal: data.team2Goal ?? null,
      description: data.description,
    }

    await updateMatchProcess(payload)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
      })
      .catch(() => {
        setEditable(true)
      })
      .finally(() => {
        setIsLoading(false)
        refresh()
      })
  }

  return (
    <Box sx={{ width: '100%' }}>
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

      <DialogDeleteProcess
        ref={dialogDeleteProcessRef}
        matchProcess={matchProcess}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        refresh={refresh}
      />

      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          <SimpleCard>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Controller
                    name="type"
                    control={methods.control}
                    render={({ field }) => (
                      <FormControl fullWidth margin="dense">
                        <InputLabel id="demo-simple-select-label">
                          Loại diễn biến*
                        </InputLabel>
                        <Select
                          variant="outlined"
                          {...field}
                          onClose={() => {
                            methods.trigger().then(() => methods.clearErrors())
                          }}
                          onChange={field.onChange as any}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Loại diễn biến*"
                          fullWidth
                          disabled={!editable}
                        >
                          {Object.values(MATCH_PROCESS_TYPES).map(
                            (type, index) => {
                              return (
                                <MenuItem key={index} value={type.id}>
                                  {type.label}
                                </MenuItem>
                              )
                            },
                          )}
                        </Select>
                        {!!methods.formState.errors?.type?.message && (
                          <FormHelperText>
                            {methods.formState.errors?.type.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="time"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        label="Thời gian*"
                        error={!!methods.formState.errors?.time}
                        helperText={methods.formState.errors?.time?.message}
                        {...field}
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        disabled={!editable}
                      />
                    )}
                  />
                </Grid>
                {[MATCH_PROCESS_TYPES.SCORED.id].includes(
                  methods.getValues('type'),
                ) && (
                  <Grid item xs={6}>
                    <Controller
                      name="idTeam"
                      control={methods.control}
                      render={({ field }) => (
                        <FormControl fullWidth margin="dense">
                          <InputLabel id="demo-simple-select-label">
                            Đội ghi bàn*
                          </InputLabel>
                          <Select
                            variant="outlined"
                            {...field}
                            onChange={field.onChange as any}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Loại diễn biến*"
                            fullWidth
                            disabled={!editable}
                          >
                            <MenuItem value={match?.idTeam1 ?? 0}>
                              {match?.team1Name ?? 'Doi 1'}
                            </MenuItem>
                            <MenuItem value={match?.idTeam2 ?? 1}>
                              {match?.team2Name ?? 'Doi 2'}
                            </MenuItem>
                          </Select>
                          {!!methods.formState.errors?.idTeam?.message && (
                            <FormHelperText>
                              {methods.formState.errors?.idTeam.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                )}
                {[
                  MATCH_PROCESS_TYPES.RED_CARD.id,
                  MATCH_PROCESS_TYPES.YELLOW_CARD.id,
                  MATCH_PROCESS_TYPES.SCORED.id,
                ].includes(methods.getValues('type')) && (
                  <Grid item xs={6}>
                    <Controller
                      name="player"
                      control={methods.control}
                      render={({ field }) => (
                        <TextField
                          label="Cầu thủ*"
                          error={!!methods.formState.errors?.player}
                          helperText={methods.formState.errors?.player?.message}
                          {...field}
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          disabled={!editable}
                        />
                      )}
                    />
                  </Grid>
                )}
                {[MATCH_PROCESS_TYPES.END_ROUND1.id].includes(
                  methods.getValues('type'),
                ) && (
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="dense">
                      <Typography color="grey">Tỷ số:</Typography>
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
                              label={`${match?.team1Name ?? 'Đội 1'}*`}
                              type="number"
                              variant="outlined"
                              margin="dense"
                              disabled={!editable}
                            />
                          )}
                        />
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
                              label={`${match?.team2Name ?? 'Đội 2'}*`}
                              type="number"
                              variant="outlined"
                              margin="dense"
                              disabled={!editable}
                            />
                          )}
                        />
                      </Stack>
                    </FormControl>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormControl fullWidth margin="dense">
                    <FormLabel error={!!methods.formState.errors?.description}>
                      Mô tả diễn biến:*
                    </FormLabel>
                    <RHFWYSIWYGEditor
                      name="description"
                      readOnly={!editable}
                      key={editable ? 1 : 0}
                    ></RHFWYSIWYGEditor>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            {editable && (
              <CardActions
                sx={{
                  alignSelf: 'stretch',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                  p: 2,
                }}
              >
                <Button
                  color="primary"
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                >
                  Lưu
                </Button>
                <Button
                  variant="outlined"
                  disabled={isLoading}
                  onClick={() => {
                    methods.reset()
                    setEditable(false)
                  }}
                >
                  Hủy
                </Button>
              </CardActions>
            )}
            {!editable && (
              <CardActions
                sx={{
                  alignSelf: 'stretch',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                  p: 2,
                }}
              >
                {/* <Button
                  color="secondary"
                  disabled={isLoading}
                  onClick={() => {
                    console.info('gui thong bao')
                  }}
                >
                  // TODO api: gui lai
                  Gửi thông báo
                </Button> */}
                <Button
                  color="error"
                  disabled={isLoading}
                  onClick={() => {
                    dialogDeleteProcessRef?.current.handleClickOpen()
                  }}
                >
                  Xóa
                </Button>
                <Button
                  color="primary"
                  disabled={isLoading}
                  onClick={() => {
                    setEditable(true)
                  }}
                >
                  Sửa
                </Button>
              </CardActions>
            )}
          </SimpleCard>
        </FormProvider>
      </form>
    </Box>
  )
}
