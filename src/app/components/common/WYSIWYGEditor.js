import React, { useState } from 'react'
import { EditorState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
// import './WYSIWYG.scss'

const WYSIWYGEditor = React.forwardRef((props, ref) => {
  const { onChange, onBlur, value } = props

  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const onEditorStateChange = editorState => {
    setEditorState(editorState)
    console.log('PROPS ==> ', props)
    return onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }

  return (
    <React.Fragment>
      <div className="editor">
        <Editor
          editorState={editorState}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          onEditorStateChange={onEditorStateChange}
        />
      </div>
    </React.Fragment>
  )
})

export default WYSIWYGEditor
