import * as React from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Grid, Icon, Box, Chip, Button, TextField, Stack } from '@mui/material'
import { Controller } from 'react-hook-form'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import DialogCustom from 'app/components/common/DialogCustom'

export default function Feature({ control, errors }) {
  const dialogCustomRef = React.useRef(null)
  return (
    <>
      <Grid container>
        <Grid
          item
          xs={2}
          md={2}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          Phương tiện thích hợp:
        </Grid>
        <Grid item xs={10} md={10}>
          <Controller
            name="vehicle"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label={
                  <span style={{ color: 'black', display: 'flex' }}>
                    Xe bus
                    <Icon style={{ color: 'black' }}>
                      directions_bus_filled
                    </Icon>
                  </span>
                }
              />
            )}
          />
          <Controller
            name="vehicle"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label={
                  <span style={{ color: 'black', display: 'flex' }}>
                    Xe cá nhân
                    <Icon style={{ color: 'black' }}>directions_car</Icon>
                  </span>
                }
              />
            )}
          />
          <Controller
            name="vehicle"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label={
                  <span style={{ color: 'black', display: 'flex' }}>
                    Xe máy
                    <Icon style={{ color: 'black' }}>two_wheeler</Icon>
                  </span>
                }
              />
            )}
          />
        </Grid>
        <Grid item xs={2} md={2} style={{ marginTop: '15px' }}>
          Tình trạng mạng:
        </Grid>
        <Grid item xs={5} md={5} style={{ marginTop: '15px' }}>
          <Stack spacing={3}>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '80%',
              }}
            >
              <Controller
                name="vehicle"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Viettel"
                  />
                )}
              />
              <FormControl style={{ width: '150px' }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={e => {
                    console.log(e.target.value)
                    setStatusFilter(e.target.value)
                  }}
                >
                  <MenuItem value={0}>Không có sóng</MenuItem>
                  <MenuItem value={1}>Sóng yếu </MenuItem>
                  <MenuItem value={2}>Sóng trung bình</MenuItem>
                  <MenuItem value={3}>Sóng mạnh</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '80%',
              }}
            >
              <Controller
                name="vehicle"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Mobiphone"
                  />
                )}
              />
              <FormControl style={{ width: '150px' }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={e => {
                    console.log(e.target.value)
                    setStatusFilter(e.target.value)
                  }}
                >
                  <MenuItem value={0}>Không có sóng</MenuItem>
                  <MenuItem value={1}>Sóng yếu </MenuItem>
                  <MenuItem value={2}>Sóng trung bình</MenuItem>
                  <MenuItem value={3}>Sóng mạnh</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={5} md={5} style={{ marginTop: '15px' }}>
          <Stack spacing={3}>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '80%',
              }}
            >
              <Controller
                name="vehicle"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Vinaphone"
                  />
                )}
              />
              <FormControl style={{ width: '150px' }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={e => {
                    console.log(e.target.value)
                    setStatusFilter(e.target.value)
                  }}
                >
                  <MenuItem value={0}>Không có sóng</MenuItem>
                  <MenuItem value={1}>Sóng yếu </MenuItem>
                  <MenuItem value={2}>Sóng trung bình</MenuItem>
                  <MenuItem value={3}>Sóng mạnh</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '80%',
              }}
            >
              <Controller
                name="vehicle"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="VietnamMobile"
                  />
                )}
              />
              <FormControl style={{ width: '150px' }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={e => {
                    console.log(e.target.value)
                    setStatusFilter(e.target.value)
                  }}
                >
                  <MenuItem value={0}>Không có sóng</MenuItem>
                  <MenuItem value={1}>Sóng yếu </MenuItem>
                  <MenuItem value={2}>Sóng trung bình</MenuItem>
                  <MenuItem value={3}>Sóng mạnh</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Grid>
        <Grid
          item
          xs={2}
          md={2}
          style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}
        >
          Loại địa hình:
        </Grid>
        <Grid item xs={10} md={10} style={{ marginTop: '15px' }}>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              style={{ display: 'flex' }}
            >
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Dễ di chuyển"
              />
              <FormControlLabel
                value={2}
                control={<Radio />}
                label="Khó di chuyển"
              />
              <FormControlLabel
                value={3}
                control={<Radio />}
                label="Rất khó di chuyển"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={2} md={2} style={{ marginTop: '15px' }}>
          Tiện ích:
        </Grid>
        <Grid
          item
          xs={10}
          md={10}
          style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}
        >
          <Box
            style={{
              width: '60%',
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: '5px',
              padding: '8px',
              marginRight: '20px',
            }}
          >
            <Stack direction="row" spacing={1}>
              <Chip
                label="Deletable"
                onDelete={() => {
                  console.log('x')
                }}
              />
              <Chip
                label="Deletable"
                onDelete={() => {
                  console.log('x')
                }}
              />
              <Chip
                label="Deletable"
                onDelete={() => {
                  console.log('x')
                }}
              />
            </Stack>
          </Box>
          <Box>
            <Button onClick={() => dialogCustomRef.current.handleClickOpen()}>
              Thêm tiện ích
            </Button>
          </Box>
        </Grid>
        <Grid item xs={2} md={2} style={{ marginTop: '15px' }}>
          Số lượng người:
        </Grid>
        <Grid item xs={10} md={10} style={{ marginTop: '15px' }}>
          <TextField variant="outlined" />
        </Grid>
        <Grid item xs={2} md={2} style={{ marginTop: '15px' }}>
          Trang thái*:
        </Grid>
        <Grid item xs={10} md={10} style={{ marginTop: '15px' }}>
          <FormControl style={{ width: '150px' }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              onChange={e => {
                console.log(e.target.value)
                setStatusFilter(e.target.value)
              }}
            >
              <MenuItem value={0}>Không có sóng</MenuItem>
              <MenuItem value={1}>Sóng yếu </MenuItem>
              <MenuItem value={2}>Sóng trung bình</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <DialogCustom ref={dialogCustomRef} title="Tiện ích" maxWidth="sm">
        <Grid container>
          <Grid item xs={6} md={6}>
            <Radio value="a" name="radio-buttons" id="r1" />
            <label for="r1">abc</label>
          </Grid>
        </Grid>
      </DialogCustom>
    </>
  )
}
