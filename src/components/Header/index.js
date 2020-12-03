import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';

const logoPath = '/images/logo.png';

const Header = ({ siteTitle }) => {
  return (
    <header className="header" id="header">
      <div className="header-inner-wrap">
        <Link href="/">
          <a className="logo-wrap">
            <img src={logoPath} alt="Kỹ sư mặt tiền - Từ Zero đến Hero" />
            <span>{siteTitle}</span>
          </a>
        </Link>
        <span className="perspective">Từ Zero đến Hero</span>
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
