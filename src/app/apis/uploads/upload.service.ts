import { http } from 'app/helpers/http-config'

export const uploadFile = async (
  mediaFormat?: 1 | 2,
  file?: any,
  onUploadProgress?: any,
  controller?: any,
): Promise<any> => {
  const path = mediaFormat === 1 ? '/api/video/upload' : '/api/image/upload'

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
