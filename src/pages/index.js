import React from "react"

import MdxEditor from "../components/contentful/editor"

const defaultMdx = `# Contentful UI MDX Editor Demo

This is a **demo** to integrate an live MDX editor into Contentful.

The \`<Columns />\` element is a very simple example component using flexbox to display content next to each other.

<Columns>

![](https://source.unsplash.com/random?1)

![](https://source.unsplash.com/random?2)

![](https://source.unsplash.com/random?3)

</Columns>

## Feel free to play around!
`

export default () => <MdxEditor editorId="demo" initialValue={defaultMdx} />
