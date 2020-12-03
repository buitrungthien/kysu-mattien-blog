import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

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
      className={styles["back-to-top-button"]}
      onClick={scrollTop}
      style={{ display: showScroll ? 'flex' : 'none' }}
      title="Lên đầu trang"
    >
      <span>&#8593;</span>
    </button>
  );
};

export default ScrollArrow;
