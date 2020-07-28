---
title: 'ReactJs và Declarative Programming'
date: '26/07/2020'
author: {name: 'Thiên Bùi'}
tag: 'exp'
image: 'https://wordsofayoungmind.files.wordpress.com/2015/02/i-want-to.jpg'
---
> Em nói em thích làm với React và muốn được thực tập ở vị trí ReactJS Developer. Vậy tại sao em thích nó? Nó hay ở chỗ nào mà em, và thậm chí là rất nhiều người, công ty đang yêu thích và sử dụng React?

Mình nghĩ thầm trong bụng: 
> Dạ tại em mới học làm web, lên mạng ‘gô gồ’ thấy React đang hot, lương cao, việc nhiều, … Chứ em mới học, có biết gì đâu anh ơi :D.

Nghĩ là vậy thôi, chứ trả lời nó phải ra ngô ra khoai để người ta còn nhận mình chứ vầy thì tạch mất.

> Dạ, React nó sử dụng DOM ảo, nó nhanh, không có làm với DOM thuần, nó “học một lần, viết tùm lum” (Learn Oce, Write Anywhere), chia nhỏ theo cấu trúc Component (Component-Based) và viết code theo hướng Declarative giúp dễ đọc, dễ hiểu.

> Ừm, ok, vậy cho anh biết viết code declarative hay declarative programming là gì mà nó được xem như là một điểm mạnh của React em ha?
Vâng, tới đây thì mình chính thức tịt ngòi :D

Mến chào các bạn đã đến với blog “kỹ sự mặt tiền” ngày hôm nay. Câu chuyện trên là thật, và nó là cuộc phỏng vấn của mình vào những ngày đầu học lập trình web. Nhớ không lầm đó là thời điểm 3 tháng sau khi tập tò học lập trình web và phỏng vấn đi xin việc ở vị trí thực tập tại một công ty nọ. Và mình đã được học ngay những bài học đầu tiên - the hard way. Mình đã tạch các bạn ạ, tạch ngay từ thời điểm đi xin thực tập.

Thực chất để một người mới học, mới tìm hiểu lập trình nắm và hiểu được các định nghĩa, khái niệm, ‘terms’ như thế này khá là khó các bạn ạ. Nhưng biết sao được, có rất nhiều người đang theo học web ngày nay, đồng nghĩa với việc cạnh tranh là điều khó tránh khỏi. Hơn nữa, thay vì lấy lý do mới học nên không tìm hiểu, cố gắng mỗi ngày luôn là cách để chúng ta phát triển phải không nào? Bên cạnh việc làm được việc, có hiểu biết sâu và rộng về technical cũng là một điểm mạnh khiến bạn lọt vào mắt xanh nhà tuyển dụng. Mách bạn một tip nhỏ thì chính những kiến thức như thế này sẽ là tiêu chí để các anh senior phân loại ứng viên đấy.

Mình xuất thân từ kỹ sư phần cứng, sau một năm đi làm mình chuyển ngành và thành thật mà nói là mình không hề biết gì về web, về JS hay thậm chí là web chạy như thế nào. Có chăng là tí kiến thức lập trình đại cương lúc học 2 năm đầu đại học. Nếu bạn cũng là một người tự mày mò học web, hẳn bạn cũng đã trải qua cảm giác như mình: rằng có quá nhiều thứ để học, tỉ tỉ thứ chưa biết :D, chưa học hết JS căn bản đã phải lao vào ngay React. Nào là DOM ảo, (DOM thật là gì lúc đó mình còn chưa biết nói chi đến DOM ảo, hè hè), rồi vô vàn thứ mới lạ khác.

Mình tin rằng phần lớn đa số những người mới sẽ luôn phải đối mặt với các vấn đề khó khăn như thế, vì chính mình đã trải qua. Với loạt bài viết trên trang blog này, mình hy vọng giúp ích được phần nào cho các bạn mới và đặc biệt cũng rất mong những ý kiến đánh giá, nhận xét của các bạn để mình hoàn thiện hơn, để chúng ta cùng nhau phát triển.

Vào chủ để chính thôi, Declrative programming chính là yếu tố đầu tiên mà đội ngũ phát triển ReactJS tự hào xem như là điểm mạnh của bản thân library này, và nó được show ngay ở trang chủ của React: