import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import defaultImage from '../images/images.jpg';
import myAvatar from '../images/my-avatar.jpg';

const IndexPage = ({ data }) => {
  const { edges } = data.allMarkdownRemark;
  return (
    <Layout>
      <SEO title="Home" />
      <di className="main__content">
        <di className="articles-wrap">
          {edges.map(({ node }) => (
            <article key={node.id} className="article-card">
              <div className="article-card__image-wrap">
                <img src={defaultImage} alt="abc" />
              </div>
              <di className="article-card__content">
                <h2 className="article-card__header">
                  {node.frontmatter.title} -{' '}
                  <time>{node.frontmatter.date}</time>
                </h2>
                <div className="article-card__excerpt">{node.excerpt}</div>
                <div className="author-info">
                  <div className="author-image-wrap">
                    <img src={myAvatar} alt="Bùi Kiệm" />
                  </div>
                  <span className="author-name">Tony Bùi</span>
                </div>
              </di>
            </article>
          ))}
        </di>
        <aside className="side-bar">
          <span className="side-bar__filter-title">Lọc bài viết</span>
          <ul className="tags-option">
            <li className="tag">Technical</li>
            <li className="tag">Kinh nghiệm đi làm, tự học</li>
          </ul>
          <input
            type="search"
            className="search"
            placeholder="Tìm bài viết bằng tên"
          />
        </aside>
      </di>
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
