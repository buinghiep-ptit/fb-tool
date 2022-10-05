import {
  AddCircleSharp,
  ChangeCircleSharp,
  UploadFile,
} from '@mui/icons-material'
import {
  FormHelperText,
  Icon,
  IconButton,
  LinearProgress,
  Stack,
} from '@mui/material'
import { Box } from '@mui/system'
import { Image, IMediaOverall } from 'app/models'
import { EMediaFormat, EMediaType } from 'app/utils/enums/medias'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'
import { AbsoluteFillObject } from './AbsoluteFillObjectBox'
import { CircularProgressWithLabel, ImageListView } from './ImageListCustomize'
import MediaPlayer from './MediaPlayer'
import { ModalFullScreen } from './ModalFullScreen'
import { MuiButton } from './MuiButton'
import { MuiTypography } from './MuiTypography'

interface Props {
  name: string
  mediaConfigs: {
    mediaFormat: 1 | 2
    accept: string
    multiple: boolean
    mediaType?: number
  }
  mode?: 'append' | 'update' | undefined
  selectFiles: (files: any) => void
  uploadFiles: (files: any, mediaFormat?: 1 | 2) => void
  removeSelectedFiles?: (index?: number) => void
  uploading?: boolean
  progressInfos: any
  mediasSrcPreviewer: IMediaOverall[]
  setMediasSrcPreviewer: (files: any) => void
}

export function UploadPreviewer({
  name,
  mediaConfigs = {
    mediaFormat: EMediaFormat.VIDEO,
    accept: 'video/*',
    multiple: false,
    mediaType: EMediaType.POST,
  },
  mode = 'append',
  uploadFiles,
  removeSelectedFiles,
  uploading,
  progressInfos,
  mediasSrcPreviewer,
  setMediasSrcPreviewer,
}: Props) {
  const { mediaFormat, mediaType, multiple } = mediaConfigs
  const [duration, setDuration] = useState(0)
  const _mediasSrcRef = useRef<{ val: IMediaOverall[] }>({ val: [] })
  const [openSlider, setOpenSlider] = useState(false)
  const [initialIndexSlider, setInitialIndexSlider] = useState(0)

  const {
    register,
    unregister,
    setValue,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const files: File[] = watch(name)

  useEffect(() => {
    if (mediaType === EMediaType.AVATAR) return
    setMediasSrcPreviewer([])
    setValue('files', null)
    clearErrors('files')
  }, [mediaFormat])

  useEffect(() => {
    const fileVideo = getValues(name) && getValues(name)[0]
    if (duration && mediaFormat === 1 && fileVideo) {
      const newFiles = Object.assign(fileVideo, {
        duration,
      })
      setValue(name, [newFiles], {
        shouldValidate: true,
      })
    }
  }, [duration])

  useEffect(() => {
    register(name)
    return () => {
      unregister(name)
    }
  }, [register, unregister, name])

  const handleCloseSlider = () => {
    setOpenSlider(false)
  }
  const onClickMedia = (imgIndex?: number) => {
    if (imgIndex === 4) setInitialIndexSlider(0)
    else setInitialIndexSlider(imgIndex ?? 0)
    setOpenSlider(true)
  }
  const handleRemoveMedia = (mediaIndex?: number) => {
    mediasSrcPreviewer.splice(mediaIndex ?? 0, 1)
    setMediasSrcPreviewer([...mediasSrcPreviewer])

    files.splice(mediaIndex ?? 0, 1)
    if (!!files.length) setValue('files', files)
    else setValue('files', null)

    removeSelectedFiles && removeSelectedFiles(mediaIndex)
  }

  const handleResetMedia = () => {
    setMediasSrcPreviewer([])
    setValue('files', null)
    clearErrors('files')

    removeSelectedFiles && removeSelectedFiles()
  }

  const extractDroppedFiles = (old: File[], dropped: File[]): File[] => {
    const newFiles = dropped.reduce((prev: File[], file: File) => {
      const fo = Object.entries(file)
      if (
        old.find((e: File) => {
          const eo = Object.entries(e)
          return eo.every(
            ([key, value], index) =>
              key === fo[index][0] && value === fo[index][1],
          )
        })
      ) {
        return prev
      } else {
        return [...prev, file]
      }
    }, [])
    return newFiles
  }

  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      if (mediaFormat === EMediaFormat.VIDEO && !!files)
        delete (files[0] as any).duration
      const extract = extractDroppedFiles([...(files || [])], [...droppedFiles])
      if (!extract.length) return

      if (mediaFormat === EMediaFormat.VIDEO || mediaType === EMediaType.AVATAR)
        setMediasSrcPreviewer([{ url: URL.createObjectURL(extract[0]) }])
      else {
        const newImages = [...extract].map((originalFile: File) =>
          // deep clone
          Object.assign(
            new File([originalFile], originalFile.name, {
              type: originalFile.type,
            }),
            {
              url: URL.createObjectURL(originalFile),
            },
          ),
        )
        setMediasSrcPreviewer((prev: any) => [...prev, ...newImages] as any)
      }
      _mediasSrcRef.current = {
        val: mediasSrcPreviewer,
      }

      uploadFiles(extract, mediaFormat)
      const newSelectedFiles: File[] =
        mediaFormat === EMediaFormat.VIDEO
          ? [...extract]
          : [...(files || []), ...extract]
      setValue(name, newSelectedFiles, {
        shouldValidate: true,
      })
    },
    [setValue, name, mode, files, mediaFormat],
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: !!mediasSrcPreviewer.length,
    noDrag: uploading,
    multiple: multiple,
    accept:
      mediaFormat === EMediaFormat.VIDEO
        ? {
            'video/*': [],
          }
        : {
            'image/*': [],
          },
    onDrop,
  })

  useEffect(() => {
    return () =>
      mediasSrcPreviewer.forEach(
        image => image.url && URL.revokeObjectURL(image.url),
      )
  }, [])

  return (
    <Box {...getRootProps({ className: 'dropzone' })} position={'relative'}>
      {mediaType !== EMediaType.AVATAR ? (
        <Box
          sx={{
            position: 'relative',
            aspectRatio:
              mediaFormat === EMediaFormat.VIDEO ? 'auto 9 / 16' : 'auto 1 / 1',
            background: 'rgba(22, 24, 35, 0.03)',
            borderRadius: 1.5,
            display: !!mediasSrcPreviewer.length ? 'none' : 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            border: '2px dashed rgba(22, 24, 35, 0.2)',
            '&:hover': {
              border: '2px dashed #2F9B42',
            },
          }}
        >
          <input {...getInputProps()} />
          <Stack flexDirection={'column'} alignItems="center" gap={1}>
            <MuiTypography fontSize={'1.125rem'}>
              {mediaFormat === EMediaFormat.VIDEO
                ? 'Chọn video để tải lên'
                : 'Chọn ảnh để tải lên'}
            </MuiTypography>
            <MuiTypography variant="body2">
              Hoặc kéo và thả tập tin
            </MuiTypography>
            <UploadFile fontSize="medium" />
            {mediaFormat === EMediaFormat.VIDEO ? (
              <>
                <MuiTypography variant="body2">MP4 hoặc WebM</MuiTypography>
                <MuiTypography variant="body2">tối đa 3 phút</MuiTypography>
              </>
            ) : (
              <>
                <MuiTypography variant="body2">
                  PNG / JPEG hoặc JPG
                </MuiTypography>
                <MuiTypography variant="body2">nhỏ hơn 10MB/ảnh</MuiTypography>
              </>
            )}

            <MuiButton
              title="Chọn tập tin"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            />
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            width: 200,
            height: 200,
            borderRadius: 100,
            position: 'relative',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            boxShadow:
              '0 2px 6px 0 rgba(0, 0, 0, 0.1), 0 4px 10px 0 rgba(0, 0, 0, 0.16)',

            backgroundImage: `url(${
              mediasSrcPreviewer[0] && mediasSrcPreviewer[0].url
            })`,
          }}
        >
          <input {...getInputProps()} />
          <IconButton
            onClick={open}
            sx={{ position: 'absolute', bottom: 0, left: 8 }}
          >
            <Icon sx={{ fontSize: '32px !important' }}>local_see</Icon>
          </IconButton>
        </Box>
      )}

      {mediaType !== EMediaType.AVATAR && (
        <>
          {!!mediasSrcPreviewer.length && mediaFormat === EMediaFormat.IMAGE && (
            <Box mt={-2} position="relative">
              <ImageListView
                medias={[...mediasSrcPreviewer] as any}
                oldMedias={_mediasSrcRef.current.val}
                progressInfos={progressInfos}
                onClickMedia={onClickMedia}
              />
              <ModalFullScreen
                mode="edit"
                data={mediasSrcPreviewer as Image[]}
                open={openSlider}
                onCloseModal={handleCloseSlider}
                onSubmit={handleRemoveMedia}
                initialIndexSlider={initialIndexSlider}
              />
              {!uploading && (
                <MuiButton
                  title="Thêm ảnh"
                  variant="contained"
                  color="primary"
                  sx={{ position: 'absolute', top: 16, left: 16 }}
                  onClick={open}
                  startIcon={<AddCircleSharp fontSize="small" />}
                />
              )}
            </Box>
          )}
          {!!mediasSrcPreviewer.length &&
            mediasSrcPreviewer[0].url &&
            mediaFormat === EMediaFormat.VIDEO && (
              <Box
                sx={{
                  position: 'relative',
                  aspectRatio: 'auto 9 / 16',
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <>
                  <MediaPlayer
                    url={mediasSrcPreviewer[0].url}
                    setDuration={setDuration}
                  />
                  {!uploading && (
                    <MuiButton
                      title="Thay đổi video"
                      variant="contained"
                      color="primary"
                      sx={{ position: 'absolute', top: 16, left: 16 }}
                      onClick={open}
                      startIcon={<ChangeCircleSharp fontSize="small" />}
                    />
                  )}
                </>
                {progressInfos?.val &&
                  progressInfos.val[0] &&
                  (progressInfos.val[0].percentage ?? 0) < 100 && (
                    <AbsoluteFillObject bgcolor="rgba(0, 0, 0, 0.7)">
                      <CircularProgressWithLabel
                        value={progressInfos.val[0].percentage ?? 0}
                      />
                    </AbsoluteFillObject>
                  )}
              </Box>
            )}
        </>
      )}

      <Box px={1.5} my={1.5}>
        {uploading && <LinearProgress />}

        {errors[name] && (
          <FormHelperText error>
            {errors[name]?.message as string}
          </FormHelperText>
        )}
      </Box>
    </Box>
  )
}
