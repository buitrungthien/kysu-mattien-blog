import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const PortFolio = () => (
  <>
    <SEO
      title="Kỹ sư mạt tiền ra đời như thế nào"
      description="Sống là cho đi, kỹ sư mặt tiền muốn giúp các bạn trên bước đường học lập trình web. Vì kiến thức nên đáng được sẻ chia"
      url="https://www.kysumattien.com/portfolio"
    />
    <div className="not-found-article-message" style={{ margin: 'auto' }}>
      <motion.div initial="exit" animate="enter" exit="exit">
        <h3>Nội dung sẽ sớm được cập nhật</h3>
      </motion.div>
    </div>
  </>
);

export default PortFolio;
