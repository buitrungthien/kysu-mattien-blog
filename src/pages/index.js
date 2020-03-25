import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ data }) => {
  const { edges } = data.allMarkdownRemark;
  return (
    <Layout>
      <SEO title="Home" />
      <div>Tổng số bài viết: {data.allMarkdownRemark.totalCount} bài</div>
      {edges.map(({node}) => (
        <article key={node.id}>
          <h2>
            {node.frontmatter.title} - <time>{node.frontmatter.date}</time>
          </h2>
          <div>{node.excerpt}</div>
        </article>
      ))}
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query {
    allMarkdownRemark {
      edges {
        node {
          id
          frontmatter {
            date
            title
          }
          excerpt
        }
      }
      totalCount
    }
  }
`
