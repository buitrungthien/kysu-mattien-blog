import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
import Author from '../components/Author';
import myAvatar from '../images/my-avatar.jpg';
import SEO from '../components/seo';
import './styles.scss';

export default ({ data, pageContext }) => {
  const post = data.markdownRemark;
  const { previous, next } = pageContext;
  const { author } = post.frontmatter;
  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={'THIEN TEST SHARE FEATURE'}
        meta={[
          {
            property: `og:image`,
            content:
              'https://cdn.gametv.vn/gtv-photo/GTVNews/2020/01/OG-new-roster.jpg',
          },
        ]}
      />
      <article className="post">
        <div className="post-header">
          <h1 className="post-title">{post.frontmatter.title}</h1>
          <div className="post-info">
            <Author name={author.name} avatar={myAvatar} />
            <time>{post.frontmatter.date}</time>
          </div>
          <div className="image-wrap">
            {post.frontmatter.image && (
              <img src={post.frontmatter.image} alt="" />
            )}
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <div className="pre-next-navigator">
          {previous && (
            <Link to={previous.fields.slug} className="pre-link">
              {previous.frontmatter.title}
            </Link>
          )}
          {next && (
            <Link to={next.fields.slug} className="next-link">
              {next.frontmatter.title}
            </Link>
          )}
        </div>
      </article>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        image
        author {
          name
        }
        date
      }
    }
  }
`;
