import React, { Component } from 'react'
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
// import htmlToDraft from 'html-to-draftjs'
import '../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './text-editor.css'
class EditorConvertToHTML extends Component {
  state = {
    editorState: EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(this.props.description),
      ),
    ),
  }

  getValueTextEditor = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    })
  }

  render() {
    const { editorState } = this.state
    return (
      <div style={{ marginBottom: '15px' }}>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    )
  }
}

export default EditorConvertToHTML
