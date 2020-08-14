const {
  init: initContentfulExtension,
} = require("contentful-ui-extensions-sdk")

exports.onClientEntry = () => {
  // Init Contentful UI Extension SDK before the window load event
  initContentfulExtension(sdk => {
    window.sdk = sdk
  })
}
