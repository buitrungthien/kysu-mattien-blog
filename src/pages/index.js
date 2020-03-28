import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const IndexPage = ({ data }) => {
  const { edges } = data.allMarkdownRemark;
  return (
    <Layout>
      <SEO title="Home" />
      <div className="main__content">
        <div className="articles-wrap">
          {edges.map(({ node }) => (
            <article key={node.id} className="article-card">
              <h2 className="article-card__header">
                {node.frontmatter.title} - <time>{node.frontmatter.date}</time>
              </h2>
              <div className="article-card__exerpt">{node.excerpt}</div>
            </article>
          ))}
        </div>
        <aside className="side-bar">
          <span className="side-bar__filter-title">Lọc bài viết</span>
          <ul className="tags-option">
            <li className="tag">Technical</li>
            <li className="tag">Kinh nghiệm đi làm, tự học</li>
          </ul>
          <input type="search" className='search' placeholder='Tìm bài viết bằng tên' />
        </aside>
      </div>
    </Layout>
  );
};

export default IndexPage;

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
`;
