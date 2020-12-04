import React from 'react';
import { motion } from 'framer-motion';
// import SEO from '../components/seo';

const PortFolio = () => (
  <div className="not-found-article-message" style={{ margin: 'auto' }}>
    <motion.div initial="exit" animate="enter" exit="exit">
      <h3>Nội dung sẽ sớm được cập nhật</h3>
    </motion.div>
  </div>
);

export default PortFolio;
