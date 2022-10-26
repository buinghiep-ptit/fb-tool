import { http } from 'app/helpers/http-config'

export const uploadFile = async (
  mediaFormat?: number,
  file?: any,
  onUploadProgress?: any,
  controller?: any,
): Promise<any> => {
  let path = ''
  if (mediaFormat === 1) {
    path = '/api/video/upload'
  } else if (mediaFormat === 2) {
    path = '/api/image/upload'
  } else {
    path = '/api/file/upload'
  }

  const formData = new FormData()
  formData.append('file', file)

  const { data }: any = await http.post(path, formData, {
    baseURL: 'https://dev09-api.campdi.vn/upload',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
    signal: controller.signal,
  })
  return data
}

export const uploadThumbnail = async (file?: any): Promise<any> => {
  const formData = new FormData()
  formData.append('file', file)

  const { data }: any = await http.post('/api/image/upload', formData, {
    baseURL: 'https://dev09-api.campdi.vn/upload',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
