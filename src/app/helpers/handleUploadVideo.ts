import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const handleUploadImage = async (file: any) => {
  const formData = new FormData()
  formData.append('file', file)
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
    return res.data.path
  } catch (e) {
    console.log(e)
  }
}

export default handleUploadImage
