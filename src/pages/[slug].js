// import React, { useEffect, useState } from 'react';
// import { graphql } from 'gatsby';
// import Layout from '../components/layout';
// import Author from '../components/Author';
// import myAvatar from '../images/my-avatar.jpg';
// import SEO from '../components/seo';
// import './styles.scss';
// import Image from 'gatsby-image';
// import { FacebookProvider, Comments, Like } from 'react-facebook';

// export default ({ data, pageContext }) => {
//   const post = data.markdownRemark;
//   const { previous, next, slug } = pageContext;
//   const { author } = post.frontmatter;

//   useEffect(() => {
//     function windowPopup(url, width, height) {
//       // Calculate the position of the popup so
//       // it’s centered on the screen.
//       const left = window.screen.width / 2 - width / 2,
//         top = window.screen.height / 2 - height / 2;

//       window.open(
//         url,
//         '',
//         'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=' +
//           width +
//           ',height=' +
//           height +
//           ',top=' +
//           top +
//           ',left=' +
//           left
//       );
//     }

//     const facebookShareLink = document.querySelector('.facebook > a');
//     facebookShareLink.setAttribute(
//       'href',
//       `https://www.facebook.com/sharer/sharer.php?u=kysumattien.com${slug}`
//     );
//     facebookShareLink.addEventListener('click', function(e) {
//       e.preventDefault();
//       windowPopup(this.href, 500, 500);
//     });
//   }, [slug]);
//   return (
//     <Layout>
//       <SEO
//         title={post.frontmatter?.title}
//         description={post.frontmatter?.description}
//         image={post.frontmatter?.featuredImgUrl}
//       />
//       <article className="post">
//         <FacebookProvider appId="3364552500258287">
//           <div className="post-header">
//             <h1 className="post-title">{post.frontmatter.title}</h1>
//             <div className="post-info">
//               <Author name={author.name} avatar={myAvatar} />
//               <time>{post.frontmatter.date}</time>
//             </div>
//             <div className="image-wrap">
//               <Image
//                 fluid={post.featuredImg.childImageSharp.fluid}
//                 alt={post.frontmatter.featuredImgAlt}
//                 title={post.frontmatter.featuredImgAlt}
//               />
//             </div>
//           </div>
//           <div dangerouslySetInnerHTML={{ __html: post.html }} />
//           <div className="facebook-actions">
//             <Like
//               showFaces
//               size={
//                 typeof window !== 'undefined' && window.innerWidth > 768
//                   ? 'large'
//                   : 'small'
//               }
//               layout={
//                 typeof window !== 'undefined' && window.innerWidth > 768
//                   ? 'standard'
//                   : 'button_count'
//               }
//               showFaces
//               share
//               href={href}
//             />
//             <Comments width={'100%'} href={href} />
//           </div>
//           <div className="pre-next-navigator">
//             {previous && (
//               <a
//                 href={
//                   (process.env.NODE_ENV !== 'development'
//                     ? 'https://www.kysumattien.com'
//                     : '') + previous.fields.slug
//                 }
//                 className="pre-link"
//                 title={previous.frontmatter.title}
//               >
//                 {previous.frontmatter.title}
//               </a>
//             )}
//             {next && (
//               <a
//                 href={
//                   (process.env.NODE_ENV !== 'development'
//                     ? 'https://www.kysumattien.com'
//                     : '') + next.fields.slug
//                 }
//                 className="next-link"
//                 title={next.frontmatter.title}
//               >
//                 {next.frontmatter.title}
//               </a>
//             )}
//           </div>
//         </FacebookProvider>
//       </article>
//     </Layout>
//   );
// };

// export const query = graphql`
//   query($slug: String!) {
//     markdownRemark(fields: { slug: { eq: $slug } }) {
//       html
//       featuredImg {
//         childImageSharp {
//           fluid(maxWidth: 820) {
//             ...GatsbyImageSharpFluid
//           }
//         }
//       }
//       frontmatter {
//         title
//         featuredImgAlt
//         featuredImgUrl
//         description
//         author {
//           name
//         }
//         date
//       }
//     }
//   }
// `;

import React, { useState, useEffect } from 'react';
import remark from 'remark';
import html from 'remark-html';
import { getPostBySlug, getAllPosts } from '../lib/blog';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FacebookProvider, Like, Comments } from 'react-facebook';

export default function BlogTemplatePost({ content, ...rest }) {
  const route = useRouter();
  const href = `https://www.kysumattien.com${route.asPath.toLowerCase()}`;
  return (
    <>
      <FacebookProvider appId="3364552500258287">
        <article className="post">
          <div className="post-header">
            <h1 className="post-title">{rest.frontmatter.title}</h1>
            <div className="post-info">
              {/* <Author name={rest.frontmatter.author.name} avatar={myAvatar} /> */}
              <time>{rest.frontmatter.date}</time>
            </div>
            <div className="image-wrap">
              <Image
                src={rest.frontmatter.featuredImgUrl}
                alt={rest.frontmatter.featuredImgAlt}
                title={rest.frontmatter.featuredImgAlt}
                layout="responsive"
                width={500}
                height={500}
              />
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <div className="facebook-actions">
            <Like
              showFaces
              size={
                typeof window !== 'undefined' && window.innerWidth > 768
                  ? 'large'
                  : 'small'
              }
              layout={
                typeof window !== 'undefined' && window.innerWidth > 768
                  ? 'standard'
                  : 'button_count'
              }
              showFaces
              share
              href={href}
            />
            <Comments width={'100%'} href={href} />
          </div>
        </article>
      </FacebookProvider>
    </>
  );
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  const markdown = await remark()
    .use(html)
    .process(post.content || '');
  const content = markdown.toString();

  return {
    props: {
      ...post,
      content,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts();

  return {
    paths: posts.map(post => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
