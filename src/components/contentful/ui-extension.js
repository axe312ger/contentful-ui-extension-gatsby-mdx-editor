import React, { useState, useEffect, useRef, useCallback } from "react"
import { init as initContentfulExtension } from "contentful-ui-extensions-sdk"
import styled from "@emotion/styled"

import MdxEditor from "./editor"

const Wrapper = styled.div`
  min-height: 400px;
`

const ContentfulUiExtensionMdxEditor = () => {
  const editorId = "contentful-ui"
  const [sdk, setSdk] = useState(null)
  const [value, setValue] = useState(null)
  const refFormWrapper = useRef(null)

  // Connect to Contentful
  useEffect(() => {
    if (sdk) {
      return
    }
    initContentfulExtension(sdk => {
      setSdk(sdk)
      const fieldValue = sdk.field.getValue()
      setValue(fieldValue)
    })
  }, [sdk])

  // Resize field interface based on form height
  useEffect(() => {
    if (!refFormWrapper || !refFormWrapper.current || !sdk) {
      return
    }
    sdk.window.updateHeight(refFormWrapper.current.clientHeight)
  }, [refFormWrapper, sdk])

  // Save handler to send editor value to Contentful
  const save = useCallback(async editorValue => {
    try {
      await sdk.field.setValue(editorValue)
      // setValue(editorValue)
      sdk.notifier.success("Synced data with Contentful")
    } catch (err) {
      console.error(err)
      sdk.notifier.error("Could not sync with Contentful")
    }
  })

  if (!sdk) {
    return "Connecting to Contentful..."
  }

  return (
    <Wrapper ref={refFormWrapper}>
      {value !== null && (
        <MdxEditor editorId={editorId} onSave={save} value={value} />
      )}
    </Wrapper>
  )
}

export default ContentfulUiExtensionMdxEditor
