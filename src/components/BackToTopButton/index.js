import React, { useState, useEffect, useCallback } from 'react';
import styles from './styles.scss';

const ScrollArrow = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  });

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      console.log(showScroll);
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className="back-to-top-button"
      onClick={scrollTop}
      style={{ display: showScroll ? 'flex' : 'none' }}
      title="Lên đầu trang"
    >
      <span>^</span>
    </button>
  );
};

export default ScrollArrow;
