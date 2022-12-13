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
    baseURL: process.env.REACT_APP_API_UPLOAD_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
    signal: controller.signal,
  })
  return data
}

export const uploadApi = async (
  file?: any,
  onUploadProgress?: any,
  cancelToken?: any,
  scrTypeModule?: any,
): Promise<any> => {
  const formData = new FormData()
  formData.append('file', file)

  let path = ''
  if (file.type.includes('video')) {
    path = '/api/video/upload'
  } else if (file.type.includes('image')) {
    path = '/api/image/upload'
  } else if (file.type.includes('audio')) {
    path = '/api/audio/upload'
  } else {
    path = '/api/file/upload'
  }

  const headers: any = {
    'Content-Type': 'multipart/form-data',
  }

  if (scrTypeModule && scrTypeModule?.srcType === 3) {
    headers.srcType = 3
    headers.idSrc = 0
  } else if (scrTypeModule && scrTypeModule?.srcType === 9) {
    headers.srcType = 9
    headers.idSrc = scrTypeModule.idSrc
  } else {
    headers.srcType = scrTypeModule?.srcType ?? 0
  }

  const { data }: any = await http.post(path, formData, {
    baseURL: process.env.REACT_APP_API_UPLOAD_URL,
    headers: headers,
    onUploadProgress,
    cancelToken: cancelToken,
  })
  return data
}

export const uploadImage = async (file?: any): Promise<any> => {
  const formData = new FormData()
  formData.append('file', file)

  const { data }: any = await http.post('/api/image/upload', formData, {
    baseURL: process.env.REACT_APP_API_UPLOAD_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export const uploadAudio = async (file?: any): Promise<any> => {
  const formData = new FormData()
  formData.append('file', file)

  const { data }: any = await http.post('/api/audio/upload', formData, {
    baseURL: process.env.REACT_APP_API_UPLOAD_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export const uploadFileAll = async (file?: any): Promise<any> => {
  const formData = new FormData()
  formData.append('file', file)

  const { data }: any = await http.post('/api/file/upload', formData, {
    baseURL: process.env.REACT_APP_API_UPLOAD_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
