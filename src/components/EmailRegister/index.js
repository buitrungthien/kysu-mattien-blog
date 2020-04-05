import React, { useRef, useCallback } from 'react';
import addToMailchimp from 'gatsby-plugin-mailchimp';
import './styles.scss';

export default () => {
  const inputEl = useRef(null);
  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    const data = await addToMailchimp(inputEl.current.value);
    if (data.result === 'success') {
      alert('Cảm ơn bạn, đón đọc những bài viết mới nhé');
      inputEl.current.value = null;
    } else {
      alert('Có lỗi xảy ra, vui lòng thử lại');
    }
  });
  return (
    <form className="email-register-form" onSubmit={handleSubmit}>
      <input placeholder="Email của bạn" ref={inputEl} />
      <button>Gửi tôi</button>
    </form>
  );
};
