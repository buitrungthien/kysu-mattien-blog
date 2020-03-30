import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const Header = ({ siteTitle }) => (
  <header className='header'>
    <h1 className='logo'>
      <Link to="/">{siteTitle}</Link>
    </h1>
    <p className='perspective'>Từ Zero đến Hero</p>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
