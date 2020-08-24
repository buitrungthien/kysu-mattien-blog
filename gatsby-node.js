const { createFilePath, createRemoteFileNode } = require('gatsby-source-filesystem');
const path = require('path');

exports.onCreateNode = async ({
  node,
  getNode,
  actions: { createNode, createNodeField },
  store,
  cache,
  createNodeId,
}) => {
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode });

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
  if (
    node.internal.type === 'MarkdownRemark' &&
    node.frontmatter.featuredImgUrl !== null
  ) {
    let fileNode = await createRemoteFileNode({
      url: node.frontmatter.featuredImgUrl, // string that points to the URL of the image
      parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
      createNode, // helper function in gatsby-node to generate the node
      createNodeId, // helper function in gatsby-node to generate the node id
      cache, // Gatsby's cache
      store, // Gatsby's redux store
    });
    // if the file was created, attach the new node to the parent node
    if (fileNode) {
      node.featuredImg___NODE = fileNode.id;
    }
  }
};

//In addition to the first way of creating new file in the pages folder, we
//can also use this method to generate markdown-based pages
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return graphql(`
    {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
    result.data.allMarkdownRemark.edges.forEach(
      ({ node, previous, next }, index) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve('./src/templates/default-blog-post.js'),
          context: {
            slug: node.fields.slug,
            previous,
            next,
          },
        });
      }
    );
  });
};
