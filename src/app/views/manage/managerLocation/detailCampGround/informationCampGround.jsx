import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GeneralInformation from './generalInformation'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { Button } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  getDistricts,
  getProvinces,
  getWards,
} from 'app/apis/common/common.service'
import {
  getDetailCampGround,
  updateCampGround,
  getListCampAreaWithoutProvince,
  createCampGround,
  getListMerchant,
  deleteCampGround,
} from 'app/apis/campGround/ground.service'
import InformationBooking from './informationBooking'
import Introduction from './introduction'
import Feature from './feature'
import { cloneDeep } from 'lodash'
import { INTERNET, seasonsById, VEHICLES } from '../const'
import { toastSuccess } from 'app/helpers/toastNofication'
import Policy from './policy'
import { yupResolver } from '@hookform/resolvers/yup'

export default function InformationCampGround({ action }) {
  const [hashtag, setHashtag] = React.useState([])
  const [provinces, setProvinces] = React.useState([])
  const [districts, setDistricts] = React.useState([])
  const [wards, setWards] = React.useState([])
  const [feature, setFeature] = React.useState({})
  const [campAreas, setCampAreas] = React.useState([])
  const [medias, setMedias] = React.useState([])
  const [description, setDescription] = React.useState('')
  const [listMerchant, setListMerchant] = React.useState([])
  const [detailPolicy, setDetailPolicy] = React.useState({
    id: 1,
    name: 'Default Deposit Policy',
    scope: 1,
    scaleAmount: 50.0,
    minAmount: 200000,
    maxAmount: 2000000,
  })
  const params = useParams()
  const [createDegrees, setCreateDegrees] = React.useState({
    lat: 21.027161210811197,
    lng: 105.78872657468659,
  })
  const introductionRef = React.useRef()
  const [listContact, setListContact] = React.useState([
    {
      name: '',
      web: '',
      phone: '',
    },
  ])

  const typeCamp = [
    { label: 'Cắm trại', id: 1 },
    { label: 'Chạy bộ', id: 2 },
    { label: 'Teambuiding', id: 3 },
    { label: 'Lưu trú', id: 4 },
    { label: 'Trekking', id: 5 },
    { label: 'Leo núi', id: 6 },
  ]
  const navigate = useNavigate()

  const schema = yup
    .object({
      nameCampground: yup
        .string()
        .required('Vui lòng nhập tên địa danh')
        .max(255, 'Số ký tự quá dài')
        .trim(),
      province: yup.object().required('Vui lòng chọn thành tỉnh/phố'),
      district: yup.object().required('Vui lòng chọn quận/huyện'),
      status: yup.string().required('Vui lòng chọn trạng thái'),
    })
    .required()

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
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
      speedViettel: -1,
      speedMobiphone: -1,
      speedVinaphone: -1,
      speedVietnamMobile: -1,
      bus: false,
      car: false,
      motobike: false,
      campAreas: [],
      campTypes: [],
      isSupportBooking: '1',
      idMerchant: null,
      latitude: 21.027161210811197,
      longitude: 105.78872657468659,
      note: '',
      policy: 1,
    },
  })

  const updateFeature = newFeature => {
    setFeature(cloneDeep(newFeature))
  }

  const handleDataImageUpload = async () => {
    const introData = introductionRef.current.getIntro()
    console.log(introData)
    const fileUpload = [...introData].map(file => {
      const formData = new FormData()
      formData.append('file', file)
      try {
        const token = window.localStorage.getItem('accessToken')
        const res = axios({
          method: 'post',
          url: 'https://dev09-api.campdi.vn/upload/api/image/upload',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        })
        return res
      } catch (e) {
        console.log(e)
      }
    })

    const response = await Promise.all(fileUpload)
    if (response) return response.map(item => item.data.url)
  }

  const onSubmit = async data => {
    const listUrlImage = await handleDataImageUpload()

    const mediasUpdate = listUrlImage.map((url, index) => {
      const media = new Object()
      media.mediaType = 1
      media.srcType = 2
      media.mediaFormat = 2
      media.url = url
      return media
    })

    const dataUpdate = new Object()
    dataUpdate.medias = [...medias, ...mediasUpdate]
    dataUpdate.description = introductionRef.current.getValueEditor()
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
    dataUpdate.campTypes = data.campTypes.map(type => type.id)
    dataUpdate.idDepositPolicy = data.policy
    dataUpdate.idMerchant = data.idMerchant?.id || null
    dataUpdate.idTopography = data.topographic
    dataUpdate.idProvince = data.province?.id
    dataUpdate.idDistrict = data.district?.id
    dataUpdate.isSupportBooking = parseInt(data.isSupportBooking)
    if (parseInt(data.isSupportBooking) === 1) {
      dataUpdate.idMerchant = data.idMerchant?.id || null
      dataUpdate.contact = []
    } else {
      dataUpdate.contact = listContact.map(
        contact => `${contact.name},${contact.web},${contact.phone}`,
      )
      dataUpdate.idMerchant = null
    }

    dataUpdate.idWard = data.ward?.id
    dataUpdate.openTime = data.openTime
    dataUpdate.closeTime = data.closeTime
    dataUpdate.address = data.address
    dataUpdate.capacity = data.capacity
    dataUpdate.latitude = data.latitude
    dataUpdate.longitude = data.longitude
    dataUpdate.isPopular = 0
    dataUpdate.noteTopography = data.note
    dataUpdate.status = data.status
    dataUpdate.campAreas = data.campAreas.map(areas => areas.id)
    dataUpdate.tags = data.hashtag.map(tag => {
      return {
        value: tag.value,
      }
    })
    dataUpdate.campGroundSeasons = (data.campGroundSeasons || []).map(
      season => season.id,
    )

    dataUpdate.campGroundUtilities = (feature.utility || []).map(item =>
      parseInt(item),
    )
    dataUpdate.campGroundVehicles = []
    if (data.bus) dataUpdate.campGroundVehicles.push(1)
    if (data.car) dataUpdate.campGroundVehicles.push(2)
    if (data.motobike) dataUpdate.campGroundVehicles.push(3)
    dataUpdate.freeParking = true

    if (action === 'create') {
      const res = await createCampGround(dataUpdate)
      if (res) {
        toastSuccess({ message: 'Điểm camp đã được tạo' })
        navigate('/quan-ly-thong-tin-diem-camp')
      }
    } else {
      const res = await updateCampGround(params.id, dataUpdate)
      if (res) {
        toastSuccess({ message: 'Thông tin đã được cập nhật' })
        navigate('/quan-ly-thong-tin-diem-camp')
      }
    }
  }

  const fetchListCampArea = async () => {
    const res = await getListCampAreaWithoutProvince()
    setCampAreas(res)
  }

  const fetchInforCampGround = async () => {
    const res = await getProvinces()
    setProvinces(res)
    const merchants = await getListMerchant()
    setListMerchant(merchants)
    if (res && merchants) {
      if (action === 'edit') {
        getDetailCampGround(params.id)
          .then(data => {
            setCreateDegrees({
              lat: data.latitude,
              lng: data.longitude,
            })
            setValue(
              'campTypes',
              data.campTypes.map(type => typeCamp[type - 1]),
            )
            setDescription(data.description || '')
            setDetailPolicy(data.depositPolicy)
            setValue('note', data.noteTopography)
            setMedias(data.medias)
            setHashtag(data.tags)
            setValue('campAreas', data.campAreas)
            setValue('hashtag', data.tags)
            setValue('nameCampground', data.name)
            setValue(
              'province',
              res.find(province => province.id === data.idProvince),
            )

            setValue('policy', data.depositPolicy.id)
            // setValue('contact', data.contact)
            setValue('openTime', data.openTime)
            setValue('closeTime', data.closeTime)
            setFeature({ utility: data.campGroundUtilities })
            const seasons = data.campGroundSeasons.map(
              item => seasonsById[item],
            )
            setValue('campGroundSeasons', seasons)
            setValue('address', data.address)
            setValue('description', data.description)
            setValue('topographic', data.idTopography)
            setValue('capacity', data.capacity)
            setValue('status', data.status)
            setValue('isSupportBooking', data.isSupportBooking.toString())
            if (data.isSupportBooking === 1) {
              setValue(
                'idMerchant',
                merchants.filter(merchant => merchant.id == data.idMerchant)[0],
              )
            } else {
              const newListContact = data.contact.map(item => {
                const arr = item.split(',')
                return {
                  name: arr[0],
                  web: arr[1],
                  phone: arr[2],
                }
              })
              setListContact(newListContact)
            }
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
                  dataDistrict.find(district => district.id == data.idDistrict),
                )
              })
              .catch(err => console.log(err))
            if (data.idDistrict) {
              getWards(data.idDistrict)
                .then(dataWard => {
                  setWards(dataWard)
                  setValue(
                    'ward',
                    dataWard.find(ward => ward.id == data.idWard),
                  )
                })
                .catch(err => console.log(err))
            }
          })
          .catch(err => console.log(err))
      } else {
        setFeature({ utility: [] })
      }
    }
  }

  const handleDeleteCampGround = async () => {
    const res = await deleteCampGround(params.id)
    if (res) {
      navigate('/quan-ly-thong-tin-diem-camp')
    }
    navigate('/quan-ly-thong-tin-diem-camp')
  }

  const fetchDistricts = provinceId => {
    getDistricts(provinceId)
      .then(dataDistrict => {
        setDistricts(dataDistrict)
        setValue('district', null)
        setValue('ward', null)
        setWards([])
      })
      .catch(err => console.log(err))
  }

  const fetchWards = districtId => {
    getWards(districtId)
      .then(dataWard => {
        setWards(dataWard)
        setValue('ward', null)
      })
      .catch(err => console.log(err))
  }

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
            fetchDistricts={fetchDistricts}
            control={control}
            errors={errors}
            provinces={provinces}
            districts={districts}
            wards={wards}
            fetchWards={fetchWards}
            getValues={getValues}
            setValue={setValue}
            hashtag={hashtag}
            campAreas={campAreas}
            createDegrees={createDegrees}
            setCreateDegrees={setCreateDegrees}
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
            listContact={listContact}
            setListContact={setListContact}
            errors={errors}
            getValues={getValues}
            setValue={setValue}
            listMerchant={listMerchant}
            defaultCheck={getValues('isSupportBooking')}
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
          <Introduction
            setDescription={setDescription}
            ref={introductionRef}
            medias={medias}
            action={action}
            description={description}
            setMedias={setMedias}
          />
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
            action={action}
            control={control}
            errors={errors}
            getValues={getValues}
            setValue={setValue}
            feature={feature}
            updateFeature={updateFeature}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5a-content"
          id="panel5a-header"
        >
          <Typography>5. Chính sách</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Policy
            setValue={setValue}
            action={action}
            detailPolicy={detailPolicy}
            setDetailPolicy={setDetailPolicy}
          />
        </AccordionDetails>
      </Accordion>
      <div style={{ marginTop: '50px' }}>
        <Button
          color="primary"
          type="submit"
          variant="contained"
          style={{ marginRight: '10px' }}
        >
          Lưu
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => handleDeleteCampGround()}
        >
          Xóa
        </Button>
      </div>
    </form>
  )
}
