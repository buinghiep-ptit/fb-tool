import { compressImageFile } from 'app/helpers/extractThumbnailVideo'

export const uploadFile = async files => {
  const fileUpload = [...files].map(async file => {
    const formData = new FormData()
    const newFile = await compressImageFile(file)
    formData.append('file', newFile)
    try {
      const token = window.localStorage.getItem('accessToken')
      const res = axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_UPLOAD_URL}/api/file/upload?directory=cahnfc`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      return res
    } catch (e) {
      console.log(e)
    }
  })

  const response = await Promise.all(fileUpload)
  if (response) return response.map(item => item.data.url)
}
