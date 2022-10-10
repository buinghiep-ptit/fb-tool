import * as React from 'react'
import {
  Box,
  Grid,
  styled,
  InputLabel,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material'
import { Breadcrumb, SimpleCard } from 'app/components'
import { ICampAreaResponse } from 'app/models/camp'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchCampAreas } from 'app/apis/feed/feed.service'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { MuiRHFAutoComplete } from 'app/components/common/MuiRHFAutoComplete'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import * as Yup from 'yup'
import { checkIfFilesAreTooBig } from 'app/helpers/validateUploadFiles'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import { ApprovalRounded, CancelSharp } from '@mui/icons-material'
import { MuiButton } from 'app/components/common/MuiButton'
import { UploadPreviewer } from 'app/components/common/UploadPreviewer'
import { IMediaOverall } from 'app/models'
import { useUploadFiles } from 'app/hooks/useFilesUpload'
import MuiRHFNumericFormatInput from 'app/components/common/MuiRHFWithNumericFormat'
import { MuiTypography } from 'app/components/common/MuiTypography'
import FormInputText from 'app/components/common/MuiRHFInputText'
const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}))
export interface Props {}
export default function ServiceDetail(props: Props) {
  const [mediasSrcPreviewer, setMediasSrcPreviewer] = useState<IMediaOverall[]>(
    [],
  )
  const [
    selectFiles,
    uploadFiles,
    uploading,
    progressInfos,
    message,
    fileInfos,
  ] = useUploadFiles()

  const calendar = [
    'Thứ 2:',
    'Thứ 3:',
    'Thứ 4:',
    'Thứ 5:',
    'Thứ 6:',
    'Thứ 7:',
    'Chủ nhật:',
  ]
  const [fileConfigs, setFileConfigs] = useState({
    mediaFormat: 2,
    accept: 'image/*',
    multiple: true,
  })

  const { data: campAreas }: UseQueryResult<ICampAreaResponse, Error> =
    useQuery<ICampAreaResponse, Error>(['camp-areas'], () =>
      fetchCampAreas({ size: 200, page: 0 }),
    )

  type TypeElement = {
    camp?: string[]
    files?: any
    content?: string
  }
  const [defaultValues] = useState<TypeElement>({
    camp: [],
  })

  const validationSchema = Yup.object().shape({
    camp: Yup.object().required('Không được để trống'),
    content: Yup.string().required('Nội dung không được bỏ trống'),
    files: Yup.mixed()
      .required('Vui lòng chọn file')
      .test('fileSize', 'Dung lượng file quá lớn (10MB/ảnh )', files =>
        checkIfFilesAreTooBig(files, fileConfigs.mediaFormat),
      ),
  })

  const methods = useForm<any>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })
  const onSubmitHandler: SubmitHandler<TypeElement> = (values: TypeElement) => {
    console.log(values)
  }
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: 'Chi tiết dịch vụ' }]} />
      </Box>
      <SimpleCard>
        <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
          <FormProvider {...methods}>
            <Grid container spacing={2}>
              <Grid item sm={3} xs={3}>
                <MuiButton
                  title="Lưu"
                  loading={false}
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ width: '100%' }}
                  startIcon={<ApprovalRounded />}
                />
              </Grid>

              <Grid item sm={3} xs={3}>
                <MuiButton
                  onClick={() => methods.reset()}
                  title="Huỷ"
                  variant="outlined"
                  color="secondary"
                  sx={{ width: '100%' }}
                  startIcon={<CancelSharp />}
                />
              </Grid>
            </Grid>
            <Grid
              container
              sx={{ marginLeft: '8px', marginTop: '10px ' }}
              rowSpacing={1}
            >
              <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  required
                  sx={{ color: 'Black', fontSize: '15px', fontWeight: '500' }}
                >
                  Địa điểm camp:
                </InputLabel>
              </Grid>
              <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
                <MuiRHFAutoComplete
                  key={'campGroundId'}
                  name="camp"
                  options={campAreas?.content ?? []}
                  optionProperty="name"
                  getOptionLabel={option => option.name ?? ''}
                  defaultValue=""
                />
              </Grid>
              <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  required
                  sx={{
                    color: 'Black',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  Loại dịch vụ:
                </InputLabel>
              </Grid>
              <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
                <SelectDropDown name="rentalType" label="">
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="1">Gói dịch vụ</MenuItem>
                  <MenuItem value="2">Gói lưu trú</MenuItem>
                  <MenuItem value="3">Khác</MenuItem>
                </SelectDropDown>
              </Grid>
              <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  required
                  sx={{
                    color: 'Black',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  Áp dụng:
                </InputLabel>
              </Grid>
              <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
                <MuiRHFNumericFormatInput
                  type="text"
                  name="capacity"
                  label=""
                  placeholder=""
                  defaultValue=""
                  iconEnd={
                    <MuiTypography variant="subtitle2">Người</MuiTypography>
                  }
                />
              </Grid>
              <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  required
                  sx={{
                    color: 'Black',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  Tên dịch vụ:
                </InputLabel>
              </Grid>
              <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormInputText
                  type="text"
                  name="name"
                  label={''}
                  defaultValue=""
                  placeholder=""
                  sx={{ width: '50%' }}
                />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  sx={{
                    color: 'Black',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  Mô tả
                </InputLabel>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  id="description"
                  multiline
                  rows={10}
                  sx={{ width: '75%' }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  sx={{
                    color: 'Black',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  Hình ảnh:
                </InputLabel>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                <Stack
                  gap={2}
                  flexDirection={'column'}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <Box
                    width={{
                      sx: '100%',
                      md: fileConfigs.mediaFormat === 1 ? 300 : 500,
                    }}
                    position="relative"
                  >
                    <UploadPreviewer
                      name="files"
                      mediasSrcPreviewer={mediasSrcPreviewer}
                      setMediasSrcPreviewer={setMediasSrcPreviewer}
                      mediaConfigs={fileConfigs}
                      selectFiles={selectFiles}
                      uploadFiles={uploadFiles}
                      uploading={uploading}
                      progressInfos={progressInfos}
                    />
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  sx={{
                    color: 'Black',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  Giá dịch vụ:
                </InputLabel>
              </Grid>

              {calendar.map((date, index) => (
                <Grid
                  container
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 1,
                  }}
                  key={index}
                >
                  <Grid item xs={2}>
                    <InputLabel
                      sx={{
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      {date}
                    </InputLabel>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <MuiRHFNumericFormatInput
                      type="text"
                      name="amount"
                      label=""
                      placeholder=""
                      defaultValue=""
                      iconEnd={
                        <MuiTypography variant="subtitle2">
                          VND/Ngày
                        </MuiTypography>
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              ))}

              <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <InputLabel
                  sx={{
                    color: 'Black',
                    fontSize: '15px',
                    fontWeight: '500',
                  }}
                >
                  Trạng thái:
                </InputLabel>
              </Grid>
              <Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
                <SelectDropDown name="status" label="" sx={{ width: '50%' }}>
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="1">Hiệu lực</MenuItem>
                  <MenuItem value="-1">Không hiệu lực</MenuItem>
                </SelectDropDown>
              </Grid>
            </Grid>
          </FormProvider>
        </form>
      </SimpleCard>
    </Container>
  )
}
