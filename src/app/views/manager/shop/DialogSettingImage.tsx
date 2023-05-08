import BackupIcon from '@mui/icons-material/Backup'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IconButton } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {
  getImageCategories,
  uploadImageCategories,
} from 'app/apis/shop/shop.service'
import { compressImageFile } from 'app/helpers/compressFile'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import * as React from 'react'
import { useParams } from 'react-router-dom'

interface Props {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const DialogSettingImage = React.forwardRef((props: Props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [file, setFile] = React.useState<any>(null)
  const [previewImage, setPreviewImage] = React.useState<any>(null)
  const params = useParams()

  React.useImperativeHandle(ref, () => ({
    handleClickOpen: () => {
      setOpen(true)
    },
    handleClose: () => {
      setOpen(false)
    },
  }))

  const handleClose = () => {
    setOpen(false)
    setFile(null)
  }

  const handleUploadImage = async () => {
    const formData = new FormData()
    const newFile = await compressImageFile(file)
    formData.append('file', newFile)
    try {
      const token = window.localStorage.getItem('accessToken')
      const config: AxiosRequestConfig = {
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/api/file/upload?directory=cahnfc`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
          srcType: '1',
        },
      }
      const res: AxiosResponse = await axios(config)
      return res.data
    } catch (e) {
      console.log(e)
    }
  }

  const uploadImage = async () => {
    props.setIsLoading(true)
    const url = await handleUploadImage()
    if (url) {
      const res = uploadImageCategories(params.id || 0, {
        id: params.id || 0,
        imgUrl: url?.path,
      })
      if (await res) {
        props.setIsLoading(false)
        handleClose()
      }
    }
  }

  const getDetailImage = async () => {
    const res = await getImageCategories(params.id || 0)
    setPreviewImage(res.imgUrl)
  }

  React.useEffect(() => {
    getDetailImage()
  }, [])

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>Cài đặt hình ảnh</div>
            <IconButton aria-label="close" size="large" onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <input
            type="file"
            id="uploadImage"
            style={{ display: 'none' }}
            onChange={(event: any) => {
              setPreviewImage(window.URL.createObjectURL(event.target.files[0]))
              setFile(event.target.files[0])
            }}
          />
          <div
            onClick={() => {
              const inputUploadImage = document.getElementById(
                'uploadImage',
              ) as HTMLInputElement | null
              inputUploadImage?.click()
            }}
            style={{
              width: 500,
              height: 400,
              border: '2px dashed black',
              textAlign: 'center',
              paddingTop: '100px',
            }}
          >
            {!file && previewImage === null && (
              <div>
                <div>Chọn ảnh để tải lên</div>
                <div>Hoặc kéo và thả tập tin</div>
                <BackupIcon fontSize="large" />
                <div>PNG/JPEG hoặc JPG</div>
                <div>Dung lượng không quá 50mb</div>
                <div>(Tỷ lệ ảnh phù hợp)</div>
              </div>
            )}

            {previewImage !== null && (
              <img src={previewImage} width="480px" height="270px"></img>
            )}
          </div>
        </DialogContent>
        <DialogActions sx={{ textAlign: 'center' }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={props.isLoading}
          >
            Đóng
          </Button>
          <Button
            disabled={props.isLoading}
            variant="contained"
            onClick={() => {
              const inputUploadImage = document.getElementById(
                'uploadImage',
              ) as HTMLInputElement | null
              inputUploadImage?.click()
            }}
          >
            Thay đổi
          </Button>
          <Button
            onClick={uploadImage}
            autoFocus
            variant="contained"
            disabled={props.isLoading}
          >
            {props.isLoading ? 'Đang tải ảnh lên...' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

export default DialogSettingImage
