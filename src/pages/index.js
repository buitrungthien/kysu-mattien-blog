import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import defaultImage from '../images/images.jpg';
import myAvatar from '../images/my-avatar.jpg';

const IndexPage = ({ data }) => {
  const allPosts = data.allMarkdownRemark.edges;
  const [filteredData, setFilteredData] = useState([...allPosts]);
  const [filterValue, setFilterValue] = useState({ tech: true, exp: true });
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const filteredPosts = allPosts.filter(post => {
      if (!searchValue) {
        if (filterValue[post.node.frontmatter.tag]) return post;
      } else {
        if (filterValue[post.node.frontmatter.tag] && post.node.frontmatter.title.toLowerCase().includes(searchValue)) return post;
      }
    });
    setFilteredData(filteredPosts);
  }, [filterValue, searchValue]);

  const handleFilterChange = event => {
    const { name } = event.target;
    const { checked } = event.target;
    const filterKeyNeedTOBEChecked = name === 'tech' ? 'exp' : 'tech';
    if (!filterValue[filterKeyNeedTOBEChecked]) {
      return; //At least one filter value is choosed
    } else {
      setFilterValue({
        ...filterValue,
        [name]: checked,
      });
    }
  };

  const handleSearch = event => {
    const { value } = event.target;
    const searchValue = value.trim().toLowerCase();
    setSearchValue(searchValue);
  };

  return (
    <Layout>
      <SEO title="Home" />
      <div className="register-bar">
        <span>
          Bạn muốn nhận những bài viết mới nhất, những khóa học bổ ích?
        </span>
        <form>
          <input placeholder="Email của bạn" />
          <button>Gửi tôi</button>
        </form>
      </div>
      <div className="main__content">
        <div className="articles-wrap">
          {filteredData.map(({ node }) => (
            <article key={node.id} className="article-card">
              <div className="article-card__image-wrap">
                <img src={defaultImage} alt="abc" />
              </div>
              <div className="article-card__content">
                <h2 className="article-card__header">
                  {node.frontmatter.title}
                </h2>
                <div className="article-card__excerpt">{node.excerpt}</div>
                <div className="article-card__footer">
                  <div className="author-info">
                    <div className="author-image-wrap">
                      <img src={myAvatar} alt="Bùi Kiệm" />
                    </div>
                    <span className="author-name">
                      {node.frontmatter.author.name || 'Thiên Bùi'}
                    </span>
                  </div>
                  <div>
                    <time>{node.frontmatter.date}</time>
                    <span className="tag">
                      {node.frontmatter.tag === 'tech'
                        ? 'technical'
                        : 'kinh nghiệm đi làm, tự học'}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className="side-bar">
          <span className="side-bar__filter-title">Lọc bài viết</span>
          <div className="tags-option">
            <input
              id="tech"
              name="tech"
              type="checkbox"
              checked={filterValue.tech}
              onChange={handleFilterChange}
            />
            <label className="tag" htmlFor="tech">
              Technical
            </label>
            <input
              id="exp"
              name="exp"
              type="checkbox"
              checked={filterValue.exp}
              onChange={handleFilterChange}
            />
            <label className="tag" htmlFor="exp">
              Kinh nghiệm đi làm, tự học
            </label>
          </div>
          <input
            type="search"
            className="search"
            placeholder="Tìm kiếm bài viết"
            value={searchValue}
            onChange={handleSearch}
          />
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
            author {
              name
            }
            tag
          }
          excerpt
        }
      }
    }
  }
`;
