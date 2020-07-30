/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

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
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : 'kysumattien.netlify.app'}`}
              target="_blank"
            >
              <svg>
                <use xlinkHref={`${sprite}#icon-facebook`}></use>
              </svg>
            </a>
          </li>
          <li className="social-link youtube">
            <a
              href="https://www.youtube.com/channel/UCp2xF9XfnX1HuCup2B3thcw?view_as=subscriber"
              target="_blank"
              rel="noopener noreferrer"
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
              <a href="portfolio">Dự án tôi đã làm</a>
            </li>
            <li>
              <a href="contact">Liên hệ / Thuê</a>
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
