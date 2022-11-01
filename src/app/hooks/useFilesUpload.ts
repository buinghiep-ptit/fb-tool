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
  cancel?: any
}

export const useUploadFiles = () => {
  const abortControllerRef = useRef([]) as any

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

  const upload = (
    file: any,
    idx: number,
    mediaFormat?: number,
    thumbnail?: { type: 'video' | 'image' },
  ) => {
    const abortController = new AbortController()

    abortControllerRef.current.push(abortController)

    if (!progressInfosRef || !progressInfosRef.current) return
    const _progressInfos = [...progressInfosRef.current.val]

    return uploadFile(
      mediaFormat,
      file,
      (event: any) => {
        if (thumbnail) return
        _progressInfos[idx].percentage = Math.round(
          (100 * event.loaded) / event.total,
        )
        setProgressInfos({ val: _progressInfos as any })
      },
      abortController,
    )
      .then(fileResult => {
        setMessage(prevMessage => [
          ...prevMessage,
          'Uploaded the file successfully: ' + file.name,
        ])
        return {
          ...fileResult,
          mediaFormat,
          thumbnail: thumbnail ? thumbnail : null,
          mediaType: thumbnail ? 2 : 3,
        }
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

  const uploadFiles = async (
    files?: File[],
    mediaFormat?: number,
    thumbnail?: { type: 'video' | 'image' },
  ) => {
    // remove progress when is thumbnail
    setUploading(true)
    const selectedFilesToArr = Array.from(files ?? [])

    if (!thumbnail) {
      const _progressInfos = selectedFilesToArr.map(file => ({
        percentage: 0,
        fileName: file.name,
      }))

      progressInfosRef.current = {
        val: _progressInfos,
      }
    }

    const uploadPromises = selectedFilesToArr.map((file, index) =>
      upload(file, index, mediaFormat, thumbnail),
    )

    const filesResult = await Promise.all(uploadPromises)
    setFileInfos(prev => [...prev, ...filesResult])
    setUploading(false)
    setMessage([])
  }

  const cancelUploading = () => {
    abortControllerRef?.current &&
      abortControllerRef.current.length &&
      abortControllerRef.current.forEach((aborted: any) => {
        aborted.abort()
      })
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
    (
      files?: File[],
      mediaFormat?: number,
      thumbnail?: { type: 'video' | 'image' },
    ) => uploadFiles(files, mediaFormat, thumbnail),
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
