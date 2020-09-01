import React, { useEffect, useState } from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
import Author from '../components/Author';
import myAvatar from '../images/my-avatar.jpg';
import SEO from '../components/seo';
import './styles.scss';
import Image from 'gatsby-image';
import { FacebookProvider, Comments, Like } from 'react-facebook';

export default ({ data, pageContext }) => {
  const post = data.markdownRemark;
  const { previous, next, slug } = pageContext;
  const { author } = post.frontmatter;
  const [href, setHref] = useState('');

  useEffect(() => {
    setHref(`https://www.kysumattien.com${slug}`);
  });

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
        image={post.frontmatter?.featuredImgUrl}
      />
      <article className="post">
        <FacebookProvider appId="3364552500258287">
          <div className="post-header">
            <h1 className="post-title">{post.frontmatter.title}</h1>
            <div className="post-info">
              <Author name={author.name} avatar={myAvatar} />
              <time>{post.frontmatter.date}</time>
            </div>
            <div className="image-wrap">
              <Image
                fluid={post.featuredImg.childImageSharp.fluid}
                alt={post.frontmatter.featuredImgAlt}
                title={post.frontmatter.featuredImgAlt}
              />
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
          <div className="facebook-actions">
            <Like
              showFaces
              size="large"
              layout={
                typeof window !== 'undefined' && window.innerWidth < 768
                  ? 'button'
                  : 'standard'
              }
              showFaces
              share
              href={href}
            />
            <Comments width={'100%'} href={href} />
          </div>
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
        </FacebookProvider>
      </article>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      featuredImg {
        childImageSharp {
          fluid(maxWidth: 820) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      frontmatter {
        title
        featuredImgAlt
        featuredImgUrl
        description
        author {
          name
        }
        date
      }
    }
  }
`;
