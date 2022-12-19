import React from 'react'
import { TextField, Grid, Button } from '@mui/material'
import { generate } from 'generate-password'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { updateMerchantPassword } from 'app/apis/merchant/merchant.service'
import { useParams } from 'react-router-dom'
import { toastSuccess } from 'app/helpers/toastNofication'
import { messages } from 'app/utils/messages'
const ChangePasswordMerchant = ({ handleClose }) => {
  const params = useParams()
  const schema = yup
    .object({
      password: yup
        .string()
        .required(messages.MSG1)
        .test('latinChars', messages.MSG21, value => {
          const regexStr = /^[\x20-\x7E]+$/
          if (value) {
            return regexStr.test(value)
          } else return false
        })
        .matches(/^\S*$/, messages.MSG21)
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, messages.MSG20)
        .min(8, messages.MSG20)
        .max(32, messages.MSG20),
      note: yup.string().max(255, 'Ghi chú không được vượt quá 255 ký tự'),
    })
    .required()

  const generatePassword = () => {
    const password = generate({
      length: 8,
      numbers: true,
    })
    clearErrors('password')
    setValue('password', password + Math.floor(Math.random() * 10))
  }

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      note: '',
    },
  })

  const onSubmit = (data, event) => {
    event.preventDefault()
    event.stopPropagation()
    const res = updateMerchantPassword(params.id, {
      newPassword: data.password,
      note: data.note,
    })
    handleClose()
    if (res) {
      toastSuccess({ message: 'Đổi mật khẩu thành công' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Grid
          item
          xs={12}
          md={12}
          style={{ alignItems: 'baseline', display: 'flex' }}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.password}
                helperText={errors.password?.message}
                {...field}
                label="Mật khẩu mới*"
                variant="outlined"
                margin="normal"
              />
            )}
          />
          <Button
            color="primary"
            variant="contained"
            style={{ marginLeft: '15px' }}
            onClick={generatePassword}
          >
            Tạo tự động
          </Button>
        </Grid>
      </div>

      <Grid item xs={12} md={12}>
        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <TextField
              style={{ width: '50%' }}
              error={!!errors.note}
              helperText={errors.note?.message}
              {...field}
              multiline
              rows={4}
              label="Ghi chú"
              variant="outlined"
              margin="normal"
            />
          )}
        />
      </Grid>
      <Grid>
        <Button color="primary" variant="contained" type="submit">
          Lưu
        </Button>
        <Button
          color="primary"
          variant="contained"
          type="button"
          style={{ marginLeft: '15px' }}
          onClick={() => {
            handleClose()
          }}
        >
          Hủy
        </Button>
      </Grid>
    </form>
  )
}

export default ChangePasswordMerchant
