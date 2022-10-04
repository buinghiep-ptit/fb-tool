import { http } from 'app/helpers/http-config'

export const uploadFile = async (
  mediaFormat?: 1 | 2,
  file?: any,
  onUploadProgress?: any,
): Promise<any> => {
  const path = mediaFormat === 1 ? '/api/video/upload' : '/api/image/upload'

  const formData = new FormData()
  formData.append('file', file)

  const { data }: any = await http.post(path, formData, {
    baseURL: process.env.REACT_APP_UPLOAD_API_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })
  return data
}
