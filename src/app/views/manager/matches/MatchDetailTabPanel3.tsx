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
import { SimpleCard } from 'app/components'
import PropTypes from 'prop-types'
import React from 'react'
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
  refresh: PropTypes.func.isRequired,
}

export default function MatchDetailTabPanel3(props: any) {
  const { value, index, match, isLoading, setIsLoading, refresh, ...other } =
    props

  const navigate = useNavigate()

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

  const initDefaultValues = (match: any) => {
    const defaultValues: any = {
      team1: {},
      team2: {},
    }
    defaultValues.team1.possession = match?.team1?.possession ?? ''
    defaultValues.team1.passAccuracy = match?.team1?.passAccuracy ?? ''
    defaultValues.team1.shotsOnTarget = match?.team1?.shotsOnTarget ?? ''
    defaultValues.team1.shots = match?.team1?.shots ?? ''
    defaultValues.team1.passes = match?.team1?.passes ?? ''
    defaultValues.team1.fouls = match?.team1?.fouls ?? ''
    defaultValues.team1.yellowCards = match?.team1?.yellowCards ?? ''
    defaultValues.team1.redCards = match?.team1?.redCards ?? ''
    defaultValues.team1.offsides = match?.team1?.offsides ?? ''
    defaultValues.team1.corners = match?.team1?.corners ?? ''
    methods.reset({ ...defaultValues })
  }

  React.useEffect(() => {
    // TODO pending api
    if (match) initDefaultValues(match)
  }, [])

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    const payload: any = {}
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
                          {match?.team1Name ?? 'Đội 1'}
                        </TableCell>
                        <TableCell align="center">
                          {match?.team2Name ?? 'Đội 2'}
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
          </SimpleCard>
        </Box>
      )}
    </div>
  )
}
