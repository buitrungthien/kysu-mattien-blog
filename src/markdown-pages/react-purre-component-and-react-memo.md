---
title: 'React.PureComponent và React.memo - bạn nhất định phải biết'
date: '2020-08-09'
author: { name: 'Thiên Bùi' }
tag: 'tech'
image: 'https://i.imgur.com/eqnM93z.png'
description: 'Bạn đã biết làm sơ sơ với React? Tốt! Giờ là lúc chúng ta quan tâm đến vấn đề performance thôi'
---

Mến chào các bạn đã quay trở lại với **“kỹ sư mặt tiền”** ngày hôm nay. Chủ đề của bài viết hôm nay sẽ là về **React PureComponent** và **React memo**.

Nếu bạn nào còn đang bỡ ngỡ chưa từng sử dụng hay dùng rồi nhưng chưa thực sự hiểu cặn kẽ 2 khái niệm trên thì mình xin nói ngắn gọn rằng 2 kỹ thuật dùng trong React trên nhằm giúp tăng performance, cụ thể là giảm thiểu số lần re-render không cần thiết - gây hao tốn performance.

Bằng cách nêu vấn đề và khởi sự với PureComponent và memo, sắp tới mình sẽ cho ra 1 series đi sâu vào **React hooks**, giúp các bạn hiểu và sử dụng thành thạo các hooks (vì sao và khi nào cần sử dụng useCallback, useMemo, v.v…) trong React nha.

Chúng ta bắt đầu thôi.

## 1. Có một sự thật khá nhức nhối đó là cứ Component cha re-render là toàn bộ con cháu, chút, chít re-render theo.

Đầu tiên, mình xin phép làm rõ khái niệm **re-render** và **re-paint** khi làm việc với ReactJS.

Chắc hẳn các bạn đã biết dev chúng ta làm việc với React là làm việc với DOM ảo, còn React mới trực tiếp làm việc với DOM thật.

Từ lúc một Component React được tạo ra và trong suốt quá trình nó được mount, hiển thị trên trình duyệt, bản thân Component này sẽ trải qua các quá trình update state, re-render liên tục cho tới lúc unmount.

Giữa các lần update (re-rendering) này, React sẽ lấy kết quả render của chúng (là các thẻ jsx nằm trong hàm method **render**- ứng với React Class Component, hay các tag jsx được đặt trong câu lệnh **return** - ứng với React Functional Component để so sánh (React gọi nó là cơ chế **diffing**).

Nếu kết quả so sánh này có sự khác biệt, React sẽ **thực sự** change cây DOM thật (cái này gọi là re-painting). Nhìn chung, thứ ảnh hưởng đến performance của một trang web nhiều nhất chính là quá trình **re-painting** (vẽ lại) này.

Và chính vì có cơ chế kiểm tra **diffing** này đã làm nên điều kỳ diệu của React. React đã hạn chế được số lần re-painting, điều này chính là yếu tố then chốt giúp React chạy nhanh, mượt mà, ít hao tốn performance.

Nhưng ngoài re-painting ta cũng phải cân nhắc đến yếu tố re-rendering.

Đồng ý re-rendering không tốn nhiều performance, thứ ảnh hưởng nhiều nhất đến performance chính là thao tác re-paiting - vẽ lại DOM thật kia.

Nhưng… phàm là một hoạt động bất kỳ nào cần xử lý trong máy tính đều gây tốn performance và một lượng thời gian xử lý nhất định, dù ít nhay nhiều. Cụ thể là cơ chế diffing này, bản thân nó cũng phải làm các thao tác so sánh giữa các lần re-render để quyết định có change DOM thật hay không.

Và khi có quá nhiều lần re-render không cần thiết thì… tích gió thành bão, performance sẽ bị hao tốn nhiều, app sẽ bị chậm.

Thậm chí vì một lý do nào đó bạn xử lý các thao tác so sánh, tìm kiếm phần tử mảng, v.v… trong các lần render, thì mỗi khi các lần re-render vô ích kia diễn ra đồng nghĩa với đống logic xử lý - vốn rất tốn performance kia cũng sẽ chạy nhiều lần, không tốt cho performance.

<span class='problem-label'>Bài toán</span>

Implement một Facebook-post component. Mỗi post có 2 thành phần chính là **nội dung bài post** và **số lượt like**. Nội dung bài post sẽ không thay đổi, còn số lượt like sẽ tăng lên khi bấm vào nút **Hack Like**.

```jsx
import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';

class FacebookPost extends Component {
  state = {
    likeCounter: 0,
  };

  likeClickHandler = () => {
    this.setState(prevState => ({ likeCounter: prevState.likeCounter + 1 }));
  };

  render() {
    return (
      <div>
        <LikeCounter likeCounter={this.state.likeCounter} />
        <PostContent postContent="Trời trong xanh, nắng long lanh, chim hót líu lo trên cành" />
        <button onClick={this.likeClickHandler}>Hack like :))</button>
      </div>
    );
  }
}

class LikeCounter extends Component {
  render() {
    console.log('re-render LikeCounter');
    return <div>Số lượng like: {this.props.likeCounter}</div>;
  }
}

class PostContent extends Component {
  render() {
    console.log('re-render PostContent');
    console.log(
      'tưởng tượng đây là một logic tìm kiếm, sắp xếp' +
        'chạy lâu ơi là lâu, mà cứ bị chạy đi chạy lại hoài'
    );
    return <p>{this.props.postContent}</p>;
  }
}

render(<FacebookPost />, document.getElementById('root'));
```

Bên dưới là demo (nhớ bấm, hoặc kéo dài **console** ra để xem log bạn nhé). sau đó bấm vào nút "Hack Like" nào!

https://stackblitz.com/edit/react-musrtr?file=Hello.js

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/cbjSHpw.png' alt='re-render không cần thiết gây hao tốn performance' />
  </div>

  <p class='image-description'>Re-render không cần thiết gây hao tốn performance</p>
</div>

Mỗi khi bấm vào nút "Hack like", biến state <span class='inline-code'>likeCounter</span> sẽ được tăng lên. Biến state này đồng thời được pass vào component con là **LikeCounter** giúp component con này hiển thị được số lượt like.

Vấn đề ở đây là nhìn vào console log, ta sẽ thấy component PostContent cũng được **re-render** mỗi khi bấm nút like. Thứ chúng ta không hề mong muốn, vì bản thân prop <span class='inline-code'>postContent</span> của nó không hề thay đổi, lẽ ra nó không nên chạy các lần re-render không cần thiết.

Nhưng hóa ra đó lại là default-behavior của React. Rằng mỗi lần component cha re-render (cha ở đây là component **FacebookPost**) thì các component con ngay bên dưới nó (ở đây là **LikeCounter** và **PostConTent**) cũng sẽ được re-render.

Giả sử tiếp tục **LikeCounter** và **PostContent** lại là cha của các component khác nữa, thì mỗi khi **LikeCounter** và **PostContent** này re-render thì các component con bên trong chúng cũng sẽ lại được re-render theo.

Như một dây chuyền, điều này dẫ đến việc **cứ Component cha re-render là toàn bộ con cháu, chút, chít re-render theo.**

Ngoài việc ảnh hưởng performance, việc re-render này còn có thể gây ra lỗi UX khi kết hợp với các UI library có animation. Ví dụ sau đây mình sử dụng Kendo React UI để vẽ một chart hình tròn, thống kê độ tuổi trung bình dân số thế giới.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import '@progress/kendo-react-charts';
import '@progress/kendo-react-popup';
import { ComboBox, DropDownList } from '@progress/kendo-react-dropdowns';
import '@progress/kendo-react-inputs';
import '@progress/kendo-react-intl';
import '@progress/kendo-data-query';
import '@progress/kendo-drawing';
import '@progress/kendo-file-saver';

import {
  Chart,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartTitle,
} from '@progress/kendo-react-charts';

const series = [
  { category: '0-14', value: 0.2545 },
  { category: '15-24', value: 0.1552 },
  { category: '25-54', value: 0.4059 },
  { category: '55-64', value: 0.0911 },
  { category: '65+', value: 0.0933 },
];

const labelContent = props => {
  let formatedNumber = Number(props.dataItem.value).toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: 2,
  });
  return `${props.dataItem.category} years old: ${formatedNumber}`;
};

class ChartContainer extends React.Component {
  render() {
    return (
      <Chart>
        <ChartTitle text={this.props.chartTitle} />
        <ChartLegend position="bottom" />
        <ChartSeries>
          <ChartSeriesItem
            type="pie"
            data={series}
            field="value"
            categoryField="category"
            labels={{ visible: true, content: labelContent }}
          />
        </ChartSeries>
      </Chart>
    );
  }
}

class App extends React.Component {
  state = { useLessCount: 0 };

  countClickHandler = () => {
    this.setState(prevState => {
      return { useLessCount: prevState.useLessCount + 1 };
    });
  };

  render() {
    return (
      <>
        <p>
          Bấm vào nút bên dưới tăng biến đếm, nhưng không đụng chạm gì đến cái
          chart nha các bạn:
        </p>
        <button onClick={this.countClickHandler}>
          {this.state.useLessCount}
        </button>
        <ChartContainer chartTitle="Độ tuổi dân số thế giới" />
      </>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('my-app'));
```

Live - demo:

https://stackblitz.com/edit/react-c1uykr?file=app%2Fmain.jsx

Khi bấm vào button counter, các bạn sẽ thấy chart của chúng ta bị re-render, dẫn đến nó bị flick, nhấp nháy mỗi khi bấm nút counter. Đây là lỗi xảy ra khá phổ biến sinh ra từ việc re-render khi làm việc với các UI lib có animation.

Prop <span class='inline-code'>chartTitle</span> của component **ChartContainer** không hề thay đổi, và bản thân nó cũng không có nhu cầu re-render. Nhưng vì component cha (component App) re-render, đã kéo theo component con re-render, và gây ra lỗi trên.

## 2. Vậy làm cách nào để ngăn việc re-render không cần thiết kia?

Trong React Class Component có một life cycle method là <span class='inline-code'>shouldComponentUpdate</span> dùng để quyết định xem component có được re-render hay không.

Nếu method này **return** <span class='inline-code'>true</span> thì component sẽ tiếp tục quá trình re-render, còn nếu **return** <span class='inline-code'>false</span> thì component sẽ stop re-render.

Mặc định trong mỗi Class Component thì life cycle này default trả ra **true** - và đây chính là yếu tố đã làm cho việc **cha render, con render theo như ở ví dụ trên**

<span class='solution-label'>Giải pháp</span>

Can thiệp vào hook shouldComponentUpdate bên trong component **PostContent** như sau:

```jsx
class PostContent extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.postContent !== nextProps.postContent) {
        return true;
        }
        return false;
    }
```

Giờ thử bấm lại vào nút Like khi nãy:

https://stackblitz.com/edit/react-3qmjke

Bạn sẽ thấy chỉ có component **LikeCounter** được re-render, còn **PostContent** thì không. Hoan hô!

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/rMxzJjx.png' alt='Hạn chế re-render không cần thiết bằng componentShouldUpdate' />
  </div>

  <p class='image-description'>Hạn chế re-render không cần thiết bằng componentShouldUpdate</p>
</div>

Bằng cách làm này, chúng ta đã ngăn chặn được việc re-render không cần thiết ở component **PostContent**. Giờ đây, chỉ khi nào component cha re-render và prop <span class='inline-code'>postContent</span> thay đổi thì **PostContent** mới được re-render.

Làm tương tự với ví dụ chart **độ tuổi dân số thế giới** phía trên, chúng ta đã ngăn chặn được lỗi re-render và flick animation chart. Giờ đây, bấm nút tăng biến counter sẽ không làm chart bị nhấp nháy nữa.

https://stackblitz.com/edit/react-uferbr?file=app%2Fmain.jsx

## 3. Pattern lặp đi lặp lại, React lắng nghe cộng đồng dev, và released React.PureComponent.

Việc handle và xử lý re-render bằng <span class='inline-code'>shouldComponentUpdate</span> kia nhiều đến nỗi đến version 15.3, React đã released class **PureComponent** bên cạnh class **Component**. Giờ đây, ngoài việc **extends Component**, chúng ta có thể **extends PureComponent**.

Về cơ bản, thay vì phải tự tay viết các logic so sánh bên trong componentShouldUpdate như lúc trước, PureComponent sẽ tự động xử lý thêm một bước **so sánh nông (shallow comparison)** bên trong life cycle **shouldComponentUpdate** để đảm bảo component chỉ được re-render khi các props hay state có sự thay đổi, từ đó cải thiện performance.

```jsx
class PostContent extends PureComponent {
  // PureComponent đã implement sẵn tính năng so sánh props
  // và state trong shouldComponentUpdate, chúng ta không cần phải làm manually như thế này nữa

  //   shouldComponentUpdate(nextProps, nextState) {
  //     if (this.props.postContent !== nextProps.postContent) {
  //       return true;
  //     }
  //     return false;
  //   }

  render() {
    console.log('re-render PostContent');
    console.log(
      'tưởng tượng đây là một logic tìm kiếm, sắp xếp' +
        'chạy lâu ơi là lâu, mà cứ bị chạy đi chạy lại hoài'
    );
    return <p>{this.props.postContent}</p>;
  }
}
```

## 4. React.memo

**PureComponent** dùng cho các **React Class Component**, còn **React Functional Component** thì dùng... **memo**.

Với React Functional Component chúng ta sẽ không có life cycle shouldComponentUpdate, và cũng không thể extends từ PureComponent, thay vào đó React cung cấp cho chúng ta một Higher-order-component có tên **memo**.

vẫn là ví dụ về component PostContent bên trên, thay vì implement <span class='inline-code'>shouldComponentUpdate</span> hay <span class='inline-code'>extends PureComponent</span>. Với Functional Component và React.memo, ta làm như sau:

```jsx
const PostContent = props => {
  return <p>{props.postContent}</p>;
};

export default React.memo(PostContent);
```

hoặc

```jsx
const PostContent = React.memo(props => {
  return <p>{props.postContent}</p>;
});

export default PostContent;
```

Nếu bạn muốn custom hàm so sánh của memo thì hãy pass vào tham số thứ 2 của React.memo 1 callback. Callback này có 2 arguments là prevProps và nextProps.

**Ví dụ:**

```jsx
function PostContent(props) {
  /* render using props */
}
function areEqual(prevProps, nextProps) {
  /*
  trả ra true nếu nextprops và prevProps bằng nhau, 
  ngược lại trả ra false.
  */
  if (prevProps.postContent === nextProps.postContent) {
    return true;
  }
  return false;
}
export default React.memo(PostContent, areEqual);
```

<span class='warning-label'>Lưu ý:</span>

- Có một tí khác biệt ở đây là React.memo chỉ kiểm tra props change.
- Tương tự như PureComponent, memo cũng chỉ thực hiện **so sánh nông** trên một object.
- Nếu tinh ý, bạn sẽ phát hiện ra logic trả ra **true** và **false** của React.memo và shouldComponentUpdate là trái ngược nhau. Đúng vậy, vì **memo** là viết tắt của **memoization**. Đại ý là component này có cần **nhớ**, có cần **trả ra giá trị render trước đó hay không?** (Cụ thể, ở đây ta nói, nếu props <span class='inline-code'>postContent</span> next và prev là giống nhau, thì hãy **nhớ** và **trả ra giá trị render trước đó** hay nói cách khác là **không re-render**). Còn với <span class='inline-code'>shouldComponentUpdate</span> lại có ý nghĩa là **có tiếp tục re-render hay không?** . Lúc này logic sẽ là, nếu prop <span class='inline-code'>postContent</span> next và prev là giống nhau thì không re-render, nên return ra **false**, ngược lại thì return ra **true**. Đến lúc này thì chúng ta đã clear vì sao logic return true, false của memo và shouldComponentUpdate trái ngược nhau rồi đúng không các bạn!?

## 5. Ghi nhớ PureComponent và memo chỉ thực hiện "so sánh nông"

Trong các phần phía trên mình nói khá nhiều đến cụm từ **so sánh nông** hay **shallow comparison**. Vậy so sánh nông ở đây là gì?

Trước hết, chúng ta hãy cùng nhớ lại khẩu quyết nhập môn về **primiteve typed varibales** và **reference typed varibales** trong javascript.

**Primitive** tức là khi khai báo các biến ví dụ như string, number, boolean với cú pháp **literal**, thì các biến hứng giá trị của chúng thực sự nắm giữ **giá trị** string hay number đó.

Ví dụ:

```js
myName = 'thien';
myName2 = 'thien';
```

Thì biến myName thật sự đang nắm giữ gí trị 'thien', myName2 cũng vậy.

Nên nếu thực hiện phép so sánh myName và myName2

```js
console.log(myName == myName2);
```

thì kết quả sẽ là **true**

**Reference** thì không như thế. Khi khai báo một biến gán với một object (bao gồm object, array, function. Vì trong javascript, 3 thứ vừa kể trên đều là object). Thì biến đó chỉ thật sự nắm giữ **địa chỉ vùng nhớ của object đó** trong vùng **heap**. Từ địa chỉ vùng nhớ này, memory trong máy tính mới tiếp tục mò tới vùng **heap** để lấy được giá trị của object.

Tại sao lại lằng nhằng phức tạp như vậy? Vì quá trình khởi tạo và lưu giữ các giá trị object này tốn performance, nặng nhọc, nên js quyết định sẽ chỉ khởi tạo chúng một lần ở vùng heap. Làm như vậy, các biến tham chiếu hay tạo mới từ object sẽ chỉ cần gán bằng với địa chỉ vùng nhớ của object này, không cần phải khởi tạo hay bê nguyên object đi nơi khác, đỡ hao tốn performance.

Lấy ví dụ cho tường minh:

```js
const author = { name: 'thien' };
```

Lúc này, bên trong javascrip run-time environment sẽ làm các bước như sau:

- Khởi tạo object trong vùng heap có giá trị {name: 'thien'}. Địa chỉ tương ứng trong heap của object này ví dụ (thường) sẽ có dạng mã hexa **0x0abcd2321**
- Địa chỉ vùng nhớ **0x0abcd2321** được trả ra cho biến <span class='inline-code'>author</span> nắm giữ.

Lúc này, nếu ta khai báo một biến <span class='inline-code'>author2</span> bằng <span class='inline-code'>author</span>

```js
const author = { name: 'thien' };
const author2 = author;
```

Thì khi so sánh:

```js
console.log(author === author2);
```

Sẽ cho ra kết quả là **true**. Vì cả 2 biến đều nắm giá trị cùa **vùng nhớ**, cụ thể là bằng **0x0abcd2321**

Nhưng nếu khai báo biến <span class='inline-code'>author2</span> như sau:

```js
const author = { name: 'thien' };
const author2 = { name: 'thien' };
```

Thì khi so sánh:

```js
console.log(author === author2);
```

Sẽ cho ra kết quả là **false**.

Vì khi khai báo biến <span class='inline-code'>author2</span>, runtime-environment sẽ đi khởi tạo một object khác trong vùng heap có giá trị { name: 'thien' }, và tiếp tục gán **giá trị vùng nhớ** của object vừa tạo cho biến <span class='inline-code'>author2</span>. Vì **gí trị vùng nhớ là duy nhất**. Nên author2 lúc này sẽ nắm giữ gí trị **0x0abcd4567**

Kết quả là khi so sánh **0x0abcd2321** và **0x0abcd4567**, js nhìn thấy đây là 2 con số khác nhau, nên sẽ cho ra kết quả **false**.

OK, tiếp tục với so sánh nông nào.

Lấy ví dụ về một **nested object** - object lồng object.

```js
const nestedObjectA = {
  author: {
    name: 'Thien Bui',
    country: 'Viet Nam',
  },
};

const nestedObjectB = {
  author: {
    name: 'Thien Bui',
    country: 'Viet Nam',
  },
};
```

Thì khi so sánh

```js
console.log(nestedObjectA === nestedObjectB);
```

Sẽ cho ra kết quả là **false**. Lý do thì như ta đã biết vì hai biến <span class='inline-code'>nestedObjectA</span> và <span class='inline-code'>nestedObjectB</span> đang trỏ đến hai **địa chỉ vùng nhớ** khác nhau. Và đây cũng chính là **so sánh nông**.

Vì sao ư? Vì phép so sánh trên chỉ mới dừng lại ở **bề mặt**, ở mức **nông**, khi mà chỉ vừa nhìn thấy 2 con số chứa 2 địa chỉ vùng nhớ khác nhau là phép toán sẽ return ra **false** ngay.

Ngược lại với **so sánh nông** là **so sánh sâu** - **deep comparison**.

Nếu phép so sánh vừa rồi mà thực hiện **so sánh sâu** thì js sẽ đi so sánh đi sâu vào tận các property trong cùng.

```js
nestedObjectA.author.name === nestedObjectB.author.name;
//true. Vì cả 2 property name này đều đang là kiểu primitve, đều đang chứa giá trị 'Thien Bui'
nestedObjectA.author.country === nestedObjectB.author.country;
//true. Vì cả 2 property name này đều đang là kiểu primitve, đều đang chứa giá trị 'Viet Nam'
```

Nhưng đời không như mơ, căn bản việc so sánh sâu như thế này rất phức tạp và tốn thời gian trong trường hợp các object có độ lồng nhau cao, điều này không khả thi khi đưa vào các phép so sánh object. Thành ra **PureComponent** hay **React.memo** quyết định chỉ thực hiện so sánh nông mà thôi. Đỡ tốn performance hơn phải không nào các bạn!?

## 6. Các lỗi dễ mắc khiến cho các nỗ lực sử dụng PureComponent và memo trở thành công cốc.

Phù, dài và buồn ngủ quá rồi, chủ đề này cũng cần nói khá dài, thôi thì mình sẽ gửi đến các bạn ở bài viết tiếp theo nhé :D

## 7. Kết luận

Qua bài viết trên, hy vọng mình đã giúp các bạn đã nắm được:

- Cách thức re-render giữa các component cha con trong React
- Cách tối ưu performance bằng việc tránh re-render không cần thiết
- Lý do vì sao PureComponent và memo ra đời
- So sánh nông là gì

Ở bài viết tiếp theo, mình sẽ chỉ ra <a href='https://www.kysumattien.com/mistakes-make-memo-and-pure-component-useless/'>Các lỗi dễ mắc khiến cho các nỗ lực sử dụng PureComponent và memo trở thành công cốc</a>. Các bạn nhớ đón đọc nhé.

Cảm ơn các bạn đã đồng hành từ trên đầu trang đến tới tận dưới này ^^.

Mọi lời góp ý và động viên của các bạn sẽ là nguồn động lực cho mình tiếp tục ra đời các bài blog technical như thế này.

Mến chào các bạn!
