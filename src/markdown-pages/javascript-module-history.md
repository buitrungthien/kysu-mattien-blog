---
title: 'Javascript module, import, export, dễ ẹc, ai mà chả biết'
date: '2020-09-22'
author: { name: 'Thiên Bùi' }
tag: 'tech'
featuredImgUrl: 'https://i.imgur.com/4KpMlZ4.jpg?1'
featuredImgAlt: 'Javascript module, import, export, dễ ẹc, ai mà chả biết'
description: 'Để có được module hay cú pháp import, export dùng trong javascript như ngày nay, bản thân ngôn ngữ này đã trải qua một quá trình dài và chông gai, bài viết hôm nay chúng ta cùng tìm hiểu nhé!'
---

Xuyên suốt quá trình học và làm việc với các dự án web, chắc hẳn chúng ta đã quá quen với cú pháp **import** và **export** trong javascript, sử dụng nó một cách thuần thục (hoặc chưa), và mặc định đây là điều hiển nhiên trong thế giới javascript.

Nhưng mấy ai biết được rằng, để có được những **import**, **export** kia, bản thân javascript đã phải nỗ lực không ngừng **tiến hóa** mới có khái niệm **module** tiện dụng như thế này cho anh em chúng ta dùng.

Bài viết hôm nay mình sẽ cùng các bạn đi qua khái niệm **module** (đọc là "mo dzù ồl nha các bạn :D) trong JavaCript. Module là gì, tại sao module quan trọng, quá trình hình thành của javascript module và nhiều vấn đề hay ho khác.

Trong bài viết đôi chỗ sẽ có những khái niệm, diễn giải khá hàn lâm nhưng chỉ cần chúng ta chịu khó đọc chậm và suy nghĩ kỹ càng thì sẽ nắm bắt được ý đồ đang diễn giải. Chúc các bạn gặt hái được nhiều kiến thức bổ ích nhé. Chúng ta bắt đầu thôi.

## 1. Module là gì?

**Một module là một tập hợp, một gói, một packet, chứa data - ví dụ các biến lưu giữ state,..., các hàm (function hoặc method) lấy dữ liệu, thao tác, thay đổi giá trị, các biến state đó nhằm phục vụ một chức năng nhất định.** Để dễ hình dung thì các library, npm package ta dùng hằng ngày nhìn chung chính là các module.

Cơ bản một web app tổng thể sẽ có nhiều thành phần, nhiều chức năng kết hợp lại với nhau. Mỗi chức năng, thành phần riêng biệt đó thường sẽ được xem là mỗi module khác nhau.

**Module có tính stateful**: nghĩa là nó lưu giữ, duy trì một số data, object instance,... xuyên suốt quá trình khởi tạo và sử dụng module đó. Kèm theo đó là các function, method dùng để **access**, **update** các data, object instance (hay còn có thể gọi là **state information**) kia. Đó là lý do gọi module có tính stateful.

Ví dụ như package Swiper.js. Khi import và sử dụng package này, chúng ta sẽ đi khởi tạo một object instance bằng cách:

```js
var mySwiper = new Swiper('.swiper-container', {
    speed: 400,
    spaceBetween: 100
});
```

Công việc này tạo ra một object instance tồn tại và duy trì bên trong moudle Swiper này.

Tất nhiên, để làm cho swiper (banner, slider, ...) này hoạt động, kéo chạy sang trái, sang phải, animation các thứ, ta sẽ cần các method tương ứng, thay đổi trạng thái, instance object <span class='inline-code'>mySwiper</span> kia, ví dụ:

```js
mySwiper.slideNext();
```

Với các biến và các function bên trong module, sẽ có các phần được che dấu (**private**), chỉ dùng nội bộ trong module đó. Ngoài ra, các phần data, function còn lại sẽ được **public** ra cho người dùng sử dụng (ví dụ các function, API các npm package cho phép chúng ta sử dụng hay ở với ví dụ swiper.js thì chính là method <span class='inline-code'>slideNext()</span>).

## 2. Tại sao cần module?

<span class="solution-label">Tính đóng gói</span> - một trong số các đặc tính cơ bản của lập trình hướng đối tượng (OOP) mà chúng ta nghe ra rả hằng ngày, từ lúc đi học, đi phỏng vấn, đến lúc đi làm. Tác dụng và tầm quan trọng của tính đóng gói này thật ra còn quan trọng hơn nhiều, được dùng hằng ngày chứ không chỉ đơn thuần có ích trong thế giới OOP.

Tính đóng gói cho phép chúng ta **đóng gói** (tất nhiên :))) các data và functions liên quan với nhau thành một khối, một gói, để phục vụ một chức năng nhất định.

>Module có quan trọng và hữu dụng không?

**Có**. Thật ra bạn đang dùng module hằng ngày, hàng giờ. Chính việc viết các file js riêng biệt ví dụ **search.js**, **urlHelpers.js**, chính là bạn đang áp dụng triết lý của tính đóng gói nói riêng và module nói chung.

Hay như khi làm việc với ReactJS, ta thường tách nhỏ các component ra thành các folder riêng biệt. Ví dụ: **SearchBar Component**. Folder sẽ có file css style, dumb component thực hiện chức năng render, smart component thực hiện call api, get data,... Mọi thứ kết hợp với nhau, và được đóng gói thành <span class='inline-code'>\<SearchBar \/></span> component mà chúng ta dùng để import ở nơi khác.

Bằng cách tạo ra module, quyết định phần nào là private, phần nào là public, giúp che dấu thông tin code, chỉ cho phép người dùng thao tác với các phần thông tin, function public.

Việc đóng gói các biến, function vào một module, rồi đến lúc sử dụng, chúng ta import vào dưới một cái **tên** khác cũng đem lại lợi ích lớn đó là tránh việc các khai báo biến, hàm bị trùng lập hay vô tình bị ghi đè lên nhau, thứ mà chúng ta sẽ dễ dàng mắc phải khi làm việc với **global scope**.

Cuối cùng, tựu chung các lợi ích trên giúp ích rất nhiều trong việc cấu trúc, hệ thống source code, giúp ích cho việc phát triển, scale up hay đơn giản là dễ dàng **maintainable** trong tương lai. Module quá tuyệ vời đúng không các bạn!?

## 3. Module những năm về trước

Module tuyệt vời là vậy, nó gần như đóng vai trò rất lớn trong mọi ngôn ngữ lập trình. Ấy vậy mà, có một sự thật vô cùng khủng khiếp, đó là: những năm trước khi xuất hiện bước ngoặt ES6, thì cơ bản, native javascript không có concept về module. Developer phải tự động não, tìm trick, và manually tạo ra module bằng cách:



## 4. Module không phải là...

## 5. Module trong CommonJS - NodeJS

## 6. Module trong ES6

## 7. Giống và khhác nhau giữa ES6's module và CommonJS's module

## 8. Kết luận

## 9. Nguồn và bài viết hay liên quan

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/3G2dOz4.png' alt='Anh văn 1' />
  </div>

  <p class='image-description'>Điểm học phần Anh văn 1</p>
</div>
