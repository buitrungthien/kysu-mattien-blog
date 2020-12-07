const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": hot(preferDefault(require("/home/thienbt/Projects/kysu-mattien-blog/.cache/dev-404-page.js"))),
  "component---src-pages-404-js": hot(preferDefault(require("/home/thienbt/Projects/kysu-mattien-blog/src/pages/404.js"))),
  "component---src-pages-about-me-and-this-blog-js": hot(preferDefault(require("/home/thienbt/Projects/kysu-mattien-blog/src/pages/about-me-and-this-blog.js"))),
  "component---src-pages-index-js": hot(preferDefault(require("/home/thienbt/Projects/kysu-mattien-blog/src/pages/index.js"))),
  "component---src-pages-portfolio-js": hot(preferDefault(require("/home/thienbt/Projects/kysu-mattien-blog/src/pages/portfolio.js"))),
  "component---src-templates-default-blog-post-js": hot(preferDefault(require("/home/thienbt/Projects/kysu-mattien-blog/src/templates/default-blog-post.js")))
}

