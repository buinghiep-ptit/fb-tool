import { ContentState, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
// import './WYSIWYG.scss'

const WYSIWYGEditor = React.forwardRef(({ onChange, value }, ref) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
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
  }, [value])

  const onEditorStateChange = editorState => {
    setUpdated(true)
    setEditorState(editorState)

    return onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }

  return (
    <React.Fragment>
      <div className="editor">
        <Editor
          spellCheck
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
        />
      </div>
    </React.Fragment>
  )
})

export default WYSIWYGEditor
