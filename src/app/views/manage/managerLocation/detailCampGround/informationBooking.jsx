import * as React from 'react'
import { Grid, TextField, Autocomplete, Button } from '@mui/material'
import { Controller } from 'react-hook-form'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
export default function InformationBooking({
  control,
  errors,
  listContact,
  setListContact,
  listMerchant,
  setValue,
  defaultCheck,
  getValues,
}) {
  const [isBooking, setIsBooking] = React.useState()

  React.useEffect(() => {
    setIsBooking(defaultCheck)
  }, [defaultCheck])

  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={12}>
          <FormControl
            component="fieldset"
            onChange={event => {
              setIsBooking(event.target.value)
            }}
          >
            <FormLabel component="legend">Hỗ trợ đặt chỗ*</FormLabel>
            <Controller
              control={control}
              name="isSupportBooking"
              render={({ field }) => {
                return (
                  <RadioGroup {...field}>
                    <FormControlLabel
                      value={1}
                      control={<Radio />}
                      label="Có"
                    />
                    <FormControlLabel
                      value={0}
                      control={<Radio />}
                      label="Không"
                    />
                  </RadioGroup>
                )
              }}
            />
          </FormControl>
        </Grid>
        {isBooking !== '1' &&
          listContact.map((contact, index) => {
            return (
              <Grid container key={index}>
                <Grid
                  item
                  xs={12}
                  md={12}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '10px',
                  }}
                >
                  <Controller
                    name={`contactName${index}`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        style={{ marginRight: '15px' }}
                        label="Tên"
                        variant="outlined"
                        value={contact.name}
                        onChange={e => {
                          const newList = [...listContact]
                          newList[index].name = e.target.value
                          setListContact(newList)
                        }}
                      />
                    )}
                  />
                  <Controller
                    name={`contactWebsite${index}`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        style={{ marginRight: '15px' }}
                        label="Website"
                        variant="outlined"
                        value={contact.web}
                        onChange={e => {
                          const newList = [...listContact]
                          newList[index].web = e.target.value
                          setListContact(newList)
                        }}
                      />
                    )}
                  />
                  <Controller
                    name={`contactPhone${index}`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        style={{ marginRight: '15px' }}
                        label="Số điện thoại"
                        variant="outlined"
                        value={contact.phone}
                        onChange={e => {
                          const newList = [...listContact]
                          newList[index].phone = e.target.value
                          setListContact(newList)
                        }}
                      />
                    )}
                  />
                  <Button
                    style={{ height: '50px' }}
                    color="error"
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      const arr = [...listContact]
                      arr.splice(index, 1)
                      setListContact(arr)
                    }}
                  >
                    Xóa
                  </Button>
                </Grid>
              </Grid>
            )
          })}
        {isBooking !== '1' && (
          <Grid item xs={12} md={12}>
            <Button
              style={{ margin: '25px 0 25px' }}
              color="primary"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setListContact([
                  ...listContact,
                  {
                    name: '',
                    web: '',
                    phone: '',
                  },
                ])
              }}
            >
              Thêm
            </Button>
          </Grid>
        )}
        {isBooking === '1' && (
          <Grid item xs={6} md={6} style={{ paddingRight: '15px' }}>
            <Controller
              name="idMerchant"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  disablePortal
                  {...field}
                  fullWidth
                  options={listMerchant}
                  getOptionLabel={option =>
                    `${option.email}, ${option.mobilePhone}`
                  }
                  onChange={(_, data) => {
                    field.onChange(data)
                  }}
                  renderInput={params => (
                    <TextField {...params} label="Liên hệ" margin="normal" />
                  )}
                />
              )}
            />
          </Grid>
        )}
        <Grid item xs={6} md={6}>
          <Controller
            name="openTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                style={{ marginRight: '15px' }}
                margin="normal"
                id="time"
                label="Thời gian mở cửa"
                type="time"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                sx={{ width: 150 }}
              />
            )}
          />
          <Controller
            name="closeTime"
            control={control}
            render={({ field }) => (
              <TextField
                label="Thời gian đóng cửa"
                margin="normal"
                {...field}
                id="time"
                type="time"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                sx={{ width: 150 }}
              />
            )}
          />
        </Grid>
      </Grid>
    </div>
  )
}
