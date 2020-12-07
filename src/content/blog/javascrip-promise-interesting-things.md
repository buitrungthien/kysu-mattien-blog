---
title: 'Tò mò và những thắc mắc về Promise - Promise liệu có đáng tin?'
date: '2020-10-09'
author: { name: 'Thiên Bùi' }
tag: 'tech'
featuredImgUrl: 'https://i.imgur.com/ROIboLS.jpg?1'
featuredImgAlt: 'JavaScript Promise concerns'
description: 'JavaScript Promise - những câu hỏi tại sao'
---

Có thể bạn đã làm nhiều và có kinh nghiệm với Promise, đã biết cơ chế <a href="https://kysumattien.com/javascrip-promise-reject-vs-throw/" target="_blank" rel="noopener noreferrer">throw, reject Promise</a> hay chỉ mới học và tìm hiểu Promise. Nhiều khi chúng ta sử dụng Promise theo cách được mọi người khuyên như là best practice. Ví dụ như **đặt catch block ở cuối mỗi Promise chain!**, làm thế này, làm thế kia,... chúng ta làm theo, code chạy nhưng cũng chưa hiểu tại sao.

Hôm nay, trong một ngày đẹp trời, nổi máu **em yêu khoa học**, mình sẽ cùng các bạn cùng nhau đặt ra các câu hỏi "ngu" và tìm lời giải đáp về Promise trong JS nhé!

## 1. Best practice bảo hãy đặt .catch block ở cuối mỗi promise - OK, nhưng tại sao?

Khi làm việc với Promise, ví dụ như fetch data, chúng ta luôn đặt **.catch** block ở cuối mỗi Promise chain để xử lý lỗi, bằng không JS engine sẽ la lên lỗi **UnhandledPromiseRejectionWarning** (xem lại <a href="https://kysumattien.com/javascrip-promise-reject-vs-throw/" target="_blank" rel="noopener noreferrer">bài trước</a> của mình).

```js
const p = fetch('user-api.com')
    .then(res => console.log(res))
    .then(...)
    .then(...)
    .
    .
    .
    .catch(err => console.log(err));
```

Bằng cách đặt .catch block ở cuối mỗi Promise chain, bất kỳ lỗi nào xảy ra ở **then** block nào cũng sẽ được bắt và xử lý.

<span class="problem-label">Nhưng **tại sao** lại như vậy?</span>

Để trả lời câu hỏi trên, đầu tiên mình xin được nhắc lại đặc tính cơ bản của Promise, đó là:

Thứ nhất, **sau mỗi lần thực thi .then() là một Promise mới lại tiếp tục được sinh ra và truyền tiếp cho chuỗi Promise đằng sau**. Đó là lý do chúng ta có thể .then liên tùng tục như thế kia.

Thứ hai, **.catch** block chính là cách **viết gọn** của **.then(null, rejectHandler)**. Tức là đoạn code trên hoàn toàn có thể được viết lại thành:

```js
const p = fetch('user-api.com')
    .then(res => console.log(res))
    .then(...)
    .then(...)
    .
    .
    .
    .then(null, (err) => {console.log(err)});
```

Như ta đã biết, mỗi .then block luôn expect nhận vào 2 tham số: một là fulfillmentHandler - thực thi khi Promise chạy "thành công", một là rejectionHanlder - thực thi khi Promise chạy "thất bại".

Như vậy ở dòng code số (2), `.then(res => console.log(res))` cũng đang chỉ truyền vào fulfillmentHandler và bỏ qua tham số thứ hai là rejectionHandler, hay nói cách khác, nó có thể được viết lại thành `.then((res) => {console.log(res)}, null)`. .... Lúc này thì nhìn giống giống với anh bạn `.then(null, (err) => {console.log(err)})` ở dòng số (8) rồi đúng không nào !? Một anh thì bỏ đi `rejectionHandler`, một anh thì bỏ đi `fulfillmentHanlder`.

Cuối cùng, ý chính thứ ba: trong một **JS Promise chain**, khi một `.then()` block không truyền **rejectionHandler**, thì mặc định các **lỗi** trong Promise chain đó sẽ được **propagate** - lan truyền đến các Promise phía sau trong chuỗi Promise. (Việc lan truyền này cũng xả ra tương tự cho việc không truyền **fulfillmentHanldler**)

Nhờ tính chất này, mặc dù các .then block đầu ở ví dụ trên không có rejectionHanlder nhưng lỗi vẫn được "lan truyền" xuống .catch block cuối cùng để xử lý. Từ đó sinh ra best practice như đã nêu.

## 2. Tại sao không thể bắt lỗi của chính promise trong .then block?

> Như có nhắc đến ở trên thì trong mỗi `.then` block đều có cho mình một `rejectionHanlder`, tại sao bản thân mỗi Promise không tự xử lý lỗi của nó mà phải dựa vào một `.catch` block đặt ở cuối Promise chain?

Tức là:

```js
// khởi tạo foo là object rỗng
const foo = {};
// step 1:
fetch('http://some.url.1/')
  // step 2:
  .then(function(response1) {
    foo.bar(); // foo.bar hem có, undifined,
    // lỗi foo.bar is not a function.

    // gặp lỗi phía trên ngay lập tức chạy tới đoạn
    // catch để handle lỗi, nên dòng này không chạy
    return fetch('http://some.url.2/?v=' + response1);
  })

  // step 3:
  .then(
    function fulfilled(response2) {
      // never gets here
    },
    // rejection handler to catch the error
    function rejected(err) {
      console.log(err); // `TypeError` from `foo.bar()` error
      return 42;
    }
  )

  // step 4:
  .then(function(msg) {
    console.log(msg); // 42
  });
```

Cách viết như ví dụ trên hoàn toàn ok. Ở step 3, chúng ta đã khai báo một `rejectionHanlder` để xử lý lỗi. Tuy nhiên cách viết trên cũng có các mặt hạn chế.

Thứ nhất, nếu các `.then()` block phía sau ở trong chuỗi Promise chain mà có lỗi, và trong các .then block đó không có rejectionHandler thì mỗi lần nữa JS engine sẽ lại la lên lỗi **UnhandledPromiseRejectionWarning**. Nên cách an toàn nhất vẫn cần đặt thêm một catch block ở cuối mỗi **chain**.

Thứ hai, ở step 3, tuy đã khai báo rejectionHandler:

```js
// step 3:
  .then(
    function fulfilled(response2) {
      const num = 42;
      //42 là number, không phải string,
      //nó không có hàm toLowerCase, nên chỗ này sẽ gây ra lỗi
      num.toLowerCase();
    },
    // rejection handler to catch the error
    function rejected(err) {
      //rejectionHandler này không bắt được lỗi phía trên,
      //hay nói chính xác nó không được chạy, đau lòng!
      console.log(err);
      return 42;
    }
  )
```

Nhưng có một sự thật "đau lòng" là hàm `rejected` kia không thể nào bắt được **lỗi xảy ra ở fulfillmentHandler ngay trong Promise đó**.

Vì sao vậy? Sao Promise **không thông minh** quá vậy?

Thật ra việc làm này là **có chủ đích**, nó bảo toàn tính chất **immutable** của Promise.

Promise mang trong mình tính chất immutable - nói rằng khi một promise đã được chạy xong, dù cho là **fulfilled** (thành công) hay **rejected** (thất bại), thì trạng thái **fulfilled** hay **rejected** đó sẽ được duy trì, không thể thay đổi (immutable). Nhờ tính chất này, dù cho có nhiều nơi cùng **lắng nghe** hay **sử dụng** một Promise, thì kết quả sẽ luôn đồng bộ, càng không có chuyện một bên thứ ba có thể can thiệp và thay đổi trạng thái của một Promise dẫn đến các hành vi, luồng chạy code sai lệch và nguy hiểm.

Ứng với ví dụ trên, khi đi vào tới "step 3" và vào được hàm `fulfilled` callback thì coi như Promise mà step 3 này nhận vào đã có trạng thái **fulfilled** - đã **thành công**. Chỉ vì việc có lỗi phát sinh trong callback này mà nhảy xuống `rejected` callback để xử lý thì cũng giống như việc **đổi trạng thái của Promise nhận vào từ fulfilled sang rejected**. Như vậy là đã vi phạm tính chất **immutable** nói trên.

Như vậy, việc **ngó lơ** lỗi và đoạn code handle lỗi không được thực thi là hoàn toàn hợp lý. Quay lại lỗi `num.toLowerCase();` xảy ra khi chạy hàm `fulfilled`. JS engine thấy rằng đã có lỗi xảy ra, nên **Promise trả ra từ .then block ở step 3 này sẽ có trạng thái là rejected và lỗi sẽ được bắt ở .then block phía sau**.

```js
// step 3:
  .then(
    function fulfilled(response2) {
      const num = 42;
      //42 là number, không phải string,
      //nó không có hàm toLowerCase, nên chỗ này sẽ gây ra lỗi
      num.toLowerCase();
    },
    // rejection handler to catch the error
    function rejected(err) {
      //rejectionHandler này không bắt được lỗi phía trên,
      //hay nói chính xác nó không được chạy, đau lòng!
      console.log(err);
      return 42;
    }
  )
  .then(
    function fulfilled(response2) {
      ....
    },
    // rejection handler to catch the error
    function rejected(err) {
      //Lỗi sẽ được bắt ở đây
    }
  )
```

## 3. "Thenable" là gì? Tại sao nên "bọc" một promise bởi Promise.resolve trước khi sử dụng promise đó?

> Bạn nhận được kết quả trả về từ một object của một bên thứ ba, một package nào đó. Họ nói với bạn object của tui là Promise đó, anh xài như Promise bình thường, `.then()` để xử lý khi logic chạy thành công, `.catch()` để xử lý lỗi, bình thường giống như bao Promise khác.

```js
const p = strangePackage()
    .then(() => {})
    .then(() => {})
    ...
```

Để rồi bạn phát hiện ra code .then này không chạy được bất đồng bộ, handle lỗi bắn tứ tung, thậm chí việc **chain** các block .then như với Promise bình thường cũng không được. Có chuyện gì vậy?

Tìm hiểu ra thì mới biết ông nội `strangePackage` kia là một object, được cấu tạo như sau:

```js
const strangePackage = {
  then: function() {
    //do something
  },
};
```

Các object hay cấu trúc như trên được gọi là **thenable**, nói nôm na là **có thể chấm then** được, nhưng rõ ràng không phải là Promise, không chạy giống Promise thuần túy.

Như vậy, trong thế giới Promise rõ ràng luôn tồn tại một nguy cơ tồn tại các "promise" **không đáng tin** như trên, vậy đâu là giải pháp an toàn?

<span class="solution-label">Đó chính là sử dụng Promise.resolve()</span>

Đầu tiên, ta cùng điểm qua một số tính chất cơ bản vô cùng hay ho thường ít được chú ý của `Promise.resolve()`

<span class='problem-label'>Truyền vào Promise.resolve một giá trị tức thời, một số, một chuỗi chẳng hạn</span>

Nếu bạn pass một giá trị (tạm gọi là **tức thời**), ví dụ như number, string vào Promise.resolve, bạn sẽ nhận được kết quả trả về là một Promise mới với trạng thái **fulfilled** kèm theo giá trị đó. Xét ví dụ dưới đây, việc khởi tạo p1 từ `new Promise` và p2 từ `Promise.resolve` sẽ cho kết quả tương tự nhau.

```js
var p1 = new Promise(function(resolve, reject) {
  resolve(42);
});

var p2 = Promise.resolve(42);
```

<span class="problem-label">Truyền vào Promise.resolve một Promise</span>

Nếu bạn pass vào Promise.resolve một Promise, thì ngay lập tức bạn sẽ nhận lại được chính Promise đó.

```js
var p1 = Promise.resolve(42);

var p2 = Promise.resolve(p1);

p1 === p2; // true
```

<span class="problem-label">Truyền vào Promise.resolve một "thenable" object - không phải Promise</span>

Và cuối cùng quan trọng nhất, nếu chúng ta truyền vào Promise.resolve một **thenable** object, hay object giả danh một Promise, thì **thenable** object kia sẽ được Promise.resolve **bóc tách**. Tức là Promise.resolve sẽ mò vào object này, mò từng **lớp**, từng **level** của object đó, xem có prop **.then** hay không, nếu có thì trong **.then** đó có mấy callback, có giống Promise bình thường không,... Công việc này lặp đi lặp lại (recursively) cho đến khi không còn .then nào nữa thì thôi.

Bước cuối cùng Promise.resolve sẽ trả ra một Promise **bình thường** và an toàn để sử dụng từ anh bạn **thenable** kia. Để dễ hiểu, hãy cùng xem xét các đoạn code ví dụ dưới đây.

- Ví dụ 1: Thenable object không sử dụng Promise.resolve

```js
var p = {
  then: function(cb, errcb) {
    cb(42);
    errcb('evil laugh');
  },
};

p.then(
  function fulfilled(val) {
    console.log(val); // 42
  },
  function rejected(err) {
    // oops, shouldn't have run
    console.log(err); // evil laugh
  }
);
```

Cứ tưởng p là object và cái kết: .then một phát, code chạy cả hàm `fulfilled` và `rejected`, toang.

- Ví dụ 2: Dùng Promise.resolve để cho an toàn

```js
Promise.resolve( p )
.then(
	function fulfilled(val){
		console.log( val ); // 42
	},
	function rejected(err){
		// never gets here
	}
);
```

Bằng cách này, thay gì gọi trực tiếp `p.then()`, chúng ta pass nó vào Promise.resolve trước, và kết quả là code chạy ngon lành, đúng logic.

Túm lại: Bằng cách sử dụng Promise.resolve như các cách trên, chúng ta đã đạt được những lợi ích như: luôn đạt được luồng chạy code bất đồng bộ (vì Promise.resolve luôn trả ra một Promise, dù cho có truyền vào số hay chuỗi thuần) và tiếp theo là giải quyết được các vấn đề về các object thenable, an toàn và tin tưởng hơn khi sử dụng. Thật tuyệt vời!

## 5. Kết luận

Bài viết ngày hôm nay mình đã cùng các bạn đặt ra các câu hỏi "ngu", để từ đó cùng nhau tìm hiểu các câu trả lời, từ đó nâng cao tình yêu và vốn hiểu biết của chúng ta với JavaScript.

Không biết bạn như thế nào, chứ bản thân mình luôn cảm thấy phấn khích khi tìm hiểu các vấn đề cốt lõi như trên. Đó cũng chính là lý do mình yêu thích công việc lập trình.

Hy vọng các bạn cũng sẽ giống mình và luôn ủng hộ "kỹ sư mặt tiền" nha.

Hẹn gặp lại các bạn trong các bài viết tới. Mến chào các bạn!

## 6. Nguồn và bài viết hay liên quan

Hầu hết nguồn kiến thức và ý tưởng trong bài viết được mình đọc, tìm hiểu và đúc kết gọn lại từ chương "Promise" của cuốn sách nổi tiếng "You Don't Know JS". Các bạn có thể tìm hiểu thêm và ủng hộ tác giả nhé:

<a href="https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md" rel="noopener noreferrer">You Don't Know JS: Async & Performance - Chapter 3: Promises</a> - Tác giả: Kyle Simpson