import {
  FormHelperText,
  Grid,
  Icon,
  IconButton,
  Stack,
  styled,
  Tooltip,
} from '@mui/material'
import { Box } from '@mui/system'
import { toastWarning } from 'app/helpers/toastNofication'
import { IMediaOverall } from 'app/models'
import { Fragment, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { ImageListView } from './ImageListCustomize'
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
    padding: '16px',
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
  images: IMediaOverall[]
  setUploadFile: (files: File[]) => void
  setInitialFile: (files: IMediaOverall[]) => void
  srcTypeModule?: {
    srcType?: number
    idSrc?: number
  }
  isLimitFiles?: boolean
}

export function ImageUploadPreviewer({
  name,
  images = [],
  setUploadFile,
  setInitialFile,
  srcTypeModule,
  isLimitFiles = false,
}: Props) {
  const [openDialog, setOpenDialog] = useState(false)
  const fileInfos = useSelector((state: any) => state.UploadFile.fileInfos)

  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext()
  const files: File[] = watch(name)

  const onDrop = useCallback(
    async (droppedFiles: File[]) => {
      if (isLimitFiles) {
        if (fileInfos.length >= 15) {
          toastWarning({ message: 'Số lượng ảnh của bài đã đạt tối đa (15)' })
          return
        } else {
          droppedFiles = droppedFiles.slice(0, 15 - fileInfos.length)
        }
      }

      if (!droppedFiles || !droppedFiles.length) return

      const droppedFilesModule = droppedFiles.map(file =>
        Object.assign(file, {
          srcTypeModule,
        }),
      )

      setValue(name, droppedFilesModule, { shouldValidate: true })
      // const filesCompressedPromise = droppedFiles.map(async file => {
      //   const data = await compressImageFile(file)
      //   return data
      // })
      // const filesCompressed = await Promise.all(filesCompressedPromise)

      setUploadFile(droppedFilesModule)
    },
    [setValue, name, files, fileInfos],
  )

  const { getRootProps, getInputProps, open, fileRejections } = useDropzone({
    multiple: true,
    accept: {
      'image/png': ['.png', '.PNG'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    onDrop,
    // maxFiles: 15,
    maxSize: 50 * 1024 * 1024,
  })

  const convertMessageToVn = (code: string) => {
    switch (code) {
      case 'file-too-large':
        return 'Kích thước file không hợp lệ (<= 50MB)'
      case 'file-invalid-type':
        return 'Định dạng file không hợp lệ'

      default:
        return 'File không hợp lệ'
    }
  }

  const fileRejectionItems = fileRejections.map(({ file, errors }: any) => {
    return (
      <li key={file.path}>
        {file.path} - {file.size} bytes
        <ul>
          {errors.map((e: any) => (
            <li key={e.code}>
              <span style={{ color: '#FF6868' }}>
                {convertMessageToVn(e.code)}
              </span>
            </li>
          ))}
        </ul>
      </li>
    )
  })

  const handleRemoveMedia = (imgIdx?: number) => {
    images.splice(imgIdx ?? 0, 1)
    setInitialFile([
      ...(fileInfos.filter((f: IMediaOverall) => f.mediaFormat !== 2) ?? []),
      ...(images ?? []),
    ])
    if (!images.length) {
      setValue(name, null)
      setOpenDialog(false)
    }
  }

  const handleRemoveAllMedias = () => {
    const newFiles = fileInfos.filter((f: IMediaOverall) => f.mediaFormat !== 2)
    setValue(name, null)
    setInitialFile(newFiles)
  }

  const thumbs = images.map((media, index) => (
    <Grid
      key={index}
      item
      md={images.length <= 2 ? 12 : images.length <= 4 ? 6 : 4}
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
    <Fragment>
      {!images.length && (
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />

          <DropWrapper
            sx={{
              aspectRatio: 'auto 16 / 9',
              borderRadius: 1.5,
              display: 'flex',
            }}
          >
            <Stack flexDirection={'column'} alignItems="center" gap={1}>
              <MuiTypography fontSize={'1.125rem'}>
                {'Chọn ảnh để tải lên'}
              </MuiTypography>
              <MuiTypography variant="body2">
                Hoặc kéo và thả tập tin
              </MuiTypography>
              <Icon>backup</Icon>
              <MuiTypography variant="body2">PNG / JPEG hoặc JPG</MuiTypography>
              <MuiTypography variant="body2">nhỏ hơn 50MB/ảnh</MuiTypography>
              <MuiTypography variant="body2">
                {true ? 'tối đa 15 ảnh' : 'tối đa 15 ảnh/lần chọn'}
              </MuiTypography>

              <MuiButton
                title="Chọn ảnh"
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

      {!!images.length && (
        <PreviewerViewport>
          <ImageListView medias={[...images] as any} />
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
              iconName={'add_circle_outlined'}
              title={'Thêm ảnh'}
            />
            <CustomIconButton
              handleClick={() => setOpenDialog(true)}
              iconName={'edit'}
              title={'Chỉnh sửa'}
            />

            <CustomIconButton
              handleClick={handleRemoveAllMedias}
              iconName={'delete'}
              title={'Xoá tất cả'}
            />
          </Stack>
        </PreviewerViewport>
      )}

      {fileRejections.length ? (
        <aside>
          <h4>File không hợp lệ</h4>
          <ul>{fileRejectionItems}</ul>
        </aside>
      ) : (
        <></>
      )}

      <MuiStyledDialogEditor
        title={'Chỉnh sửa ảnh'}
        open={openDialog}
        maxWidth={images.length <= 2 ? 'sm' : images.length <= 4 ? 'md' : 'lg'}
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
