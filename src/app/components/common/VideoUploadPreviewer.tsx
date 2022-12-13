import {
  FormHelperText,
  Icon,
  IconButton,
  Stack,
  styled,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import { uploadApi } from 'app/apis/uploads/upload.service'
import { blobToFile, getVideoDuration } from 'app/helpers/compressFile'
import { generateVideoThumbnails } from 'app/helpers/extractThumbnailVideo'
import { toastError } from 'app/helpers/toastNofication'
import { IMediaOverall } from 'app/models'
import { Fragment, useCallback, useState } from 'react'
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
  setThumbnail?: (file: string) => void
  srcTypeModule?: {
    srcType?: number
    idSrc?: number
  }
}

export function VideoUploadPreviewer({
  name,
  videos = [],
  setUploadFile,
  setInitialFile,
  setThumbnail,
  srcTypeModule,
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
  const [thumbnailActive, setThumbnailActive] = useState(0)

  const getThumbnailsFromVideo = async (file: File) => {
    const thumbnails = await generateVideoThumbnails(file, 4)
    setThumbnailPreviewer(thumbnails)
    base64ToFile(thumbnails[0])
  }

  const base64ToFile = async (base64: any) => {
    const blob = await fetch(base64).then(res => res.blob())
    const myFile = blobToFile(blob, 'thumbnail.jpeg')
    const thumbResult = await uploadApi(myFile)

    setThumbnail && setThumbnail(thumbResult.url)
  }

  const onDrop = useCallback(
    async (droppedFiles: File[]) => {
      if (!droppedFiles[0].type?.includes('video')) return
      const duration = await getVideoDuration(droppedFiles[0])

      if (duration && duration > 180) {
        toastError({
          message: 'Dung lượng video không được vượt quá 3 phút',
        })

        return
      }

      const droppedFilesModule = droppedFiles.map(file =>
        Object.assign(file, {
          srcTypeModule,
        }),
      )

      setValue(name, droppedFilesModule, { shouldValidate: true })
      setUploadFile(droppedFilesModule)
      getThumbnailsFromVideo(droppedFiles[0])
    },
    [setValue, name, files],
  )

  const { getRootProps, getInputProps, open, fileRejections } = useDropzone({
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

  const fileRejectionItems = fileRejections.map(({ file, errors }: any) => {
    return (
      <li key={file.path}>
        {file.path} - {file.size} bytes
        <ul>
          {errors.map((e: any) => (
            <li key={e.code}>
              <span style={{ color: '#FF6868' }}>{e.message}</span>
            </li>
          ))}
        </ul>
      </li>
    )
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
          <Stack direction={'row'} width="100%">
            <DropWrapper
              sx={{
                aspectRatio: 'auto 9 / 16',
                borderRadius: 1.5,
                display: 'flex',
                flex: 1,
                maxWidth: 350,
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
            <Stack width={150} px={1.5} gap={1.5}></Stack>
          </Stack>
        </div>
      )}

      {errors[name] && (
        <FormHelperText error>{errors[name]?.message as string}</FormHelperText>
      )}

      {!!videos.length &&
        !!videos[videos.length - 1] &&
        videos[videos.length - 1].url && (
          <Stack direction={'row'}>
            <PreviewerViewport
              sx={{
                aspectRatio: 'auto 9 / 16',
                borderRadius: 1.5,
                flex: 1,
                maxWidth: 350,
              }}
            >
              <MediaPlayer
                url={videos[videos.length - 1].url ?? videos[0].url ?? ''}
                setDuration={() => {}}
              />
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
            <Stack width={150} px={1.5} gap={1.5}>
              {thumbnailsPreviewer.length ? (
                thumbnailsPreviewer.map((thumb, index) => (
                  <img
                    key={index}
                    onClick={() => {
                      setThumbnailActive(index)
                      base64ToFile(thumb)
                    }}
                    src={thumb}
                    style={{
                      cursor: 'pointer',
                      width: '100%',
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: `2px solid ${
                        thumbnailActive === index ? '#2F9B42' : '#ffffff'
                      }`,
                    }}
                  />
                ))
              ) : (
                <></>
              )}
              {thumbnailsPreviewer.length ? (
                <MuiTypography
                  textAlign={'center'}
                  variant="body2"
                  fontWeight={500}
                >
                  Chọn thumbnail
                </MuiTypography>
              ) : (
                <></>
              )}
            </Stack>
          </Stack>
        )}

      {fileRejections.length ? (
        <aside>
          <h4>File không hợp lệ</h4>
          <ul>{fileRejectionItems}</ul>
        </aside>
      ) : (
        <></>
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
