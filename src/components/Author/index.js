import React from 'react';
import styles from './styles.module.scss';
import Image from 'next/image';

export default function Author () {

  return (
    <div className={styles["author-info"]}>
      <div className={styles["author-image-wrap"]}>
        <Image src={'/images/my-avatar.jpg'} layout="fixed" width={40} height={40} alt="Thiên Bùi - author of kysumattien" />
      </div>
      <span className={styles["author-name"]}>{'Thiên Bùi'}</span>
    </div>
  );
};