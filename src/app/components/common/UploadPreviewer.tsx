import {
  AddCircleSharp,
  ChangeCircleSharp,
  UploadFile,
} from '@mui/icons-material'
import { FormHelperText, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { IMediaOverall } from 'app/models'
import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'
import { AbsoluteFillObject } from './AbsoluteFillObjectBox'
import { CircularProgressWithLabel, ImageListView } from './ImageListCustomize'
import { MediaPlayer } from './MediaPlayer'
import { MuiButton } from './MuiButton'
import { MuiTypography } from './MuiTypography'

interface Props {
  name: string
  mediaConfigs: { mediaFormat: number; accept: string; multiple: boolean }
  mode?: string
  selectFiles: (files: any) => void
  progressInfos: any
  mediasSrcPreviewer: IMediaOverall[]
  setMediasSrcPreviewer: (files: any) => void
}

export function UploadMedias({
  name,
  mediaConfigs = { mediaFormat: 1, accept: 'video/*', multiple: false },
  mode,
  selectFiles,
  progressInfos,
  mediasSrcPreviewer,
  setMediasSrcPreviewer,
}: Props) {
  const { mediaFormat, multiple } = mediaConfigs
  // const [videoSrcPreviewer, setVideoSrcPreviewer] = useState('')
  const [duration, setDuration] = useState(0)
  // const [imagesSrcPreviewer, setImagesSrcPreviewer] = useState<
  //   { name: string; url: string }[]
  // >([])

  const {
    register,
    unregister,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext()

  const files: File[] = watch(name)

  useEffect(() => {
    setMediasSrcPreviewer([])
    // setVideoSrcPreviewer('')
  }, [mediaFormat])

  useEffect(() => {
    const fileVideo = getValues(name) && getValues(name)[0]
    if (duration && mediaFormat === 1 && fileVideo) {
      const newFiles = Object.assign(fileVideo, {
        duration: duration,
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const deepClone = _.cloneDeep(acceptedFiles)
      console.log('deepClone:', deepClone)
      if (mediaFormat === 1)
        setMediasSrcPreviewer([{ url: URL.createObjectURL(deepClone[0]) }])
      else {
        const newImages = deepClone.map((file: File, index: number) =>
          Object.assign(file, {
            id: index + mediasSrcPreviewer.length,
            url: URL.createObjectURL(file),
          }),
        )
        setMediasSrcPreviewer((prev: any) => [...prev, ...newImages] as any)
      }
      let newFiles: File[] =
        mediaFormat === 1 ? acceptedFiles : [...(files || []), ...acceptedFiles]

      if (true) {
        newFiles = newFiles.reduce((prev: any, file: any) => {
          const fo = Object.entries(file)
          if (
            prev.find((e: File) => {
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
      }

      setValue(name, newFiles, {
        shouldValidate: true,
      })
      selectFiles(newFiles)
    },
    [setValue, name, mode, files],
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: !!mediasSrcPreviewer.length,
    multiple: multiple,
    accept:
      mediaFormat === 1
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
      <Box
        sx={{
          position: 'relative',
          aspectRatio: mediaFormat === 1 ? 'auto 9 / 16' : 'auto 1 / 1',
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
            {mediaFormat === 1
              ? 'Chọn video để tải lên'
              : 'Chọn ảnh để tải lên'}
          </MuiTypography>
          <MuiTypography variant="body2">Hoặc kéo và thả tập tin</MuiTypography>
          <UploadFile fontSize="medium" />
          {mediaFormat === 1 ? (
            <>
              <MuiTypography variant="body2">MP4 hoặc WebM</MuiTypography>
              <MuiTypography variant="body2">tối đa 3 phút</MuiTypography>
            </>
          ) : (
            <>
              <MuiTypography variant="body2">PNG / JPEG hoặc JPG</MuiTypography>
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
      {!!mediasSrcPreviewer.length && mediasSrcPreviewer[0].mediaFormat === 2 && (
        <Box mt={-2} position="relative">
          <ImageListView
            medias={mediasSrcPreviewer as any}
            progressInfos={progressInfos}
          />
          <MuiButton
            title="Thêm ảnh"
            variant="contained"
            color="primary"
            sx={{ position: 'absolute', top: 16, left: 16 }}
            onClick={open}
            startIcon={<AddCircleSharp fontSize="small" />}
          />
        </Box>
      )}
      {!!mediasSrcPreviewer.length &&
        mediasSrcPreviewer[0].url &&
        mediasSrcPreviewer[0].mediaFormat === 1 && (
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
              <MuiButton
                title="Thay đổi video"
                variant="contained"
                color="primary"
                sx={{ position: 'absolute', top: 16, left: 16 }}
                onClick={open}
                startIcon={<ChangeCircleSharp fontSize="small" />}
              />
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
      {errors[name] && (
        <FormHelperText error>{errors[name]?.message as string}</FormHelperText>
      )}
    </Box>
  )
}
