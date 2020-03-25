import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const Header = ({ siteTitle }) => (
  <header className='header'>
    <p className='my-name'>Tony</p>
    <h1>
      <Link to="/">{siteTitle}</Link>
    </h1>
    <p className='perspective'>Chia sẻ kiến thức</p>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
