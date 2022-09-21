import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GeneralInformation from './generalInformation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'

import {
  getDistricts,
  getProvinces,
  getWards,
} from 'app/apis/common/common.service'
import {
  deleteCampGround,
  getDetailCampGround,
  updateCampGround,
  getListCampArea,
} from 'app/apis/campGround/ground.service'
import InformationBooking from './informationBooking'
import Introduction from './introduction'
import Feature from './feature'
import { cloneDeep } from 'lodash'
import { INTERNET, seasonsById, VEHICLES } from '../const'

export default function InformationCampGround() {
  const [provinceId, setProvinceId] = React.useState(null)
  const [districtId, setDistrictId] = React.useState('')
  const [hashtag, setHashtag] = React.useState([])
  const [provinces, setProvinces] = React.useState([])
  const [districts, setDistricts] = React.useState([])
  const [wards, setWards] = React.useState([])
  const [feature, setFeature] = React.useState({})
  const [campAreas, setCampAreas] = React.useState([])
  const [idMerchant, setIdMerchant] = React.useState()
  const params = useParams()
  const navigate = useNavigate()

  const schema = yup
    .object({
      namePlace: yup.string().required('Vui lòng nhập tên địa danh').trim(),
      province: yup.object().required(),
      district: yup.object().required(),
      description: yup.string().required('Vui lòng nhập mô tả').trim(),
    })
    .required()

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(schema),
    defaultValues: {
      nameCampground: '',
      province: null,
      district: null,
      ward: null,
      address: '',
      description: '',
      hashtag: [],
      campGroundSeasons: [],
      contact: '',
      openTime: '',
      closeTime: '',
      topographic: '',
      capacity: '',
      status: '',
      viettel: false,
      mobiphone: false,
      vinaphone: false,
      vietnamMobile: false,
      speedViettel: null,
      speedMobiphone: null,
      speedVinaphone: null,
      speedVietnamMobile: null,
      bus: false,
      car: false,
      motobike: false,
      campAreas: [],
    },
  })

  const updateFeature = newFeature => {
    setFeature(cloneDeep(newFeature))
  }

  const onSubmit = data => {
    console.log(data)
    console.log(feature)
    const dataUpdate = new Object()
    dataUpdate.campGroundInternets = []
    const arrInternet = [
      { provider: 'viettel', speed: 'speedViettel' },
      { provider: 'vinaphone', speed: 'speedVinaphone' },
      { provider: 'mobilephone', speed: 'speedMobiphone' },
      { provider: 'vietnamMobile', speed: 'speedVietnamMobile' },
    ]
    arrInternet.forEach((item, index) => {
      if (data[item.provider]) {
        dataUpdate.campGroundInternets.push({
          idInternet: index + 1,
          signalQuality: data[item.speed],
        })
      }
    })

    dataUpdate.id = params.id
    dataUpdate.name = data.nameCampground
    dataUpdate.description = data.description
    dataUpdate.policy = ''
    dataUpdate.idMerchant = idMerchant
    dataUpdate.idTopography = data.topographic
    dataUpdate.idProvince = data.province.id
    dataUpdate.idDistrict = data.district.id
    dataUpdate.isSupportBooking = parseInt(data.isSupportBooking)
    dataUpdate.contact = data.contact
    dataUpdate.idWard = data.ward.id
    dataUpdate.openTime = data.openTime
    dataUpdate.closeTime = data.closeTime
    dataUpdate.address = data.address
    dataUpdate.capacity = data.capacity
    dataUpdate.latitude = 0
    dataUpdate.longitude = 0
    dataUpdate.isPopular = 0
    dataUpdate.status = data.status
    dataUpdate.medias = []
    dataUpdate.campAreas = data.campAreas.map(areas => areas.id)
    dataUpdate.tags = data.hashtag.map(tag => {
      return {
        value: tag.value,
      }
    })
    dataUpdate.campTypes = [0]
    dataUpdate.campGroundSeasons = data.campGroundSeasons.map(
      season => season.id,
    )

    dataUpdate.campGroundUtilities = feature.utility.map(item => parseInt(item))
    dataUpdate.campGroundVehicles = []
    if (data.bus) dataUpdate.campGroundVehicles.push(1)
    if (data.car) dataUpdate.campGroundVehicles.push(2)
    if (data.motobike) dataUpdate.campGroundVehicles.push(3)
    dataUpdate.freeParking = true
    updateCampGround(params.id, dataUpdate)
  }

  const fetchListCampArea = async () => {
    const res = await getListCampArea()
    console.log(res)
    setCampAreas(res)
  }

  const fetchInforCampGround = async () => {
    const res = await getProvinces()
    setProvinces(res)

    if (res) {
      getDetailCampGround(params.id)
        .then(data => {
          setIdMerchant(data.idMerchant)
          setHashtag(data.tags)
          setValue('campAreas', data.campAreas)
          setValue('hashtag', data.tags)
          setValue('nameCampground', data.name)
          setProvinceId(data.idProvince)
          setValue(
            'province',
            res.find(province => province.id === data.idProvince),
          )
          setValue('contact', data.contact)
          setValue('openTime', data.openTime)
          setValue('closeTime', data.closeTime)
          setFeature({ utility: data.campGroundUtilities })
          const seasons = data.campGroundSeasons.map(item => seasonsById[item])
          setValue('campGroundSeasons', seasons)
          setDistrictId(data.idDistrict)
          setValue('address', data.address)
          setValue('description', data.description)
          setValue('topographic', data.idTopography)
          setValue('capacity', data.capacity)
          setValue('status', data.status)
          data.campGroundInternets.forEach(item => {
            setValue(INTERNET[item.idInternet].name, true)
            setValue(INTERNET[item.idInternet].speed, item.signalQuality)
          })
          data.campGroundVehicles.forEach(item => {
            setValue(VEHICLES[item]?.name, true)
          })
          getDistricts(data.idProvince)
            .then(dataDistrict => {
              setDistricts(dataDistrict)
              setValue(
                'district',
                dataDistrict.find(district => district.id == data.idProvince),
              )
            })
            .catch(err => console.log(err))
          if (data.idDistrict) {
            getWards(data.idDistrict)
              .then(dataWard => {
                setWards(dataWard)
                setValue(
                  'ward',
                  dataWard.find(ward => ward.id == data.idDistrict),
                )
              })
              .catch(err => console.log(err))
          }
        })
        .catch(err => console.log(err))
    }
  }

  const handleDeleteCampGround = async () => {
    // const res = await deleteCampGround(params.id)
    // if (res) {
    //   navigate('/quan-ly-thong-tin-diem-camp')
    // }
    navigate('/quan-ly-thong-tin-diem-camp')
  }

  React.useEffect(() => {
    if (provinceId)
      getDistricts(provinceId)
        .then(dataDistrict => {
          setDistricts(dataDistrict)
          setValue('district', null)
          setValue('ward', null)
          setWards([])
        })
        .catch(err => console.log(err))
  }, [provinceId])

  React.useEffect(() => {
    if (districtId)
      getWards(districtId)
        .then(dataWard => {
          setWards(dataWard)
          setValue('ward', null)
        })
        .catch(err => console.log(err))
  }, [districtId])

  React.useEffect(() => {
    fetchListCampArea()
    fetchInforCampGround()
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>1. Thông tin chung</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <GeneralInformation
            control={control}
            errors={errors}
            provinces={provinces}
            districts={districts}
            wards={wards}
            setProvinceId={setProvinceId}
            setDistrictId={setDistrictId}
            getValues={getValues}
            setValue={setValue}
            hashtag={hashtag}
            campAreas={campAreas}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>2. Thông tin booking</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <InformationBooking
            control={control}
            errors={errors}
            provinces={provinces}
            districts={districts}
            wards={wards}
            setProvinceId={setProvinceId}
            setDistrictId={setDistrictId}
            getValues={getValues}
            setValue={setValue}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>3. Giới thiệu</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Introduction />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4a-content"
          id="panel4a-header"
        >
          <Typography>4. Đặc điểm</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Feature
            control={control}
            errors={errors}
            getValues={getValues}
            feature={feature}
            updateFeature={updateFeature}
          />
        </AccordionDetails>
      </Accordion>
      <div style={{ marginTop: '50px' }}>
        <Button color="primary" type="submit" variant="contained">
          Lưu
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleDeleteCampGround}
        >
          Xóa
        </Button>
      </div>
    </form>
  )
}
