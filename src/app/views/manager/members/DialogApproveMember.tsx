import { yupResolver } from '@hookform/resolvers/yup'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { approveMember } from 'app/apis/members/members.service'
import MuiRHFTextarea from 'app/components/common/MuiRHFTextarea'
import { toastSuccess } from 'app/helpers/toastNofication'
import dayjs from 'dayjs'
import React from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

export interface Props {
  idRegistration: number
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  refresh: () => void
}

const DialogApproveMember = React.forwardRef((props: Props, ref) => {
  const { idRegistration, isLoading, setIsLoading, refresh } = props

  const [open, setOpen] = React.useState(false)

  React.useImperativeHandle(ref, () => ({
    handleClickOpen: () => {
      setOpen(true)
    },
    handleClose: () => {
      setOpen(false)
      methods.reset()
    },
  }))

  const handleClose = () => {
    setOpen(false)
    methods.reset()
  }

  const today = new Date(new Date().getFullYear(), 0, 1)
  const next1Years = new Date(new Date().getFullYear(), 0, 1)
  next1Years.setFullYear(next1Years.getFullYear() + 1)
  const next20Years = new Date(new Date().getFullYear(), 0, 1)
  next20Years.setFullYear(next20Years.getFullYear() + 20)

  const schema = yup
    .object({
      from: yup
        .date()
        .required('Giá trị bắt buộc')
        .min(today, 'Năm hiện tại hoặc năm hiện tại + 1')
        .max(next1Years, 'Năm hiện tại hoặc năm hiện tại + 1')
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .typeError('Không hợp lệ'),
      to: yup
        .date()
        .required('Giá trị bắt buộc')
        .min(yup.ref('from'), 'Lớn hơn [Từ mùa giải]')
        .max(next20Years, 'Tối đa 20 năm từ năm hiện tại')
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .typeError('Không hợp lệ'),
      amount: yup
        .number()
        .min(0, 'Số dương')
        .integer('Số nguyên')
        .required('Giá trị bắt buộc')
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr)),
      note: yup.string().trim().max(255, 'Tối đa 255 ký tự'),
    })
    .required()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      from: dayjs().toDate(),
      to: dayjs().toDate(),
      amount: '',
      note: '',
    },
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)

    const yearFrom = dayjs(data.from).get('year')
    const yearTo = dayjs(data.to).get('year')
    let year = yearFrom
    let yearCount = 0
    const years = []
    while (year <= yearTo) {
      years.push(year)
      yearCount += 1
      year += 1
    }

    const payload: any = {
      amount: data.amount,
      numOfYears: yearCount,
      years: years.join(','),
      note: data.note,
    }
    setIsLoading(false)
    await approveMember(idRegistration, payload)
      .then(() => {
        toastSuccess({
          message: 'Thành công',
        })
        refresh()
        handleClose()
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
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

        <DialogTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>Bạn có chắc chắn muốn duyệt hội viên?</div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormProvider {...methods}>
            <DialogContent>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Controller
                      name="from"
                      control={methods.control}
                      render={({ field }) => (
                        <DatePicker
                          label="Từ mùa giải*"
                          {...field}
                          views={['year']}
                          minDate={today}
                          maxDate={next1Years}
                          renderInput={(params: any) => (
                            <FormControl fullWidth margin="normal">
                              <TextField
                                {...params}
                                error={!!methods.formState.errors?.from}
                                helperText={
                                  methods.formState.errors?.from?.message
                                }
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                              />
                            </FormControl>
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name="to"
                      control={methods.control}
                      render={({ field }) => (
                        <DatePicker
                          label="Đến mùa giải*"
                          {...field}
                          views={['year']}
                          minDate={methods.getValues('from') ?? today}
                          maxDate={next20Years}
                          renderInput={(params: any) => (
                            <FormControl fullWidth margin="normal">
                              <TextField
                                {...params}
                                error={!!methods.formState.errors?.to}
                                helperText={
                                  methods.formState.errors?.to?.message
                                }
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                              />
                            </FormControl>
                          )}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>

              <Controller
                name="amount"
                control={methods.control}
                render={({ field }) => (
                  <TextField
                    error={!!methods.formState.errors?.amount}
                    helperText={methods.formState.errors?.amount?.message}
                    {...field}
                    label="Mức phí hội viên (tổng tiền)*"
                    type="number"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                )}
              />

              <Typography>Ghi chú</Typography>
              <MuiRHFTextarea name="note" label="Ghi chú" />
            </DialogContent>
            <DialogActions sx={{ textAlign: 'center' }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                disabled={isLoading}
              >
                Đóng
              </Button>
              <Button
                color="primary"
                type="submit"
                variant="contained"
                disabled={isLoading}
              >
                {isLoading ? 'Đang duyệt...' : 'Phê duyệt'}
              </Button>
            </DialogActions>
          </FormProvider>
        </form>
      </Dialog>
    </div>
  )
})

export default DialogApproveMember
