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

## 3. Khác biệt giữa "reject" và "throw" khi dùng trong Promise

Ok, như vậy chúng ta đã biết được reject và throw dùng để làm gì, thậm chí phát hiện chúng khá giống nhau - đều dùng để handle các lỗi, các exception. Vậy chúng có điểm nào khác nhau không? Câu trả lời là có, giữa reject và throw có các điểm khác nhau sau đây:

<span class="problem-label">callback bất đồng bộ đặt trong Promise</span>

**Throw**:

```js
const p = new Promise((resolve, reject) => {
  // Asynchronous function called within the Promise.
  // throw lỗi trong asynchronous callback - đặt trong setTimeout
  setTimeout(() => {
    throw 'promise failed!';
  }, 1000);
});

// .catch sẽ không bắt được lỗi trên
// và JS engine sẽ la lên
p.catch(err => {
  console.log(err);
});
```

Khi **được gọi** bên trong một async function (ví dụ **setTimeout**), chúng ta **không thể sử dụng throw**, vì **catch block** không bắt được lỗi này (lỗi mà được throw đi ấy).

Lúc này anh bạn Js Engine sẽ la làng lên **Uncaught promise failed!**. Nôm na là: "Ê, t thấy có một lỗi tên 'promise failed', mà lỗi này không ai chịu trách nhiệm, chịu 'bắt' để xử lý hết"

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/BAHQwHI.png' alt='Promise uncaught error' />
  </div>

  <p class='image-description'>Promise uncaught error</p>
</div>

**Reject**:

```js
const p = new Promise((resolve, reject) => {
  // Asynchronus function called within the Promise.
  setTimeout(() => {
    reject('promise failed!');
  }, 1000);
});

// Giờ thì catch đã có thể bắt được lỗi
// JS Enginge không còn cảnh báo nữa
p.catch(err => {
  console.log(err);
});
```

Bằng cách sử dụng <span class='inline-code'>reject</span>, catch block sẽ bắt được lỗi và JS Engine sẽ không còn hiện cảnh báo về \*\*lỗi không được handled" nữa.

<span class="problem-label">Ngắt luồng chạy code khi gặp lỗi</span>

Điểm khác biệt này khá basic và có lẽ nhiều dev chúng ta đã biết, rằng:

**Throw**:

```js
const p = new Promise((resolve, reject) => {
  throw 'promise failed!';

  console.log('Here');
});

p.catch(err => {
  console.log(err);
});
```

Với ví dụ trên, <span class='inline-code'>console.log('Here')</span> sẽ không được in ra, kết quả sẽ chỉ là "promise failed!". Vì trong scope của một function, nếu có một câu lệnh throw, ném ra một exception thì ngay lập tức luồng thực thi code sẽ bị ngắt. Nói cách khác, các dòng code nằm bên dưới đoạn **throw** đó sẽ không được thực thi, luồng thực thi code lúc này ngay lập tức thoát khỏi scope function đó, và tìm đến block xử lý lỗi để tiếp tục thự thi (ở đây là scope .catch).

**Reject**:

```js
const p = new Promise((resolve, reject) => {
  reject('promise failed!');

  console.log('Here');
});

p.catch(err => {
  console.log(err);
});
```

Cùng ví dụ trên, khi thay thế <span class='inline-code'>throw</span> bằng <span class='inline-code'>reject</span>, kết quả in ra lúc này sẽ là:

```js
Here
promise failed!
```

Như vậy, khác với throw, luồng thực thi code vẫn sẽ chạy hết các câu lệnh tiếp theo của scope function, sau đó mới tìm đến catch block để xử lý lỗi, thay vì ngay lập tức ngắt luồng chạy như throw đã làm.

<span class="problem-label">Được dùng trong phạm vi nào</span>

**Reject**:

```js
var a = 20;

try {
  if (a < 25) Promise.reject('Less than 25');

  console.log('Okay!');
} catch (err) {
  console.log('inside catch');

  console.log(err);
}
```

**Lưu ý**: Promise.reject() là một built-in function. Nó trả ra một Promise object có trạng thái **rejected**.

Kết quả trả về từ đoạn code ví dụ trên sẽ chỉ là:

```js
Okay!
```

Như vậy, exception đã không vào được catch block, khiến cho console.log('inside catch) và console.log(err) không được in ra.

Bonus thêm anh bạn JS Engine la lên cảnh báo: <span class='inline-code'>UnhandledPromiseRejectionWarning</span>, vì không tìm được catch block tương ứng có thể handle exceiption sau khi reject.

Lý do ở đây là vì **reject** chỉ có thể được dùng chung với scope của Promise object.

Nói cách khác, đoạn code trên phải được viết lại thành:

```js
var a = 20;

if (a < 25) {
  console.log('Okay!');

  Promise.reject('Less than 25').catch(err => {
    console.log('inside catch');

    console.log(err);
  });
}
```

Kết quả lúc này sẽ là:

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/lvvGSkq.png' alt='Promise.reject phải được sử dụng trong scope của Promise' />
  </div>

  <p class='image-description'>Promise.reject phải được sử dụng trong scope của Promise</p>
</div>

**Throw**:

Ngược lại, với cú pháp <span class='inline-code'>throw</span>, bạn có thể dùng để quăng ra exception trong **bất cứ** scope của try-catch block nào mà bạn muốn, không giới hạn chỉ trong scope của Promise.

```js
var a = 20;

try {
  if (a < 25) throw 'Less than 25';

  console.log('Okay!');
} catch (err) {
  console.log('inside catch');

  console.log(err);
}
```

Kết quả trả về:

```js
inside catch
Less than 25
```

## 4. Unhandle-promise-rejection (Lỗi promise chưa được xử lý) và Micro-task (Job-queue)

Trong các ví dụ trên, mình đã đề cập khá nhiều lần đến việc 

JS có một cái "luồng" mà thôi.

## 6. Kết luận
