import { yupResolver } from '@hookform/resolvers/yup'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
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
import { MuiRHFDatePicker } from 'app/components/common/MuiRHFDatePicker'
import * as React from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const DialogCreateMatch = React.forwardRef((props: Props, ref) => {
  const [open, setOpen] = React.useState(false)

  React.useImperativeHandle(ref, () => ({
    handleClickOpen: () => {
      setOpen(true)
    },
    handleClose: () => {
      setOpen(false)
    },
  }))

  const handleClose = () => {
    setOpen(false)
  }

  const schema = yup
    .object({
      idTeamA: yup.string().required('Giá trị bắt buộc'),
      idTeamB: yup.string().required('Giá trị bắt buộc'),
      dateStart: yup.string(),
      status: yup.string(),
      stadium: yup.string(),
      goalForTeamA: yup.string(),
      goalForTeamB: yup.string(),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      idTeamA: '',
      idTeamB: '',
      dateStart: '',
      status: '',
      stadium: '',
      goalForTeamA: '',
      goalForTeamB: '',
    },
  })
  const onSubmit = async (data: any) => {
    console.log(data)
  }
  return (
    <div>
      <Dialog open={open} maxWidth="xl">
        <DialogTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>Chọn đội bóng tham gia giải đấu</div>
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
                        style={{ width: '100%' }}
                        margin="dense"
                        error={!!methods.formState.errors?.idTeamA}
                      >
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
                          <MenuItem value={3}>Cả hai chân</MenuItem>
                          <MenuItem value={2}>Trái</MenuItem>
                          <MenuItem value={1}>Phải</MenuItem>
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
                    name="idTeamA"
                    control={methods.control}
                    render={({ field }) => (
                      <FormControl
                        style={{ width: '100%' }}
                        margin="dense"
                        error={!!methods.formState.errors?.idTeamA}
                      >
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
                          <MenuItem value={3}>Cả hai chân</MenuItem>
                          <MenuItem value={2}>Trái</MenuItem>
                          <MenuItem value={1}>Phải</MenuItem>
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MuiRHFDatePicker
                      name="startDate"
                      label="Ngày sinh*"
                      inputFormat={'DD/MM/YYYY'}
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
                        label="Quê quán*"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </FormProvider>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default DialogCreateMatch
