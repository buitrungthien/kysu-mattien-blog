---
title: 'HTTP/2 khác với HTTP/1.1 như thế nào và nó làm web load nhanh hơn ra sao?'
author: { name: 'Thiên Bùi' }
date: '2020-08-29'
tag: 'tech'
featuredImgUrl: 'https://i.imgur.com/vfzmidh.jpg?1'
featuredImgAlt: 'Series HTTP2 - Phần 1: HTTP/2 khác với HTTP/1.1 như thế nào và nó làm web load nhanh hơn ra sao?'
description: 'Series HTTP/2. Cùng tìm hiểu ảnh hưởng của HTTP/2 đến thế giới web'
---

Xuất phát từ câu hỏi phỏng vấn ở vị trí senior front-end developer:

> Em có biết đến HTTP1, HTTP2? Và nó ảnh hưởng thế nào đến cách bundle code một dự án web?

Sau quá trình tìm đọc, tổng hợp và liên kết các dữ liệu, xin được gửi đến các bạn series **HTTP2 là cái qq gì và nó ảnh hưởng đến lập trình web ra sao?**

Series có 3 phần:

- **Phần 1: HTTP/2 khác với HTTP/1.1 như thế nào và nó làm web load nhanh hơn ra sao?**

- Phần 2: HTTP/2 thay đổi cuộc chơi, cách bundle assets, source code với webpack như thế nào?

- Phần 3: HTTP/2 - Những lầm tưởng và thực tế

Ok, bắt đầu với phần 1 nào.

Bài viết được tham khảo, dịch sang tiếng Việt từ bài gốc: <a href="https://medium.com/@factoryhr/http-2-the-difference-between-http-1-1-benefits-and-how-to-use-it-38094fa0e95b" target="_blank">HTTP/2: the difference between HTTP/1.1, benefits and how to use it</a> - **Tác giả: Factory.hr**

## 1. HTTP là gì?

Nếu bạn đã biết nó là gì thì xin skip qua section này và đọc tiếp section tiếp theo. Ngược lại, hãy tiếp tục nào.

Hypertext Transfer Protocal (HTTP) là một **giao thức truyền dữ liệu** (bluetooth cũng là một giao thức truyền nhận dữ liệu) được dùng phổ biến trong việc truyền nhận dữ liệu trong mạng lưới internet, web app ngày nay.

HTTP dựa trên mô hình Client/Server. Để dễ hình dung thì hãy xem Client và Server là hai chiếc máy tính đặt ở hai nơi khác nhau. **Client** (gửi đi các yêu cầu) và **Server** (cung cấp các dữ liệu khi được yêu cầu). Về cơ bản quá trình truyền nhận này được thực hiện thông qua việc truyền và nhận luân phiên các gói tin **request** và **response** giữa hai máy tính kia.

Để dễ liên tưởng thì hãy hình dung Client là một người khách đi ăn nhà hàng và Server là một người phục vụ. Thực khách (**Client**) gọi món (**gửi request**) đến người phục vụ (**Server**), phục vụ bàn lấy đồ ăn dưới bếp (chính là nơi đặt code web app của bạn ở phía server), và rồi cuối cùng, mang nó lên cho khách hàng thưởng thức.

**Lưu ý:** Để hiểu rõ hơn, các bạn có thể tham khảo thêm một post mình thấy giải thích rất hay và chi tiết về lược sử, cũng như các khái niệm chính của HTTP/1 và HTTP/2 trên Viblo <a href='https://viblo.asia/p/tong-quan-http2-aWj53OEQ56m' target='_blank'>Tổng quan HTTP/2</a>

## 2. Vậy HTTP/2 là gì?

Vào năm 2015, HTTP/2 được chính thức released.

Nói ngắn gọn, HTTP/2 cung cấp một cơ chế cải thiện tốc độ tải trang web, thông qua việc:

- Nén các request headers trước khi gửi.
- Mã nhị phân thay vì text.
- Cơ chế Server Push
- Request multiplexing (ghép kênh) dựa trên một kết nối TCP duy nhất.
- Request pipelining
- HOL blocking (Head-of-line) - Package blocking

## 3. Request multiplexing (ghép kênh)

Một chút về mối tương quan giữa **HTTP** và **TCP** . Thật ra, việc truyền dữ liệu trên mạng lưới internet chính là công việc của giao thức **TCP**. **HTTP** giống như một layer high level của **TCP**.

Từ đó, ta có thể hiểu mỗi khi một request hay response **HTTP** được gửi đi đồng nghĩa với việc một kết nối **TCP** được tạo ra.

HTTP/2 có khả năng gửi **multiple requests** để truyền nhận dữ liệu một cách song song mà chỉ tiêu tốn một TCP connection.

Nếu bạn chưa biết thì đa số browser đều limit số lượng TCP connections đến một server. Như vậy, cũng cùng một số lượng limit đó, mà lại truyền nhận được nhiều hơn thì là một bước tiến đáng kể rồi đúng không nào?

Có thể nói đây chính là yếu tố quan trọng nhất làm nên tên tuổi của HTTP/2 bởi vì điều này cho phép bạn tải source web, hình ảnh, ... **một cách bất đồng bộ** từ server.

Lấy ví dụ như hình dưới

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/hAbH5rY.png' alt="Multiplexing trong HTTP/2 tuyệt vời như thế nào" />
  </div>

  <p class='image-description'>Multiplexing trong HTTP/2 tuyệt vời như thế nào - Hình ảnh: medium.com </p>
</div>

Với HTTP/1.1, 3 kết nối TCP phải được tạo ra để nhận được 3 file (hình ảnh, css, source code javascript). Với HTTP/2, chỉ cần một kết nối TCP là đủ.

Nhìn chung điều này đã giảm đi được tổng thời gian **round trip time** (RTT là thời gian tính từ lúc một request từ phía client được gửi đi cho tới lúc phía client đó nhận được những bit đầu tiên của dữ liệu gửi về, 3 kết nối TCP đồng nghĩa với 3 lần RRT, 1 kết nối TCP tương tự ứng chỉ cần tiêu tốn 1 RTT, tuyệt vời đúng không nào các bạn.).

## 4. Nén Headers

Như bạn đã biết, trong mỗi HTTP request và responsde đều có chứa thông tin **Header**, chứa các thông tin cấu hình nên request đó.

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/LT2RYrf.png' alt="Thông tin Header được đính kèm trong mỗi kết nối HTTP" />
  </div>

  <p class='image-description'>Thông tin Header được đính kèm trong mỗi kết nối HTTP</p>
</div>

Với một web app phức tạp cần truyền và nhận một cơ số lớn số lượng HTTP request, dẫn đến trường thông tin **Header** kia dần dà đóng một vai trò lớn trong khối lượng dữ liệu truyền và nhận.

Nhận thấy điều này, HTTP/2 dùng cơ chế HPACK để nén từng field giá trị của các thông tin header trước khi gửi đến server. Một lần nữa giúp tối ưu hóa tốc độ tải.

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/cNrYhr1.png' alt="HTTP/2 nén header trước khi gửi đi" />
  </div>

  <p class='image-description'>HTTP/2 nén header trước khi gửi đi - Hình ảnh: medium.com</p>
</div>

## 5. Dùng mã nhị phân để chạy các tác vụ (task) thay vì dạng text

Lấy ví dụ một gói tin HTTP được truyền đến, sẽ phải có các tác vụ để bóc tách các gói tin, xử lý, v.v...

Khác với việc HTTP/1.x sử dụng các task commands này dưới dạng text, HTTP/2 dùng các tác vụ này dưới dạng mã nhị phân, bao gồm các chuỗi số 0 và 1 (10001001010001010....).

Bằng cách sử dụng chuỗi mã nhị phân, điều này đã giảm đi tính phức tạp khi đối mặt với các trường hợp phân tích task commands khi có chữ hoa, chữ thường, khoảng trắng, xuống dòng,...

Các trình duyệt sử dụng HTTP/2 sẽ convert các text command sang mã nhị phân trước khi gửi đi.

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/UYWq7k0.png' alt="Task commands dưới dạng mã nhị phân thay vì text" />
  </div>

  <p class='image-description'>HTTP/2 nén header trước khi gửi đi - Hình ảnh: medium.com</p>
</div>

## 6. HTTP/2 Server Push

Chắc hẳn bạn đã quá quen với việc nhìn thấy các thẻ script nằm phía cuối thẻ đóng </body> như bên dưới.

```javascript
<body>
  <script src="Scripts/Generate.js" type="text/javascript"></script>
  <script src="Scripts/Script1.js" type="text/javascript"></script>
  <script src="Scripts/Script2.js" type="text/javascript"></script>
</body>
```

Về cơ bản, khi browser parse code trong file html, code sẽ được đọc từ trên xuống, khi bắt gặp tag **\<script\>**, browser gửi lần lượt các request để nhận về các file script tương ứng.

Với HTTP/2 Server Push thì thông minh hơn. Server có khả năng dự đoán được client sẽ có khả năng cần đến ở tương lai. Ví dụ, nếu client request đến file X, và trong X có reference đến file Y, thì server sẽ quyết định push luôn Y khi trả về X, thay vì đợi browser yêu cầu ở lần tiếp theo.

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/zc37w30.png' alt="HTTP2/ push" />
  </div>

  <p class='image-description'>HTTP/2 push - Hình ảnh: medium.com</p>
</div>

**Lợi ích**:

- Client có thể cache các dữ liệu được pushed này.
- Client cos theer tái sử dụng chúng giữa các page khác nhau.
- Server có thể prioritize pushed resources.
- Dĩ nhiên server gửi kèm thì Client có quyền không nhận hoặc hoàn toàn có khả năng disable Server Push.
- Clent có khả năng limit số lượng các pushed streams diễn ra đồng thời.

Quay lại với ví dụ về thực khách và người phục vụ ban đầu:

Tưởng tượng mỗi người phục vụ là một TCP connection. Thực khách muốn order một dĩa đồ ăn và một chai nước.

Với HTTP/1.1, điều này đồng nghĩa với việc bạn order dĩa đồ ăn với một anh phục vụ, và tiếp tục order chai nước với anh phục vụ khác, tổng cộng là cần 2 anh phục vụ.

Với HTTP/2, bạn order cả dĩa đồ ăn và chai nước cho 1 một anh phục vụ (nhưng anh phục vụ vẫn phải bưng từng món lên). Bằng cách này, chỉ có 1 TCP connection được tạo, vậy là đã dư ra được 1 TCP - hay 1 anh phục vụ cho thực khách khác.

Với Server Push, thì lợi ích sẽ tăng lên như sau:

Tưởng tượng thực khách chỉ order một dĩa thức ăn, anh phục vụ xuống bếp lấy thức ăn, nhưng ảnh cũng nghĩ rằng: "Hmm, có thể thực khách sẽ order cả nước uống, nên mình mang lên luôn". Kết quả là chỉ có 1 TCP connection và một request được tạo. Yeah!

## 7. Ví dụ về sự ưu việt của HTTP/2 Server Push

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/2d3vCJA.png?1' alt="Ví dụ về HTTP2 Server Push" />
  </div>

  <p class='image-description'>Ví dụ về HTTP2 Server Push - Hình ảnh: medium.com</p>
</div>

Giả sử ta có một page html hiển thị 100 hình dấu check nhỏ như hình.

Các bạn để ý tập trung vào **số lượng request**, **thời gian tải**, **protocal column**, **initiator column** và **waterfall diagram** nha.

<span class="problem-label">HTTP/1.1:</span>

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/vX0Hea5.png' alt="Ví dụ ứng với HTTP/1.1" />
  </div>

  <p class='image-description'>Ví dụ ứng với HTTP/1.1 - Hình ảnh: medium.com</p>
</div>

**Number of requests**: 102

**Load time**: 12.97s

**Protocal**: "http/1.1"

**Initiator column**: Client, cứ mỗi lần browser parse code và nhận ra cần 1 image, nó gửi đi request đến server.

**Waterfall diagram**: Bạn có thể thấy có rất nhiều TCP connection được tạo ra (các vạch bao gồm 1 vạch xám nhỏ xíu đầu tiên và các vạch xanh dương nằm dưới - ở mục timeline - dưới các con số 500ms, 1000ms, 1500ms,... Xem hình bên dưới)

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/N9qBzRf.png' alt="Nhiều TCP connections được tạo ra khi sử dụng HTTP/1.1" />
  </div>

  <p class='image-description'>Nhiều TCP connections được tạo ra khi sử dụng HTTP/1.1</p>
</div>

<span class="problem-label">HTTP/2:</span>

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/ng0JC7s.png' alt="Ví dụ ứng với HTTP/2" />
  </div>

  <p class='image-description'>Ví dụ ứng với HTTP/2 - Hình ảnh: medium.com</p>
</div>

**Number of requests**: 102

**Load time**: 11.19s

**Protocal**: "h2" (HTTP/2)

**Initiator column**: Client, cứ mỗi lần browser parse code và nhận ra cần 1 image, nó gửi đi request đến server.

**Waterfall diagram**: Với trường hợp này ta thấy có 2 TCP connection được tạo ra. 1 cho request file html, và 1 cho toàn bộ các images check-icon.

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/b71PUYZ.png' alt="2 TCP connections được tạo ra khi sử dụng HTTP/2" />
  </div>

  <p class='image-description'>2 TCP connections được tạo ra khi sử dụng HTTP/2</p>
</div>

<span class="problem-label">HTTP/2 với Server Push:</span>

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/Hc4NHSZ.png' alt="Ví dụ ứng với HTTP/2 và Server Push" />
  </div>

  <p class='image-description'>Ví dụ ứng với HTTP/2 Server Push - Hình ảnh: medium.com</p>
</div>

**Number of requests**: 102 (102 là số lần browser gửi request, nhưng thật ra số lượng request thật sự tới server chỉ có 1. Vì ở lần đầu tiên, server đã push sẵn, client lưu vào cache, nên 101 lần requesst sau, browser sẽ lấy các hình được lưu ở cache chứ không thật sự tìm tới server để lấy được hình)

**Load time**: 3.17s

**Protocal**: "h2" (HTTP/2)

**Initiator column**: Initiator lần đâu là client, còn lại đều được initiated bởi server, thông qua cơ chế server push (vị chi là chỉ có duy nhất 1 request/response cycle).

**Waterfall diagram**: Ta có thể thấy chỉ có 1 kết nối TCP được tạo. Thật tuyệt vời.

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/CprCDwr.png' alt="Duy nhất 1 TCP connection được tạo ra khi sử dụng HTTP/2 kèm Server Push" />
  </div>

  <p class='image-description'>Duy nhất 1 TCP connection được tạo ra khi sử dụng HTTP/2 kèm Server Push</p>
</div>

## 8. Kết luận

HTTP/2 cung cấp cho chúng ta một chơ chế mới, khắc phục các nhược điểm của HTTP/1.1 và từ đó giảm thời gian load trang, tăng performance cho ứng dụng web.

Tính tới thời điểm này, các website trên thị trường đại đa số đã implement HTTP/2 (thậm chí là HTTP/3) như: news.zing.vn, sendo.vn,...

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/bHgrjVn.png' alt="news.zing.vn sử dụng HTTP/2" />
  </div>

  <p class='image-description'>news.zing.vn sử dụng HTTP/2</p>
</div>

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/9258tze.png' alt="sendo.vn sử dụng HTTP/2" />
  </div>

  <p class='image-description'>sendo.vn sử dụng HTTP/2</p>
</div>

Tuy nhiên, việc sử dụng HTTP/2 đồng nghĩa với việc chúng ta cần cân nhắc cách phân chia source code, cách bundle các file assets như images. Và đó sẽ là chủ đề của <a href="https://www.kysumattien.com/what-and-why-http2-part-2" rel="noopener noreferrer" target="_blank">**Phần 2: HTTP/2 thay đổi cuộc chơi, cách bundle assets, cách bundle với webpack như thế nào?**</a>

Các bạn nhớ đón đọc nhé. Mến chào các bạn!