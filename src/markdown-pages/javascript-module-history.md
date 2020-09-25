---
title: 'Javascript module, import, export, dễ ẹc, nhưng có thể bạn vẫn chưa biết'
date: '2020-09-22'
author: { name: 'Thiên Bùi' }
tag: 'tech'
featuredImgUrl: 'https://i.imgur.com/m2QgI0I.jpg?1'
featuredImgAlt: 'Javascript module, import, export, dễ ẹc, nhưng có thể bạn vẫn chưa biết'
description: 'Để có được module hay cú pháp import, export dùng trong javascript như ngày nay, bản thân ngôn ngữ này đã trải qua một quá trình dài và chông gai, bài viết hôm nay chúng ta cùng tìm hiểu nhé!'
---

Chắc hẳn chúng ta đã quá quen với cú pháp **import** và **export** trong javascript, sử dụng nó một cách thuần thục (hoặc chưa), và mặc định đây là điều hiển nhiên trong thế giới javascript.

Nhưng mấy ai biết được rằng, để có được những **import**, **export** kia, bản thân javascript đã phải nỗ lực không ngừng **tiến hóa** mới có khái niệm **module** tiện dụng như thế này cho anh em chúng ta dùng.

Bài viết hôm nay mình sẽ cùng các bạn đi qua khái niệm **module** (đọc là "mo dzù ồl nha các bạn :D) trong JavaCript. Module là gì, tại sao module quan trọng, quá trình hình thành của javascript module và nhiều vấn đề hay ho khác.

Trong bài viết đôi chỗ sẽ có những khái niệm, diễn giải khá hàn lâm nhưng chỉ cần chúng ta chịu khó đọc chậm và suy nghĩ kỹ càng thì sẽ nắm bắt được ý đồ đang diễn giải. Chúc các bạn gặt hái được nhiều kiến thức bổ ích nhé. Chúng ta bắt đầu thôi.

> Nếu bạn đã quá quen thuộc với concept module, CommonJS module, hay ES6 module, bạn có thể bỏ qua các section đầu, nơi mình giới thiệu chi tiết về module cho các bạn mới và nhảy tới section 7. Khác nhau giữa ES6's module và CommonJS's module (Quan trọng)

## 1. Module là gì?

**Một module là một tập hợp, một gói, một packet, chứa data - ví dụ các biến lưu giữ state,..., các hàm (function hoặc method) lấy dữ liệu, thao tác, thay đổi giá trị, các biến state đó nhằm phục vụ một chức năng nhất định.** Để dễ hình dung thì các library, npm package ta dùng hằng ngày nhìn chung chính là các module.

Cơ bản một web app tổng thể sẽ có nhiều thành phần, nhiều chức năng kết hợp lại với nhau. Mỗi chức năng, thành phần riêng biệt đó thường sẽ được xem là mỗi module khác nhau.

**Module có tính stateful**: nghĩa là nó lưu giữ, duy trì một số data, object instance,... xuyên suốt quá trình khởi tạo và sử dụng module đó. Kèm theo đó là các function, method dùng để **access**, **update** các data, object instance (hay còn có thể gọi là **state information**) kia. Đó là lý do gọi module có tính stateful.

Ví dụ như package Swiper.js. Khi import và sử dụng package này, chúng ta sẽ đi khởi tạo một object instance bằng cách:

```js
var mySwiper = new Swiper('.swiper-container', {
  speed: 400,
  spaceBetween: 100,
});
```

Công việc này tạo ra một object instance tồn tại và duy trì bên trong moudle Swiper này.

Tất nhiên, để làm cho swiper (banner, slider, ...) này hoạt động, kéo chạy sang trái, sang phải, animation các thứ, ta sẽ cần các method tương ứng, thay đổi trạng thái của instance object <span class='inline-code'>mySwiper</span> kia, ví dụ:

```js
mySwiper.slideNext();
```

Với các biến và các function bên trong module, sẽ có các phần được che dấu (**private**), chỉ dùng nội bộ trong module đó. Ngoài ra, các phần data, function còn lại sẽ được **public** ra cho người dùng sử dụng (ví dụ các function, API các npm package cho phép chúng ta sử dụng hay ở với ví dụ swiper.js thì chính là method <span class='inline-code'>slideNext()</span>).

## 2. Tại sao cần module?

<span class="solution-label">Tính đóng gói</span> - một trong số các đặc tính cơ bản của lập trình hướng đối tượng (OOP) mà chúng ta nghe ra rả hằng ngày, từ lúc đi học, đi phỏng vấn, đến lúc đi làm. Tác dụng và tầm quan trọng của tính đóng gói này thật ra còn quan trọng hơn nhiều, được dùng hằng ngày chứ không chỉ đơn thuần có ích trong thế giới OOP.

Tính đóng gói cho phép chúng ta **đóng gói** (tất nhiên :))) các data và functions liên quan với nhau thành một khối, một gói, để phục vụ một chức năng nhất định.

> Module có quan trọng và hữu dụng không?

**Có**. Thật ra bạn đang dùng module hằng ngày, hàng giờ. Chính việc viết các file js riêng biệt ví dụ **search.js**, **urlHelpers.js**, chính là bạn đang áp dụng triết lý của tính đóng gói nói riêng và module nói chung.

Hay như khi làm việc với ReactJS, ta thường tách nhỏ các component ra thành các folder riêng biệt. Ví dụ: **SearchBar Component**. Folder sẽ có file css style, dumb component thực hiện chức năng render, smart component thực hiện call api, get data,... Mọi thứ kết hợp với nhau, và được đóng gói thành <span class='inline-code'>\<SearchBar \/></span> component mà chúng ta dùng để import ở nơi khác.

Bằng cách tạo ra module, quyết định phần nào là private, phần nào là public, giúp che dấu thông tin code, chỉ cho phép người dùng thao tác với các phần thông tin, function public.

Việc đóng gói các biến, function vào một module, rồi đến lúc sử dụng, chúng ta import vào dưới một cái **tên** khác cũng đem lại lợi ích lớn đó là tránh việc các khai báo biến, hàm bị trùng lặp hay vô tình bị ghi đè lên nhau, thứ mà chúng ta sẽ dễ dàng mắc phải khi làm việc với **global scope**.

Cuối cùng, tựu chung các lợi ích trên giúp ích rất nhiều trong việc cấu trúc, hệ thống source code, giúp ích cho việc phát triển, scale up hay đơn giản là dễ dàng **maintainable** trong tương lai. Module quá tuyệt vời đúng không các bạn!?

## 3. Module những năm về trước

Module tuyệt vời là vậy, nó gần như đóng vai trò rất lớn trong mọi ngôn ngữ lập trình. Ấy vậy mà, có một sự thật vô cùng khủng khiếp, đó là: những năm trước khi xuất hiện bước ngoặt ES6, thì cơ bản, native javascript không có concept về module. Developer phải tự động não, tìm trick, và manually tạo ra module bằng cách:

<span class='solution-label'>Sử dụng IIFE (Immediately Invoked Function Expression)</span>

```js
var Student = (function defineStudent() {
  var records = [
    { id: 14, name: 'Kyle', grade: 86 },
    { id: 73, name: 'Suzy', grade: 87 },
    { id: 112, name: 'Frank', grade: 75 },
    { id: 6, name: 'Sarah', grade: 91 },
  ];

  var publicAPI = {
    getName,
  };

  return publicAPI;

  // ************************

  function getName(studentID) {
    var student = records.find(student => student.id == studentID);
    return student.name;
  }
})();

Student.getName(73); // Suzy
```

Bằng cách sử dụng IIFE, chúng ta vừa **khai báo** vừa **chạy** ngay lập tức hàm <span class='inline-code'>defineStuden</span>, hàm này trả ra một object chứa proptery trỏ tới hàm <span class='inline-code'>getName</span>.

Xét lại định nghĩa về một module. Hàm <span class='inline-code'>defineStudent</span> có chứa biến biến state là <span class='inline-code'>records</span> và phương thức <span class='inline-code'>getName</span> để thao tác với biến state đó (cụ thể ở đây là get ra tên của student có id tương ứng). Như vậy , đây chính là một module.

Mọi thứ sau đó được gán ngược lại cho biến <span class='inline-code'>Student</span>. Student giờ đây trở thành một **instance** của module. Khi gọi Student.getName(73), lợi dụng tính chất của **closure** (getName vẫn có khả năng lấy được data từ <span class='inline-code'>records</span>, mặc dù hàm <span class='inline-code'>defineStudent</span> đã chạy rồi), chúng ta đã có khả năng lấy được thông tin về tên của student có id là 73. Tuyệt vời!

Nói theo ngôn ngữ bậc cao loài người, chúng ta có thể phát biểu rằng: Đây là module Student, nhiệm vụ của module này là khởi tạo danh sách các sinh viên, và cho phép chúng ta tra cứu thông tin về tên của sinh viên.

<span class='warning-label'>Một số lưu ý:</span>

Trong ví dụ trên, data <span class='inline-code'>records</span> đang được hard-code trong lúc khởi tạo module để đơn giản hóa quá trình giải thích cho các bạn hiểu. Nhưng trong các module thực tế, data này sẽ được khởi tạo (hoặc load) từ database, APIs,... sau đó được load vào module instance bằng một phương thức cụ thể, ví dụ **setListStudents**.

Nhớ lại kiến thức về **lexical scope**, bằng cách khai báo các biến và method bên trong hàm <span class='inline-code'>defineStudent</span>, mọi thứ đã được **che dấu** một cách mặc định, rằng mọi người ở scope bên ngoài sẽ không có khả năng tùy ý thay đổi giá trị các biến, hàm trong module của chúng ta. Họ chỉ có thể thực hiện một số action nhất định mà chúng ta cho phép (bằng cách return ra method tương ứng) mà thôi.

Với ví dụ trên, module của chúng ta chỉ có một instance duy nhất là <span class='inline-code'>Student</span>, pattern này còn được biết đến với cái tên là **Singleton**. Nhưng nếu ta cần nhiều hơn một instance thì sao?

<span class='solution-label'>Sử dụng Module Factory</span>

```js
// factory function, not singleton IIFE
function defineStudent() {
  var records = [
    { id: 14, name: 'Kyle', grade: 86 },
    { id: 73, name: 'Suzy', grade: 87 },
    { id: 112, name: 'Frank', grade: 75 },
    { id: 6, name: 'Sarah', grade: 91 },
  ];

  var publicAPI = {
    getName,
  };

  return publicAPI;

  // ************************

  function getName(studentID) {
    var student = records.find(student => student.id == studentID);
    return student.name;
  }
}

var firstInstance = defineStudent();
var secondInstance = defineStudent();
firstInstance.getName(73); // Suzy
...
```

Tới đây, bạn đã dần dần thấy khái niệm và cách tạo ra module dần dần quen thuộc và không còn khó khăn đúng không nào!?

## 4. Module không phải là...

Đến thời điểm này, chúng ta đã nhận ra module sẽ được tạo ra bằng cách wrap mọi thứ bên trong một scope, một function hay một object nhất định, tuy nhiên... các cách làm sau đây không được xem là một **module** đúng nghĩa:

<span class='warning-label'>Namespaces (Stateless Grouping)</span>

Nếu chúng ta gom nhóm một số function với nhau mà không có data (stateless), thì đây không được xem là một module mà được gọi là **namespace**

```js
// namespace, not module
var Utils = {
  cancelEvt(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();
  },
  wait(ms) {
    return new Promise(function c(res) {
      setTimeout(res, ms);
    });
  },
  isValidEmail(email) {
    return /[^@]+@[^@.]+\.[^@.]+/.test(email);
  },
};
```

<span class='warning-label'>Data Structures (Stateful Grouping)</span>

Nếu chúng ta chỉ gom nhóm một set các giá trị state và function cùng nhau, **nhưng không limit phần nào là public, phần nào là private** (thông qua việc invoke hàm và return ra value như ví dụ trước), thì đây cũng không được xem là một module. Vì nó không có tính che dấu thông tin.

```js
// data structure, not module
var Student = {
  records: [
    { id: 14, name: 'Kyle', grade: 86 },
    { id: 73, name: 'Suzy', grade: 87 },
    { id: 112, name: 'Frank', grade: 75 },
    { id: 6, name: 'Sarah', grade: 91 },
  ],
  getName(studentID) {
    var student = this.records.find(student => student.id == studentID);
    return student.name;
  },
};

Student.getName(73);
// Suzy
```

## 5. Module trong CommonJS - NodeJS

NodeJs ra đời nhằm biến JS có thể sử dụng được ở tầng back-end. Và cũng như bao ngôn ngữ lập khác thời bấy giờ - vốn có concept về module, NodeJS phải tìm cách implement module bên trong nó bằng cách sử dụng library CommonJs's module.

Với module trong CommonJS hay NodeJS, các module có đặc tính **file-based**, tức là **mỗi một file js là một module**.

Xét ví dụ về NodeJS module sau:

```js
var records = [
  { id: 14, name: 'Kyle', grade: 86 },
  { id: 73, name: 'Suzy', grade: 87 },
  { id: 112, name: 'Frank', grade: 75 },
  { id: 6, name: 'Sarah', grade: 91 },
];

function getName(studentID) {
  var student = records.find(student => student.id == studentID);
  return student.name;
}

module.exports.getName = getName;
```

Đây chính là một module trong NodeJS.

Mặc cho <span class='inline-code'>records</span> và <span class='inline-code'>getName</span> được khai báo ở **top-level scope**, các biến và hàm này vẫn đảm bảo **mặc định private** và chỉ nằm trong module này, tức là không nằm trong globals scope (ví dụ như ở browser thì các biến và function nằm ở global scope sẽ được truy vấn bằng **window.xyz**). Vì sao lại như vậy?

Vì mặc định một file js được viết trong NodeJS trước khi được xử lý sẽ được bao bọc bởi một hàm wrapper. Với ví dụ trên, mọi thứ sẽ trở thành như sau:

```js
function Module(module, require, __dirname,...) {
  var records = [
    { id: 14, name: 'Kyle', grade: 86 },
    { id: 73, name: 'Suzy', grade: 87 },
    { id: 112, name: 'Frank', grade: 75 },
    { id: 6, name: 'Sarah', grade: 91 },
  ];

  function getName(studentID) {
    var student = records.find(student => student.id == studentID);
    return student.name;
  }
  module.exports.getName = getName;
}
```

Node sau đó mới **invoke** <span class='inline-code'>Module</span> và nhờ vậy, chúng ta có thể hiêu tại sao mọi thứ bên trong Module trở nên **private** với thế giới bên ngoài.

Sau đó, developer chúng ta sẽ chọn ra những public API muốn export ra thế giới bên ngoài bằng cách export một cách tường minh

```js
module.exports.getName = getName;
```

hoặc export dưới dạng một object:

```js
module.exports = {
  getName,
};
```

Ở module hoặc file js khác, muốn sử dụng CommonJS module vừa khởi tạo phía trên, chúng ta sử dụng **phương thức** **require**

```js
var Student = require('/path/to/student.js');

Student.getName(73);
// Suzy
```

Một lưu ý vô cùng quan trọng ở đây là: **CommonJS modules có tính singleton**. Không cần biết bạn **require** một module bao nhiêu lần, gán bằng bao nhiêu tên biến, thì mọi thứ đều đang trỏ về chung một module instance.

Ví dụ:

```js
var Student1 = require('/path/to/student.js');
var Student2 = require('/path/to/student.js');

Student1.getStudent(73).changeName('Thien');
```

Ví dụ module Student lúc trước của chúng ta có thêm phương thức <span class='inline-code'>changeName</span> giúp thay đổi tên của một studen, thì với đặc tính **singleton**, khi Student1 thay đổi name của student có id = 73 thành 'Thien', thì student tương ứng trong **Student2** cũng sẽ change theo. Nói cách khác, theo đặc tính của **singleton**, hai biến Student1 và Student2 thực chất đang trỏ tới cùng một instance.

Để sử dụng được nhiều instance trong CommonJS module, các bạn có thể tham khảo bài viết <a href="https://medium.com/@iaincollins/how-not-to-create-a-singleton-in-node-js-bd7fde5361f5" target="_blank">sau</a>.

## 6. Module trong ES6

Như vậy, thoạt đầu từ cú pháp IFFE để tạo ra module, rồi đến CommonJS, và còn nhiều thư viện khác nữa (AMD, UMD, ...). Rõ ràng, module đóng một vai trò vô cùng quan trọng trong cộng đồng dev JavaScript. Và cuối cùng, JavaSciprt native module đã xúât hiện hay còn được biết với cái tên **ES Module**

Về cơ bản, ES Module (ESM) có khá nhiều điểm tương đồng với CommonJS. ESM cũng có tính chất **file-based** (mỗi file js là một module), có luôn singleton, và mọi thứ by default sẽ được xem là **private** tức chỉ có thể access được bên trong module đó. Tuy nhiên có một khác biệt nhỏ đó là: ESM files mặc định chạy trong strict mode.

Tiếp đến, thay vì sử dụng <span class='inline-code'>module.exports</span> giống như CommonJS, ESM sử dụng keyword <span class='inline-code'>export</span>, đồng thời sử dụng **keyword** <span class='inline-code'>import</span> thay vì **method** <span class='inline-code'>require</span> như CommonJS.

```javascript
var records = [
  { id: 14, name: 'Kyle', grade: 86 },
  { id: 73, name: 'Suzy', grade: 87 },
  { id: 112, name: 'Frank', grade: 75 },
  { id: 6, name: 'Sarah', grade: 91 },
];

function getName(studentID) {
  var student = records.find(student => student.id == studentID);
  return student.name;
}

export { getName };
```

Ngoài cách export một object như trên, ESM còn cho phép chúng ta thoải mái sử dụng cú pháp export cho từng biến hay function cụ thể (named export):

```javascript
// awesome-library.js
export const PI = 3.1415926;

export function sum(...args) {
  log('sum', args);
  return args.reduce((num, tot) => tot + num);
}

export function mult(...args) {
  log('mult', args);
  return args.reduce((num, tot) => tot * num);
}

// private function
function log(...msg) {
  console.log(...msg);
}
```

Một biến thể nữa là **default export**.

```js
export default function getName(studentID) {
  // ..
}
```

Khác với named export, một module chỉ có duy nhất một default export. Nếu người dùng không chỉ rõ phần nào cần import, mà chỉ import mopdule một cách chung chung, thì phần export default này sẽ được import.

**Các biến thể import:**

<span class='solution-label'>Named import</span>

Sử dụng "named import", chúng ta sẽ import những thứ cần thiết, tránh import cả module.

```js
import { sum, mult } from './lib.js';

console.log(sum(1, 2, 3, 4));
console.log(mult(1, 2, 3, 4));
```

<span class='solution-label'>Alias thành một cái tên khác</span>

Bằng cách sử dụng keyword **as**, chúng ta có thể import và gán một cái tên khác cho phần api vừa được import.

```js
import { sum as addAll, mult as multiplyAll } from './lib.js';

console.log(addAll(1, 2, 3, 4));
console.log(multiplyAll(1, 2, 3, 4));
```

<span class='solution-label'>default import</span>

Như đã nhắc đến phía trên, nếu module có export default, thì khi đứng ở module khác chúng ta có thể import phần default đó như sau:

```js
import getName from "/path/to/students.js";

getName(73);
```

<span class='solution-label'>Mix vừa default import vừa named import</span>

```js
import { default as getName, /* .. others .. */ }
   from "/path/to/students.js";

getName(73);
```

<span class='solution-label'>Namespace import</span>

Cuối cùng, bạn có thể  sử dụng dấu * để import toàn bộ mọi thứ được export bên trong một module, bao gồm cả default và named export, gom chúng thành một **name space** - một biến xài chung như sau:

```js
import * as Student from "/path/to/students.js";

Student.getName(73);
```

## 7. Khác nhau giữa ES6's module và CommonJS's module (Quan trọng)

Tới phần quan trọng nhất rồi. Ở section này, chúng ta sẽ cùng nhau tìm hiểu về một số khác biệt giữa CommonJS module và ES module. Chúng rất thú vị và có thể nhiều dev trong số chúng ta vẫn chưa biết tới.

Mọi điểm khác nhau giữa ES module và CommonJS module có thể được tóm gọn bằng một câu như sau: ES6 Module là **Static** và CommonJS Module là **Dynamic**. Cụ thể, NodeJS chạy ở server, vì thế  mọi thứ import, export sẽ diễn ra ở **Runtime**, ngược lại ESM diễn ra ở **Parse time** - trước khi code chạy (ví dụ với trường hợp sử dụng transpiler Babel hay bundler như Webpack).

Từ điểm khác biệt cốt lõi đó sẽ kéo theo các điểm khác nhau giữa ESM và CommonJS module như:

<span class='problem-label'>Tôi có thể đặt import, export ở đâu?</span>

**ESM:**
Bắt buộc phải ở **top-level** scope, hay nói cách khác: **không được nằm trong các câu lệnh rẽ nhánh if, else, trong các funtcion con,...**

```js
// valid
import foo from 'foo';

//invalid 
if (false) {
  import bar from 'bar';
}

// invalid
setTimeout(function () {
  export let num = 14;
})
```

Lý do như đã nói phía trên, ESM chỉ hoạt động ở quá trình **Parse Time**, tổng hợp code, trước khi code chạy. Nhìn chung, mọi thứ import và export phải được **biết trước**, không cho phép dynamic import hay export dựa theo một điều kiện nhất định trong suốt quá trình chạy code.

**CommonJS:**
Bạn có thể đặt require/module.exports **anywhere**

```js
if (Math.random() > 0.1) {
  exports.foobar = 7;
} else {
  require('lib.js');
}
```

Với CommonJS module, mọi thứ xoay quanh object, mọi thứ diễn ra ở **Runtime**. exports, require nhìn chung cũng chỉ là add, get value từ một object, bạn có đặt ở bất kỳ logic, bất kỳ scope nào tùy thích.

<span class='problem-label'>Khi nào có thể sử dụng được các giá trị import?</span>

**ESM:**
Dùng trước cả khi import:

```js
// valid
console.log('this is ok', foo);
import foo from 'foo';
```

Một lần nữa, vì import, export trong ESM diễn ra ở quá trình parse code, nên các cú pháp import có thể được **hoisted** giống như khi khai báo **var**, khiến cho đoạn code trên hoàn toàn hợp lệ.

**CommonJS:**
Với CommonJS, bạn không thể refer tới một giá trị trước khi nó được require.

```js
//throws an error
console.log('oh no an error', foo); // ReferenceError
const foo = require('./foo');
```

Ở đây, việc thực hiện gọi require để import một module chỉ đơn thuần là chạy một hàm, không hề có hoisting ở đây, dẫn đến lỗi **ReferenceError**

<span class='problem-label'>Chúng ta có thể import bằng cách nào?</span>

**ESM:**
String literal, túm lại giá trị import phải là string

```js
// valid
import foo from 'foo';

//invalid 
import foo from 'f' + 'oo';
import foo from `template-string`;
import foo from 6;
import foo from {};
```

**CommonJS:**
Như đã nhắc ở section trên khi nói về CommonJS, **require là một method**, không phải là native syntax như **import**. Chính vì việc nó là một hàm bình thường, chúng ta có thể  pass vào logic import tùy thích.

```js
require(hasDoneSomething ?
  'left-pad' :
  Math.random() * Date.now() / 2 + 7 + '.js'
);
```

<span class='problem-label'>Variable binding</span>

**ESM:**
Với import và export trong ESM, variables sẽ được bind mặc định.

```js
// foo.js
export let foo = 4;
export function incFoo() { foo += 1; }
//main.js
import { foo, incFoo } from './foo.js';
console.log(foo); // 4
incFoo();
console.log(foo); // 5
```

Như chúng ta thấy từ kết quả console.log. Mỗi lần chạy hàm <span class='inline-code'>incFoo()</span>, biến <span class='inline-code'>foo</span> cũng được tăng lên, như vậy mặc định đã có quá trình bind variable.

**CommonJS:**
Với CommonJS, mọi thứ... có chút phức tạp hơn, cùng xem xét kỹ đoạn code dưới đây:

```js
// lib.js
var foo = 4;
module.exports = { foo, bar: 7, incFoo, incBar };
function incFoo() { foo += 1; }
function incBar() { module.exports.bar += 1; };

// main.js
var instance = require('./lib');
console.log(instance.foo, instance.bar); // 4, 7
instance.incFoo();
instance.incBar();
console.log(instance.foo, instance.bar); // 4, 8
```

Với CommonJS thì không có cơ chế variable binding mặc định kia. Tức là, biến <span class='inline-code'>foo</span> được export ở dòng thứ 2 kia chỉ đơn giản nhận giá trị là **4** (key là **foo**, value là **4**). Khi gọi <span class='inline-code'>incFoo()</span>, biến foo ở dòng thứ nhất được tăng lên, nhưng foo trong object **exports** thì không.

Để tăng được biến đếm khi sử dụng CommonJS module, trong hàm <span class='inline-code'>incBar</span>, ta phải trỏ trực tiếp tới giá property <span class='inline-code'>bar</span> trong object exports, cụ thể là **module.exports.bar**

## 8. Kết luận

Bài viết hôm nay khá dài, cám ơn các bạn đã đón đọc. Chúc các bạn học tốt và nắm được các vấn đề chủ chốt về Module trong JavaScript.

Mến chào các bạn, hẹn gặp lại các bạn trong các post tiếp theo.

## 9. Nguồn và bài viết hay liên quan

Các concept, diễn giải, ví dụ trong bài viết được mình tìm tòi và tổng hợp từ nhiều nguồn, các bạn có thể đọc tài liệu, xem video gốc, hoặc thậm chí đào sâu hơn về Module Pattern thông qua các tài liệu dưới đây:

<a href="https://www.sitepoint.com/understanding-es6-modules/#:~:text=While%20CommonJS%20and%20ES6%20modules,demand%20while%20executing%20the%20code">Understanding ES6 Modules</a> - Tác giả: **Craig Bucker**

Video youtube: <a href="https://www.youtube.com/watch?v=8O_H2JgV7EQ">Modules: ES2015 vs. CommonJS (English)</a>

You Don't Know JS Yet: <a href="https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch8.md">Chapter 8: The Module Pattern</a>

<a href="https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript">The Module Pattern - Learning JavaScript Design Patterns</a> Tác giả: **Addy Osmani**