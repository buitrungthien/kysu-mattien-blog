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

Bài viết giả định bạn đã có kiến thức cơ bản hoặc từng làm việc với Promise. Ngược lại, nếu chưa biết Promise là gì, các bạn đầu tiên hay tìm hiểu về khái niệm, cách khởi tạo, ý nghĩa của Promise qua bài viết cực kỳ hay và hài hước của tác giả **Dương Thanh Hợp** - <a target="_blank" rel="noopener noreferrer" href="https://duthaho.com/js-promise/">**Tìm hiểu về promise trong JavaScript**</a>

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

Bằng cách sử dụng <span class='inline-code'>reject</span>, catch block sẽ bắt được lỗi và JS Engine sẽ không còn hiện cảnh báo về **lỗi không được handled** nữa.

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

Với ví dụ trên, <span class='inline-code'>console.log('Here')</span> sẽ không được in ra, kết quả sẽ chỉ là "promise failed!". Vì trong scope của một function, nếu có một câu lệnh throw, ném ra một exception thì ngay lập tức luồng thực thi code sẽ bị ngắt.

Nói cách khác, các dòng code nằm bên dưới đoạn **throw** đó sẽ không được thực thi, luồng thực thi code lúc này ngay lập tức thoát khỏi scope function đó, và tìm đến block xử lý lỗi để tiếp tục thự thi (ở đây là scope .catch).

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

Kết quả:

```js
inside catch
Less than 25
```

## 4. Unhandle-promise-rejection (Lỗi promise chưa được xử lý) và Micro-task (Job-queue)

Trong các ví dụ trên, chắc hẳn các bạn đã để ý nhiều đến việc cảnh báo **Unhandled Promise Rejection**. Lỗi hay chính xác hơn là cảnh báo này xảy ra khi **JS engine** phát hiện Promise trả ra một exception (lỗi) nhưng không có **catch** block tương ứng để **bắt lấy lỗi và xử lý lỗi**. Nói cách khác, best practice JS Engine mong muốn lập trình viên chúng ta khi khai báo, sử dụng một promise mà có exception thì phải khai báo kèm luôn catch block để sử lý lỗi luôn, không thể để **trôi nổi** vô kỷ luật như vậy được.

Như vậy, warning như trên thường xuất hiện khi chúng ta quên thêm catch block để xử lý lỗi cho promise. Ví dụ:

```js
let promise = Promise.reject(new Error("Promise Failed!"));

//promise.catch(err => alert(err));
```

Ở ví dụ trên mình đã cố tình tạo một Promise có **trạng thái rejected** với message lỗi là "Promised Failed!", nhưng lại cố tình không add catch block để xử lý lỗi (comment out), thì ngay lập tức, broswer sẽ xuất hiện cảnh báo:

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/aO67o7M.png' alt='Promise uncaught error' />
  </div>

  <p class='image-description'>Promise uncaught error</p>
</div>

Nhưng kỳ lạ thay, xét ví dụ tiếp theo, mặc dù ta thêm catch block như sau:

```js
let promise = Promise.reject(new Error("Promise Failed!"));

setTimeout(() => promise.catch(err => alert('caught')), 1000);

Thì lỗi **UnhandledPromiseRejectionWarning** kia vẫn xuất hiện. Tại sao vậy?
```

Ok, và lý do đó là vì **ở lần chạy cuối cùng, job-queue hay microtask queue không tìm thấy catch block handler tương ứng để xử lý lỗi**

<span class="problem-label">Khoan đã, cái gì mà microtask queue ở đây?</span>

Hè hè, mình cố tình cài vào để có thể tranh thủ nói đến một vấn đề hay ho trong javascript về cách thức thực thi code bất đồng bộ.

Nếu các bạn đã tìm hiểu về **Event loop** và asynchronous code trong JS, các bạn sẽ thấy bức ảnh phía dưới rất quen thuộc.

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/oXhs6LK.png' alt='Event Loop trong JavaScript' />
  </div>

  <p class='image-description'>Event Loop trong JavaScript</p>
</div>

Đại khái là trong JavasCript, có hai "loại" code cần thực thi, đó là **code bình thường** - các cú pháp khai báo biến, các phép tính cộng trừ nhân chia, ... và các **code bất đồng bộ** - hay còn gọi là các Wep APIs, bao gồm các event handler (click, submit,...), AJAX call hay các hàm setTimeout, setInterval.

Các **code bình thường** sẽ được đặt trong call-stack (stack giống như một chiếc xô, đồ nào đặt vào sau cùng thì sẽ được lấy ra trước - LIFO (Last In First Out)).

Còn **code bất đồng bộ** thì sẽ được **xếp vào một hàng đợi - queue** (queue thì cũng giống một cái xô, nhưng mà cái xô không có đáy, vào trước thì ra trước - FIFO (First In First Out))

Về thứ tự thực thi code thì sẽ là code trong Call-stack chạy trước, đến khi toàn bộ code trong cái "xô" call-stack chạy xong thì sẽ đến cái xô lủng đít "Call back queue" kia.

Điều này giải thích cho lý do tại sao đoạn code:

```js
setTimeout(() => {
  console.log('in ra sau, mặc dù đợi 0 giây và nằm trên');
}, 0);

consol.log('code nằm dưới nhưng in ra trước');
```

Sẽ cho ra kết quả:

```js
code nằm dưới nhưng in ra trước
in ra sau, mặc dù đợi 0 giây và nằm trên
```

Nhưng kể từ khi ES6 ra đời, kèm theo sự xuất hiện của Promise, thì ngoài cái xô lành (Call-stack) và cái xô lủng đít (Callback-queue) kia còn xuất hiện thêm một cái xô lủng đít nữa, đó chính là: "Job-queue", cái "xô lủng đít - queue" này dành để thực thi các "microtask", mà cụ thể ở đây là thực thi các logic code bên trong **.then/catch handlers**.

Khi một promise đã "sẵn sàng" (ở trạng thái fulfilled hoặc rejected) thì tương ứng các code **trong** .then và .catch handler sẽ được xếp vào hàng đợi **Job-queue** và chờ chực để được chạy.

Thứ tự chạy code ở 3 cái xô này bây giờ sẽ là:

Xô lành (call-stack) chạy trước, chạy hết sạch code (theo cơ chế vào sau ra trước) -> xô lủng đít Job-queue (microtask) chạy tiếp (cơ chế vào trước ra trước), chạy hết sạch -> xô lủng đít cuối cùng Callback-queue.

Bạn có thể kiểm chứng bằng ví dụ:

```js
setTimeout(() => {
  console.log('Tui nằm trong callback queue, tui đứng đầu nhưng in ra cuối cùng');
}, 0);

Promise.resolve()
.then(res => {console.log('Tui nằm trong microtask queue, tui in ra trước anh bạn callback queue')});

console.log('Tui nằm trong callstack, tui đứng cuối nhưng in ra đầu tiên');
```

Quay lại với lý do xảy ra lỗi <span class='inline-code'>Unhandled promise rejection bên trên</span>.

Nhìn chung JavaScript Engine mong đợi chúng ta luôn khai báo các hàm xử lý lỗi một cách đầy đủ cho mỗi cái "xô". Nói cách khác, lỗi xảy ra ở xô nào, thì trong xô đó phải có catch block tương ứng để xử lý lỗi, vì 3 cái xô này có thể coi là tách biệt với nhau.

```js
let promise = Promise.reject(new Error("Promise Failed!"));

setTimeout(() => promise.catch(err => alert('caught')), 1000);
```

Như đoạn code trên, bằng cách đặt promise.catch vào bên trong setTimeout, ta đã vô tình mang nó đến cái xô lủng đít số 2 (xô callback-queue), trong khi ở ở xô nọ, eror quăng ra từ Promise.rejec không tìm thấy catch block handler tương ứng -> Engine báo lỗi **UnhandledPromiseRejectionWarning**

## 6. Kết luận

Qua bài viết ngày hôm nay, mình đã cùng các bạn tìm hiểu về sự khác biệt giữa **reject** và **throw**, bên cạnh đó chúng ta cũng đã tìm hiểu sơ lược về **microtask** trong JavasCript.

Promise trong JavaScript luôn là một chủ đề hấp dẫn và có rất nhiều vấn đề đi kèm như cách xử lý lỗi, trình tự thực thi,...

Để nắm được các concept khó nhai này, mình xin chia sẻ các bạn link các bài viết hay để các bạn tiếp tục đào sâu hơn về các vấn đề nêu trên nhé.

<a href="https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/">Tasks, microtasks, queues and schedules</a> - Tác giả: Jake - a developer advocate for Google Chrome. **Bài viết cực cực kỳ hay, có animation cho bạn bấm bấm, code chạy dễ hiểu, giúp bạn hiểu sâu và chi tiết về microtask, mình vô cùng tha thiết recommend các bạn đọc bài này**.

<a href="https://duthaho.com/js-promise/">Tìm hiểu về promise trong JavaScript</a> - Tác giả: anh đ* tha hồ - duthaho **Giới thiệu về Promise, cách khai báo, cách dùng, lợi ích,... một cách rất hài hước và dễ hiểu**

Nếu thấy hay đừng quên cho mình một like. Ngoài ra các bạn có những kiến thức nào khác liên quan đến chủ đề này, đừng quên comment phía bên dưới để mọi người cùng biết nhé. Mến chào các bạn!