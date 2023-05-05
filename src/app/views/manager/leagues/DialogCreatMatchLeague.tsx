import { yupResolver } from '@hookform/resolvers/yup'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { createMatchForRound } from 'app/apis/leagues/leagues.service'
import { MuiRHFDateTimePicker } from 'app/components/common/MuiRHFDateTimePicker'
import { toastError, toastSuccess } from 'app/helpers/toastNofication'
import * as React from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import * as yup from 'yup'
interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  fetchScheduleCup: any
}

const DialogCreateMatchLeague = React.forwardRef((props: Props, ref) => {
  const [open, setOpen] = React.useState(false)
  const leagues = useSelector((state: any) => state.leagues)
  const [idRound, setIdRound] = React.useState(null)
  const [nameRound, setNameRound] = React.useState(null)
  const [status, setStatus] = React.useState<any>(0)

  React.useImperativeHandle(ref, () => ({
    handleClickOpen: (round: any) => {
      setIdRound(round.id)
      setNameRound(round.name)
      setOpen(true)
    },
    handleClose: () => {
      setOpen(false)
    },
  }))

  const handleClose = () => {
    clearData()
    setOpen(false)
  }

  const clearData = () => {
    methods.reset()
  }
  const schema = yup
    .object({
      idTeamA: yup.string().required('Giá trị bắt buộc'),
      idTeamB: yup
        .string()
        .required('Giá trị bắt buộc')
        .test(
          'team-match',
          'Hai đội bóng tham gia không được trùng nhau. Vui lòng chọn đội bóng khác',
          function (value) {
            return this.parent.idTeamA !== value
          },
        ),
      dateStart: yup.string().required('Giá trị bắt buộc'),
      status: yup.string(),
      stadium: yup.string().trim(),
      goalForTeamA:
        status === 1 || status === 2
          ? yup.string().matches(/^[0-9]+$/, 'Nhập số lơn hơn bằng 0')
          : yup.string(),
      goalForTeamB:
        status === 1 || status === 2
          ? yup.string().matches(/^[0-9]+$/, 'Nhập số lơn hơn bằng 0')
          : yup.string(),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      idTeamA: '',
      idTeamB: '',
      dateStart: '',
      status: '0',
      stadium: '',
      goalForTeamA: '',
      goalForTeamB: '',
    },
  })
  const onSubmit = async (data: any) => {
    props.setIsLoading(true)
    const payload = {
      idTeamA: data.idTeamA,
      goalForTeamA: data.goalForTeamA,
      idTeamB: data.idTeamB,
      goalForTeamB: data.goalForTeamB,
      dateStart: new Date(data.dateStart).toISOString() || null,
      status: status,
      stadium: data.stadium,
    }
    try {
      const res = await createMatchForRound(payload, idRound)
      if (res) {
        toastSuccess({
          message: 'Thêm trận đấu thành công',
        })
        props.fetchScheduleCup()
        handleClose()
      }
    } catch (e) {
      toastError({
        message: 'Thêm trận đáu thất bại',
      })
    } finally {
      props.setIsLoading(false)
    }
  }
  return (
    <div>
      <Dialog open={open} maxWidth="sm">
        <DialogTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>Thêm mới lịch thi đấu</div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormProvider {...methods}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography>Vòng đấu: {nameRound}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="idTeamA"
                    control={methods.control}
                    render={({ field }) => (
                      <FormControl
                        style={{ width: '400px' }}
                        margin="dense"
                        error={!!methods.formState.errors?.idTeamA}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Đội bóng chủ nhà*
                        </InputLabel>
                        <Select
                          autoWidth
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Đội bóng chủ nhà*"
                        >
                          {leagues.teamList.map((team: any) => (
                            <MenuItem key={team.id} value={team.id}>
                              {team.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!methods.formState.errors?.idTeamA?.message && (
                          <FormHelperText>
                            {methods.formState.errors?.idTeamA.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="idTeamB"
                    control={methods.control}
                    render={({ field }) => (
                      <FormControl
                        style={{ width: '400px' }}
                        margin="dense"
                        error={!!methods.formState.errors?.idTeamB}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Đội bóng sân khách*
                        </InputLabel>
                        <Select
                          autoWidth
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Đội bóng sân khách*"
                        >
                          {leagues.teamList.map((team: any) => (
                            <MenuItem key={team.id} value={team.id}>
                              {team.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!methods.formState.errors?.idTeamB?.message && (
                          <FormHelperText>
                            {methods.formState.errors?.idTeamB.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MuiRHFDateTimePicker
                      name="dateStart"
                      label="Thời gian diễn ra*"
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="stadium"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        error={!!methods.formState.errors?.stadium}
                        helperText={methods.formState.errors?.stadium?.message}
                        {...field}
                        label="Sân vận động"
                        variant="outlined"
                        margin="normal"
                        style={{ width: '400px' }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="status"
                    control={methods.control}
                    render={({ field }) => (
                      <FormControl
                        style={{ width: '100%' }}
                        margin="dense"
                        error={!!methods.formState.errors?.status}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Trạng thái
                        </InputLabel>
                        <Select
                          style={{ width: '400px' }}
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Chân thuận"
                          onChange={e => setStatus(e.target.value)}
                          value={status}
                        >
                          <MenuItem value={0}>Chưa diễn ra</MenuItem>
                          <MenuItem value={1}>Đang diễn ra</MenuItem>
                          <MenuItem value={4}>Hủy</MenuItem>
                          <MenuItem value={3}>Hoãn </MenuItem>
                          <MenuItem value={2}>Kết thúc</MenuItem>
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
                {(status === 1 || status === 2) && (
                  <Grid item xs={12}>
                    <InputLabel id="demo-simple-select-label">
                      Tỷ số trận đấu*
                    </InputLabel>
                    <Controller
                      name="goalForTeamA"
                      control={methods.control}
                      render={({ field }) => (
                        <TextField
                          error={!!methods.formState.errors?.goalForTeamA}
                          helperText={
                            methods.formState.errors?.goalForTeamA?.message
                          }
                          {...field}
                          variant="outlined"
                          margin="normal"
                          style={{ width: '100px', marginRight: '20px' }}
                        />
                      )}
                    />

                    <Controller
                      name="goalForTeamB"
                      control={methods.control}
                      render={({ field }) => (
                        <TextField
                          error={!!methods.formState.errors?.goalForTeamB}
                          helperText={
                            methods.formState.errors?.goalForTeamB?.message
                          }
                          {...field}
                          style={{ width: '100px' }}
                          variant="outlined"
                          margin="normal"
                        />
                      )}
                    />
                  </Grid>
                )}
              </Grid>
            </FormProvider>
            <Grid item xs={12} style={{ marginTop: '15px' }}>
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
                onClick={handleClose}
              >
                Quay lại
              </Button>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default DialogCreateMatchLeague
