import { uploadFile } from 'app/apis/uploads/upload.service'
import { EMediaFormat } from 'app/utils/enums/medias'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import React, { useEffect, useRef, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
// import './WYSIWYG.scss'

const WYSIWYGEditor = React.forwardRef(({ onChange, value }, ref) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [updated, setUpdated] = useState(false)
  const abortController = useRef(null)

  useEffect(() => {
    if (!value) {
      setUpdated(false)
    }
    if (!updated) {
      const defaultValue = value ? value : ''
      const blocksFromHtml = htmlToDraft(defaultValue)
      const contentState = ContentState.createFromBlockArray(
        blocksFromHtml.contentBlocks,
        blocksFromHtml.entityMap,
      )
      const newEditorState = EditorState.createWithContent(contentState)
      setEditorState(newEditorState)
    }
  }, [value, updated])

  const onEditorStateChange = editorState => {
    setUpdated(true)
    setEditorState(editorState)

    return onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }

  const uploadImageCallBack = async file => {
    abortController.current = new AbortController()

    return uploadFile(
      EMediaFormat.IMAGE,
      file,
      e => {},
      abortController.current,
    ).then(file => {
      return { data: { link: file.url } }
    })
  }

  return (
    <React.Fragment>
      <div className="editor">
        <Editor
          spellCheck
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: {
              urlEnabled: true,
              uploadEnabled: true,
              alignmentEnabled: true,
              uploadCallback: uploadImageCallBack,
              previewImage: true,
              inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
              alt: { present: true, mandatory: false },
            },
          }}
        />
      </div>
    </React.Fragment>
  )
})

export default WYSIWYGEditor
