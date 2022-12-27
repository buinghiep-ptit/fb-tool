import { yupResolver } from '@hookform/resolvers/yup'
import {
  FormHelperText,
  Grid,
  Icon,
  IconButton,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import { checkExistedName } from 'app/apis/audio/audio.service'
import {
  uploadApi,
  uploadAudio,
  uploadImage,
} from 'app/apis/uploads/upload.service'
import { BoxWrapperDialog } from 'app/components/common/BoxWrapperDialog'
import { MuiCheckBox } from 'app/components/common/MuiRHFCheckbox'
import FormInputText from 'app/components/common/MuiRHFInputText'
import { SelectDropDown } from 'app/components/common/MuiRHFSelectDropdown'
import MuiStyledModal from 'app/components/common/MuiStyledModal'
import { MuiTypography } from 'app/components/common/MuiTypography'
import { DropWrapper } from 'app/components/common/UploadPreviewer'
import { compressImageFile } from 'app/helpers/compressFile'
import { toastError, toastSuccess } from 'app/helpers/toastNofication'
import { useCreateAudio, useUpdateAudio } from 'app/hooks/queries/useAudiosData'
import { getReturnValues } from 'app/hooks/useCountDown'
import useDebounce from 'app/hooks/useDebounce.'
import { IMediaOverall } from 'app/models'
import { IAudioOverall } from 'app/models/audio'
import { EMediaFormat } from 'app/utils/enums/medias'
import { messages } from 'app/utils/messages'
import React, { useEffect, useRef, useState } from 'react'
import Dropzone from 'react-dropzone'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'

type Props = {
  title: string
}

type SchemaType = {
  name?: string
  isDefault: boolean
  urlAudio?: string
  audioFile?: File
  duration?: number
  imageFile?: File
  urlImage?: string
  author?: string
  performer?: string
  status?: number
}

export default function AddAudio({ title }: Props) {
  const navigate = useNavigate()
  const location = useLocation() as any
  const isModal = location.state?.modal ?? false
  const audio = (location.state?.data as IAudioOverall) ?? {}
  const { audioId } = useParams()
  const [audioPreviewer, setAudioPreviewer] = useState<IMediaOverall | null>(
    null,
  )
  const [imagePreviewer, setImagePreviewer] = useState<IMediaOverall | null>(
    null,
  )

  const [audioDur, setAudioDur] = useState<number>(0)
  const [labelDur, setLabelDur] = useState<string>('')

  const [isExistedName, setIsExistedName] = useState(false)

  const audioRef = useRef() as any

  const dropzoneImgRef = useRef(null) as any
  const dropzoneAudioRef = useRef(null) as any

  const [defaultValues] = useState<SchemaType>({
    status: 1,
    isDefault: false,
  })

  useEffect(() => {
    if (audio && !!Object.keys(audio).length) {
      defaultValues.name = audio.name
      defaultValues.performer = audio.performer ?? ''
      defaultValues.author = audio.author ?? ''
      defaultValues.isDefault = audio.isDefault === 1 ? true : false
      defaultValues.duration = audio.duration ?? 0
      defaultValues.status = audio?.status

      if (audio.urlAudio) {
        setAudioPreviewer({
          mediaFormat: EMediaFormat.AUDIO,
          url: audio.urlAudio,
        })
      }
      if (audio.urlImage) {
        setImagePreviewer({
          mediaFormat: EMediaFormat.IMAGE,
          url: audio.urlImage,
        })
      }

      methods.reset({ ...defaultValues })
    }
  }, [audio])

  const onSuccess = (data: any, message?: string) => {
    toastSuccess({
      message: message ?? '',
    })
    navigate(-1)
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .max(255, 'Nội dung không được vượt quá 255 ký tự')
      .required(messages.MSG1),
    // .test('existed', 'Tên bài hát đã tồn tại', () => !isExistedName),
    audioFile: Yup.mixed().test('empty', messages.MSG1, () => {
      return !!audioPreviewer
    }),
  })

  const methods = useForm<SchemaType>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const openDialogFileAudio = () => {
    if (dropzoneAudioRef.current) {
      dropzoneAudioRef.current.open()
    }
  }
  const removeAudioSelected = () => {
    setAudioPreviewer(null)
    methods.setValue('audioFile', undefined)
  }

  const openDialogFileImage = () => {
    if (dropzoneImgRef.current) {
      dropzoneImgRef.current.open()
    }
  }
  const removeImageSelected = () => {
    setImagePreviewer(null)
    methods.setValue('imageFile', undefined)
  }

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDur(audioRef.current.duration)
      const times = getReturnValues(audioRef.current.duration * 1000 ?? 0)
      const minutes = times[2]
        ? times[2] < 10
          ? '0' + times[2]
          : times[2]
        : '00'
      const seconds = times[3]
        ? times[3] < 10
          ? '0' + times[3]
          : times[3]
        : '00'
      setLabelDur(minutes + ':' + seconds)
    }
  }

  const { mutate: create, isLoading: createLoading } = useCreateAudio(() =>
    onSuccess(null, 'Thêm bài hát thành công'),
  )

  const { mutate: update, isLoading: updateLoading } = useUpdateAudio(() =>
    onSuccess(null, 'Cập nhật thành công'),
  )

  const debouncedSearchQuery = useDebounce(methods.watch('name') ?? '', 500)

  // const { data: checkName } = useCheckExistedName(debouncedSearchQuery)

  const checkName = async (nameAudios: string) => {
    try {
      const result = await checkExistedName({
        nameAudios,
      })
      if (result) {
        setIsExistedName(result.used)
        // if (result.used) {
        //   methods.setError('name', { message: 'Tên bài hát đã tồn tại' })
        // } else {
        //   methods.clearErrors('name')
        // }
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (!debouncedSearchQuery || (audio && audio.name == methods.watch('name')))
      return
    checkName(debouncedSearchQuery.trim())
  }, [debouncedSearchQuery])

  const onSubmitHandler: SubmitHandler<SchemaType> = async (
    values: SchemaType,
  ) => {
    let audData,
      imgData = null
    if (values.audioFile)
      audData = await uploadApi(values.audioFile, () => {}, null, {
        srcType: 14,
      })
    if (values.imageFile) {
      const fileCompressed = await compressImageFile(values.imageFile)

      imgData = await uploadApi(fileCompressed, () => {}, null, {
        srcType: 14,
      })
    }

    const payload: IAudioOverall = {
      name: values.name,
      isDefault: values.isDefault ? 1 : 0,
      urlAudio: audData ? audData.url : audio.urlAudio ?? null,
      urlImage: imgData ? imgData.url : audio.urlImage || null,
      duration: audioDur ? Math.floor(audioDur) : audio.duration,
      author: values.author || null,
      performer: values.performer || null,
      status: Number(values.status ?? 0),
    }

    if (audioId) {
      update({ id: Number(audioId ?? 0), payload: payload })
    } else {
      create(payload)
    }
  }

  const handleClose = () => {
    navigate(-1)
  }

  const getContent = () => {
    return (
      <BoxWrapperDialog>
        <FormProvider {...methods}>
          <Grid container spacing={3}>
            <Grid item md={5} xs={12}>
              <Stack my={3} gap={3}>
                <FormInputText
                  type="text"
                  label={'Tên bài hát'}
                  name="name"
                  placeholder="Nhập tên bài hát"
                  defaultValue=""
                  required
                />
                {isExistedName && (
                  <FormHelperText sx={{ color: '#f9a352', mt: -1.5 }}>
                    Tên nhạc nền đã được sử dụng (chỉ mang tính chất thông báo,
                    bạn vẫn có thể thêm)
                  </FormHelperText>
                )}

                <FormInputText
                  type="text"
                  label={'Tác giả'}
                  name="author"
                  placeholder="Nhập tên tác giả"
                  defaultValue=""
                />

                <FormInputText
                  type="text"
                  label={'Người thể hiện'}
                  name="performer"
                  placeholder="Nhập tên người thể hiện"
                  defaultValue=""
                />
                <SelectDropDown name="status" label="Trạng thái">
                  <MenuItem value="1">Hoạt động</MenuItem>
                  <MenuItem value="0">Không hoạt động</MenuItem>
                </SelectDropDown>
                <MuiCheckBox name="isDefault" label="Nhạc hay" />
              </Stack>
            </Grid>
            <Grid item md={7} xs={12}>
              <MuiTypography variant="body2" mt={2}>
                Tải lên bài hát: *
              </MuiTypography>
              <Box flex={1}>
                <Dropzone
                  ref={dropzoneAudioRef}
                  onDrop={(acceptedFiles, fileRejections) => {
                    if (fileRejections.length) {
                      toastError({
                        message:
                          fileRejections[0].errors[0].code ===
                          'file-invalid-type'
                            ? 'Nhạc nền chứa định dạng không hợp lệ'
                            : fileRejections[0].errors[0].message,
                      })

                      return
                    }
                    if (audioRef.current) {
                      audioRef.current.pause()
                      audioRef.current.load()
                      audioRef.current.play()
                    }
                    setAudioPreviewer({
                      url: URL.createObjectURL(acceptedFiles[0]),
                    })
                    methods.setValue('audioFile', acceptedFiles[0])
                    methods.clearErrors('audioFile')
                  }}
                  accept={{
                    'audio/ogg': ['.ogg', '.OGG'],
                    'audio/wav': ['.wav', '.WAV'],
                    'audio/mp3': ['.mp3', '.MP3'],
                    'audio/mp4': ['.mp4', '.MP4'],
                    'audio/aac': ['.aac', '.AAC'],
                  }}
                  multiple={false}
                  maxSize={20 * 1024 * 1024}
                >
                  {({ getRootProps, getInputProps }) => (
                    <>
                      <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        {!audioPreviewer && (
                          <Stack
                            flexDirection={'row'}
                            sx={{
                              background: 'rgba(22, 24, 35, 0.03)',
                              borderRadius: 1.5,
                              justifyContent: 'center',
                              alignItems: 'center',
                              cursor: 'pointer',
                              border: '2px dashed rgba(22, 24 , 35, 0.2)',
                              '&:hover': {
                                border: '2px dashed #2F9B42',
                              },
                              py: 1,
                              my: 1,
                            }}
                          >
                            <IconButton>
                              <Icon>audiotrack</Icon>
                            </IconButton>

                            <Stack alignItems={'center'}>
                              <MuiTypography variant="body2">
                                Chọn hoặc kéo thả file audio
                              </MuiTypography>
                              <MuiTypography
                                variant="body2"
                                fontSize={'0.75rem'}
                              >
                                (MP3 / OG / AAC MP4 hoặc WAV)
                              </MuiTypography>
                            </Stack>
                          </Stack>
                        )}
                      </div>
                      {audioPreviewer && (
                        <Stack
                          flexDirection={'row'}
                          sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            py: 1,
                            my: 1,
                          }}
                        >
                          <audio
                            controls
                            autoPlay
                            ref={audioRef}
                            onLoadedMetadata={onLoadedMetadata}
                          >
                            <source
                              src={audioPreviewer.url}
                              type="audio/mpeg"
                            />
                          </audio>

                          <Stack flexDirection={'row'} gap={1} ml={2}>
                            <Tooltip arrow title={'Chọn lại'}>
                              <IconButton
                                sx={{
                                  bgcolor: '#303030',
                                  borderRadius: 1,
                                }}
                                onClick={openDialogFileAudio}
                              >
                                <Icon sx={{ color: 'white' }}>cached</Icon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip arrow title={'Xóa'}>
                              <IconButton
                                sx={{
                                  bgcolor: '#303030',
                                  borderRadius: 1,
                                }}
                                onClick={removeAudioSelected}
                              >
                                <Icon sx={{ color: 'white' }}>delete</Icon>
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>
                      )}
                    </>
                  )}
                </Dropzone>
                {methods.formState.errors.audioFile && (
                  <FormHelperText error>
                    {methods.formState.errors.audioFile?.message as string}
                  </FormHelperText>
                )}

                <Stack flexDirection={'row'} gap={1} my={1}>
                  <MuiTypography variant="body2">
                    Thời lượng: {labelDur}
                  </MuiTypography>
                </Stack>

                <Stack flexDirection={'row'} gap={1.5} my={2}>
                  <MuiTypography variant="body2">Ảnh(1x1)</MuiTypography>
                  <Box flex={1}>
                    <Dropzone
                      ref={dropzoneImgRef}
                      onDrop={acceptedFiles => {
                        if (!acceptedFiles || !acceptedFiles.length) return
                        setImagePreviewer({
                          url: URL.createObjectURL(acceptedFiles[0]),
                        })
                        methods.setValue('imageFile', acceptedFiles[0])
                      }}
                      accept={{
                        'image/png': ['.png', '.PNG'],
                        'image/jpeg': ['.jpg', '.jpeg'],
                      }}
                      multiple={false}
                      maxSize={10 * 1024 * 1024}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <>
                          <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            {!imagePreviewer && (
                              <DropWrapper
                                sx={{
                                  aspectRatio: 'auto 16 / 9',
                                  borderRadius: 1.5,
                                  display: 'flex',
                                }}
                              >
                                <Stack
                                  sx={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 0.5,
                                  }}
                                >
                                  <MuiTypography variant="body2">
                                    Chọn hoặc kéo thả ảnh
                                  </MuiTypography>
                                  <Icon>backup</Icon>
                                  <MuiTypography
                                    variant="body2"
                                    fontSize={'0.75rem'}
                                  >
                                    PNG / JPEG hoặc JPG
                                  </MuiTypography>
                                  <MuiTypography
                                    variant="body2"
                                    fontSize={'0.75rem'}
                                  >
                                    nhỏ hơn 10MB/ảnh
                                  </MuiTypography>
                                </Stack>
                              </DropWrapper>
                            )}
                          </div>
                          {imagePreviewer && (
                            <Box
                              sx={{
                                position: 'relative',
                                aspectRatio: 'auto 16 / 9',
                                borderRadius: 1.5,
                                overflow: 'hidden',
                                boxShadow:
                                  '0 2px 6px 0 rgba(0, 0, 0, 0.1), 0 4px 10px 0 rgba(0, 0, 0, 0.16)',
                              }}
                            >
                              <Stack
                                flexDirection={'row'}
                                sx={{
                                  position: 'absolute',
                                  top: '6px',
                                  right: '6px',
                                  gap: 1,
                                }}
                              >
                                <Tooltip arrow title={'Chọn lại'}>
                                  <IconButton
                                    sx={{
                                      bgcolor: '#303030',
                                      borderRadius: 1,
                                    }}
                                    onClick={openDialogFileImage}
                                  >
                                    <Icon sx={{ color: 'white' }}>cached</Icon>
                                  </IconButton>
                                </Tooltip>
                                <Tooltip arrow title={'Xóa'}>
                                  <IconButton
                                    sx={{
                                      bgcolor: '#303030',
                                      borderRadius: 1,
                                    }}
                                    onClick={removeImageSelected}
                                  >
                                    <Icon sx={{ color: 'white' }}>delete</Icon>
                                  </IconButton>
                                </Tooltip>
                              </Stack>

                              <img
                                src={imagePreviewer.url}
                                alt="thumb"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            </Box>
                          )}
                        </>
                      )}
                    </Dropzone>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </FormProvider>
      </BoxWrapperDialog>
    )
  }

  return (
    <React.Fragment>
      <MuiStyledModal
        title={title}
        open={isModal}
        onCloseModal={handleClose}
        isLoading={createLoading || updateLoading}
        maxWidth={'md'}
        onSubmit={methods.handleSubmit(onSubmitHandler)}
        submitText="Lưu"
        cancelText="Quay lại"
      >
        {getContent()}
      </MuiStyledModal>
    </React.Fragment>
  )
}
