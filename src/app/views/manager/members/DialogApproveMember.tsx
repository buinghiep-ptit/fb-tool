import { yupResolver } from '@hookform/resolvers/yup'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  LinearProgress,
  Radio,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { approveMember } from 'app/apis/members/members.service'
import { MuiRHFRadioGroup } from 'app/components/common/MuiRHFRadioGroup'
import MuiRHFTextarea from 'app/components/common/MuiRHFTextarea'
import MuiRHFNumericFormatInput from 'app/components/common/MuiRHFWithNumericFormat'
import { toastSuccess } from 'app/helpers/toastNofication'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
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
      type: yup.number().required().min(1).max(2),
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
        .when('type', (type, schema) => {
          if (Number(type) === 2) return schema.required('Giá trị bắt buộc')
          else return schema
        })
        .max(next20Years, 'Tối đa 20 năm từ năm hiện tại')
        .when('type', (type, schema) => {
          if (type === 2)
            return schema.min(yup.ref('from'), 'Lớn hơn [Từ mùa giải]')
          else return schema
        })
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
      type: 1,
      from: dayjs().startOf('year').toDate(),
      to: dayjs().startOf('year').toDate(),
      amount: '',
      note: '',
    },
  })

  const watchFrom = methods.watch('from')
  const watchType = methods.watch('type')
  useEffect(() => {
    methods.trigger().then(() => methods.clearErrors())
  }, [watchType])

  const onSubmit = async (data: any) => {
    setIsLoading(true)

    const yearFrom = dayjs(data.from).get('year')
    const yearTo =
      data.type === 1
        ? dayjs(data.from).get('year')
        : dayjs(data.to).get('year')

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
      note: data.note ? data.note : null,
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
      <Dialog open={open} onClose={handleClose} fullWidth>
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
                  <Grid item xs={12}>
                    <MuiRHFRadioGroup name="type" row>
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Một mùa giải"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="Nhiều mùa giải"
                      />
                    </MuiRHFRadioGroup>
                  </Grid>
                  <Grid item xs={6}>
                    <Controller
                      name="from"
                      control={methods.control}
                      render={({ field }) => (
                        <DatePicker
                          label="Từ mùa giải*"
                          {...field}
                          onChange={field.onChange as any}
                          views={['year']}
                          openTo="year"
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
                              />
                            </FormControl>
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    display={Number(watchType) === 2 ? 'block' : 'none'}
                  >
                    <Controller
                      name="to"
                      control={methods.control}
                      render={({ field }) => (
                        <DatePicker
                          label="Đến mùa giải*"
                          {...field}
                          onChange={field.onChange as any}
                          views={['year']}
                          openTo="year"
                          minDate={watchFrom}
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
                              />
                            </FormControl>
                          )}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>

              <FormControl fullWidth margin="normal">
                <MuiRHFNumericFormatInput
                  name="amount"
                  label="Mức phí hội viên (tổng tiền)*"
                  fullWidth
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <FormLabel error={!!methods.formState.errors?.note}>
                  Ghi chú
                </FormLabel>
                <MuiRHFTextarea name="note" label="Ghi chú" />
              </FormControl>
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
