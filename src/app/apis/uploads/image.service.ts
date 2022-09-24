import { http } from 'app/helpers/http-config'

export const uploadImage = async (
  file: any,
  onUploadProgress?: any,
): Promise<any> => {
  const formData = new FormData()
  formData.append('file', file)

  const { data }: any = await http.post(`/api/image/upload`, formData, {
    baseURL: 'https://dev09-api.campdi.vn/upload',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })
  return data
}
