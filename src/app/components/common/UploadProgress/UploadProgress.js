import { size, toArray } from 'lodash'
import { useEffect } from 'react'
import { connect } from 'react-redux'

import { Icon, IconButton, Stack } from '@mui/material'
import {
  clearUploadingFile,
  retryUpload,
  setInitialFile,
  uploadFile,
} from 'app/redux/reducers/upload/uploadFile.actions'
import { MuiTypography } from '../MuiTypography'
import UploadItem from '../UploadFile/UploadItem'
import Styles from './UploadProgress.module.css'

const UploadProgress = props => {
  const { fileProgress, uploadFile, retryUpload } = props
  const uploadedFileAmount = size(fileProgress)

  useEffect(() => {
    return () => {
      props.clearUploadingFile()
      props.setInitialFile([])
    }
  }, [])

  useEffect(() => {
    const fileToUpload = toArray(fileProgress).filter(
      file => file.progress === 0,
    )
    uploadFile(fileToUpload)
  }, [uploadedFileAmount])

  return uploadedFileAmount > 0 ? (
    <div className={Styles.wrapper}>
      <Stack
        direction={'row'}
        justifyContent="space-between"
        alignItems={'center'}
        px={1.5}
        bgcolor="green"
      >
        <MuiTypography color={'#ffffff'} variant="subtitle1">
          File tải lên
        </MuiTypography>
        <IconButton onClick={() => props.clearUploadingFile()}>
          <Icon sx={{ color: '#FFFFFF!important' }}>clear</Icon>
        </IconButton>
      </Stack>
      {size(fileProgress)
        ? toArray(fileProgress).map(file => (
            <UploadItem
              key={file.id}
              file={file}
              retryUpload={() => retryUpload(file.id)}
            />
          ))
        : null}
    </div>
  ) : null
}

const mapStateToProps = state => ({
  fileProgress: state.UploadFile.fileProgress,
})

const mapDispatchToProps = dispatch => ({
  setInitialFile: files => dispatch(setInitialFile(files)),
  clearUploadingFile: files => dispatch(clearUploadingFile(files)),
  uploadFile: files => dispatch(uploadFile(files)),
  retryUpload: id => dispatch(retryUpload(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadProgress)
