import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GeneralInformation from './generalInformation'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from '@mui/material'
import { useParams } from 'react-router-dom'
import {
  getDistricts,
  getProvinces,
  getWards,
} from 'app/apis/common/common.service'
import { getDetailCampGround } from 'app/apis/campGround/ground.service'
import InformationBooking from './informationBooking'
import Introduction from './introduction'
import Feature from './feature'

export default function InformationCampGround() {
  const [provinceId, setProvinceId] = React.useState(null)
  const [districtId, setDistrictId] = React.useState('')
  const [hashtag, setHashtag] = React.useState([])
  const [provinces, setProvinces] = React.useState([])
  const [districts, setDistricts] = React.useState([])
  const [wards, setWards] = React.useState([])
  const params = useParams()
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
  })

  const onSubmit = data => {
    console.log(data)
  }

  const fetchInforCampGround = async () => {
    const res = await getProvinces()
    setProvinces(res)

    if (res) {
      getDetailCampGround(params.id)
        .then(data => {
          //   setHashtag(data.tags)
          //   setValue('hashtag', data.tags)
          //   setValue('namePlace', data.name)
          //   setProvinceId(data.idProvince)
          //   setValue('address', data.address)
          //   setValue(
          //     'province',
          //     res.find(province => province.id === data.idProvince),
          //   )
          //   setDistrictId(data.idDistrict)
          //   setValue('description', data.description)
          //   getDistricts(data.idProvince)
          //     .then(dataDistrict => {
          //       setDistricts(dataDistrict)
          //       setValue(
          //         'district',
          //         dataDistrict.find(district => district.id == data.idProvince),
          //       )
          //     })
          //     .catch(err => console.log(err))
          //   if (data.idDistrict) {
          //     getWards(data.idDistrict)
          //       .then(dataWard => {
          //         setWards(dataWard)
          //         setValue(
          //           'ward',
          //           dataWard.find(ward => ward.id == data.idDistrict),
          //         )
          //       })
          //       .catch(err => console.log(err))
          //   }
        })
        .catch(err => console.log(err))
    }
  }

  React.useEffect(() => {
    console.log('xx')
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
          <Feature control={control} errors={errors} />
        </AccordionDetails>
      </Accordion>
      <div style={{ marginTop: '50px' }}>
        <Button color="primary" type="submit" variant="contained">
          Lưu
        </Button>
      </div>
    </form>
  )
}
