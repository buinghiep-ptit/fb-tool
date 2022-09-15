import * as React from 'react'
import UploadImage from 'app/components/common/uploadImage'
import EditorConvertToHTML from 'app/components/common/TextEditor/textEditorCustom'

export default function Introduction({}) {
  return (
    <>
      Nội dung:
      <EditorConvertToHTML></EditorConvertToHTML>
      Ảnh:
      <UploadImage></UploadImage>
    </>
  )
}
