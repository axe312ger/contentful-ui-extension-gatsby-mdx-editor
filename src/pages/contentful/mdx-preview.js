import React, { useState } from "react"
import propTypes from "prop-types"
import loadable from "@loadable/component"
import { Styled } from "theme-ui"
import useEventListener from "@use-it/event-listener"
import styled from "@emotion/styled"

const MDX = loadable(() => import("@mdx-js/runtime"))

const PreviewFailedWrapper = styled.div`
  display: flex;
  flex-direction: columns;
  justify-items: center;
  text-align: center;
  width: 100vw;
  height: 100vh;
`

class MDXErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  static propTypes = {
    children: propTypes.node.isRequired,
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return (
        <PreviewFailedWrapper>
          <Styled.h2>Something went wrong rendering the preview.</Styled.h2>
          <Styled.pre>{this.state.error.message}</Styled.pre>
        </PreviewFailedWrapper>
      )
    }

    return this.props.children
  }
}

const DocsPreviewPage = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const localStorageId = searchParams.get("id")

  const [content, setContent] = useState(localStorage.getItem(localStorageId))

  // Listen for content updates from editor
  useEventListener("storage", e => {
    if (e.key === localStorageId) {
      setContent(e.newValue)
    }
  })

  if (!localStorageId || !content) {
    return null
  }

  return (
    <MDXErrorBoundary>
      <MDX>{content}</MDX>
    </MDXErrorBoundary>
  )
}

const DocsPreviewBrowserOnlyWrapper = props =>
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement ? (
    <DocsPreviewPage {...props} />
  ) : null

export default DocsPreviewBrowserOnlyWrapper
