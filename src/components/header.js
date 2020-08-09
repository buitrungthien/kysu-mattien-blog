import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import Logo from '../images/logo.png';

const Header = ({ siteTitle }) => {
  return (
    <header className="header" id="header">
      <div className="header-inner-wrap">
        <Link className="logo-wrap" to="/">
          <img src={Logo} alt="Kỹ sư mặt tiền - Từ Zero đến Hero" />
          <span>{siteTitle}</span>
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
