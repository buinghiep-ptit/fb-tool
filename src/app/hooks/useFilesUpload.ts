import { uploadFile } from 'app/apis/uploads/upload.service'
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
  const [uploading, setUploading] = useState<boolean>(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [progressInfos, setProgressInfos] = useState<{
    val: FileInfoProgress[]
  }>({ val: [] })
  const [message, setMessage] = useState<string[]>([])
  const [fileInfos, setFileInfos] = useState<FileInfoResult[]>([])
  const progressInfosRef = useRef<{ val: FileInfoProgress[] }>({ val: [] })

  const selectFiles = (selectedFiles: any) => {
    setSelectedFiles(selectedFiles)
    setProgressInfos({ val: [] })
  }

  const upload = (file: any, idx: number, mediaFormat?: 1 | 2) => {
    if (!progressInfosRef || !progressInfosRef.current) return
    const _progressInfos = [...progressInfosRef.current.val]

    return uploadFile(mediaFormat, file, (event: any) => {
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
        return { ...result, mediaFormat }
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

  const removeSelectedFiles = (index?: number) => {
    if (index) {
      fileInfos.splice(index, 1)
      setFileInfos([...fileInfos])
    } else setFileInfos([])
  }

  const uploadFiles = async (files?: File[], mediaFormat?: 1 | 2) => {
    setUploading(true)
    const selectedFilesToArr = Array.from(files ?? [])
    const _progressInfos = selectedFilesToArr.map(file => ({
      percentage: 0,
      fileName: file.name,
    }))

    progressInfosRef.current = {
      val: _progressInfos,
    }

    const uploadPromises = selectedFilesToArr.map((file, index) =>
      upload(file, index, mediaFormat),
    )

    const filesResult = await Promise.all(uploadPromises)
    setFileInfos(prev => [...prev, ...filesResult])
    setUploading(false)
    setMessage([])
  }

  return [
    (files?: File[]) => selectFiles(files),
    (files?: File[], mediaFormat?: 1 | 2) => uploadFiles(files, mediaFormat),
    (index?: number) => removeSelectedFiles(index),
    uploading,
    progressInfos,
    message,
    fileInfos,
  ] as const
}
