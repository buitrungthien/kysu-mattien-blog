const { createFilePath } = require('gatsby-source-filesystem');
const path = require('path');

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode });

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

//In addition to the first way of creating new file in the pages folder, we
//can also use this method to generate markdown-based pages
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return graphql(`
    {
      allMarkdownRemark(sort: {order: ASC, fields: frontmatter___date}) {
        edges {
          next {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
          node {
            fields {
              slug
            }
          }
          previous {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
        }
      }
    }
  `).then(result => {
    result.data.allMarkdownRemark.edges.forEach(({node, previous, next}, index) => {
      createPage({
        path: node.fields.slug,
        component: path.resolve('./src/templates/default-blog-post.js'),
        context: {
          slug: node.fields.slug,
          previous,
          next,
        }
      });
    });
  });
};
