import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import Logo from '../images/logo.png';

const Header = ({ siteTitle }) => {
  useEffect(() => {
    function scrollFunction() {
      const header = document.getElementById('header');
      const allSpans = header.querySelectorAll('span');
      if (
        document.body.scrollTop > 70 ||
        document.documentElement.scrollTop > 70
      ) {
        header.style.padding = '0.4rem 0';
        allSpans.forEach(span => (span.style.fontSize = '2rem'));
      } else {
        header.style.padding = '1rem 0';
        allSpans.forEach(span => (span.style.fontSize = '2.7rem'));
      }
    }
    window.onscroll = function() {
      scrollFunction();
    };
  }, []);

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
