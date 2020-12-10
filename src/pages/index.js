// import EmailRegisterForm from '../components/EmailRegister';
import { useState, useEffect } from 'react';
import { getAllPosts } from '../lib/blog';
import Link from 'next/link';
import Image from 'next/image';
import { AwesomeButton } from 'react-awesome-button';
import NoTissue from '../../public/illustration/no-tissue.svg';
import { motion } from 'framer-motion';
import Author from '../components/Author';
import SEO from '../components/SEO';

const postVariants = {
  initial: { scale: 0.96, y: 30, opacity: 0 },
  enter: {
    scale: 1,
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.48, 0.15, 0.25, 0.96] },
  },
  exit: {
    scale: 0.6,
    y: 100,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.48, 0.15, 0.25, 0.96] },
  },
};

export default function IndexPage({ posts }) {
  const allPosts = posts;
  const [filteredData, setFilteredData] = useState([...allPosts]);
  const [filterValue, setFilterValue] = useState({ tech: true, exp: true });
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const filteredPosts = allPosts.filter(post => {
      if (!searchValue) {
        if (filterValue[post.frontmatter.tag]) return post;
      } else {
        if (
          filterValue[post.frontmatter.tag] &&
          post.frontmatter.title.toLowerCase().includes(searchValue.trim())
        )
          return post;
      }
    });
    setFilteredData(filteredPosts);
  }, [filterValue, searchValue, allPosts]);

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
    <>
      {/* <div className="register-bar"> */}
      {/* <span>
          Bạn muốn nhận những bài viết mới nhất, những khóa học bổ ích?
        </span> */}
      {/* <EmailRegisterForm /> */}
      {/* </div> */}
      <SEO
        title="Kỹ sư mặt tiền"
      />
      <div className="main__content">
        <motion.div
          initial="initial"
          animate="enter"
          exit="exit"
          variants={postVariants}
          style={{ height: '100%', width: '100%' }}
        >
          <div className="articles-wrap">
            {filteredData.length ? (
              filteredData.map(node => (
                <article key={node.slug} className="article-card">
                  <div className="article-card__image-wrap">
                    <Link href={node.slug}>
                      <a>
                        <Image
                          src={node.frontmatter.featuredImgUrl}
                          alt={node.frontmatter.featuredImgAlt}
                          title={node.frontmatter.featuredImgAlt}
                          layout="responsive"
                          width={300}
                          height={300}
                        />
                      </a>
                    </Link>
                  </div>

                  <div className="article-card__content">
                    <Link href={node.slug}>
                      <a>
                        <h2 className="article-card__header">
                          {node.frontmatter.title}
                        </h2>
                      </a>
                    </Link>
                    <div className="article-card__excerpt">
                      {node.frontmatter.description}
                    </div>
                    <div className="article-card__footer">
                      <Author />
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
              ))
            ) : (
              <div
                style={{
                  minWidth: '100%',
                  minHeight: '60rem',
                  position: 'relative',
                }}
              >
                <p
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1.5rem',
                  }}
                >
                  Bài viết bạn tìm hiện chưa có
                </p>
                <NoTissue />
              </div>
            )}
          </div>
        </motion.div>
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
              <Image
                src="/images/my-avatar-2.jpg"
                alt="Thiên Bùi - author of kysumattien"
                layout="intrinsic"
                width={130}
                height={200}
              />
            </div>
            <p className="brief-introduction">
              Chào các bạn mình là Thiên. Hiện tại mình đang là front-end
              developer làm việc tại sendo.vn.
            </p>
            <p className="brief-introduction mobile-no-display">
              Thuở mới vào nghề, mình đã trải qua rất nhiều khó khăn, sai lầm,
              lắm lúc bế tắc và có thật nhiều thắc mắc nhưng không có ai giải
              đáp.
            </p>
            <p className="brief-introduction tablet-no-display">
              Mình lập ra blog này nhằm chia sẻ những kinh nghiệm tích cóp được,
              và chắc chắn sẽ giúp được các bạn, đặc biệt là Fresher, các bạn
              sinh viên mới ra trường hay đặc biệt là tay ngang như mình...
            </p>
            <Link href="/about-me-and-this-blog">
              <a style={{ float: 'left' }}>
                <AwesomeButton type="link" size="medium" ripple>
                  Đọc thêm
                </AwesomeButton>
              </a>
            </Link>
          </section>
          <div className="facebook-counts"></div>
        </aside>
      </div>
    </>
  );
}

export function getStaticProps() {
  const allPosts = getAllPosts();
  return {
    props: {
      posts: allPosts,
    },
  };
}
