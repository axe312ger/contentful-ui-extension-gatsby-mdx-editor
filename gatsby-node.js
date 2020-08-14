/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  // Ensure MDX runtime can be bundled
  actions.setWebpackConfig({
    node: {
      fs: "empty",
    },
  })
  // Ensure Contentful UI Extensions SDK can be bundled
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /contentful-ui-extensions-sdk/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
