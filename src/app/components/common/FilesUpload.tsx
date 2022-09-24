import { uploadImage } from 'app/apis/uploads/image.service'
import { useRef, useState } from 'react'

export type FileInfoResult = {
  url: string
  filename: string
  size: number
}

export const UploadFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined)
  const [progressInfos, setProgressInfos] = useState({ val: [] })
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

  const uploadFiles = async () => {
    const files = Array.from(selectedFiles as any)
    const _progressInfos = files.map((file: any) => ({
      percentage: 0,
      fileName: file.name,
    }))

    progressInfosRef.current = {
      val: _progressInfos,
    }

    const uploadPromises = files.map((file, index) => upload(index, file))

    const filesResult = await Promise.all(uploadPromises)
    setFileInfos([...filesResult])

    setMessage([])
  }

  return [
    (files: any) => selectFiles(files),
    uploadFiles,
    progressInfos,
    message,
    fileInfos,
  ] as const
}
