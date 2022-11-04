import * as React from 'react'
import UploadImage from 'app/components/common/uploadImage'
import EditorConvertToHTML from 'app/components/common/TextEditor/textEditorCustom'

const Introduction = React.forwardRef(
  ({ medias, setMedias, description, setValue }, ref) => {
    const uploadImageRef = React.useRef()
    const editorRef = React.useRef()
    React.useImperativeHandle(ref, () => ({
      getIntro: () => {
        return uploadImageRef.current.getFiles()
      },
      getValueEditor: () => {
        return editorRef.current.getValueTextEditor()
      },
    }))

    return (
      <>
        Nội dung:
        <EditorConvertToHTML
          ref={editorRef}
          description={description}
          key={description}
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
