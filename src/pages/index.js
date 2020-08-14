import React from "react"

import MdxEditor from "../components/contentful/editor"

const defaultMdx = `# Contentful UI MDX Editor Demo

This is a **demo** to integrate a live MDX editor into Contentful.

The \`<Columns />\` element is a very simple example component using flexbox to display content next to each other.

<Columns>

![](https://source.unsplash.com/800x600/daily?sunset)

![](https://source.unsplash.com/800x600/daily?dogs)

![](https://source.unsplash.com/800x600/daily?cats)

</Columns>

## Feel free to play around!`

export default () => <MdxEditor editorId="demo" initialValue={defaultMdx} />
