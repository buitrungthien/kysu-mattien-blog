/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FacebookProvider, Like } from 'react-facebook';

import Header from '../../components/Header';
import BackToTopButton from '../../components/BackToTopButton';
import styles from './styles.module.scss';

const sprite = '/images/sprite.svg';
const Layout = ({ children }) => {
  const [href, setHref] = useState('https://www.kysumattien.com');
  const firstRender = useRef(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHref(
        `https://www.kysumattien.com/${
          window.location.pathname.split('/')[1]
        }/`.toLowerCase()
      );
      firstRender.current
        ? (firstRender.current = false)
        : window.FB && window.FB.XFBML.parse();
    }
  });

  return (
    <div className={styles['layout']}>
      <Header siteTitle="ASD" />
      <aside className={styles["social"]}>
        <ul className={styles["social-links-wrap"]}>
          <li style={{ marginBottom: 20 }}>
            <FacebookProvider appId="3364552500258287">
              <Like showFaces layout="box_count" href={href} />
            </FacebookProvider>
          </li>
          <li className={styles["social-link facebook"]}>
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
          <li className={styles["social-link youtube"]}>
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
      <main className={styles["main"]}>{children}</main>
      <BackToTopButton />
      <footer className={styles["footer"]}>
        <div className={styles["footer__inner"]}>
          <div className={styles["my-contact"]}>
            <a href="https://www.kysumattien.com/portfolio">Dự án tôi đã làm</a>
            <span>Liên hệ: thienbt95@gmail.com</span>
          </div>
          <div className={styles["related-sites-wrap"]}>
            <p>Các trang liên quan: </p>
            <ul className={styles["related-sites"]}>
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
        <div className={styles["footer__copyright"]}>
          © {new Date().getFullYear()}, Built with
          {` love`}
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
