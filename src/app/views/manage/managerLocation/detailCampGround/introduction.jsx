import * as React from 'react'
import UploadImage from 'app/components/common/uploadImage'
import EditorConvertToHTML from 'app/components/common/TextEditor/textEditorCustom'

const Introduction = React.forwardRef(
  ({ medias, setMedias, setDescription }, ref) => {
    const uploadImageRef = React.useRef()
    React.useImperativeHandle(ref, () => ({
      getIntro: () => {
        console.log(uploadImageRef.current.getFiles(), 'x')
        return uploadImageRef.current.getFiles()
      },
    }))

    return (
      <>
        Nội dung:
        <EditorConvertToHTML
          setDescription={setDescription}
        ></EditorConvertToHTML>
        Ảnh:
        <UploadImage
          ref={uploadImageRef}
          medias={medias}
          setMedias={setMedias}
        ></UploadImage>
      </>
    )
  },
)

export default Introduction
