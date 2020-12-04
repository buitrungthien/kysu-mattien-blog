/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FacebookProvider, Like } from 'react-facebook';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Header from '../../components/Header';
import BackToTopButton from '../../components/BackToTopButton';
import styles from './styles.module.scss';
import cs from 'classnames';

const sprite = '/images/sprite.svg';
const Layout = ({ children }) => {
  const route = useRouter();
  
  const href = `https://www.kysumattien.com${route.asPath.toLowerCase()}`;

  return (
    <div className={styles['layout']}>
      <Header siteTitle='Kỹ sư "mặt tiền"' />
      <aside className={styles['social']}>
        <ul className={styles['social-links-wrap']}>
          <li style={{ marginBottom: 20 }}>
            <FacebookProvider appId="3364552500258287">
              <Like showFaces layout="box_count" href={href} />
            </FacebookProvider>
          </li>
          <li className={cs(styles['social-link'], styles['facebook'])}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg>
                <use xlinkHref={`${sprite}#icon-facebook`}></use>
              </svg>
            </a>
          </li>
          <li className={cs(styles['social-link'], styles['youtube'])}>
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
      <main className={styles['main']}>{children}</main>
      <BackToTopButton />
      <footer className={styles['footer']}>
        <div className={styles['footer__inner']}>
          <div className={styles['my-contact']}>
            <Link href="/portfolio">
              <a>Dự án tôi đã làm</a>
            </Link>
            <span>Liên hệ: thienbt95@gmail.com</span>
          </div>
          <div className={styles['related-sites-wrap']}>
            <p>Các trang liên quan: </p>
            <ul className={styles['related-sites']}>
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
        <div className={styles['footer__copyright']}>
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
