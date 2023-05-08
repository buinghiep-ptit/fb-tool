import { uploadFile } from 'app/apis/uploads/upload.service'
import { EMediaFormat } from 'app/utils/enums/medias'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
// import './WYSIWYG.scss'
import DOMPurify from 'dompurify'

const getInitialState = defaultValue => {
  if (defaultValue) {
    const blocksFromHtml = htmlToDraft(defaultValue)
    const { contentBlocks, entityMap } = blocksFromHtml
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap,
    )
    return EditorState.createWithContent(contentState)
  } else {
    return EditorState.createEmpty()
  }
}

const WYSIWYGEditor = React.forwardRef(
  ({ onChange, value: defaultValue, readOnly }, ref) => {
    const [editorState, setEditorState] = useState()
    const [defaultValueState, setDefaultValueState] = useState()
    const abortController = useRef(null)

    useEffect(() => {
      if (defaultValue) {
        const initialState = getInitialState(defaultValue)
        onEditorDefaultStateChange(initialState)
      }
    }, [onEditorDefaultStateChange, defaultValue])

    const onEditorDefaultStateChange = useCallback(
      editorState => {
        // console.log(editorState)
        setDefaultValueState(editorState)
        const currentContentAsHTML = draftToHtml(
          convertToRaw(editorState.getCurrentContent()),
        )
        const cleanHtml = DOMPurify.sanitize(currentContentAsHTML)

        return onChange(cleanHtml)
      },
      [onChange],
    )

    const onEditorStateChange = useCallback(
      editorState => {
        setEditorState(editorState)
        const currentContentAsHTML = draftToHtml(
          convertToRaw(editorState.getCurrentContent()),
        )
        const cleanHtml = DOMPurify.sanitize(currentContentAsHTML)

        return onChange(cleanHtml)
      },
      [onChange],
    )

    const uploadImageCallBack = async file => {
      abortController.current = new AbortController()

      return uploadFile(
        EMediaFormat.IMAGE,
        file,
        e => {},
        abortController.current,
      ).then(file => {
        console.log(file)
        return { data: { link: file.path } }
      })
    }

    return (
      <React.Fragment>
        <div className="editor">
          <Editor
            readOnly={readOnly}
            toolbarHidden={readOnly}
            spellCheck
            editorState={editorState ? editorState : defaultValueState}
            onEditorStateChange={onEditorStateChange}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            editorStyle={{ color: readOnly ? 'lightgray' : 'black' }}
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
                inputAccept:
                  'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                alt: { present: true, mandatory: false },
              },
            }}
          />
        </div>
      </React.Fragment>
    )
  },
)

export default WYSIWYGEditor
