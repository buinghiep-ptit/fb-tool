import {
  AddCircleSharp,
  ChangeCircleSharp,
  UploadFile,
} from '@mui/icons-material'
import { Stack } from '@mui/material'
import { Box } from '@mui/system'
import { ImageListView } from 'app/views/manage/feeds/components/ImageListCustomize'
import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { MediaPlayer } from './MediaPlayer'
import { MuiButton } from './MuiButton'
import { MuiTypography } from './MuiTypography'

interface Props {
  mediaConfigs: { mediaFormat: number; accept: string; multiple: boolean }
}

export function UploadMedias({
  mediaConfigs = { mediaFormat: 1, accept: 'video/*', multiple: false },
}: Props) {
  const { mediaFormat, multiple } = mediaConfigs
  const [videoSrc, setVideoSrc] = useState('')
  const [imagesSrc, setImagesSrc] = useState<{ name: string; url: string }[]>(
    [],
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: !!videoSrc || !!imagesSrc.length,
    multiple: multiple,
    accept:
      mediaFormat === 1
        ? {
            'video/*': [],
          }
        : {
            'image/*': [],
          },
    onDrop: acceptedFiles => {
      console.log('acceptedFiles:', acceptedFiles)
      if (mediaFormat === 1) setVideoSrc(URL.createObjectURL(acceptedFiles[0]))
      else {
        const newImages = acceptedFiles.map((file, index) =>
          Object.assign(file, {
            id: index + imagesSrc.length,
            url: URL.createObjectURL(file),
          }),
        )
        setImagesSrc(prev => [...prev, ...newImages] as any)
      }
    },
  })

  useEffect(() => {
    return () => imagesSrc.forEach(image => URL.revokeObjectURL(image.url))
  }, [])

  return (
    <Box {...getRootProps({ className: 'dropzone' })} position={'relative'}>
      <Box
        sx={{
          position: 'relative',
          aspectRatio: 'auto 9 / 16',
          background: 'rgba(22, 24, 35, 0.03)',
          borderRadius: 1.5,
          display: !!videoSrc || !!imagesSrc.length ? 'none' : 'flex',
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
            Chọn ảnh hoặc video để tải lên
          </MuiTypography>
          <MuiTypography variant="body2">Hoặc kéo và thả tập tin</MuiTypography>
          <UploadFile fontSize="medium" />
          <MuiTypography variant="body2">
            MP4 hoặc WebM với Video (tối đa 3 phút)
          </MuiTypography>
          <MuiTypography variant="body2">
            PNG / JPEG / JPG với Ảnh (tối đa 10MB/ảnh)
          </MuiTypography>
          <MuiButton
            title="Chọn tập tin"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          />
        </Stack>
      </Box>
      {!!imagesSrc.length && (
        <Box mt={-2} position="relative">
          <ImageListView medias={imagesSrc as any} />
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
      {!!videoSrc && (
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
          <MediaPlayer url={videoSrc} />
          <MuiButton
            title="Thay đổi video"
            variant="contained"
            color="primary"
            sx={{ position: 'absolute', top: 16, left: 16 }}
            onClick={open}
            startIcon={<ChangeCircleSharp fontSize="small" />}
          />
        </Box>
      )}
    </Box>
  )
}
