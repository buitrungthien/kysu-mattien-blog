---
title: 'Tất tần tật về useMemo và useCallback'
date: '2020-09-05'
author: { name: 'Thiên Bùi' }
tag: 'tech'
featuredImgUrl: 'https://i.imgur.com/K5sxPWF.jpg?1'
featuredImgAlt: 'Tất tần tật về useMemo và useCallback'
description: 'Đã tìm hiểu và thử dùng useMemo và useCallback nhưng vẫn còn khó hiểu? Bài viết này sẽ giúp bạn'
---

Mến chào các bạn đã quay trở lại với "Kỹ sư mặt tiền".

Nếu bạn giống như mình, đã từng mày mò tìm hiểu và áp dụng React hooks vào dự án, và rồi cứ mơ mơ hồ hồ về cách sử dụng, giống và khác nhau, khi nào sử dụng cái nào,... giữa **useMemo và useCallback**. Thì hãy cùng mình tìm hiểu bài viết ngày hôm nay nhé.

## 1. Một loạt câu hỏi "tại sao?"

> Note: Nếu bạn đã quá quen thuộc với các vấn đề về re-render, tại sao, tác hại, ... thì xin hãy skip qua section này.

Nếu đã đọc post trước của mình về <a href="https://kysumattien.com/miskates-make-memo-and-pure-component-useless/" rel="noopener noreferrer" target="_blank">**Các lỗi sai khiến việc sử dụng React.memo và PureComponent trở nên vô ích**</a>, mình đã có đề cập đến việc:

**Khác với Class Component, các Functional Component không có các life cycle như constructor, componentDidmount,... Mọi thứ nằm bên trong "ruột" của một Functional component chính là body của hàm render ứng với người anh em Class component.**

Điều này dẫn đến việc, bất kể khi nào functional component đó re-render, các hàm và logic tính toán khai báo bên trong component sẽ được **tính toán lại**.

<span class="problem-label">Vì sao tính toán lại?</span>

Vì đây là cách hoạt động của functional component. Mọi thứ trong thế giới của **Functional component** đều xoay quanh **closures**. (Có thể trong tương lai mình sẽ viết một post về chủ đề này.)

Nói ngắn gọn thì việc tạo mới các **funtion hay logic tính toán ở mỗi lần re-render là bắt buộc**, bằng cách làm như vậy thì các funtion hay các hàm tính toán đó mới có khả năng access được các **giá trị mới nhất** của các **biến state**.

Vì ở mỗi lần re-render, functional component kia sẽ tạo ra một closure khác nhau (một vỏ bọc, chứa tất cả hàm, biến của component đó). Nếu một hàm khai báo bên trong component có sử dụng **một biến state bất kỳ** để tính toán, mà bản thân hàm này không được tạo mới ứng với mỗi lần re-render, thì nó sẽ chỉ **refer** tới biến state cũ của lần render trước đó, dẫn đến tính toán sai.

Nhưng bản thân việc tạo mới các function liên tục bên trong functional component lại nảy sinh vấn đề mới, đó là re-render.

<span class="problem-label">Vì sao re-render?</span>

Vì function cũng là object, ở mỗi lần re-render, hàm được tạo mới, tương đương một object được tạo mới. Trong trường hợp object hay function này được pass xuống component con, thì component con sẽ bị re-render, mặc cho component con đó có áp dụng React.memo hay React.PureComponent. (Cơ chế so sánh nông, bạn đọc lại mục 5 trong <a href="https://kysumattien.com/react-purre-component-and-react-memo/" rel="noopener noreferrer" target="_blank">bài này</a>)

<span class="problem-label">Vì sao nên tránh re-render? Re-render là xấu?</span>

Không. **Re-render không xấu**, nó chỉ là một bước để React **so sánh** và quyết định có nên **update** thứ gì hay không. Quá trình re-render được handle bởi React và nó diễn ra **rất nhanh**, performance đã được đảm bảo tối ưu nhất có thể bởi React. Thường thì với các tác vụ render text, logic nho nhỏ, bạn **không cần** và **không nên** bận tâm đến việc có chạy dư 1, 2 lần re-render. Thậm chí việc áp dụng các kỹ thuật memoization vào các logic nhỏ như vậy càng làm performance **tệ hơn**, vì nó phát sinh thêm các phần việc kiểm tra, so sánh, ...

**Nhưng...**

Khi kết hợp với các logic tính toán lớn như hiển thị bảng dữ liệu với cả trăm dòng dữ liệu, logic sort, filter, hay các tác vụ vẽ biểu đồ, các UI library có animation,... thì bạn bắt buộc phải quan tâm tới việc hạn chế tối đa các lần re-render không cần thiết.

<span class="problem-label">Tại sao phải hạn chế tối đa?</span>

Vì với các UI library có animation, sẽ xảy ra tình trạng animation flicking.

Với các tác vụ tính toán sort, filter nặng nề, nó sẽ chạy đi chạy lại gây hao tốn performance.

## 2. Vậy useMemo và useCacllback là cái gì?

Là hai hook của React, giúp tạo ra các **memoized** function và value, nôm na là khi nào cần tạo mới thì mới tạo mới, không thì dùng lại giá trị cũ, từ đó tránh được các vấn đề về re-render, performance kể trên.

Trang chủ Reactjs đề cập rằng useCallback:

> Trả ra một memoized **function**

Còn useMemo thì:

> Trả ra một memoized **value**

<span class="inline-code">useCallback</span> và <span class='inline-code'>useMemo</span> đều nhận vào 2 tham số.

Tham số thứ nhất là một **function** và tham số thứ hai là **mảng chứa các dependencies**.

```js
const returnedFunction = useCallback(fn, deps);
const returendValue = useMemo(fn, deps);
```

<span class="solution-label">useMemo</span>

<span class='inline-code'>useMemo</span> tập trung vào việc **tránh lặp đi lặp lại các logic tính toán nặng nề**.

Cụ thể, nó trả về một **giá trị** (là kết quả trả về từ việc **thực thi**, **chạy** hàm <span class='inline-code'>fn</span> mà bạn pass vào ứng với tham số thứ nhất).

Nếu một trong số các dependencies thay đổi, thì hàm tính toán sẽ được **thực thi lại**, từ đó trả ra giá trị mới. Ngược lại, nếu nhận thấy giá trị của các dependencies kia không đổi, thì ngay lập tức <span class='inline-code'>useMemo</span> trả ra kết quả trước đó mà không hề tính toán lại, từ đó tránh được một khối lượng lớn công việc, giúp ích cho performance.

Ngoài ra, lợi dụng tính năng trả ra **giá trị trước đó** khi dependencies không thay đổi, ta cũng sẽ tránh được việc tạo mới các object không cần thiết (object cũ sẽ được trả ra), giúp tránh re-render không cần thiết.

<span class="solution-label">useCallback</span>

<span class="inline-code">useCallback</span> thì tập trung giải quyết vấn đề về performance, khi mà các callback function được tạo ở **functional component cha** pass xuống component con luôn bị tạo mới, khiến cho con luôn bị re-render.

<span class="inline-code">useCallback</span> trả về một **function** (chính là function bạn pass vào ứng với tham số thứ nhất), callback function này sẽ được **tạo lại khi một trong số các dependencies thay đổi**. Nếu dependencies không đổi, function trả về sẽ là function trước đó -> tức là function pass xuống component con không bị tạo mới, tương đương không có object được tạo mới -> component con không bị re-render.

## 3. Ví dụ cụ thể với useMemo

<span class="solution-label">Tránh tính toán nặng</span>

**Khi không dùng <span class="inline-code">useMemo</span>**

```jsx
const componentA = () => {
  const [count, setCount] = useState(0);

  const getArray = () => {
    // tưởng tượng một hàm phức tạp, filter,
    // sort một mảng 100 phần tử, tốn 2s để chạy
    const result = filterAndSortAndDoSomething(...);

    return result;
  }

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <div>mảng phức tạp: {getArray()}</div>
    </div>
  )
}
```

Viết như thế này, mỗi lần bấm nút tăng biến <span class='inline-code'>count</span>, componentA sẽ re-render, và hàm <span class='inline-code'>getArray</span> sẽ bị chạy lại, tốn 2s để có kết quả và render ra màn hình.

**Khi dùng <span class="inline-code">useMemo</span>**

```jsx
const componentA = () => {
  const [count, setCount] = useState(0);

  const getArray = useMemo(() => {
    // tưởng tượng một hàm phức tạp, filter,
    // sort một mảng 100 phần tử, tốn 2s để chạy
    const result = filterAndSortAndDoSomething(...);

    return result;
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <div>mảng phức tạp: {getArray()}</div>
    </div>
  )
}
```

Giờ đây, mặc cho bạn bấm nút và tăng biến <span class='inline-code'>count</span>, hàm getArray ngay lập tức trả ra giá trị <span class='inline-code'>result</span> trước đó mà không cần tốn 2s tính toán.

<span class="solution-label">Tránh re-render</span>

**Khi không dùng <span class="inline-code">useMemo</span>**

```jsx
const ComponentA = () => {
  const getStyle = () => {
    return {
      color: 'blue',
      background: 'gold',
    };
  };

  return (
    <div>
      CHA NÈ CON
      <ComponentB myStyle={getStyle()} />
    </div>
  );
};

const ComponentB = React.memo(props => {
  return <div style={props.myStyle}>CON NÈ CHA</div>;
});
```

Viết như thế này, mỗi lần <span class='inline-code'>ComponentA</span> re-render, hàm <span class='inline-code'>getStyle</span> sẽ tạo ra một **object mới** và pass xuống <span class='inline-code'>ComponentB</span>, khiến cho <span class='inline-code'>ComponentB</span> bị re-render (mặc dù đã sử dụng React.memo)

**Khi dùng <span class="inline-code">useMemo</span>**

```jsx
const ComponentA = () => {
  const getStyle = useMemo(() => {
    return {
      color: 'blue',
      background: 'gold',
    };
  }, []);

  return (
    <div>
      CHA NÈ CON
      <ComponentB myStyle={getStyle()} />
    </div>
  );
};

const ComponentB = React.memo(props => {
  return <div style={props.myStyle}>CON NÈ CHA</div>;
});
```

Giờ đây, khi dùng <span class="inline-code">useMemo</span> cho hàm <span class='inline-code'>getStyle</span>, ở các lần re-render sau của <span class="inline-code">ComponentA</span>, object style cũ sẽ được trả ra thay vì tạo mới -> React.memo ở <span class="inline-code">ComponentB</span> nhận thấy prop nhận vào không có sự thay đổi -> không re-render.

## 4. Ví dụ cụ thể với useCallback

<span class="solution-label">Tránh re-render ở component con</span>

**Khi không dùng <span class="inline-code">useCallback</span>**

```jsx
function Parent({ ... }) {
  const [a, setA] = useState(0);
  const onChangeHandler = () => {
    doSomething(a);
  };
  ...
  return (
    ...
    //Pure là component con có sử dụng React.memo
    <Pure onChange={onChangeHandler} />
  );
}
```

Viết thế này, mỗi lần component <span class="inline-code">Parent</span> re-render, callback <span class="inline-code">onChangeHandler</span> sẽ được tạo mới và pass xuống component con <span class="inline-code">Pure</span>. Mặc cho component có sử dụng React.memo, nó vẫn bị re-rendered.

**Khi dùng <span class="inline-code">useCallback</span>**

```jsx
function Parent({ ... }) {
  const [a, setA] = useState(0);
  const onChangeHandler = useCallback(() => {
    doSomething(a);
  }, [a]);
  ...
  return (
    ...
    //Pure là component con có sử dụng React.memo
    <Pure onChange={onChangeHandler} />
  );
}
```

Nhờ sử dụng <span class='inline-code'>useCallback</span>, giờ đây ở mỗi lần component <span class='inline-code'>Parent</span> re-render, hàm <span class='inline-code'>onChangeHanlder</span> sẽ không còn luôn luôn bị tạo mới nữa, mà sẽ chỉ được tạo mới khi depencency của nó là biến <span class='inline-code'>a</span> thay đổi. Function không bị tạo mới -> object không bị tạo mới -> component con nhận vào cũng không bị re-render. Tuyệt vời!

## 5. useMemo dùng thay thế useCallback cũng được

Như đã nói phía trên, <span class="inline-code">useMemo</span> sẽ thực thi hàm được pass vào và trả ra kết quả. Nếu khéo léo, return ra **function** như là một **kết quả**, thì lúc này useMemo sẽ có vai trò và tác dụng giống hệt useCallback.

```js
useCallback(fn, deps)
//tương đương
useMemo(() => fn, deps).
```

## 6. Kết luận

Qua bài viết trên, hy vọng đã giúp các bạn giải mã hai hooks khá khó hiểu trong React là <span class="inline-code">useCallback</span> và <span class='inline-code'>useMemo</span>, đồng thời giúp chúng ta hiểu được các vấn đề về re-render trong thế giới functional component.

Nếu các bạn thấy hay hãy cho mình một like và một share để khích lệ tinh thần mình nha.

Ngoài ra, nếu muốn mình làm thêm bài viết về chủ đề nào thì các bạn comment cho mình biết luôn nha.

Rất mong nhận được ý kiến đóng góp của mọi người.

Hẹn gặp lại các bạn trong các bài viết sau.

## 7. Nguồn và bài viết hay liên quan

<a href="https://medium.com/@jan.hesters/usecallback-vs-usememo-c23ad1dc60" target="_blank" rel="noopener noreferrer">useCallback vs useMemo</a> - Jan Hesters - medium.com

<a href="https://dev.to/milu_franz/demystifying-react-hooks-usecallback-and-usememo-1a8j" target="_blank" rel="noopener noreferrer">Demystifying React Hooks: useCallback and useMemo</a> - Milu - dev.com
