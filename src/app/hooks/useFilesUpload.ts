import { uploadImage } from 'app/apis/uploads/image.service'
import { useRef, useState } from 'react'

export type FileInfoResult = {
  url: string
  filename: string
  size: number
}

export type FileInfoProgress = {
  index?: number
  percentage?: number
  fileName?: string
}

export const useUploadFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined)
  const [progressInfos, setProgressInfos] = useState<{
    val: FileInfoProgress[]
  }>({ val: [] })
  const [message, setMessage] = useState<string[]>([])
  const [fileInfos, setFileInfos] = useState<FileInfoResult[]>([])
  const progressInfosRef = useRef<any>(null)

  const selectFiles = (selectedFiles: any) => {
    setSelectedFiles(selectedFiles)
    setProgressInfos({ val: [] })
  }

  const upload = (idx: number, file: any) => {
    const _progressInfos = [...progressInfosRef.current.val]

    return uploadImage(file, (event: any) => {
      _progressInfos[idx].percentage = Math.round(
        (100 * event.loaded) / event.total,
      )
      setProgressInfos({ val: _progressInfos as any })
    })
      .then(result => {
        setMessage(prevMessage => [
          ...prevMessage,
          'Uploaded the file successfully: ' + file.name,
        ])
        return result
      })
      .catch(() => {
        _progressInfos[idx].percentage = 0
        setProgressInfos({ val: _progressInfos as any })

        setMessage(prevMessage => [
          ...prevMessage,
          'Could not upload the file: ' + file.name,
        ])
      })
  }

  const uploadFiles = async (f?: any) => {
    console.log('selectedFiles:', selectedFiles)
    const files = Array.from(selectedFiles as any)
    const _progressInfos = files.map((file: any) => ({
      index: file.id ?? 0,
      percentage: 0,
      fileName: file.name,
    }))

    progressInfosRef.current = {
      val: _progressInfos,
    }

    const uploadPromises = files.map((file: any) => upload(file.id ?? 0, file))

    const filesResult = await Promise.all(uploadPromises)
    setFileInfos([...filesResult])

    setMessage([])
  }

  return [
    (files: any) => selectFiles(files),
    (f?: any) => uploadFiles(f),
    progressInfos,
    message,
    fileInfos,
  ] as const
}
