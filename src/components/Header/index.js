import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';
import styles from './styles.module.scss';

const logoPath = '/images/logo.png';

const Header = ({ siteTitle }) => {
  return (
    <header className={styles['header']} id="header">
      <div className={styles['header-inner-wrap']}>
        <Link href="/">
          <a className={styles['logo-wrap']}>
            <img src={logoPath} alt="Kỹ sư mặt tiền - Từ Zero đến Hero" />
            <span>{siteTitle}</span>
          </a>
        </Link>
        <span className={styles['perspective']}>Từ Zero đến Hero</span>
      </div>
    </header>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
