import React, { useEffect } from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
import Author from '../components/Author';
import myAvatar from '../images/my-avatar.jpg';
import SEO from '../components/seo';
import './styles.scss';

export default ({ data, pageContext }) => {
  const post = data.markdownRemark;
  const { previous, next, slug } = pageContext;
  const { author } = post.frontmatter;
  useEffect(() => {
    function windowPopup(url, width, height) {
      // Calculate the position of the popup so
      // it’s centered on the screen.
      const left = window.screen.width / 2 - width / 2,
        top = window.screen.height / 2 - height / 2;

      window.open(
        url,
        '',
        'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=' +
          width +
          ',height=' +
          height +
          ',top=' +
          top +
          ',left=' +
          left
      );
    }

    const facebookShareLink = document.querySelector('.facebook > a');
    facebookShareLink.setAttribute(
      'href',
      `https://www.facebook.com/sharer/sharer.php?u=kysumattien.com${slug}`
    );
    facebookShareLink.addEventListener('click', function(e) {
      e.preventDefault();
      windowPopup(this.href, 500, 500);
    });
  }, [slug]);
  return (
    <Layout>
      <SEO
        title={post.frontmatter?.title}
        description={post.frontmatter?.description}
        image={post.frontmatter?.image}
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
            <Link
              to={previous.fields.slug}
              className="pre-link"
              title={previous.frontmatter.title}
            >
              {previous.frontmatter.title}
            </Link>
          )}
          {next && (
            <Link
              to={next.fields.slug}
              className="next-link"
              title={next.frontmatter.title}
            >
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
        description
        author {
          name
        }
        date
      }
    }
  }
`;
