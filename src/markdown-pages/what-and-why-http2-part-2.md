---
title: 'HTTP/2 thay đổi cuộc chơi, cách bundle assets, source code như thế nào?'
author: { name: 'Thiên Bùi' }
date: '2020-09-02'
tag: 'tech'
featuredImgUrl: 'https://i.imgur.com/x6XgIcH.jpg?2'
featuredImgAlt: 'HTTP/2 thay đổi cuộc chơi, cách bundle assets, source code như thế nào?'
description: 'HTTP/2 thay đổi cuộc chơi, cách bundle assets, source code như thế nào?'
---

Với phần 1 đã giới thiệu sơ lược về <a href="https://www.kysumattien.com/what-and-why-http2-part-1" rel="noopener noreferrer" target="_blank" >**HTTP/2 là gì và nó giúp web load nhanh hơn ra sao?**</a>. Hôm nay mình sẽ cùng các bạn đi tiếp phần 2 với chủ đề: **HTTP/2 thay đổi cuộc chơi, cách bundle assets, source code như thế nào?**

## 1. HTTP thay đổi cuộc chơi

Mặc dù HTTP2 có tính **tương thích ngược** (backward-compatible) với HTTP/1.1. Rằng nếu browser của user không hỗ trợ HTTP/2, thì mọi thứ sẽ quay trở về với HTTP/1.1 như bình thường, web vẫn chạy ok. (Tính tới thời điểm hiện tại khi viết bài này, thì đại đa số người dùng internet đều đang sử dụng các trình duyệt hiện đại và đã support HTTP/2).

Khi bước chân vào thế giới HTTP/2, có những thứ được xem là **best practices**, **tối ưu performance cho web** được xài ở HTTP/1.1 sẽ không còn đúng với HTTP/2, thậm chí còn bị đảo ngược. Nói cách khác, các best practices lúc trước kia (HTTP/1.1) bỗng dưng khiến web chạy chậm hơn khi so với website được optimized với HTTP2.

Với phần còn lại của blog này, chúng ta sẽ cùng nhìn lại và đánh giá các best practices một thời - bỗng nhiên trở thành anti-patterns khi dùng với HTTP/2.

## 2. Kỹ thuật ghép nhiều hình nhỏ thành file sprites

<span class="problem-label">HTTP/1.1</span>

Bình thường khi hoạt động, một web page với 100 hình ảnh hoặc icon nhỏ tách rời sẽ đồng nghĩa với việc browser phát sinh 100 lần gọi HTTP đến server để lấy được các hình ảnh, icon đó.

Như đã phân tích ở <a href="https://www.kysumattien.com/what-and-why-http2-part-1" rel="noopener noreferrer" target="_blank">phần 1</a>, đối với HTTP/1.1, càng nhiều HTTP request đồng nghĩa với thời gian load trang web càng lâu, gây hao tổn performance.

Thậm chí, nếu ta vô tình làm chức năng hover vào một icon thì hiện ra hình khác bằng cách:

```css
.star-icon {
  background: url('/src/images/red-star.png');
}

.star-icon:hover {
  background: url('/src/images/white-star.png');
}
```

Thì sẽ bị trường hợp khi hover vào icon trên, icon **red-star** đột nhiên biến mất, background không còn hình, và một lát sau mới xuất hiện icon **white-star** mới xuất hiện. Khoảng thời gian **biến mất** kia chính là khoảng thời gian browser đang gọi HTTP request để load **white-star**. Một trải nghiệm không dễ chịu đúng không nào các bạn.

Lúc này **image sprites** xuất hiện, và được xem là **best practice** suốt một thời gian dài.

Dành cho bạn nào chưa biết, thì **image sprites** là một kỹ thuật ghép nối các hình, icon nhỏ của một page thành một tấm hình lớn. 100 tấm hình nhỏ cho vào một tấm hình lớn, dẫn đến browser chỉ cần load một file với một lần gọi HTTP duy nhất, hệ quả là giảm được thời gian chờ gọi các HTTP request, giúp web load nhanh hơn. Tấm hình lớn này còn được cached lại bởi browser, nên hoàn toàn có thể tái sử dụng ở các page khác (hoặc dùng với trường hợp **hover** như ví dụ trên) mà không tốn thời gian chờ tải. Cuối cùng, để chọn và xài được một hình, icon cụ thể trong file sprite tổng đó, chúng ta sẽ sử dụng css position.

Ví dụ:

```css
.star-icon {
  background: url('/src/images/icon-sprites.png') 0 0;
}

.star-icon:hover {
  background: url('/src/images/icon-sprites.png') -45px -45px;
}
```

Kỹ thuật này có được đề cập đến ở developer.mozilla

>Image sprites are used in numerous web apps where multiple images are used. Rather than include each image as a separate image file, it is much more memory- and bandwidth-friendly to send them as a single image; using background position as a way to distinguish between individual images in the same image file, so the number of HTTP requests is reduced - Trích developer.mozilla

Bạn có thể kiểm chứng về kỹ thuật này bằng cách mở một tab brwoser mới, gõ goole.com, bật F12, chọn tab Network và tích chọn Img, bạn sẽ thấy google đang sử dụng một file sprite để lưu nhiều icon nhỏ thành một tấm hình lớn duy nhất như hình dưới.

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/CgWpNbV.png' alt="Google sử dụng sprite images" />
  </div>

  <p class='image-description'>Google sử dụng sprite images</p>
</div>

<span class="solution-label">HTTP/2</span>

Nhược điểm của phương pháp sprite trên là khi user chỉ đứng ở một page mà vốn dĩ page đó chỉ cần một icon image, nhưng vẫn phải load một file sprites lớn, chứa nhiều images con kia -> tốn performance không cần thiết.

Ở <a href="https://www.kysumattien.com/what-and-why-http2-part-1" rel="noopener noreferrer" target="_blank">phần 1</a> chúng ta đã biết HTTP/2 sử dụng cơ chế ghép kênh (**multiplexing**) để thực hiện việc gọi nhiều HTTP request chạy song song, bất đồng bộ với chỉ một TCP connection duy nhất, nên việc gửi request để nhận nhiều tấm hình riêng lẻ kia đã không còn là vấn đề nữa.

Vô tình việc load hình ảnh, icon riêng lẻ lại trở nên **tốt hơn**, web page chỉ cần load số lượng hình ảnh, icon tương ứng tùy theo page mà user đang đứng.

## 3. Data URLs nói chung và Inline images (dạng base64) nói riêng

<span class="problem-label">HTTP/1.1</span>

Data URLs cung cấp cho chúng ta khả năng **nhúng trực tiếp**, **inine** các file **nhỏ** vào document.

Data URL có format:

```js
data:[<mime type>][;charset=<charset>][;base64],<encoded data>
```

Một trường hợp cụ thể thường được dùng với Data URLs là nhúng trực tiếp hình ảnh dưới dạng base 64, thay vì load hình ảnh bằng link như bình thường.

Với CSS, nó sẽ là:

```css
li {
  background:
    url(data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7)
    no-repeat
    left center;
  padding: 5px 0 5px 25px;
}
```

Với HTML:

```html
<img src="data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7" alt="star" width="16" height="16" />
```

Hiểu nôm na thì với kiểu nhúng image base64 như thế này, bức ảnh đó đã được convert thành một **biến**, một **chuỗi** dài, **nằm ngay trong source code css hoặc js**. Việc nó là một chuỗi dài và nằm sẵn trong source code giúp hình ảnh được hiển thị ngay lập tức khi browser vừa vẽ cây DOM, thay vì phải tốn 1 HTTP request gọi đến server để load hình về.

Kỹ thuật này thường được áp dụng cho các **image placeholders** có kích thước nhỏ. Một ví dụ điển hình là các banner ở các trang chủ, khi vừa vào và load web, sẽ có một placeholder hiện ra trong lúc chờ HTTP request để lấy hình banner thật sự, bản thân placeholder này thường được nhúng dưới dạng base64 ( vì nếu gắn vào attribute **src** của thẻ \<img> thì lại phải tốn HTTP request để gọi, trong lúc gọi người dùng sẽ thấy nền trắng, không thấy được hình placeholder, khiến nó mất đi ý nghĩa của placeholder ban đầu).

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/eSimKBp.png' alt="Placeholder của banner Sendo" />
  </div>

  <p class='image-description'>Placeholder của banner Sendo</p>
</div>

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/9cBI2bu.png' alt="Hình ảnh thật sau khi được load xong" />
  </div>

  <p class='image-description'>Hình ảnh thật sau khi được load xong</p>
</div>

<span class="solution-label">HTTP/2</span>

Webpack, bundler nổi tiếng có hẳn config cho việc này với **url-loader**, giúp chuyển assets thành inline bất kể khi nào asset có kích thước nhỏ hơn limit size mà chúng ta quy định.

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/yw1Nvs3.png' alt="Webpack có url-loader" />
  </div>

  <p class='image-description'>Webpack có url-loader</p>
</div>

<span class="solution-label">HTTP/2</span>

Ngoại trừ lợi dụng việc hình ảnh được load trực tiếp vào source code để làm placeholder, thì với HTTP/2, kỹ thuật này nên hạn chế, tránh dùng nhiều.

Vì suy cho cùng, kỹ thuật này nhắm tránh việc gọi nhiều HTTP request cho các hình ảnh có kích thước nhỏ, thay vào đó chúng được nhúng trực tiếp.

Nhưng ngược lại, việc convert hình ảnh thành một chuỗi text dài đằng đẵng và nhúng trực tiếp vào source code như thế này sẽ khiến cho css style sheet bị phình ra.

Một lần nữa, với HTTP/2, các HTTP request đã trở nên nhẹ nhàng và **cheap** hơn rất nhiều so với HTTP/1.1, **best practice Data URLs** đã không còn đúng trong thể giới HTTP/2.

## 4. Ghép nối, bundle các file css và javascript

<span class="problem-label">HTTP/1.1</span>

Bước cuối cùng trong mỗi build process, chúng ta thường sẽ **nối**, **bundle** các file nhỏ CSS và JavaScript lại với nhau (ngày nay chúng ta dùng webpack hay các bundler khác để làm việc này, thay vì làm tay). Các file source code thường được tách rời và implement riêng biệt xuyên suốt quá trình phát triển, để dễ đọc và dễ maintain, nhưng chúng ta cũng biết rằng việc gửi một file duy nhất hoặc ít nhất limit số lượng file gửi đến brwoser sẽ tốt cho performance web rất nhiều.

Một lần nữa, trong thế giới HTTP/1.1, chúng ta đang cố gắng **limit số lượng HTTP request**.

<span class="solution-label">HTTP/2</span>

Làm cách trên, nếu một người dùng truy cập vào trang web của chúng ta, có khả năng sẽ download tất cả các dữ liệu CSS và JavaScript cho cả trang, ngay cả khi họ có thể không cần đến nó (ví dụ chưa click xem các mục liên quan trong page, vừa vào trang landing xem được 1, 2s và thoát ngay). Again vì mọi thứ đã được **nối**, **bundle** thành một file duy nhất.

Một cách workaround khá phổ biến với vấn đề trên mà các developer thường hay làm là cẩn thận chọn ra những file, nằm trong khu vực mà người dùng có khả năng sẽ nhìn thấy đầu tiên để gửi về. Kỹ thuật này gọi là lazy-load, vốn cũng rất khó và tốn công sức để implement.

Một vấn đề nữa với việc kết nối, bundle các file nhỏ như trên đó là dễ dàng đánh mất đi lợi ích của cơ chế cache file có trong browser. Vì mọi thứ đã được bundle thành một file, chỉ cần source code đầu server change một dòng CSS, toàn bộ file bundle cũng sẽ bị load lại (vì browser nhận thấy **nguyên file** đã thay đổi).

Một lần nữa, **HTTP request rất cheap trong thế giới HTTP/2**. Bạn sẽ thoải mái hơn trong việc lưu và gửi về browser hàng tá file css nhỏ, nó không còn là vấn đề như HTTP/1.1. Ngoài ra, nhờ việc tách nhỏ như vậy, chúng ta sẽ tận dụng tối đa lợi ích từ việc cache file của browser. Giờ đây, browser sẽ chỉ re-download những file thực sự change, tránh được trường hợp re-download cả một file lớn chỉ vì thay đổi một line css như trên.

## 6. Kết luận

Như vậy là mình đã cùng các bạn điểm qua một số kỹ thuật bundle web, được xem là **best practices** trong một thời gian dài.

Tuy nhiên, kể từ khi chyển mình sang HTTP/2, các kỹ thuật trên dường như không còn đúng nữa, mà ngược lại còn khiến performance tệ hơn.

Hmm, cũng không thực chất tệ và tránh khỏi các practices này như vậy đâu. Cụ thể, ở phần 3 - phần cuối cùng sắp tới, mình sẽ nói về **HTTP/2 và các lầm tưởng**, các bạn nhớ đón đọc nha.

Các bạn có biết kỹ thuật nào khác hay ho thì hãy comment phía dưới để chia sẻ với mọi người nha. Thấy bài viết hay thì cho mình một like và một share để ủng hộ mình nhé. Mến chào các bạn!

## 7. Nguồn và bài viết hay liên quan

<a href="https://www.smashingmagazine.com/2016/02/getting-ready-for-http2/#what-do-we-need-to-change-to-embrace-http2" target="_blank" rel="noopener noreferrer">Getting Ready For HTTP2: A Guide For Web Designers And Developers</a> - Rachel Andrew

<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs" target="_blank" rel="noopener noreferrer">Data URLs</a> - developer.mozilla