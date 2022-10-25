import { Button, Grid, Icon } from '@mui/material'

import * as React from 'react'

import './upload.css'

const UploadImage = React.forwardRef(({ medias, setMedias }, ref) => {
  const [files, setFiles] = React.useState([])

  React.useImperativeHandle(ref, () => ({
    getFiles: () => {
      console.log(files, 'data')
      return files
    },
  }))

  const deleteItemImage = index => {
    const filesCoppy = [...files]
    filesCoppy.splice(index, 1)
    setFiles([...filesCoppy])
  }

  const deleteItemImageMedias = index => {
    const mediasCopy = [...medias]
    mediasCopy.splice(index, 1)
    setMedias(mediasCopy)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          console.log(files)
        }}
      >
        Ntn
      </button>
      <Grid container>
        <input
          type="file"
          id="inputFile"
          accept=".png, .jpg, .jpeg"
          style={{ display: 'none' }}
          multiple
          onChange={event => {
            const newFiles = [...files, ...event.target.files]
            const uniqueFiles = Array.from(
              new Set(newFiles.map(a => a.name)),
            ).map(name => {
              return newFiles.find(a => a.name === name)
            })
            setFiles(uniqueFiles)
          }}
        />

        {(medias || []).map((file, index) => {
          return (
            <Grid item xs={3} md={3} key={index}>
              <div className="uploader" id="fileSelect">
                <Icon
                  style={{ color: 'red', cursor: 'pointer' }}
                  className="uploader__icon-delete"
                  onClick={() => deleteItemImageMedias(index)}
                >
                  delete
                </Icon>

                {file?.mediaFormat === 1 ? (
                  <video width="90%" height="auto" controls>
                    <source src={file.url} type="video/mp4" />
                  </video>
                ) : (
                  <img src={file.url} />
                )}
              </div>
            </Grid>
          )
        })}
        {(files || []).map((file, index) => {
          return (
            <Grid item xs={3} md={3} key={index}>
              <div className="uploader" id="fileSelect">
                <Icon
                  style={{ color: 'red' }}
                  className="uploader__icon-delete"
                  onClick={() => deleteItemImage(index)}
                >
                  clear
                </Icon>
                {file.type.startsWith('image/') && (
                  <img src={window.URL.createObjectURL(file)}></img>
                )}
                {file.type.startsWith('video/') && (
                  <video width="90%" height="auto" controls>
                    <source
                      src={window.URL.createObjectURL(file)}
                      type="video/mp4"
                    />
                  </video>
                )}
              </div>
            </Grid>
          )
        })}
        <Grid item xs={3} md={3}>
          <div className="uploader" id="fileSelect">
            <div
              id="content"
              className="content"
              onClick={() => {
                document.getElementById('inputFile').click()
              }}
            >
              <Icon color="primary" style={{ fontSize: 50 }}>
                add_circle
              </Icon>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  )
})

export default UploadImage
