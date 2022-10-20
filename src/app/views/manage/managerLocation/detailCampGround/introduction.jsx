import * as React from 'react'
import UploadImage from 'app/components/common/uploadImage'
import EditorConvertToHTML from 'app/components/common/TextEditor/textEditorCustom'

const Introduction = React.forwardRef(
  ({ medias, setMedias, setDescription, description, action }, ref) => {
    const uploadImageRef = React.useRef()
    const editorRef = React.useRef()
    React.useImperativeHandle(ref, () => ({
      getIntro: () => {
        console.log(uploadImageRef.current.getFiles(), 'x')
        return uploadImageRef.current.getFiles()
      },
      getValueEditor: () => {
        return editorRef.current.getValueTextEditor()
      },
    }))
    console.log(action)

    return (
      <>
        Nội dung:
        <EditorConvertToHTML
          ref={editorRef}
          description={description}
          key={description}
        />
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
