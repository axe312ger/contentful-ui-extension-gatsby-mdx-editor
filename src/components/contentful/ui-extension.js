import React, { useState, useEffect, useRef, useCallback } from "react"
import propTypes from "prop-types"
import styled from "@emotion/styled"

import MdxEditor from "./editor"

const Wrapper = styled.div`
  min-height: 400px;
`

const ContentfulUiExtensionMdxEditor = ({ sdk }) => {
  const editorId = "contentful-ui"
  const [fieldValue] = useState(sdk.field.getValue())
  const refFormWrapper = useRef(null)

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
    } catch (err) {
      console.error(err)
      sdk.notifier.error("Could not sync editor value with Contentful")
    }
  })

  return (
    <Wrapper ref={refFormWrapper}>
      <MdxEditor editorId={editorId} onSave={save} fieldValue={fieldValue} />
    </Wrapper>
  )
}

ContentfulUiExtensionMdxEditor.propTypes = {
  sdk: propTypes.object.isRequired,
}

const ContentfulUiExtensionMdxEditorWrapper = props => {
  // Skip SSR
  if (
    !(
      typeof window !== "undefined" &&
      window.document &&
      window.document.createElement
    )
  ) {
    return null
  }

  // Wait for Contentful UI SDK to be connected
  const [sdk, setSdk] = useState(null)
  useEffect(() => {
    console.log("check for sdk")
    if (!sdk && window.sdk) {
      console.log("SDK found")
      setSdk(window.sdk)
    }
  }, [sdk, window.sdk])

  if (!sdk) {
    return "Connecting..."
  }
  return <ContentfulUiExtensionMdxEditor sdk={sdk} {...props} />
}

export default ContentfulUiExtensionMdxEditorWrapper
