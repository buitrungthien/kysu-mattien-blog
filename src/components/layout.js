/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import { Link } from 'gatsby';
import { FacebookProvider, Like } from 'react-facebook';

import Header from './header';
import '../scss/main.scss';
import BackToTopButton from './BackToTopButton';
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
          <li style={{ marginBottom: 20 }}>
            <FacebookProvider appId="3364552500258287" await>
              <Like
                showFaces
                layout="box_count"
                href={
                  typeof window !== 'undefined'
                    ? window.location.href
                    : 'https://www.kysumattien.com'
                }
              />
            </FacebookProvider>
          </li>
          <li className="social-link facebook">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${
                typeof window !== 'undefined'
                  ? window.location.href
                  : 'kysumattien.com'
              }`}
              target="_blank"
              rel="noopener noreferrer"
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
      <BackToTopButton />
      <footer className="footer">
        <div className="footer__inner">
          <div className="my-contact">
            <Link to="/portfolio">Dự án tôi đã làm</Link>
            <span>Liên hệ: thienbt95@gmail.com</span>
          </div>
          <div className="related-sites-wrap">
            <p>Các trang liên quan: </p>
            <ul className="related-sites">
              <li>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.youtube.com/channel/UCxRgDi15EJsB2ayyP-eg3Tg"
                >
                  nghiepuit
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://www.toidicodedao.com"
                  rel="noreferrer"
                >
                  toidicodedao.com
                </a>
              </li>
              <li>
                <a target="_blank" href="https://niviki.com/" rel="noreferrer">
                  niviki.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__copyright">
          © {new Date().getFullYear()}, Built with
          {` love`}
        </div>
      </footer>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
