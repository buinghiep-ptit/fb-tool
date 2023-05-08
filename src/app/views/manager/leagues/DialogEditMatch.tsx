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
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { editMatch } from 'app/apis/leagues/leagues.service'
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

const DialogEditMatch = React.forwardRef((props: Props, ref) => {
  const [open, setOpen] = React.useState(false)
  const leagues = useSelector((state: any) => state.leagues)
  const [idMatch, setIdMatch] = React.useState()
  const [status, setStatus] = React.useState<any>(0)
  const initDefaultValues = (match: any) => {
    setIdMatch(match.id)
    const defaultValues: any = {}
    defaultValues.idTeamA = match.teamA.id
    defaultValues.idTeamB = match.teamB.id
    defaultValues.dateStart = new Date(match.dateStart)
    defaultValues.status = match.status
    defaultValues.stadium = match.stadium
    defaultValues.goalForTeamA = match.goalForTeamA
    defaultValues.goalForTeamB = match.goalForTeamB
    methods.reset({ ...defaultValues })
    setStatus(match.status)
  }

  React.useImperativeHandle(ref, () => ({
    handleClickOpen: (match: any) => {
      initDefaultValues(match)
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
      dateStart: yup
        .date()
        .typeError('Thời gian diễn ra không hợp lệ. Vui lòng nhập lại'),
      status: yup.string(),
      stadium: yup.string().trim(),
      goalForTeamA:
        status === 1 || status === 2
          ? yup
              .string()
              .matches(/^[0-9]+$/, 'Vui lòng nhập số lớn hơn bằng 0')
              .typeError('Vui lòng nhập số lớn hơn bằng 0')
          : yup.string().nullable(),
      goalForTeamB:
        status === 1 || status === 2
          ? yup
              .string()
              .matches(/^[0-9]+$/, 'Vui lòng nhập số lớn hơn bằng 0')
              .typeError('Vui lòng nhập số lớn hơn bằng 0')
          : yup.string().nullable(),
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
    console.log(data)
    const payload = {
      idTeamA: data.idTeamA,
      goalForTeamA: status === 1 || status === 2 ? data.goalForTeamA : '',
      idTeamB: data.idTeamB,
      goalForTeamB: status === 1 || status === 2 ? data.goalForTeamB : '',
      dateStart: new Date(data.dateStart).toISOString() || null,
      status: status,
      stadium: data.stadium,
    }

    try {
      const res = await editMatch(payload, idMatch)
      if (res) {
        toastSuccess({
          message: 'Chỉnh sửa trận đấu thành công',
        })
        props.fetchScheduleCup()
        handleClose()
      }
    } catch (e) {
      toastError({
        message: 'Chỉnh sửa trận đáu thất bại',
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
            <div>Chỉnh sửa lịch thi đấu</div>
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
                  <Controller
                    name="idTeamA"
                    control={methods.control}
                    render={({ field }) => (
                      <FormControl
                        style={{ width: '400px' }}
                        margin="dense"
                        error={!!methods.formState.errors?.idTeamA}
                        disabled
                      >
                        <InputLabel id="demo-simple-select-label">
                          Đội bóng 1*
                        </InputLabel>
                        <Select
                          autoWidth
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Đội bóng 1*:"
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
                        disabled
                      >
                        <InputLabel id="demo-simple-select-label">
                          Đội bóng 2*
                        </InputLabel>
                        <Select
                          autoWidth
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Đội bóng 2*"
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
                <Grid item xs={6}>
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
                          label="Trạng thái"
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
            <Grid item xs={12}>
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

export default DialogEditMatch
