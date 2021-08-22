/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FacebookProvider, Like } from 'react-facebook';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Header from '../../components/Header';
import BackToTopButton from '../../components/BackToTopButton';
import styles from './styles.module.scss';
import cs from 'classnames';
import Prism from 'prismjs';
import PrismJSX from 'prismjs/components/prism-jsx';

const sprite = '/images/sprite.svg';
const Layout = ({ children, slug }) => {
  const href = slug ? `https://kysumattien.com/${slug}/`.toLowerCase() : '';

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

    const facebookShareLink = document.querySelector('#facebook > a');
    facebookShareLink.setAttribute(
      'href',
      href
        ? `https://www.facebook.com/sharer/sharer.php?u=${href}`
        : `https://www.facebook.com/sharer/sharer.php?u=kysumattien.com`
    );
    const shareLinkClickHandler = function(e) {
      e.preventDefault();
      windowPopup(this.href, 500, 500);
    };

    facebookShareLink.addEventListener('click', shareLinkClickHandler);
    return () => {
      facebookShareLink.removeEventListener('click', shareLinkClickHandler);
    };
  }, [href]);

  const errorLikeCountList = ['mot-so-loi-thuong-gap-khi-lam-voi-react-hook', 'things-i-wish-i-knew-as-a-fresher', 'miskates-make-memo-and-pure-component-useless', 'things-i-wish-i-knew-as-a-fresher-2', 'what-and-why-http2-part-1', 'what-and-why-http2-part-2', 'the-ultimate-guide-about-useMemo-and-useCallback', 'javascript-module-history', 'javascrip-promise-reject-vs-throw']

  return (
    <div className={styles['layout']}>
      <Header siteTitle='Kỹ sư "mặt tiền"' />
      <aside className={styles['social']}>
        <ul className={styles['social-links-wrap']}>
          {href && !errorLikeCountList.some(errLink => href.includes(errLink)) && (
            <li style={{ marginBottom: 20 }}>
              <FacebookProvider appId="3364552500258287">
                <Like showFaces layout="box_count" href={href} />
              </FacebookProvider>
            </li>
          )}
          <li
            className={cs(styles['social-link'], styles['facebook'])}
            id="facebook"
          >
            <a target="_blank" rel="noopener noreferrer">
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
