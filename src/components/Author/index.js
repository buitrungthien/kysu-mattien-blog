import React from 'react';
import './styles.scss';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';

export default () => {
  const avatar = useStaticQuery(graphql`
    query {
      file(name: { regex: "/my-avatar/" }) {
        childImageSharp {
          fixed(height: 40, width: 40) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `);

  return (
    <div className="author-info">
      <div className="author-image-wrap">
        <Image fixed={avatar.file.childImageSharp.fixed} alt="Thiên Bùi" />
      </div>
      <span className="author-name">{'Thiên Bùi'}</span>
    </div>
  );
};
