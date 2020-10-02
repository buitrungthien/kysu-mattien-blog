---
title: 'JavaScript Promise - Không thích thì từ chối, không thích nữa thì quăng luôn!'
date: '2020-10-01'
author: { name: 'Thiên Bùi' }
tag: 'tech'
featuredImgUrl: 'https://i.imgur.com/7qoiAvY.png?1'
featuredImgAlt: 'JavaScript Promise In Depth'
description: 'JavaScript Promise, sự khác nhau giữa reject và throw? Micro-task là gì? Chúng ta sẽ tìm hiểu những vấn đề này trong bài viết ngày hôm nay'
---

Những ngày đầu chập chững tham gia những cuộc phỏng vấn đầu tiên, JavaScript Promise hẳn đã có đôi lần được đưa ra để "đánh đố" chúng ta đúng không nào? Nào **trạng thái của promise, promise.all**, vân vân và mây mây.

Nhìn chung JavaScript Promise là một khái niệm, một công cụ khá hữu ích trong công việc hằng ngày của js developer chúng ta.

Để đóng góp thêm vốn kiến thức đa dạng và phức tạp của anh bạn Promise, hôm nay mình sẽ cùng các bạn tìm hiểu sự khác nhau giữa việc **reject** và **throw** một **exception** trong object Promise, đồng thời cho những ai chưa biết, chúng ta cũng sẽ đi tìm hiểu Micro-task hay Job-queue là gì? (Bạn thường nghe Call-stack và Callback-queue đúng không nào).

Bài viết giả định bạn đã có kiến thức cơ bản hoặc từng làm việc với Promise. Ngược lại, nếu chưa biết Promise là gì, các bạn đầu tiên hay tìm hiểu về khái niệm, cách khởi tạo, ý nghĩa của Promise qua bài viết cực kỳ hay và hài hước của tác giả **duongthanhduoc** - <a target="_blank" rel="noopener noreferrer" href="https://duthaho.com/js-promise/">**Tìm hiểu về promise trong JavaScript**</a>

Ok bây giờ chúng ta bắt đầu nào

## 1. reject - từ chối

Khi khởi tạo một Promise object, chúng ta được yêu cầu truyền vào Promise constructor một **executor** (hàm thực thi), và tham số thứ 2 của executor đó chính là một **reject** callback, dùng để chuyển trạng thái của Promise nêu trên thành **rejected** hay nói cách khác **từ chối** một Promise với một lý do nhất định.

Có khá nhiều cách để "từ chối" một Promise (Người ta nói muốn thì tìm cách, không muốn thì tìm lý do mà :)))

Ví dụ, **pass string** vào reject:

```js
const p = new Promise((resolve, reject) => {
  reject('promise failed!');
});

p.catch(err => {
  console.log(err);
});
```

Hoặc **pass một Error instance**:

```js
const p = new Promise((resolve, reject) => {
  reject(new Error('promise failed!'));
});

p.catch(err => {
  console.log(err);
});
```

Bằng cách pass một Error instance, chúng ta có thể tự tạo các **custom Error** để thuận tiện trong việc quản lý lỗi. Ví dụ chúng ta đi tạo các class lỗi như: lỗi đăng nhập, lỗi mạng, lỗi cú pháp, ...

Đồng thời, việc pass Error instance sẽ giúp javascript engine cung cấp cho chúng ta thêm thông tin về **Error tree**, bao gồm các thông tin rất hữu ích, ví dụ lỗi xảy ra ở dòng mấy, tree-stack, ...

```js
Error: promise failed!
    at :4:9
    at new Promise ()
    at :2:11
    at render (tryit.php:202)
    at tryit.php:170
    at dispatch (jquery.js:4435)
    at r.handle (jquery.js:4121)
```

## 2. throw - quăng lỗi

"Throw" nghĩa là "quăng" - rõ ràng rồi :)) . Khi khởi tạo một "lời hứa" **Promise**, thay vì cách trên - không thực hiện được thì "từ chối" (reject), với throw - không thực hiện được, chúng ta "quăng" đi luôn, khá cục súc :))

Mình đùa thôi. Throw chung quy dùng để **khởi tạo** và **quăng ra** các lỗi custom (user defined exception) khi cần thiết. Dùng throw, chúng ta có thể kiểm soát được luồng chạy code (được phép chạy tiếp hay không, code sẽ bị terminate, dừng khi nào,...).

Throw có thể được dùng trong Peomise, tương tự như **reject** ở ví dụ code trên. Bằng cách thay thế "reject" bởi keyword "throw", ta sẽ có kết quả tương tự như lúc dùng reject.

```js
const p = new Promise((resolve, reject) => {
  throw 'promise failed!';
});

p.catch(err => {
  console.log(err);
});
```

Ngoài ra, throw còn có thể được dùng mà không cần phải nằm trong Promise (thường được dùng kèm **try, catch** block để xử lý lỗi)

```js
var a = 20;
try {
  if (a < 25) throw 'Less than 25';

  console.log('Okay!');
} catch (err) {
  console.log(err);
}
```

## 1. Khác biệt giữa "reject" và "throw" khi dùng trong Promise

Ok, như vậy chúng ta đã biết được reject và throw dùng để làm gì, thậm chí phát hiện chúng khá giống nhau - đều dùng để handle các lỗi, các exception. Vậy chúng có điểm nào khác nhau không? Câu trả lời là có, giữa reject và throw có các điểm khác nhau sau đây:

<span class="problem-label">Asynchronous callback function inside the Promise</span>

Khi **được gọi** bên trong một async function (ví dụ **setTimeout**), chúng ta **không thể sử dụng throw**, vì **catch block** không bắt được lỗi này (lỗi mà được throw đi ấy).

Lúc này anh bạn Js Engine sẽ la làng lên **Uncaught promise failed!**. Nôm na là: "Ê, t thấy có một lỗi tên 'promise failed', mà lỗi này không ai chịu trách nhiệm, chịu 'bắt' để xử lý hết"

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/BAHQwHI.png' alt='Promise uncaught error' />
  </div>

  <p class='image-description'>Promise uncaught error</p>
</div>

<span class="problem-label"></span>
<span class="problem-label"></span>

## 2. Unhandle-promise-rejection (Lỗi promise chưa được xử lý)

## 3. Micro-task là gì. setTimeout, promise, callstack, cái nào chạy trước, cái nào sau???

JS có một cái "luồng" mà thôi.

## 4. Kết luận
