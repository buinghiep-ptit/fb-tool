import { http } from 'app/helpers/http-config'

export const uploadImage = async (
  file: any,
  onUploadProgress?: any,
): Promise<any> => {
  const formData = new FormData()
  formData.append('file', file)

  const { data }: any = await http.post(`/api/image/upload`, formData, {
    baseURL: process.env.REACT_APP_UPLOAD_API_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })
  return data
}
