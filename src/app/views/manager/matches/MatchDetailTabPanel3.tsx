import { yupResolver } from '@hookform/resolvers/yup'
import { Button, LinearProgress, TextField } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Box } from '@mui/system'
import {
  getMatchStats,
  updateMatchStats,
} from 'app/apis/matches/matches.service'
import { SimpleCard } from 'app/components'
import { toastSuccess } from 'app/helpers/toastNofication'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import './style.css'

const TableRowForm = (props: any) => {
  const {
    label,
    field1,
    field1Err,
    field1Msg,
    field2,
    field2Err,
    field2Msg,
    methods,
    endAdornment,
  } = props
  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell align="center">
        <Controller
          name={field1}
          control={methods.control}
          render={({ field }) => (
            <TextField
              error={!!field1Err}
              helperText={field1Msg}
              {...field}
              variant="outlined"
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{endAdornment}</InputAdornment>
                ),
              }}
            />
          )}
        />
      </TableCell>
      <TableCell align="center">
        <Controller
          name={field2}
          control={methods.control}
          render={({ field }) => (
            <TextField
              error={!!field2Err}
              helperText={field2Msg}
              {...field}
              variant="outlined"
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{endAdornment}</InputAdornment>
                ),
              }}
            />
          )}
        />
      </TableCell>
    </TableRow>
  )
}

MatchDetailTabPanel3.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  match: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
}

export default function MatchDetailTabPanel3(props: any) {
  const { value, index, match, isLoading, setIsLoading, ...other } = props

  const navigate = useNavigate()

  const [matchStats, setMatchStats] = useState<any>()

  const numberValidation = yup
    .number()
    .min(0, 'Số dương')
    .integer('Số nguyên')
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))

  const schema = yup.object({
    team1: yup.object().shape({
      possession: numberValidation,
      passAccuracy: numberValidation,
      shotsOnTarget: numberValidation,
      shots: numberValidation,
      passes: numberValidation,
      fouls: numberValidation,
      yellowCards: numberValidation,
      redCards: numberValidation,
      offsides: numberValidation,
      corners: numberValidation,
    }),
    team2: yup.object().shape({
      possession: numberValidation,
      passAccuracy: numberValidation,
      shotsOnTarget: numberValidation,
      shots: numberValidation,
      passes: numberValidation,
      fouls: numberValidation,
      yellowCards: numberValidation,
      redCards: numberValidation,
      offsides: numberValidation,
      corners: numberValidation,
    }),
  })

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      team1: {
        possession: '',
        passAccuracy: '',
        shotsOnTarget: '',
        shots: '',
        passes: '',
        fouls: '',
        yellowCards: '',
        redCards: '',
        offsides: '',
        corners: '',
      },
      team2: {
        possession: '',
        passAccuracy: '',
        shotsOnTarget: '',
        shots: '',
        passes: '',
        fouls: '',
        yellowCards: '',
        redCards: '',
        offsides: '',
        corners: '',
      },
    },
  })

  const initDefaultValues = (matchStats: any) => {
    const defaultValues: any = {
      team1: {},
      team2: {},
    }
    defaultValues.team1.possession = matchStats.team1Possession ?? ''
    defaultValues.team1.passAccuracy = matchStats.team1PassAccuracy ?? ''
    defaultValues.team1.shotsOnTarget = matchStats.team1ShotsOnTarget ?? ''
    defaultValues.team1.shots = matchStats.team1Shots ?? ''
    defaultValues.team1.passes = matchStats.team1Passes ?? ''
    defaultValues.team1.fouls = matchStats.team1Fouls ?? ''
    defaultValues.team1.yellowCards = matchStats.team1YellowCards ?? ''
    defaultValues.team1.redCards = matchStats.team1RedCards ?? ''
    defaultValues.team1.offsides = matchStats.team1Offsides ?? ''
    defaultValues.team1.corners = matchStats.team1Corners ?? ''
    defaultValues.team2.possession = matchStats.team2Possession ?? ''
    defaultValues.team2.passAccuracy = matchStats.team2PassAccuracy ?? ''
    defaultValues.team2.shotsOnTarget = matchStats.team2ShotsOnTarget ?? ''
    defaultValues.team2.shots = matchStats.team2Shots ?? ''
    defaultValues.team2.passes = matchStats.team2Passes ?? ''
    defaultValues.team2.fouls = matchStats.team2Fouls ?? ''
    defaultValues.team2.yellowCards = matchStats.team2YellowCards ?? ''
    defaultValues.team2.redCards = matchStats.team2RedCards ?? ''
    defaultValues.team2.offsides = matchStats.team2Offsides ?? ''
    defaultValues.team2.corners = matchStats.team2Corners ?? ''
    methods.reset({ ...defaultValues })
  }

  const fetchMatchStats = async () => {
    setIsLoading(true)
    await getMatchStats(match.id)
      .then(res => {
        setMatchStats(res)
        initDefaultValues(res)
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  React.useEffect(() => {
    fetchMatchStats()
  }, [])

  const onSubmit = async (data: any) => {
    setIsLoading(true)

    const payload: any = {
      idMatch: matchStats.idMatch,
      team1Possession: data.team1.possession,
      team2Possession: data.team2.possession,
      team1PassAccuracy: data.team1.passAccuracy,
      team2PassAccuracy: data.team2.passAccuracy,
      team1ShotsOnTarget: data.team1.shotsOnTarget,
      team2ShotsOnTarget: data.team2.shotsOnTarget,
      team1Shots: data.team1.shots,
      team2Shots: data.team2.shots,
      team1Passes: data.team1.passes,
      team2Passes: data.team2.passes,
      team1Fouls: data.team1.fouls,
      team2Fouls: data.team2.fouls,
      team1YellowCards: data.team1.yellowCards,
      team2YellowCards: data.team2.yellowCards,
      team1RedCards: data.team1.redCards,
      team2RedCards: data.team2.redCards,
      team1Offsides: data.team1.offsides,
      team2Offsides: data.team2.offsides,
      team1Corners: data.team1.corners,
      team2Corners: data.team2.corners,
    }

    await updateMatchStats(match.id, payload)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
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
                  overflow: 'auto',
                }}
              >
                <LinearProgress />
              </Box>
            )}
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <FormProvider {...methods}>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Thống kê trận đấu</TableCell>
                        <TableCell align="center">
                          {matchStats?.team1Name ?? 'Đội 1'}
                        </TableCell>
                        <TableCell align="center">
                          {matchStats?.team2Name ?? 'Đội 2'}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRowForm
                        label="Tỷ lệ kiểm soát bóng"
                        field1="team1.possession"
                        field1Err={methods.formState.errors?.team1?.possession}
                        field1Msg={
                          methods.formState.errors?.team1?.possession?.message
                        }
                        field2="team2.possession"
                        field2Err={methods.formState.errors?.team2?.possession}
                        field2Msg={
                          methods.formState.errors?.team2?.possession?.message
                        }
                        methods={methods}
                        endAdornment="%"
                      />
                      <TableRowForm
                        label="Tỷ lệ đường chuyền chính xác"
                        field1="team1.passAccuracy"
                        field1Err={
                          methods.formState.errors?.team1?.passAccuracy
                        }
                        field1Msg={
                          methods.formState.errors?.team1?.passAccuracy?.message
                        }
                        field2="team2.passAccuracy"
                        field2Err={
                          methods.formState.errors?.team2?.passAccuracy
                        }
                        field2Msg={
                          methods.formState.errors?.team2?.passAccuracy?.message
                        }
                        methods={methods}
                        endAdornment="%"
                      />
                      <TableRowForm
                        label="Dứt điểm hướng mục tiêu"
                        field1="team1.shotsOnTarget"
                        field1Err={
                          methods.formState.errors?.team1?.shotsOnTarget
                        }
                        field1Msg={
                          methods.formState.errors?.team1?.shotsOnTarget
                            ?.message
                        }
                        field2="team2.shotsOnTarget"
                        field2Err={
                          methods.formState.errors?.team2?.shotsOnTarget
                        }
                        field2Msg={
                          methods.formState.errors?.team2?.shotsOnTarget
                            ?.message
                        }
                        methods={methods}
                        endAdornment=""
                      />
                      <TableRowForm
                        label="Số lần dứt điểm"
                        field1="team1.shots"
                        field1Err={methods.formState.errors?.team1?.shots}
                        field1Msg={
                          methods.formState.errors?.team1?.shots?.message
                        }
                        field2="team2.shots"
                        field2Err={methods.formState.errors?.team2?.shots}
                        field2Msg={
                          methods.formState.errors?.team2?.shots?.message
                        }
                        methods={methods}
                        endAdornment=""
                      />
                      <TableRowForm
                        label="Số đường truyền"
                        field1="team1.passes"
                        field1Err={methods.formState.errors?.team1?.passes}
                        field1Msg={
                          methods.formState.errors?.team1?.passes?.message
                        }
                        field2="team2.passes"
                        field2Err={methods.formState.errors?.team2?.passes}
                        field2Msg={
                          methods.formState.errors?.team2?.passes?.message
                        }
                        methods={methods}
                        endAdornment=""
                      />
                      <TableRowForm
                        label="Phạm lỗi"
                        field1="team1.fouls"
                        field1Err={methods.formState.errors?.team1?.fouls}
                        field1Msg={
                          methods.formState.errors?.team1?.fouls?.message
                        }
                        field2="team2.fouls"
                        field2Err={methods.formState.errors?.team2?.fouls}
                        field2Msg={
                          methods.formState.errors?.team2?.fouls?.message
                        }
                        methods={methods}
                        endAdornment=""
                      />
                      <TableRowForm
                        label="Thẻ vàng"
                        field1="team1.yellowCards"
                        field1Err={methods.formState.errors?.team1?.yellowCards}
                        field1Msg={
                          methods.formState.errors?.team1?.yellowCards?.message
                        }
                        field2="team2.yellowCards"
                        field2Err={methods.formState.errors?.team2?.yellowCards}
                        field2Msg={
                          methods.formState.errors?.team2?.yellowCards?.message
                        }
                        methods={methods}
                        endAdornment=""
                      />
                      <TableRowForm
                        label="Thẻ đỏ"
                        field1="team1.redCards"
                        field1Err={methods.formState.errors?.team1?.redCards}
                        field1Msg={
                          methods.formState.errors?.team1?.redCards?.message
                        }
                        field2="team2.redCards"
                        field2Err={methods.formState.errors?.team2?.redCards}
                        field2Msg={
                          methods.formState.errors?.team2?.redCards?.message
                        }
                        methods={methods}
                        endAdornment=""
                      />
                      <TableRowForm
                        label="Việt vị"
                        field1="team1.offsides"
                        field1Err={methods.formState.errors?.team1?.offsides}
                        field1Msg={
                          methods.formState.errors?.team1?.offsides?.message
                        }
                        field2="team2.offsides"
                        field2Err={methods.formState.errors?.team2?.offsides}
                        field2Msg={
                          methods.formState.errors?.team2?.offsides?.message
                        }
                        methods={methods}
                        endAdornment=""
                      />
                      <TableRowForm
                        label="Phạt góc"
                        field1="team1.corners"
                        field1Err={methods.formState.errors?.team1?.corners}
                        field1Msg={
                          methods.formState.errors?.team1?.corners?.message
                        }
                        field2="team2.corners"
                        field2Err={methods.formState.errors?.team2?.corners}
                        field2Msg={
                          methods.formState.errors?.team2?.corners?.message
                        }
                        methods={methods}
                        endAdornment=""
                      />
                    </TableBody>
                  </Table>
                </TableContainer>

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
                    variant="outlined"
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
          </SimpleCard>
        </Box>
      )}
    </div>
  )
}
