import React, { useState, useEffect, useRef } from "react"
import { useDebounceCallback } from "@react-hook/debounce"
import propTypes from "prop-types"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import mdx from "@mdx-js/mdx"
import { Styled } from "theme-ui"
import AceEditor from "react-ace"

import "ace-builds/src-noconflict/ext-searchbox"
import "ace-builds/src-noconflict/ext-language_tools"
import "ace-builds/src-noconflict/mode-markdown"
import "ace-builds/src-noconflict/theme-dracula"

const LiveEditorWrapper = styled.section(
  () => css`
    display: grid;
    grid-template-columns: 320px 1fr;
    grid-template-rows: 1fr min-content;
    grid-template-areas:
      "preview editor"
      "error error";
    height: 100vh;
    width: 100vw;
  `
)
const LiveEditorPreviewWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  grid-area: preview;
`
const LiveEditorPreview = styled.iframe`
  width: 100%;
  height: 100%;
  overflow: scroll;
`
const PreviewControls = styled.div`
  position: absolute;
  z-index: 50;
  right: 0;
  top: 0;
  margin: 1rem;
`
const PreviewControl = styled.a`
  border-radius: 1rem;
  background: tomato;
  color: white;
  padding: 0.25rem 0.5rem;
  text-decoration: none;
`

const LiveEditorError = styled.div`
  padding: 1rem;
  border: 4px dashed white;
  background: tomato;
  color: white;
  grid-area: error;
`
const LiveEditorErrorMessage = styled.pre`
  font-size: 0.8em;
`
const LiveEditorEditor = styled.div`
  grid-area: editor;
  min-height: 4rem;
`

function LiveEditor({ editorId, initialValue, value, onSave }) {
  const localStorageId = `contentful-ui-live-editor-${editorId}`
  const editorRef = useRef(null)
  const [editorValue, setEditorValue] = useState(
    value || localStorage.getItem(localStorageId) || initialValue || ""
  )
  const [currentValue, setCurrentValue] = useState(editorValue)
  const [error, setError] = useState()

  // Validate MDX and send valid content to preview and save handler
  useEffect(() => {
    async function parseMdx() {
      try {
        // Validate mdx by parsing it
        await mdx(currentValue)

        // Set valid raw value
        setError(null)

        // Store to localStorage for preview
        localStorage.setItem(localStorageId, currentValue)

        // Save value if desired by user
        if (onSave) {
          await onSave(currentValue)
        }

        // Resize editor when MDX error was fixed by the user
        if (editorRef.current) {
          editorRef.current.editor.resize()
        }
      } catch (error) {
        // Show MDX validation error message
        console.error(error)
        setError(error)
        if (editorRef.current) {
          editorRef.current.editor.resize()
        }
      }
    }

    parseMdx()
  }, [currentValue])

  // Handle changes to editor value by user
  const handleEditorChange = useDebounceCallback(content => {
    if (content !== editorValue) {
      setEditorValue(content)
    }

    // Trim whitespace
    const cleanValue = content.replace(/^[ \t]+$/gm, "")

    // No need to overwrite the same value
    if (cleanValue !== currentValue) {
      setCurrentValue(cleanValue)
    }
  }, 300)

  const previewSrc = `/contentful/mdx-preview?id=${localStorageId}`

  return (
    <LiveEditorWrapper>
      {error && (
        <LiveEditorError>
          <Styled.h3>Oops, something went wrong:</Styled.h3>
          <LiveEditorErrorMessage>
            {error.message
              .replace(/[> ]+([0-9]+) \|/g, (a, b) =>
                a.replace(b, parseInt(b) - 2)
              )
              .replace(/\(([0-9]+):[0-9]+\)/, (a, b) =>
                a.replace(b, parseInt(b) - 2)
              )}
          </LiveEditorErrorMessage>
        </LiveEditorError>
      )}
      <LiveEditorPreviewWrapper>
        <PreviewControls>
          <PreviewControl target="_blank" href={previewSrc}>
            💻 Full Screen Preview
          </PreviewControl>
        </PreviewControls>
        <LiveEditorPreview src={previewSrc} />
      </LiveEditorPreviewWrapper>
      <LiveEditorEditor>
        <AceEditor
          mode="markdown"
          theme="dracula"
          ref={editorRef}
          enableEmmet
          enableLiveAutocompletion
          tabSize={2}
          onChange={handleEditorChange}
          name={`docs-ace-editor-${editorId}`}
          editorProps={{
            $blockScrolling: true,
          }}
          value={editorValue}
          width="100%"
          height="100%"
        />
      </LiveEditorEditor>
    </LiveEditorWrapper>
  )
}

LiveEditor.defaultProps = {
  editorId: "default-editor",
}

LiveEditor.propTypes = {
  editorId: propTypes.string,
  initialValue: propTypes.string,
  value: propTypes.string,
  onSave: propTypes.func,
}

const LiveEditorBrowserOnlyWrapper = props =>
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement ? (
    <LiveEditor {...props} />
  ) : null

export default LiveEditorBrowserOnlyWrapper
