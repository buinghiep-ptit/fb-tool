import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { size, toArray } from 'lodash'

import Styles from './UploadProgress.module.css'
import {
  clearUploadingFile,
  retryUpload,
  uploadFile,
} from 'app/redux/reducers/upload/uploadFile.actions'
import UploadItem from '../UploadFile/UploadItem'
import { Icon, IconButton, Stack } from '@mui/material'
import { MuiTypography } from '../MuiTypography'

const UploadProgress = props => {
  const { fileProgress, uploadFile, retryUpload } = props
  const uploadedFileAmount = size(fileProgress)

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
        <MuiTypography color={'Highlight'} variant="subtitle1">
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
  clearUploadingFile: files => dispatch(clearUploadingFile(files)),
  uploadFile: files => dispatch(uploadFile(files)),
  retryUpload: id => dispatch(retryUpload(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadProgress)
