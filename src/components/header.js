import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Logo from '../images/logo.png';

const Header = ({ siteTitle }) => (
  <header className="header">
    <div className="header-inner-wrap">
      <Link className="logo-wrap" to="/">
        <img src={Logo} alt="Kỹ sư mặt tiền - Từ Zero đến Hero" />
        <span>{siteTitle}</span>
      </Link>
      <p className="perspective">Từ Zero đến Hero</p>
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
