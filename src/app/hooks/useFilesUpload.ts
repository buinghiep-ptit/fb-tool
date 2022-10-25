import { uploadFile } from 'app/apis/uploads/upload.service'
import { IMediaOverall } from 'app/models'
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
  const abortController = useRef(null) as any

  const [uploading, setUploading] = useState<boolean>(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [progressInfos, setProgressInfos] = useState<{
    val: FileInfoProgress[]
  }>({ val: [] })
  const [message, setMessage] = useState<string[]>([])
  const [fileInfos, setFileInfos] = useState<
    FileInfoResult[] | IMediaOverall[]
  >([])
  const progressInfosRef = useRef<{ val: FileInfoProgress[] }>({ val: [] })

  const setInitialFileInfos = (files: any) => {
    setFileInfos(files)
  }

  const selectFiles = (selectedFiles: any) => {
    setSelectedFiles(selectedFiles)
    setProgressInfos({ val: [] })
  }

  const upload = (file: any, idx: number, mediaFormat?: number) => {
    abortController.current = new AbortController()

    if (!progressInfosRef || !progressInfosRef.current) return
    const _progressInfos = [...progressInfosRef.current.val]

    return uploadFile(
      mediaFormat,
      file,
      (event: any) => {
        _progressInfos[idx].percentage = Math.round(
          (100 * event.loaded) / event.total,
        )
        setProgressInfos({ val: _progressInfos as any })
      },
      abortController.current,
    )
      .then(files => {
        setMessage(prevMessage => [
          ...prevMessage,
          'Uploaded the file successfully: ' + file.name,
        ])
        return { ...files, mediaFormat }
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

  const uploadFiles = async (files?: File[], mediaFormat?: number) => {
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

  const cancelUploading = () => {
    abortController.current && abortController.current.abort()
    setProgressInfos({ val: [] })
    setUploading(false)
  }

  const removeUploadedFiles = (index?: number, mediaFormat?: number) => {
    if (index !== undefined) {
      fileInfos.splice(index, 1)
      setFileInfos([...fileInfos])
    } else {
      setFileInfos(
        ((fileInfos ?? []) as IMediaOverall[]).filter(
          file => file.mediaFormat !== mediaFormat,
        ) ?? [],
      )
    }
  }

  return [
    (files?: File[]) => selectFiles(files),
    (files?: File[], mediaFormat?: number) => uploadFiles(files, mediaFormat),
    (index?: number, mediaFormat?: number) =>
      removeUploadedFiles(index, mediaFormat),
    cancelUploading,
    uploading,
    progressInfos,
    message,
    (files: FileInfoResult[] | IMediaOverall[]) => setInitialFileInfos(files),
    fileInfos,
  ] as const
}
