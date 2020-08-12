import React, { useState, useEffect, useRef } from "react"
import { init as initContentfulExtension } from "contentful-ui-extensions-sdk"
import useEventListener from "@use-it/event-listener"

import MdxEditor from "./editor"

const ContentfulUiExtensionMdxEditor = () => {
  const editorId = "demo"
  const localStorageId = `contentful-ui-live-editor-${editorId}`
  const [sdk, setSdk] = useState(null)
  const [value, setValue] = useState(localStorage.getItem(localStorageId))
  const refFormWrapper = useRef(null)

  // Listen for content updates from editor and send them to Contentful
  useEventListener("storage", e => {
    if (e.key === localStorageId) {
      try {
        setValue(e.newValue)
        sdk.notifier.success("Save successful")
      } catch (err) {
        console.error(err)
        sdk.notifier.error("Save failed")
      }
    }
  })

  // Connect to Contentful
  useEffect(() => {
    if (sdk) {
      return
    }
    initContentfulExtension(sdk => {
      setSdk(sdk)
      setValue(sdk.field.getValue())
    })
  }, [sdk])

  // Resize field interface based on form height
  useEffect(() => {
    if (!refFormWrapper || !sdk) {
      return
    }
    sdk.window.updateHeight(refFormWrapper.current.clientHeight)
  }, [refFormWrapper, sdk])

  if (!sdk) {
    return "Connecting to Contentful..."
  }

  return (
    <div ref={refFormWrapper}>
      <MdxEditor editorId={editorId} initialValue={value} />
    </div>
  )
}

export default ContentfulUiExtensionMdxEditor
