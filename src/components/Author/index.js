import React from 'react';
import './styles.scss';

export default ({ avatar, name }) => {
  return (
    <div className="author-info">
      <div className="author-image-wrap">
        <img src={avatar} alt="" />
      </div>
      <span className="author-name">
        {name || 'Thiên Bùi'}
      </span>
    </div>
  );
};
