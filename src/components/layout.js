/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql, Link } from 'gatsby';

import Header from './header';
import '../scss/main.scss';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <aside className='social'>
        <ul className="social-links-wrap">
          <li className="social-link"></li>
          <li className="social-link"></li>
        </ul>
      </aside>
      <main className='main'>{children}</main>
      <footer className='footer'>
        <nav>
          <ul>
            <li><Link to='about'>Về tôi</Link></li>
            <li><Link to='contact'>Liên hệ</Link></li>
          </ul>
        </nav>
        <span>© {new Date().getFullYear()}, Built with
        {` love`}
        </span>
      </footer>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
