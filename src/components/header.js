import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Logo from '../images/logo.png';

const Header = ({ siteTitle }) => {
  return (
    <header className="header" id="header">
      <div className="header-inner-wrap">
        <a className="logo-wrap" href="https://www.kysumattien.com">
          <img src={Logo} alt="Kỹ sư mặt tiền - Từ Zero đến Hero" />
          <span>{siteTitle}</span>
        </a>
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
