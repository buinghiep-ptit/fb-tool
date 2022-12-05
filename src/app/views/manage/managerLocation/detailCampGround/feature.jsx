import * as React from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import {
  Grid,
  Icon,
  Box,
  Chip,
  Button,
  TextField,
  Stack,
  FormHelperText,
} from '@mui/material'
import { Controller } from 'react-hook-form'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import DialogCustom from 'app/components/common/DialogCustom'
import {
  getListUnlinkedUtility,
  getListUtility,
} from 'app/apis/campGround/ground.service'
import { useParams } from 'react-router-dom'
import FormGroup from '@mui/material/FormGroup'
import { cloneDeep, remove } from 'lodash'

export default function Feature({
  control,
  errors,
  feature,
  action,
  updateFeature,
  getValues,
  disabledInternet,
  setValue,
  setDisabledInternet,
}) {
  const dialogCustomRef = React.useRef(null)
  const params = useParams()
  const [unlinkedUtilitys, setUnlinkedUtilitys] = React.useState([])
  const [listUtility, setListUtility] = React.useState([])

  const handleClickAddUtility = async () => {
    dialogCustomRef.current.handleClickOpen()
  }

  const fetchListUnlinkedUtility = async () => {
    if (action === 'edit') {
      const res = await getListUnlinkedUtility(params.id)
      setUnlinkedUtilitys(res)
    }

    const response = await getListUtility()
    if (action !== 'edit') {
      setUnlinkedUtilitys(response)
    }
    const convertRes = {}
    response.forEach(item => {
      convertRes[item.idUtility] = item
    })
    setListUtility(convertRes)
  }

  React.useEffect(() => {
    fetchListUnlinkedUtility()
  }, [])

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
            name="bus"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                {...field}
                control={<Checkbox checked={getValues('bus')} />}
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
            name="car"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                {...field}
                control={<Checkbox checked={getValues('car')} />}
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
            name="motobike"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                {...field}
                control={<Checkbox checked={getValues('motobike')} />}
                label={
                  <span style={{ color: 'black', display: 'flex' }}>
                    Xe máy
                    <Icon style={{ color: 'black' }}>two_wheeler</Icon>
                  </span>
                }
              />
            )}
          />
          <Controller
            name="boat"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                {...field}
                control={<Checkbox checked={getValues('boat')} />}
                label={
                  <span style={{ color: 'black', display: 'flex' }}>
                    Thuyền bè
                    <Icon style={{ color: 'black' }}>sailing_icon</Icon>
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
                name="viettel"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={getValues('viettel')}
                        {...field}
                        onChange={e => {
                          setValue('viettel', !getValues('viettel'))
                          const newObj = cloneDeep(disabledInternet)
                          newObj.viettel = !newObj.viettel
                          setDisabledInternet(newObj)
                        }}
                      />
                    }
                    label="Viettel"
                  />
                )}
              />
              <Controller
                name="speedViettel"
                control={control}
                render={({ field }) => (
                  <FormControl style={{ width: '150px' }}>
                    <Select
                      disabled={disabledInternet.viettel}
                      {...field}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                    >
                      <MenuItem value={1}>Sóng yếu </MenuItem>
                      <MenuItem value={3}>Sóng mạnh</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '80%',
              }}
            >
              <Controller
                name="mobiphone"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    control={
                      <Checkbox
                        checked={getValues('mobiphone')}
                        onChange={e => {
                          setValue('mobiphone', !getValues('mobiphone'))
                          const newObj = cloneDeep(disabledInternet)
                          newObj.mobiphone = !newObj.mobiphone
                          setDisabledInternet(newObj)
                        }}
                      />
                    }
                    label="Mobiphone"
                  />
                )}
              />
              <Controller
                name="speedMobiphone"
                control={control}
                render={({ field }) => (
                  <FormControl style={{ width: '150px' }}>
                    <Select
                      disabled={disabledInternet.mobiphone}
                      {...field}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                    >
                      <MenuItem value={1}>Sóng yếu </MenuItem>
                      <MenuItem value={3}>Sóng mạnh</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
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
                name="vinaphone"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    control={
                      <Checkbox
                        checked={getValues('vinaphone')}
                        onChange={e => {
                          setValue('vinaphone', !getValues('vinaphone'))
                          const newObj = cloneDeep(disabledInternet)
                          newObj.vinaphone = !newObj.vinaphone
                          setDisabledInternet(newObj)
                        }}
                      />
                    }
                    label="Vinaphone"
                  />
                )}
              />
              <Controller
                name="speedVinaphone"
                control={control}
                render={({ field }) => (
                  <FormControl style={{ width: '150px' }}>
                    <Select
                      disabled={disabledInternet.vinaphone}
                      {...field}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                    >
                      <MenuItem value={1}>Sóng yếu </MenuItem>
                      <MenuItem value={3}>Sóng mạnh</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '80%',
              }}
            >
              <Controller
                name="vietnamMobile"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    control={
                      <Checkbox
                        checked={getValues('vietnamMobile')}
                        onChange={e => {
                          setValue('vietnamMobile', !getValues('vietnamMobile'))
                          const newObj = cloneDeep(disabledInternet)
                          newObj.vietnamMobile = !newObj.vietnamMobile
                          setDisabledInternet(newObj)
                        }}
                      />
                    }
                    label="VietnamMobile"
                  />
                )}
              />
              <Controller
                name="speedVietnamMobile"
                control={control}
                render={({ field }) => (
                  <FormControl style={{ width: '150px' }}>
                    <Select
                      disabled={disabledInternet.vietnamMobile}
                      {...field}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                    >
                      <MenuItem value={1}>Sóng yếu </MenuItem>
                      <MenuItem value={3}>Sóng mạnh</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
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
          <Controller
            name="topographic"
            control={control}
            render={({ field }) => (
              <FormControl>
                <RadioGroup
                  row
                  {...field}
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  style={{ display: 'flex' }}
                >
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Dễ đi"
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio />}
                    label="Khó đi"
                  />
                  <FormControlLabel
                    value={3}
                    control={<Radio />}
                    label="Rất khó đi"
                  />
                </RadioGroup>
              </FormControl>
            )}
          />
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
              minHeight: '60px',
            }}
          >
            {feature?.utility?.map(utility => (
              <Chip
                style={{ margin: '5px' }}
                key={utility}
                label={listUtility[utility]?.value}
                onDelete={() => {
                  const newFeatureUtility = remove(
                    cloneDeep(feature).utility,
                    item => item !== utility,
                  )
                  const newFeature = cloneDeep(feature)
                  newFeature.utility = newFeatureUtility
                  updateFeature(newFeature)
                }}
              />
            ))}
          </Box>
          <Box>
            <Button onClick={() => handleClickAddUtility()}>
              Thêm tiện ích
            </Button>
          </Box>
        </Grid>
        <Grid item xs={2} md={2} style={{ marginTop: '15px' }}>
          Số lượng người:
        </Grid>
        <Grid item xs={10} md={10} style={{ marginTop: '15px' }}>
          <Controller
            control={control}
            name="capacity"
            render={({ field }) => (
              <TextField
                variant="outlined"
                {...field}
                error={!!errors.capacity}
                helperText={errors.capacity?.message}
              />
            )}
          ></Controller>
        </Grid>
        <Grid item xs={2} md={2} style={{ marginTop: '15px' }}>
          Trang thái*:
        </Grid>
        <Grid item xs={10} md={10} style={{ marginTop: '15px' }}>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <FormControl style={{ width: '150px' }} error={!!errors?.status}>
                <Select {...field} labelId="status-label" id="status">
                  <MenuItem value={-1}>Không hoạt động</MenuItem>
                  <MenuItem value={1}>Hoạt động</MenuItem>
                </Select>
                {!!errors?.status?.message && (
                  <FormHelperText>{errors?.status.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
      <DialogCustom ref={dialogCustomRef} title="Tiện ích" maxWidth="sm">
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormGroup>
            {unlinkedUtilitys.map((utility, index) => (
              <FormControlLabel
                key={utility.idUtility}
                control={
                  <>
                    <img
                      src={utility.iconUrl}
                      style={{ width: '30px', height: '30px' }}
                    />
                    <Checkbox
                      onChange={e => {
                        if (e.target.checked) {
                          const newFeature = cloneDeep(feature)
                          newFeature.utility.push(e.target.id)
                          updateFeature(newFeature)
                          const newUnlinked = cloneDeep(unlinkedUtilitys)
                          newUnlinked[index].checked = e.target.checked
                          setUnlinkedUtilitys(newUnlinked)
                          console.log(e.target.id)
                        } else {
                          const newFeatureUtility = remove(
                            cloneDeep(feature).utility,
                            item => item !== e.target.id,
                          )
                          const newFeature = cloneDeep(feature)
                          newFeature.utility = newFeatureUtility
                          const newUnlinked = cloneDeep(unlinkedUtilitys)
                          newUnlinked[index].checked = e.target.checked
                          setUnlinkedUtilitys(newUnlinked)
                          updateFeature(newFeature)
                        }
                      }}
                      checked={utility.checked}
                      name={utility.value}
                      id={utility.idUtility.toString()}
                    />
                  </>
                }
                label={utility.value}
              />
            ))}
          </FormGroup>
        </FormControl>
      </DialogCustom>
    </>
  )
}
