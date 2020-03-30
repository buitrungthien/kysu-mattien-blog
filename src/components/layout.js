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
import sprite from '../images/sprite.svg';

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
      <aside className="social">
        <ul className="social-links-wrap">
          <li className="social-link facebook">
            <a href="https://www.facebook.com/bui.t.thien.37" target="_blank" rel="noopener noreferrer">
              <svg>
                <use xlinkHref={`${sprite}#icon-facebook`}></use>
              </svg>
            </a>
          </li>
          <li className="social-link youtube">
            <a
              href="https://www.youtube.com/channel/UCp2xF9XfnX1HuCup2B3thcw?view_as=subscriber"
              target="_blank" rel="noopener noreferrer"
            >
              <svg>
                <use xlinkHref={`${sprite}#icon-youtube`}></use>
              </svg>
            </a>
          </li>
        </ul>
      </aside>
      <main className="main">{children}</main>
      <footer className="footer">
        <nav>
          <ul>
            <li>
              <Link to="about">Về tôi</Link>
            </li>
            <li>
              <Link to="contact">Dự án tôi đã làm</Link>
            </li>
            <li>
              <Link to="contact">Liên hệ / Thuê</Link>
            </li>
          </ul>
        </nav>
        <span>
          © {new Date().getFullYear()}, Built with
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
