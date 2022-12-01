import {
  FormHelperText,
  Icon,
  IconButton,
  Stack,
  styled,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import { generateVideoThumbnails } from 'app/helpers/extractThumbnailVideo'
import { IMediaOverall } from 'app/models'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import MediaPlayer from './MediaPlayer'
import { MuiButton } from './MuiButton'
import { MuiTypography } from './MuiTypography'

export const DropWrapper = styled(Box)<{ aspectRatio?: string }>(
  ({ aspectRatio }) => ({
    position: 'relative',
    aspectRatio: aspectRatio,
    background: 'rgba(22, 24, 35, 0.03)',
    borderRadius: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: '2px dashed rgba(22, 24 , 35, 0.2)',
    '&:hover': {
      border: '2px dashed #2F9B42',
    },
  }),
)

const PreviewerViewport = styled(Box)(() => ({
  position: 'relative',
  borderRadius: 1.5,
  overflow: 'hidden',
}))

export interface Props {
  name: string
  videos: IMediaOverall[]
  setUploadFile: (files: File[]) => void
  setInitialFile: (files: IMediaOverall[]) => void
}

export function VideoUploadPreviewer({
  name,
  videos = [],
  setUploadFile,
  setInitialFile,
}: Props) {
  const {
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext()
  const files: File[] = watch(name)

  const fileInfos = useSelector((state: any) => state.UploadFile.fileInfos)
  const [thumbnailsPreviewer, setThumbnailPreviewer] = useState([])

  const getThumbnailsFromVideo = async (file: File) => {
    const thumbnails = await generateVideoThumbnails(file, 4)
    setThumbnailPreviewer(thumbnails)
    console.log(thumbnails)
  }

  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      setValue(name, droppedFiles, { shouldValidate: true })
      setUploadFile(droppedFiles)
      getThumbnailsFromVideo(droppedFiles[0])
    },
    [setValue, name, files],
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    multiple: false,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/mov': ['.mov'],
      'video/3gp': ['.3gp'],
    },
    onDrop,
    maxSize: 500 * 1024 * 1024,
  })

  const handleRemoveAllMedias = () => {
    const newFiles = fileInfos.filter((f: IMediaOverall) => f.mediaFormat !== 1)
    setValue(name, null)
    setInitialFile(newFiles)
  }

  return (
    <Fragment>
      {!videos.length && (
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />

          <DropWrapper
            sx={{
              aspectRatio: 'auto 9 / 16',
              borderRadius: 1.5,
              display: 'flex',
            }}
          >
            <Stack flexDirection={'column'} alignItems="center" gap={1}>
              <MuiTypography fontSize={'1.125rem'}>
                {'Chọn video để tải lên'}
              </MuiTypography>
              <MuiTypography variant="body2">
                Hoặc kéo và thả tập tin
              </MuiTypography>
              <Icon>backup</Icon>
              <MuiTypography variant="body2">
                MP4, MOV, 3GP hoặc WebM
              </MuiTypography>
              <MuiTypography variant="body2">tối đa 3 phút</MuiTypography>

              <MuiButton
                title="Chọn video"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              />
            </Stack>
          </DropWrapper>
        </div>
      )}

      {errors[name] && (
        <FormHelperText error>{errors[name]?.message as string}</FormHelperText>
      )}

      {!!videos.length && videos[0].url && (
        <Stack direction={'row'}>
          <PreviewerViewport
            sx={{
              aspectRatio: 'auto 9 / 16',
              borderRadius: 1.5,
              flex: 1,
            }}
          >
            <MediaPlayer url={videos[0].url} setDuration={() => {}} />
            <Stack
              flexDirection={'row'}
              gap={1.5}
              sx={{
                position: 'absolute',
                width: '100%',
                top: 0,
                left: 0,
                py: 3,
                px: 1,
                zIndex: 1,
                justifyContent: 'flex-end',
              }}
            >
              <CustomIconButton
                handleClick={open}
                iconName={'cached'}
                title={'Thay đổi video'}
              />

              <CustomIconButton
                handleClick={handleRemoveAllMedias}
                iconName={'delete'}
                title={'Xoá'}
              />
            </Stack>
          </PreviewerViewport>
          {thumbnailsPreviewer[0] && (
            <img
              src={thumbnailsPreviewer[0]}
              style={{ width: 120, height: 80 }}
            />
          )}
        </Stack>
      )}
    </Fragment>
  )
}

type ButtonProps = {
  handleClick: () => void
  iconName: string
  title: string
  style?: any
}

const CustomIconButton = ({
  iconName,
  title,
  style,
  handleClick,
}: ButtonProps) => {
  return (
    <Tooltip arrow title={title}>
      <IconButton
        sx={{
          ...style,
          bgcolor: '#303030',
          borderRadius: 1,
        }}
        onClick={() => handleClick && handleClick()}
      >
        <Icon sx={{ color: 'white' }}>{iconName}</Icon>
      </IconButton>
    </Tooltip>
  )
}
