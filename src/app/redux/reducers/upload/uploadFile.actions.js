import { uploadApi } from 'app/apis/uploads/upload.service'
import axios from 'axios'
import uploadFileTypes from './uploadFile.types'

export const clearUploadingFile = fileInitial => ({
  type: uploadFileTypes.CLEAR_UPLOADING_FILE,
  //   payload: {
  //     fileInitial,
  //   },
})

export const setInitialFile = fileInitial => ({
  type: uploadFileTypes.SET_INITIAL_FILE,
  payload: {
    fileInitial,
  },
})

export const setUploadFile = data => ({
  type: uploadFileTypes.SET_UPLOAD_FILE,
  payload: data,
})

export const setUploadProgress = (id, progress) => ({
  type: uploadFileTypes.SET_UPLOAD_PROGRESS,
  payload: {
    id,
    progress,
  },
})

export const successUploadFile = (id, fileResult) => ({
  type: uploadFileTypes.SUCCESS_UPLOAD_FILE,
  payload: {
    id,
    fileInfo: fileResult,
  },
})

export const failureUploadFile = id => ({
  type: uploadFileTypes.FAILURE_UPLOAD_FILE,
  payload: id,
})

export const uploadFile = files => dispatch => {
  if (files.length) {
    files.forEach(async file => {
      try {
        const fileResult = await uploadApi(
          file.file,
          progress => {
            const { loaded, total } = progress
            const percentageProgress = Math.floor((loaded / total) * 100)
            dispatch(setUploadProgress(file.id, percentageProgress))
          },
          file.cancelSource.token,
        )
        dispatch(successUploadFile(file.id, fileResult))
      } catch (error) {
        if (axios.isCancel(error)) {
          // Do something when user cancel upload
          console.log('cancelled by user')
        }
        dispatch(failureUploadFile(file.id))
      }
    })
  }
}

export const retryUpload = id => (dispatch, getState) => {
  dispatch({
    type: uploadFileTypes.RETRY_UPLOAD_FILE,
    payload: id,
  })

  const { fileProgress } = getState().UploadFile

  const reuploadFile = [fileProgress[id]]

  dispatch(uploadFile(reuploadFile))
}
