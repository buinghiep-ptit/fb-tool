import { Grid, Icon, IconButton, Stack, styled, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import { IMediaOverall } from 'app/models'
import React, { Fragment, useCallback, useState } from 'react'
import MuiStyledDialogEditor from './MuiStyledDialogEditor'
import { useDropzone } from 'react-dropzone'
import { ImageListView } from './ImageListCustomize'
import { MuiTypography } from './MuiTypography'
import { MuiButton } from './MuiButton'

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
  images: IMediaOverall[]
  setUploadFile: (files: File[]) => void
  setInitialFile: (files: IMediaOverall[]) => void
}

export function ImageUploadPreviewer({
  images = [],
  setUploadFile,
  setInitialFile,
}: Props) {
  const [openDialog, setOpenDialog] = useState(false)

  const onDrop = useCallback((droppedFiles: File[]) => {
    console.log(droppedFiles)

    setUploadFile(droppedFiles)
  }, [])

  const { getRootProps, getInputProps, open } = useDropzone({
    multiple: true,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    onDrop,
    maxFiles: 15,
    maxSize: 10 * 1024 * 1024,
  })

  const handleRemoveMedia = (imgIdx?: number) => {
    images.splice(imgIdx ?? 0, 1)
    setInitialFile([...images])

    if (!images.length) {
      setOpenDialog(false)
    }
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
              aspectRatio: 'auto 1 / 1',
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
              <MuiTypography variant="body2">nhỏ hơn 10MB/ảnh</MuiTypography>
              <MuiTypography variant="body2">
                {true ? 'tối đa 15 ảnh' : 'tối đa 15 ảnh/lần chọn'}
              </MuiTypography>

              <MuiButton
                title="Chọn tập tin"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              />
            </Stack>
          </DropWrapper>
        </div>
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
              handleClick={() => {}}
              iconName={'delete'}
              title={'Xoá tất cả'}
            />
          </Stack>
        </PreviewerViewport>
      )}
      <MuiStyledDialogEditor
        title={'Chỉnh sửa ảnh/video'}
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
