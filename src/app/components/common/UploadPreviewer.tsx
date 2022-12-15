import { UploadFile } from '@mui/icons-material'
import {
  FormHelperText,
  Grid,
  Icon,
  IconButton,
  LinearProgress,
  Stack,
  styled,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import {
  compressImageFile,
  generateVideoThumbnails,
} from 'app/helpers/extractThumbnailVideo'
import { toastWarning } from 'app/helpers/toastNofication'
import { IMediaOverall } from 'app/models'
import { EMediaFormat, EMediaType } from 'app/utils/enums/medias'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'
import { AbsoluteFillObject } from './AbsoluteFillObjectBox'
import { CircularProgressWithLabel, ImageListView } from './ImageListCustomize'
import MediaPlayer from './MediaPlayer'
import { MuiButton } from './MuiButton'
import MuiStyledDialogEditor from './MuiStyledDialogEditor'
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
  cursor: 'pointer',
}))

interface Props {
  name: string
  mediaConfigs: {
    mediaFormat: number
    accept: string
    multiple: boolean
    mediaType?: number
    isLimitFiles?: boolean
  }
  mode?: 'append' | 'update' | undefined
  isFileDialogOpen?: boolean
  setIsFileDialogOpen?: (isOpen: boolean) => void
  selectFiles: (files: any) => void
  uploadFiles: (
    files: any,
    mediaFormat?: number,
    thumbnail?: { type: 'video' | 'image' },
  ) => void
  removeUploadedFiles?: (index?: number, mediaFormat?: number) => void
  cancelUploading?: () => void
  uploading?: boolean
  progressInfos: any
  initialMedias?: IMediaOverall[]
  mediasSrcPreviewer: IMediaOverall[]
  fileInfos?: IMediaOverall[]
  setMediasSrcPreviewer: (files: any) => void
  message?: { index?: number; filename?: string }[]
}

export function UploadPreviewer({
  name,
  mediaConfigs = {
    mediaFormat: EMediaFormat.VIDEO,
    accept: 'video/*',
    multiple: false,
    mediaType: EMediaType.POST,
    isLimitFiles: false,
  },
  mode = 'append',
  isFileDialogOpen,
  setIsFileDialogOpen,
  uploadFiles,
  removeUploadedFiles,
  cancelUploading,
  uploading,
  progressInfos,
  mediasSrcPreviewer,
  fileInfos,
  setMediasSrcPreviewer,
  message,
  initialMedias,
}: Props) {
  const { mediaFormat, mediaType, multiple, accept, isLimitFiles } =
    mediaConfigs
  const [durationVideo, setDurationVideo] = useState(0)
  const _mediasSrcRef = useRef<{ val: IMediaOverall[] }>({ val: [] })
  const [openDialog, setOpenDialog] = useState(false)

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
    register(name)
    return () => {
      unregister(name)
    }
  }, [register, unregister, name])

  useEffect(() => {
    if (mediaType === EMediaType.AVATAR) return
    setValue(name, null)
    clearErrors(name)
    cancelUploading && cancelUploading()
    setMediasSrcPreviewer(
      (fileInfos ?? []).filter(
        file => file.mediaFormat === mediaFormat && !file.thumbnail,
      ),
    )
  }, [mediaFormat])

  useEffect(() => {
    if (!message || !message?.length) return
    message.forEach(m => {
      setMediasSrcPreviewer([
        ...(mediasSrcPreviewer.filter(
          (media, index) =>
            index !== (m?.index ?? 0) + mediasSrcPreviewer.length - 1,
        ) ?? []),
      ])
      setValue(
        name,
        getValues(name) && getValues(name).length
          ? getValues(name).filter(
              (item: any, index: number) =>
                index !== (m?.index ?? 0) + getValues(name).length - 1,
            )
          : null,
      )
    })
  }, [message])

  useEffect(() => {
    const fileVideo = getValues(name) && getValues(name)[0]
    if (durationVideo && mediaFormat === EMediaFormat.VIDEO && fileVideo) {
      const newFiles = Object.assign(fileVideo, {
        duration: durationVideo,
        mediaFormat,
      })
      if (durationVideo > 180) {
        setValue(name, [newFiles], {
          shouldValidate: true,
        })
        cancelUploading && cancelUploading()
        setDurationVideo(0)
      }
    }
  }, [durationVideo, files])

  const handleRemoveMedia = (mediaIndex?: number) => {
    mediasSrcPreviewer.splice(mediaIndex ?? 0, 1)
    setMediasSrcPreviewer([...mediasSrcPreviewer])

    if (!mediasSrcPreviewer.length) {
      setOpenDialog(false)
    }
    if (files) {
      if (mediaIndex !== -1) {
        files.splice((mediaIndex ?? 0) - (initialMedias ?? [])?.length, 1)
        setValue(name, [...files])
      }
    } else setValue(name, null)

    removeUploadedFiles && removeUploadedFiles(mediaIndex)
  }

  const handleRemoveAllMedias = () => {
    setMediasSrcPreviewer([])
    setValue(name, null)
    clearErrors(name)

    removeUploadedFiles && removeUploadedFiles(undefined, mediaFormat)
  }

  const extractUnixDroppedFiles = (old: File[], dropped: File[]): File[] => {
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

  const blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File(
      [theBlob as any], // cast as any
      fileName,
      {
        lastModified: new Date().getTime(),
        type: theBlob.type,
      },
    )
  }

  const getThumbnailsFromVideo = async (file: File) => {
    const thumbnails = await generateVideoThumbnails(file, 1)
    const blob = await fetch(thumbnails[0]).then(res => res.blob())

    const myFile = blobToFile(blob, 'thumbnail.jpeg')
    uploadFiles([myFile] as File[], EMediaFormat.IMAGE, { type: 'video' })
  }

  const getThumbnailsFromImage = async (file: File) => {
    uploadFiles([file] as File[], EMediaFormat.IMAGE, { type: 'image' })
  }

  const onDrop = useCallback(
    async (
      droppedFiles: File[],
      rejectedFiles: FileRejection[],
      // event: DropEvent[],
    ) => {
      console.log(droppedFiles, rejectedFiles)
      if (isFileDialogOpen && setIsFileDialogOpen) setIsFileDialogOpen(false)

      let extractUnixFiles = extractUnixDroppedFiles(
        [...(files || [])],
        [...droppedFiles],
      )
      if (!extractUnixFiles.length) return

      if (isLimitFiles) {
        if (mediasSrcPreviewer.length >= 15) {
          toastWarning({ message: 'Số lượng ảnh của bài đã đạt tối đa' })
          return
        } else {
          extractUnixFiles = extractUnixFiles.slice(
            0,
            15 - mediasSrcPreviewer.length,
          )
        }
      }

      _mediasSrcRef.current = {
        val: mediasSrcPreviewer,
      }

      if (!multiple) {
        setMediasSrcPreviewer([
          { url: URL.createObjectURL(extractUnixFiles[0]), mediaFormat },
        ])
        if (mediaFormat === EMediaFormat.VIDEO)
          getThumbnailsFromVideo(extractUnixFiles[0])
      } else {
        await compressImageFile(extractUnixFiles[0]).then(file => {
          getThumbnailsFromImage(file)
        })
        const newSrcPreviewer = [...extractUnixFiles].map(
          (originalFile: File) =>
            Object.assign(
              new File([originalFile], originalFile.name, {
                type: originalFile.type,
              }),
              {
                url: URL.createObjectURL(originalFile),
                mediaFormat,
              },
            ),
        )
        setMediasSrcPreviewer(
          (prev: any) => [...prev, ...newSrcPreviewer] as any,
        )
      }

      const currentSelectedFiles: File[] = !multiple
        ? [...extractUnixFiles]
        : [...(files || []), ...extractUnixFiles]
      setValue(name, currentSelectedFiles, {
        shouldValidate: true,
      })

      uploadFiles(extractUnixFiles, mediaFormat)
    },
    [setValue, name, mode, files, mediaConfigs, mediasSrcPreviewer],
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    // noClick: !!mediasSrcPreviewer.length,
    noDrag: uploading,
    multiple: multiple,
    accept: getFilesType(mediaFormat) as any,
    onDrop,
    maxFiles: 15,
    maxSize: mediaFormat === EMediaFormat.VIDEO ? Infinity : 50 * 1024 * 1024,
  })

  useEffect(() => {
    if (isFileDialogOpen) {
      open()
    }
  }, [isFileDialogOpen])

  useEffect(() => {
    return () =>
      mediasSrcPreviewer.forEach(
        media => media.url && URL.revokeObjectURL(media.url),
      )
  }, [])

  const thumbs = mediasSrcPreviewer.map((media, index) => (
    <Grid
      key={index}
      item
      md={
        mediasSrcPreviewer.length <= 2
          ? 12
          : mediasSrcPreviewer.length <= 4
          ? 6
          : 4
      }
      xs={12}
    >
      <Box
        sx={{
          position: 'relative',
          aspectRatio: 'auto 16 / 9',
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: 'rgb(0 0 0 / 12%) 0px 0.5rem 1.25rem',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${media.url})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            color: 'whitesmoke',
            filter: 'blur(8px)',
            transform: 'scale(1.2, 1.2)',
          }}
        />
        <img
          src={media.url}
          alt={'thumb'}
          style={{
            position: 'absolute',
            objectFit: 'contain',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
        {true && (
          <Tooltip arrow title={'Xóa'}>
            <IconButton
              sx={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                bgcolor: '#303030',
                borderRadius: 1,
              }}
              onClick={() => handleRemoveMedia(index)}
            >
              <Icon sx={{ color: 'white' }}>delete</Icon>
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Grid>
  ))

  return (
    <React.Fragment>
      <Box {...getRootProps({ className: 'dropzone' })} position={'relative'}>
        <input {...getInputProps()} />

        {mediaType !== EMediaType.AVATAR ? (
          <DropWrapper
            sx={{
              aspectRatio:
                mediaFormat === EMediaFormat.VIDEO
                  ? 'auto 9 / 16'
                  : 'auto 1 / 1',
              borderRadius: 1.5,
              display: !!mediasSrcPreviewer.length
                ? mediasSrcPreviewer[0].mediaFormat !== mediaFormat
                  ? 'flex'
                  : 'none'
                : 'flex',
            }}
          >
            <Stack flexDirection={'column'} alignItems="center" gap={1}>
              <MuiTypography fontSize={'1.125rem'}>
                {mediaFormat === EMediaFormat.VIDEO && 'Chọn video để tải lên'}
                {mediaFormat === EMediaFormat.IMAGE && 'Chọn ảnh để tải lên'}
                {mediaFormat === EMediaFormat.OFFICE && 'Chọn tệp đính kèm'}
              </MuiTypography>
              <MuiTypography variant="body2">
                Hoặc kéo và thả tập tin
              </MuiTypography>
              <UploadFile fontSize="medium" />
              {mediaFormat === EMediaFormat.VIDEO && (
                <>
                  <MuiTypography variant="body2">MP4 hoặc WebM</MuiTypography>
                  <MuiTypography variant="body2">tối đa 3 phút</MuiTypography>
                </>
              )}
              {mediaFormat === EMediaFormat.IMAGE && (
                <>
                  <MuiTypography variant="body2">
                    PNG / JPEG hoặc JPG
                  </MuiTypography>
                  <MuiTypography variant="body2">
                    nhỏ hơn 50MB/ảnh
                  </MuiTypography>
                  <MuiTypography variant="body2">
                    {isLimitFiles ? 'tối đa 15 ảnh' : 'tối đa 15 ảnh/lần chọn'}
                  </MuiTypography>
                </>
              )}
              {mediaFormat === EMediaFormat.OFFICE && (
                <>
                  <MuiTypography variant="body2">
                    *.pdf , *.xlsx hoặc *.docx
                  </MuiTypography>
                </>
              )}

              <MuiButton
                title="Chọn tập tin"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              />
            </Stack>
          </DropWrapper>
        ) : (
          <AvatarChoose mediasSrcPreviewer={mediasSrcPreviewer} open={open} />
        )}
      </Box>

      {mediaType !== EMediaType.AVATAR && !!mediasSrcPreviewer.length && (
        <PreviewerViewport
          sx={{
            aspectRatio:
              mediaFormat === EMediaFormat.VIDEO ? 'auto 9 / 16' : 'auto 1 / 1',
            borderRadius: 1.5,
          }}
        >
          {mediaFormat === EMediaFormat.IMAGE && (
            <>
              <ImageListView
                medias={[...mediasSrcPreviewer] as any}
                oldMedias={_mediasSrcRef.current.val}
                progressInfos={progressInfos}
              />
            </>
          )}
          {mediasSrcPreviewer[0].url && mediaFormat === EMediaFormat.VIDEO && (
            <>
              <MediaPlayer
                url={mediasSrcPreviewer[0].url}
                setDuration={setDurationVideo}
              />
              {uploading &&
                progressInfos?.val &&
                progressInfos.val[0] &&
                (progressInfos.val[0].percentage ?? 0) < 100 && (
                  <AbsoluteFillObject bgcolor="rgba(0, 0, 0, 0.7)">
                    <CircularProgressWithLabel
                      value={progressInfos.val[0].percentage ?? 0}
                    />
                  </AbsoluteFillObject>
                )}
            </>
          )}

          {!uploading && (
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
                iconName={
                  mediaFormat === EMediaFormat.VIDEO
                    ? 'cached'
                    : 'add_circle_outlined'
                }
                title={
                  mediaFormat === EMediaFormat.VIDEO ? 'Chọn lại' : 'Thêm ảnh'
                }
              />
              {mediaFormat === EMediaFormat.IMAGE && (
                <CustomIconButton
                  handleClick={() => setOpenDialog(true)}
                  iconName={'edit'}
                  title={'Chỉnh sửa'}
                />
              )}

              <CustomIconButton
                handleClick={handleRemoveAllMedias}
                iconName={'delete'}
                title={
                  mediaFormat === EMediaFormat.VIDEO ? 'Xoá' : 'Xoá tất cả'
                }
              />
            </Stack>
          )}
        </PreviewerViewport>
      )}
      <Box px={1.5} my={1.5}>
        {uploading && (
          <Stack direction={'row'} gap={1.5} alignItems="center">
            {mediaFormat === EMediaFormat.VIDEO && (
              <IconButton
                sx={{
                  bgcolor: '#303030',
                  borderRadius: 1,
                }}
                onClick={() => {
                  setDurationVideo(0)
                  setValue(name, null, {
                    shouldValidate: true,
                  })
                  cancelUploading && cancelUploading()
                }}
              >
                <Icon sx={{ color: 'white' }}>clear</Icon>
                <MuiTypography
                  sx={{ fontWeight: 500, color: 'white', px: 0.5 }}
                >
                  Huỷ
                </MuiTypography>
              </IconButton>
            )}

            <LinearProgress sx={{ flex: 1 }} />
          </Stack>
        )}

        {errors[name] && (
          <FormHelperText error>
            {errors[name]?.message as string}
          </FormHelperText>
        )}
      </Box>

      <MuiStyledDialogEditor
        title={'Chỉnh sửa ảnh/video'}
        open={openDialog}
        maxWidth={
          mediasSrcPreviewer.length <= 2
            ? 'sm'
            : mediasSrcPreviewer.length <= 4
            ? 'md'
            : 'lg'
        }
        onCloseModal={() => setOpenDialog(false)}
        isLoading={false}
        onSubmit={() => setOpenDialog(false)}
        submitText="Xong"
        cancelText="Đóng"
      >
        <Grid container spacing={1.5}>
          {thumbs}
        </Grid>
      </MuiStyledDialogEditor>
    </React.Fragment>
  )
}

const getFilesType = (formatType?: number) => {
  switch (formatType) {
    case EMediaFormat.VIDEO:
      return {
        'video/mp4': ['.mp4'],
        'video/webm': ['.webm'],
        'video/mov': ['.mov'],
        'video/3gp': ['.3gp'],
      }
    case EMediaFormat.AUDIO:
      return {
        'audio/*': ['.mp3', '.wav', '.ogg', '.aac'],
      }
    case EMediaFormat.IMAGE:
      return {
        'image/png': ['.png', '.PNG'],
        'image/jpeg': ['.jpg', '.jpeg'],
      }
    case EMediaFormat.OFFICE:
      return {
        'text/*': ['.xlsx', '.xls', '.csv', '.pdf', '.pptx', '.pptm', '.ppt'],
      }
    case EMediaFormat.ALL:
      return {
        'video/*': [],
        'audio/*': [],
        'image/*': [],
        'text/*': [],
      }

    default:
      return {
        'video/*': [],
        'audio/*': [],
        'image/*': [],
        'text/*': [],
      }
  }
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

export const AvatarChoose = ({ mediasSrcPreviewer, open }: any) => {
  return (
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
          (mediasSrcPreviewer[0] && mediasSrcPreviewer[0].url) ??
          '/assets/images/avatars/avatar-duck.jpeg'
        })`,
      }}
    >
      <IconButton
        // onClick={open}
        sx={{ position: 'absolute', bottom: 0, left: 8 }}
      >
        <Icon sx={{ fontSize: '32px !important' }}>local_see</Icon>
      </IconButton>
    </Box>
  )
}
