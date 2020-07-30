import React, { useState, useEffect } from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import defaultImage from '../images/images.jpg';
import myAvatar from '../images/my-avatar.jpg';
import myAvatarSecond from '../images/my-avatar-2.jpg';
import Author from '../components/Author';
import EmailRegisterForm from '../components/EmailRegister';

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
        if (
          filterValue[post.node.frontmatter.tag] &&
          post.node.frontmatter.title.toLowerCase().includes(searchValue.trim())
        )
          return post;
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
    const searchValue = value.toLowerCase();
    setSearchValue(searchValue);
  };

  return (
    <Layout>
      <SEO title="Home is HOUSE" />
      <div className="register-bar">
        <span>
          Bạn muốn nhận những bài viết mới nhất, những khóa học bổ ích?
        </span>
        <EmailRegisterForm />
      </div>
      <div className="main__content">
        <div className="articles-wrap">
          {filteredData.map(({ node }) => (
            <article key={node.id} className="article-card">
              <Link to={node.fields.slug} className="article-card__image-wrap">
                <img src={defaultImage} alt="abc" />
              </Link>
              <div className="article-card__content">
                <Link to={node.fields.slug}>
                  <h2 className="article-card__header">
                    {node.frontmatter.title}
                  </h2>
                </Link>
                <div className="article-card__excerpt">{node.excerpt}</div>
                <div className="article-card__footer">
                  <Author name="Thiên Bùi" avatar={myAvatar} />
                  <div className="time-tag-wrapper">
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
        <aside className="sidebar">
          <div className="filter">
            <span className="filter-title">Lọc bài viết</span>
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
          </div>
          <section className="profile">
            <div className="profile__avatar">
              <img
                src={myAvatarSecond}
                alt=""
                style={{ objectPosition: 'top' }}
              />
            </div>
            <p className="brief-introduction">
              Bắt đầu học web từ con số 0, sau 9 tháng mình đã được nhận vào làm
              việc tại công ty thương mại điện tử Sen Đỏ (sendo.vn).
            </p>
            <p className="brief-introduction mobile-no-display">
              Thưở mới vào nghề, mình đã trải qua rất nhiều khó khăn, sai lầm,
              lắm lúc bế tắc và có thật nhiều thắc mắc nhưng không có ai giải
              đáp.
            </p>
            <p className="brief-introduction tablet-no-display">
              Mình lập ra blog này nhằm chia sẻ những kinh nghiệm tích cóp được,
              và chắc chắn sẽ giúp được các bạn, đặc biệt là Fresher, các bạn
              sinh viên mới ra trường hay đặc biệt là tay ngang như mình...
            </p>
            <Link to="about-me-and-this-blog" className="read-more-link">
              Đọc thêm &gt;&gt;
            </Link>
          </section>
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
          fields {
            slug
          }
        }
      }
    }
  }
`;
