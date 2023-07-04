import { yupResolver } from '@hookform/resolvers/yup'
import MinimizeIcon from '@mui/icons-material/Minimize'
import {
  Button,
  CardActions,
  CardContent,
  Collapse,
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
import { createMatchProcess } from 'app/apis/matches/matches.service'
import { SimpleCard } from 'app/components'
import RHFWYSIWYGEditor from 'app/components/common/RHFWYSIWYGEditor'
import { toastSuccess } from 'app/helpers/toastNofication'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { MATCH_PROCESS_TYPES } from '../../../constants/matchProcessTypes'

export interface Props {
  match: any
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  refresh: () => void
}

const MatchProcessCreate = React.forwardRef((props: Props, ref) => {
  const { match, isLoading, setIsLoading, refresh } = props
  const [show, setShow] = useState(false)

  React.useImperativeHandle(ref, () => ({
    handleClickOpen: () => {
      setShow(true)
    },
    handleClose: () => {
      handleClose()
    },
  }))

  const handleClose = () => {
    setShow(false)
  }

  useEffect(() => {
    if (!show) methods.reset()
  }, [show])

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

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    const payload: any = {
      idMatch: match.id,
      type: data.type,
      time: data.time,
      idTeam: data.idTeam ?? null,
      player: data.player ?? null,
      team1Goal: data.team1Goal ?? null,
      team2Goal: data.team2Goal ?? null,
      description: data.description,
    }

    await createMatchProcess(payload)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
        handleClose()
        refresh()
      })
  }

  return (
    <Collapse in={show} timeout={{ appear: 500, enter: 500, exit: 0 }}>
      <Box sx={{ mb: 2 }}>
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
                              methods
                                .trigger()
                                .then(() => methods.clearErrors())
                            }}
                            onChange={field.onChange as any}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Loại diễn biến*"
                            fullWidth
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
                            helperText={
                              methods.formState.errors?.player?.message
                            }
                            {...field}
                            variant="outlined"
                            margin="dense"
                            fullWidth
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
                              />
                            )}
                          />
                        </Stack>
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="dense">
                      <FormLabel
                        error={!!methods.formState.errors?.description}
                      >
                        Mô tả diễn biến:*
                      </FormLabel>
                      <RHFWYSIWYGEditor
                        name="description"
                        key={show ? 1 : 2}
                      ></RHFWYSIWYGEditor>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
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
                    handleClose()
                  }}
                >
                  Hủy
                </Button>
              </CardActions>
            </SimpleCard>
          </FormProvider>
        </form>
      </Box>
    </Collapse>
  )
})

export default MatchProcessCreate
