// import React, { useState, useEffect } from 'react';
// import { graphql } from 'gatsby';

// import Layout from '../components/layout';
// import SEO from '../components/seo';
// import Author from '../components/Author';
// import EmailRegisterForm from '../components/EmailRegister';
// import Image from 'gatsby-image';

// const IndexPage = ({ data }) => {
//   const allPosts = data.allMarkdownRemark.edges;
//   const [filteredData, setFilteredData] = useState([...allPosts]);
//   const [filterValue, setFilterValue] = useState({ tech: true, exp: true });
//   const [searchValue, setSearchValue] = useState('');

//   useEffect(() => {
//     const filteredPosts = allPosts.filter(post => {
//       if (!searchValue) {
//         if (filterValue[post.node.frontmatter.tag]) return post;
//       } else {
//         if (
//           filterValue[post.node.frontmatter.tag] &&
//           post.node.frontmatter.title.toLowerCase().includes(searchValue.trim())
//         )
//           return post;
//       }
//     });
//     setFilteredData(filteredPosts);
//   }, [filterValue, searchValue, allPosts]);

//   const handleFilterChange = event => {
//     const { name } = event.target;
//     const { checked } = event.target;
//     const filterKeyNeedTOBEChecked = name === 'tech' ? 'exp' : 'tech';
//     if (!filterValue[filterKeyNeedTOBEChecked]) {
//       return; //At least one filter value is choosed
//     } else {
//       setFilterValue({
//         ...filterValue,
//         [name]: checked,
//       });
//     }
//   };

//   const handleSearch = event => {
//     const { value } = event.target;
//     const searchValue = value.toLowerCase();
//     setSearchValue(searchValue);
//   };

//   return (
//     <Layout>
//       <SEO
//         title="Kỹ sư mặt tiền"
//         description="Blog chia sẻ kiến thức lập trình web front-end, ReactJS,..., kinh nghiệm tự học, kinh nghiệm đi làm. Giúp con đường đến với lập trình web của các bạn mới đỡ chông gai!"
//       />
//       <div className="register-bar">
//         <span>
//           Bạn muốn nhận những bài viết mới nhất, những khóa học bổ ích?
//         </span>
//         <EmailRegisterForm />
//       </div>
//       <div className="main__content">
//         <div className="articles-wrap">
//           {filteredData.length ? (
//             filteredData.map(({ node }) => (
//               <article key={node.id} className="article-card">
//                 <a
//                   href={ (process.env.NODE_ENV !== 'development' ? "https://www.kysumattien.com" : '') + node.fields.slug}
//                   className="article-card__image-wrap"
//                 >
//                   <Image
//                     fluid={node.featuredImg.childImageSharp.fluid}
//                     alt={node.frontmatter.featuredImgAlt}
//                     title={node.frontmatter.featuredImgAlt}
//                   />
//                 </a>
//                 <div className="article-card__content">
//                   <a href={ (process.env.NODE_ENV !== 'development' ? "https://www.kysumattien.com" : '') + node.fields.slug}>
//                     <h2 className="article-card__header">
//                       {node.frontmatter.title}
//                     </h2>
//                   </a>
//                   <div className="article-card__excerpt">{node.excerpt}</div>
//                   <div className="article-card__footer">
//                     <Author />
//                     <div className="time-tag-wrapper">
//                       <time>{node.frontmatter.date}</time>
//                       <span className="tag">
//                         {node.frontmatter.tag === 'tech'
//                           ? 'technical'
//                           : 'kinh nghiệm đi làm, tự học'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </article>
//             ))
//           ) : (
//             <span className="not-found-article-message">
//               Bài viết bạn tìm hiện chưa có!
//             </span>
//           )}
//         </div>
//         <aside className="sidebar">
//           <div className="filter">
//             <span className="filter-title">Lọc bài viết</span>
//             <div className="tags-option">
//               <input
//                 id="tech"
//                 name="tech"
//                 type="checkbox"
//                 checked={filterValue.tech}
//                 onChange={handleFilterChange}
//               />
//               <label className="tag" htmlFor="tech">
//                 Technical
//               </label>
//               <input
//                 id="exp"
//                 name="exp"
//                 type="checkbox"
//                 checked={filterValue.exp}
//                 onChange={handleFilterChange}
//               />
//               <label className="tag" htmlFor="exp">
//                 Kinh nghiệm đi làm, tự học
//               </label>
//             </div>
//             <input
//               type="search"
//               className="search"
//               placeholder="Tìm kiếm bài viết"
//               value={searchValue}
//               onChange={handleSearch}
//             />
//           </div>
//           <section className="profile">
//             <div className="profile__avatar">
//               <Image
//                 fixed={data.file.desktopAvatar.fixed}
//                 alt="Thiên Bùi"
//                 className="desktop-avatar"
//               />
//               <Image
//                 fixed={data.file.mobileAvatar.fixed}
//                 alt="Thiên Bùi"
//                 className="mobile-avatar"
//               />
//             </div>
//             <p className="brief-introduction">
//               Chào các bạn mình là Thiên. Hiện tại mình đang là front-end
//               developer làm việc tại sendo.vn.
//             </p>
//             <p className="brief-introduction mobile-no-display">
//               Thuở mới vào nghề, mình đã trải qua rất nhiều khó khăn, sai lầm,
//               lắm lúc bế tắc và có thật nhiều thắc mắc nhưng không có ai giải
//               đáp.
//             </p>
//             <p className="brief-introduction tablet-no-display">
//               Mình lập ra blog này nhằm chia sẻ những kinh nghiệm tích cóp được,
//               và chắc chắn sẽ giúp được các bạn, đặc biệt là Fresher, các bạn
//               sinh viên mới ra trường hay đặc biệt là tay ngang như mình...
//             </p>
//             <a href={process.env.NODE_ENV !== 'development' ? "https://www.kysumattien.com" : '' + "/about-me-and-this-blog"} className="read-more-link">
//               Đọc thêm &gt;&gt;
//             </a>
//           </section>
//           <div className="facebook-counts"></div>
//         </aside>
//       </div>
//     </Layout>
//   );
// };

// export default IndexPage;

// export const query = graphql`
//   query {
//     allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
//       edges {
//         node {
//           id
//           featuredImg {
//             childImageSharp {
//               fluid(maxWidth: 300) {
//                 ...GatsbyImageSharpFluid
//               }
//             }
//           }
//           frontmatter {
//             date
//             title
//             author {
//               name
//             }
//             featuredImgAlt
//             tag
//           }
//           excerpt
//           fields {
//             slug
//           }
//         }
//       }
//     }
//     file(name: { regex: "/my-avatar-2/" }) {
//       desktopAvatar: childImageSharp {
//         fixed(height: 120, width: 120) {
//           ...GatsbyImageSharpFixed
//         }
//       }
//       mobileAvatar: childImageSharp {
//         fixed(height: 70, width: 70) {
//           ...GatsbyImageSharpFixed
//         }
//       }
//     }
//   }
// `;

export default function IndexPage() {
  return <h1>ky su mat tien ver2</h1>;
}
