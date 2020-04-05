import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import avatar from '../images/profile_avatar.jpg';

const SecondPage = () => (
  <Layout>
    <SEO title="About me and this blog" />
    <article className="post">
      <h1>Tôi bắt đầu từ con số 0. Bạn có vậy không?</h1>
      <main>
        <section>
          <h2>Tôi là Tony</h2>
          <div className="avatar-wrap">
            <img src={avatar} alt="" />
          </div>
          <p>
            Xuất phát là kỹ sư phần cứng, chuyên ngành thiết kế vi mạch, sau một
            năm đi làm tôi đã quyết định chuyển ngành. Tôi đã bắt đầu học lập
            trình web từ con số 0.
          </p>
          <p>
            Đôi dòng tự sự với các bạn, phải nói rằng khoảng thời gian này vô
            cùng khó khăn, khi mà mọi thứ đều mới, nghỉ việc không có tiền, phải
            vay mượn sống qua ngày. "HTML là gì? CSS là sao ta? Ủa sao nhiều thứ
            học quá vậy? Web chạy thế nào? Từ từ anh ơi em mới học được tí JS à,
            anh nói em học VueJS là sao? Vue là cái gì vậy anh? Bạn em làm web
            nó khuyên học React. Thế túm lại là sao?"
          </p>
          <p>
            "Anh xin lỗi nhưng hiện tại anh đang thích tuyển mấy bạn thực tập
            trẻ trẻ chứ cỡ em già quá". "Chỗ anh tuyển phải biết fullstack em
            ơi, em biết SQL không? .NET thì sao?" Vân vân và mây mây.
          </p>
        </section>
        <section>
          <h2>Sống là cho đi</h2>
          <p>
            Đã trải qua giai đoạn khó khăn nhất. Tôi thực sự hiểu rõ những trăn
            trở, khó khăn mà các bạn mới mắc phải. Để tôi đoán xem:
            <ul>
              <li>
                HTML, CSS, JS nhiều và rộng lớn quá, không biết học gì, bắt đầu
                như thế nào.
              </li>
              <li>
                Đang học cái này, nghe các anh, các bạn khác nói về mấy thứ công
                nghệ lạ tai không hiểu mô tê gì, cảm thấy kém cỏi.
              </li>
              <li>Dường như mình là đứa duy nhất không biết code.</li>
              <li>
                Tiếng anh kém quá, đọc tài liệu, xem video trên udemy không
                hiểu. Một video coi mấy tiếng chưa xong.
              </li>
              <li>
                Sao lời khuyên mỗi người cho một kiểu thế này, rồi ruốt cuộc làm
                thế nào mới nhanh có việc?
              </li>
              <li>...</li>
            </ul>
          </p>
          <p>
            Tôi muốn giúp bạn, để con đường đến với lập trình web của các bạn
            {' '}<b>bớt chông gai, không lặp lại những sai lầm tôi đã mắc phải</b>.
            Tôi lập ra blog này nhằm chia sẻ mọi thứ mà tôi biết. Từ{' '}
            <b>kinh nghiệm học</b>, <b>kinh nghiệm học tiếng Anh</b>, {' '}
            <b>kinh nghiệm đi phỏng vấn</b>, <b>kinh nghiệm đi làm</b>,{' '}
            <b>ứng xử</b>, <b>quy trình trong môi trường công sở</b>. Xen kẽ với
            đó là các bài viết về <b>Technical</b> {' '}
            từ cơ bản đến chuyên sâu về <b>HTML</b>, <b>CSS</b>, <b>ReactJS</b>,
            các <b>bài viết dịch thuật</b>, ... mọi thứ mà tôi biết và nghĩ là
            có thể giúp được mọi người.
          </p>
          <p>
            Đen Vâu nói (hát): "Đời có qua có lại thì mới toại lòng nhau. Người
            ta cho mình quá nhiều, mình thì cho cái mẹ gì đâu?".
          </p>
          <p></p>
        </section>
        <section>
          <h2>Cảm ơn</h2>
          <p>
            Tôi không thể nào hình dung nổi sẽ có một ngày tôi có thể tự tạo cho
            mình một blog, làm những thứ đẹp đẽ và thú vị như thế này. Xin chân
            thành tỏ lòng biết ơn đến:
            <ul>
              <li>
                Anh Hoàn superman: người anh senior với kiến thức sâu rộng,
                người đã chỉ bảo và truyền tinh thần 'Dám cho đi' của anh đến
                với mọi người.
              </li>
              <li>
                Bạn Nghiệp: người thầy, người bạn đã hướng dẫn tôi trong những
                bước đầu tiên trên con đường lập trình web.
              </li>
              <li>
                Bạn Thương: cảm ơn man vì đã bán rẻ con laptop Thinkpad này cho
                tao :)). Cảm ơn vì đã bỏ công sức kiếm dự án freelance đầu tay
                cho tao. Cảm ơn man đã dạy cho tao nhiều điều khác biệt giữa lý
                thuyết và thực tế, về mindset làm việc khi bước vào thế giới
                freelance.
              </li>
              <li>
                Bạn Tiến Bùi: người đã cho vay 2tr mua cái điện thoại mới trong
                lúc khốn cùng không còn một xu dính túi.
              </li>
              <li>
                Cảm ơn Sang, không có mày thì 5 tháng thất nghiệp không biết lấy
                tiền đâu ra trả tiền nhà.
              </li>
              <li>
                Cảm ơn Phát, Xít, anh chị em, bạn bè, những người tôi không thể
                kể hết đến.
              </li>
              <li>
                Cảm ơn em đã luôn tin tưởng và đồng hành cùng anh trong lúc khó
                khăn nhất.
              </li>
              <li>Cảm ơn các bạn đã ghé đọc blog này</li>
            </ul>
          </p>
        </section>
      </main>
      <Link to="/" style={{ fontSize: '1.8rem' }}>
        Trang chủ
      </Link>
    </article>
  </Layout>
);

export default SecondPage;
