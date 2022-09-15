import { Grid, Icon } from '@mui/material'

import * as React from 'react'

import './upload.css'

export default function UploadImage(props) {
  const [files, setFiles] = React.useState([])

  const deleteItemImage = index => {
    const filesCoppy = [...files]
    filesCoppy.splice(index, 1)
    setFiles([...filesCoppy])
  }
  return (
    <>
      <Grid container>
        <input
          type="file"
          id="inputFile"
          style={{ display: 'none' }}
          multiple
          onChange={event => {
            const newFiles = [...files, ...event.target.files]

            console.log(uniqueFiles, 'xxx')
            const uniqueFiles = Array.from(
              new Set(newFiles.map(a => a.name)),
            ).map(name => {
              return newFiles.find(a => a.name === name)
            })
            setFiles(uniqueFiles)
          }}
        />

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
}
