---
title: 'ReactJS render phase, commit phase và ví dụ về getSnapshotBeforeUpdate lifecycle'
date: '2021-08-21'
author: { name: 'Thiên Bùi' }
tag: 'tech'
featuredImgUrl: 'https://i.imgur.com/StutQBw.png?1'
featuredImgAlt: 'internally implemented phases in ReactJS'
description: 'Giới thiệu sơ lược về khái niệm "phase" trong ReactJS. Render phase, commit phase là gì? Ví dụ với getSnapshotBeforeUpdate.'
---

Hello các bạn đã rất lâu không gặp ^^. Hôm nay **kỹ sư mặt tiền** sẽ cùng các bạn tìm hiểu sơ lược về khái niệm "phase" trong ReactJS. Render phase là gì? Commit phase là gì? Điều gì xảy ra trong các phase này, cũng như chia sẻ một số kiến thức, "giác ngộ" mà mình thông suốt được xuyên suốt quá trình tìm hiểu, stack-overflow, google, ngày quên ngủ, đêm quên ăn của mình :))

Số là dạo gần đây công việc chính thức của mình tại công ty là làm về web chat. Trong quá trình code tính năng, thường phải kết hợp các thao tác xử lý DOM thuần, kết hợp với code React để đạt được behavior như mong muốn.

Xuyên suốt quá trình tìm hiểu, fix bug, mình đã rút ra được một số kiến thức, momg muốn chia sẻ đến quý bạn đọc và đặc biệt đến với các bạn dev mới, chưa có kinh nghiệm nhiều với React.

Nào chúng ta bắt đầu!

## 1. Giới thiệu về "phase"

Từ những ngày đầu học, tìm hiểu, làm việc với ReactJS, chúng ta đã được làm quen và thao tác với các React **lifecycle methods**. Tựu chung, đó là những hàm, method mà React cung cấp cho dev chúng ta để can thiệp (mình hay gọi vui, dân dã là chọt ngang, đâm ngang :)) ) vào vòng đời của một component để xử lý logic tại một thời điểm nhất định trong vòng đời của component đó, từ lúc Mount, Update hay cuối cùng là Delete component.

Đó là những **constructor**, **componentDidMount**, **componentDidUpdate**, ... hay dạo gần đây còn có thêm **getDerivedStateFromProps**, **componentDidCatch**, vân vân và vân vân.

Thậm chí nếu đã có cơ hội biết và nghía sơ qua project hiển thị, miêu tả diagram các lifecycle method như ["React lifecycle methods diagram"](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/), chắc hẳn sẽ có nhiều bạn (trong đó có mình) không để ý đến khái niệm "phase" được đề cập ngay trong biểu đồ (và còn nhiều lần được nhắc đến trong document, blog của trang chủ ReactJS).

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/ZZvSrKO.png' alt='React lifecycle methods diagram' />
  </div>

  <p class='image-description'>React lifecycle methods diagram</p>
</div>

Về cơ bản, chúng ta có 2 phase - 2 giai đoạn chính xảy ra xuyên suốt quá trình React chạy là **Render phase** và **Commit phase**. Tuỳ mỗi method khác nhau, các lifecycle methods được nhắc đến phía trên sẽ diễn ra ở một trong 2 phase này. Các bạn có thể click vào link diagram phía trên và nhìn lại một lần nữa để xem lifecycle method nào nằm trong phase nào, hoặc xem list mình liệt kê theo thứ tự hoạt động dưới đây:

- Render phase:
  - counstructor
  - getDerivedStateFromProps
  - shouldComponentUpdate
  - render (hàm render, nơi mà chúng ta return JSX component)

- Commit phase:
  - getSnapshotBeforeUpdate (thực chất method này nằm ở "Pre-commit phase", có thể xem là một phase trung gian thứ 3, xảy ra giữa render và commit phase)
  - componentDidMount, componentDidUpdate, componentWillUnmount (3 thằng này cùng cấp, khác nhau ở chỗ là first render, đang ở update hay delete)

Chúng ta đều biết React implement virtualDOM ngầm bên trong, biểu diễn cấu trúc toàn bộ các component thành phần, cấu thành app của chúng ta (cụ thể là cấu trúc React Fiber). Khi chúng ta khởi tạo component, update, delete các element, các component, chính là lúc React "chơi đùa", khởi tạo, update, delete virtualDOM này. Trong lúc chơi đùa này, các life cycle liên quan sẽ được gọi, thực thi (như `getDerivedStateFromProps`, `shouldComponentUpdate`, hay quay về React "thời xưa" hơn một xíu là `componentWillMount`, `componentWillReceiveProps`, ...). 

Song song với thế giới virtualDOM này, là một cây DOM hàng real từ browser - trình duyệt, thứ mà đang thực sự được show trên trình duyệt cho user xem.

Toàn bộ quá trình xử lý, thao tác với virtualDOM này diễn ra ở **Render phase**. Đặc tính của các methods trong Render phase này là chúng có thể **dừng, chờ** (async set state - thanks to cấu trúc Fiber, state batching) hoặc thậm chí **abort - bỏ đi** lần render này, không tiếp tục chạy các phase sau nếu cần (ví như lúc chúng ta dùng `shouldComponentUpdate` để ngăn render không cần thiết, hay như lúc setState mà trả ra giá trị "primitive" ví dụ như string "abc" giống nhau giữa 2 lần re-render thì React sẽ dừng, không chạy hàm render - đây chính là khái niệm **abort render** mà mình đang nói tới).

Chỉ sau khi quá trình "chơi đùa", update bên trong virtualDOM đó diễn ra xong xuôi và **React nhận ra cần update hàng loạt thay đổi từ virtualDOM vào realDOM để đồng bộ và giúp user thấy được những thứ đã thay đổi** thì React sẽ tiếp tục tiến tới **Commit phase**.

Diễn giải về mặt technical thì sau mỗi lần chạy hàm `render` (vốn là method cuối cùng của **Render phase** phía trên), React nhận được cây virtualDOM mới, React so sánh với cây virutalDOM trước đó để tìm điểm khác nhau. Sau quá trình so sánh này, nếu nhận thấy có sự khác nhau giữa 2 cây virtualDOM, React biết những gì đã thay đổi, nó sẽ apply, update toàn độ những thay đổi đó vào cây realDOM cho user (như insert, update, remove DOM nodes). Đây chính là **Commit phase**. Sau quá trình **update những thay đổi vào realDOM**, các `Did*` method sẽ được gọi, thực thi nếu chúng ta có khai báo sử dụng (`componentDidMount` nếu là lần render đầu, `componentDidUpdate` nếu đang ở lần update và `componentWillUnmount` nếu là delete)

## 2. Những quy ước, DO and DONT trong render phase, commit phase.

Vì tính chất đã nêu của các lifecycle methods trong **Render phase**, rằng chúng có thể bị dừng, chờ, invoke nhiều lần, hoặc thậm chí bị bỏ đi, đã rất nhiều lần trong React document có đề cập tới việc chúng ta không nên **make side effects** bên trong các methods ở Render phase này (ví dụ về side effects như: get thông tin một DOM node bất kỳ; thay đổi, set giá trị DOM node; call API, fetch data từ server, ...)

**Render phase** sẽ là nơi chúng ta thực thi các logic update, set state, chơi đùa với state, props. React đang cố gắng nhào nặn để tạo thành cây virtualDOM ta mong muốn.

**Commit phase** sẽ chỉ diễn ra khi React nhận thấy có sự thay đổi và update một loạt các thay đổi vào realDOM. Các methods trong phase này như `componentDidMount`, `componentDidUpdate` sẽ được đảm bảo chỉ chạy một lần ứng với mỗi sự thay đổi, và sau khi realDOM nodes được update. Đây chính là nơi thích hợp để chúng ta **make side effects** như fetch data; thao tác, set property cho DOM nodes.

Đó là lý do vì sao từ những ngày đầu chúng ta được dạy đặt logic fetchData trong `componentDidMount`, re-fetch data khi prop hoặc state change trong `componentDidUpdate` và nhiều thứ liên quan khác.

Một lý do nữa cho việc không nên make side effect ở các methods trong Render phase là vì:

> The commit phase is usually very fast, but rendering can be slow - ["React document Strict mode"](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)

Hiểu ý nghĩa câu trên thì: "Commit phase thường chạy nhanh (do React handle tốt việc update DOM, batching state update, ...) nhưng render phase thì có thể bị chậm" (do dev handle logic code không tốt, độ phức tạp trong thao tác xử lý duyệt mảng cao, không áp dụng memoize data làm component bị re-render nhiều lần không cần thiết, ...). Nếu cộng thêm việc gọi API fetch data bất đồng bộ và rồi `await` chúng, sẽ càng làm cho render phase càng chậm hơn.

Một lần nữa, ở render phase không nên make side effects.

Đây cũng là một phần nguyên nhân khiến React các version sau này dần dần bỏ đi các life cycle "cũ", legacy, hay đổi tên, gắn thêm tiền tố `UNSAFE_*` để cảnh báo dev hạn chế, tránh dùng để tránh gây ra các issue không đáng có.

<span class="problem-label">Ví dụ về getSnapshotBeforeUpdate method</span>

Để tường minh hơn, chúng ta lấy một ví dụ về code logic make side effect trong method `getSnapshotBeforeUpdate` (diễn ra ở "Pre-commit phase"). Cụ thể là đọc giá trị DOM node (scrollHeight).

Lấy ví dụ chúng ta đang implement tính năng **reverse infinitive scroll** để load nội dung chat cũ hơn trong một ứng dụng chat.

Bất cứ khi nào load more backward, biến state `messages` sẽ được "shifft" với các message mới vào đầu mảng. Điều này vô tình làm cho list messages bị reset position, thanh scroll luôn xuất hiện ở vị trí top, mang lại trải nghiệm tệ cho user.

```jsx
updatedMessages = [...newMessages, ...updatedMessages];
    this.setState({ messages: updatedMessages });
```

Bạn có thể scroll list chat demo ngược trở lên, chạm đến top để load more chat và trải nghiệm ở demo dưới đây.

<iframe src="https://codesandbox.io/embed/chat-before-handle-position-qzql0?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="chat-before-handle-position"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Giải pháp cho vấn đề này là chúng ta cần phải:
1. **đọc, ghi nhớ giá trị scrollHeight, cùng với scrollTop của list chat realDOM ở lần render trước ứng với list messages data cũ**
2. **set lại giá trị scrollTop của list messages realDOM sau mỗi lần React get thêm messages và update vào realDOM**

```jsx
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevState.messages.length < this.state.messages.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }
```

Ở lần đầu render, chúng ta load 10 messages. Tiếp theo, chúng ta lăn chuột lên trên để load more thêm 10 messages nữa.

Tại thời điểm `getSnapshotBeforeUpdate` ("Precommit - phase"), tuy rằng hàm `render` đã chạy (hàm render diễn ra ở cuối phase Render, các bạn nhìn lại vào diagram thể hiện trình tự chạy các method), virtualDOM đã update list messages mới với biến state chứa 20 messages tổng cộng, tuy nhiên vì đang ở phase Pre-commit, **React chưa update các sự thay đổi lên realDOM**, nên các thông tin về scroll position như `scrollHeight` hay `scrollTop` của message list DOM ref vẫn là cũ, vẫn là tương ứng với lần firt load 10 messages - mình tạm gọi là `list ngắn`.

Sau khi phase Commit diễn ra, React update thay đổi lên realDOM, tương ứng lúc này DOM node ref cho message list đã "dài ra" (vì chứa 20 messsages) - mình tạm gọi là `list dài`. Lúc này, như đã trình bày phía trên, method `componentDidUpdate` sẽ được chạy, chúng ta lấy giá trị `list.scrollHeight` của `list dài` hiện tại, trừ đi giá trị scroll position của `list ngắn` trước đó (lúc này đang được lưu trữ dưới biến `snapshot`).

DOM node update, chúng ta đã thành công trong việc giữ lại scroll position cho list chat, tăng trải nghiệm người dùng, tuyệt vời. Chúng ta cũng đã thực hiện đúng quy tắc đề ra ở mục 2, side effects (read, change DOM nodes) chỉ diễn ra ở phase commit, Render phase không được phép có side effects.

Các bạn có thể thử lại behavior mới với demo dưới đây.

<iframe src="https://codesandbox.io/embed/demo-get-snapshot-before-update-mf0wi?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="demo_get-snapshot-before-update"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

<span class="problem-label">Nếu không đọc giá trị DOM ở `getSnapshotBeforeUpate`, vẫn cứ thích đọc DOM node ở Render phase thì sao?</span>

Theo lý thuyết, đọc, nhớ scroll position của cái `list ngắn` phía trên kia chỉ cần diễn ra trước lần React update chagnes to realDOM và biến nó thành `list dài` là được. Vậy giờ mình muốn làm điều này ngay trong Render phase, ví dụ ở method `UNSAGE_componentWillReceiveProps`.

```jsx
  UNSAFE_componentWillReceiveProps(nextProps) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (nextProps.messages.length > this.props.messages.length) {
      const list = this.listRef.current;
      this.prevScrollPosition = list.scrollHeight - list.scrollTop;
    } else {
      this.prevScrollPosition = 0;
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (this.prevScrollPosition !== 0) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - this.prevScrollPosition;
    }
  }
```

Với cách làm lần này, ta dùng một `instance variable` tên `this.prevScrollPosition` để lưu lại giá trị DOM node, mời bạn thử chạy demo bên dưới.

<iframe src="https://codesandbox.io/embed/chat-scroll-position-in-render-phase-o1nx2?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="chat-scroll-position-in-render-phase"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

Có vẻ work đúng không nào!?

Nhưng cách này không được khuyến khích. Dùng `getSnapshotBeforeUpdate` phía trên vẫn là cách đúng nhất và được khuyên dùng nha các bạn.

Lý do là vì ở cách này, chúng ta đã make side effects (giống như query DOM) ở Render phase (componentWillReceiveProps diễn ra ở Render phase).

React document cũng có cảnh báo:

>In the above examples, it is important to read the scrollHeight property in getSnapshotBeforeUpdate because there may be delays between “render” phase lifecycles (like render) and “commit” phase lifecycles (like getSnapshotBeforeUpdate and componentDidUpdate).

Bạn hiểu ý nghĩa câu trên không? Thú thực mình đã phải đọc đi đọc lại cả chục lần và may mắn mới hiểu được đại ý của câu.

Đại ý câu trên nói rằng, việc đọc giá trị DOM nên được đặt trong `getSnapshotBeforeUpdate` (important) vì nếu đặt trong các method ở Render phase (như cái `componentWillReceiveProps` như trên) thì không phải là cách an toàn, vì có thể sẽ có "delays" giữa 2 phase Render và Commit này.

"Hmm, delay là sao nhỉ? Mà có delay thì sao, tui thấy nó work mà?" - Bạn tự hỏi.

Nhớ lại đặc tính các methods ở Render phase có thể bị **pause**, **resume**, **abort**, hoặc thậm chí chạy nhiều lần trước khi qua được phase commit. **Tức là khoảng thời gian từ lúc bạn đọc và ghi nhớ giá trị DOM (`scrollHeight` của `list ngắn`) cho tới lúc thực thi code manipulate DOM ở `componentDidUpdate`, thời gian sẽ bị dài ra, bị delay** hơn **so với việc đọc giá trị DOM ở pre-commit phase rồi ngay sau đó, ở commit phase chúng ta sử dụng nó để tính toán và chagne realDOM**.

Hơn nữa, rủi trong quá trình **delay** đó, DOM node mà ta vừa đọc có sự thay đổi/manipulate (ví dụ xảy ra rất nhanh) thì vô tình giá trị mà ta đọc được "sớm quá" (ở Render phase) sẽ không còn đúng nữa. Việc đọc giá trị DOM đó ở pre-commit phase là an toàn và đúng đắn nhất.

## 4. Kết luận

Như vậy qua bài viết trên, mình đã cùng các bạn tìm hiểu sơ lược về khái niệm "phase" trong React. Nhờ đó đưa biết cách việc nào nên làm, việc nào nên tránh bên trong mỗi phase.

Bài viết tập trung xoay quanh Class Component. Về phần Function Component, chúng ta cũng sẽ có định nghĩa khá tương đồng, nơi mà những `useEffect` dùng để handle side effects. Tuy nhiên vẫn có sự khác nhau giữa 2 loại component này mà có dịp, mình sẽ cùng các bạn tìm hiểu.

Mến chào các bạn!