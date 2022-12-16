import * as React from 'react'
import UploadImage from 'app/components/common/uploadImage'
import EditorConvertToHTML from 'app/components/common/TextEditor/textEditorCustom'
import { TextField } from '@mui/material'

const Introduction = React.forwardRef(
  ({ medias, setMedias, description, setDescription, setValue }, ref) => {
    const uploadImageRef = React.useRef()

    React.useImperativeHandle(ref, () => ({
      getIntro: () => {
        return uploadImageRef.current.getFiles()
      },
    }))

    return (
      <>
        Nội dung:
        <TextField
          multiline
          rows={6}
          fullWidth
          value={description}
          onChange={e => {
            setDescription(e.target.value)
          }}
        />
        Ảnh*:
        <UploadImage
          ref={uploadImageRef}
          medias={medias}
          setMedias={setMedias}
          setValue={setValue}
        ></UploadImage>
      </>
    )
  },
)

export default Introduction
