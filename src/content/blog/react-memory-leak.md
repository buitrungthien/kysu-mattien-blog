---
title: 'React state update vs memory leak và cái kết'
date: '2021-09-05'
author: { name: 'Thiên Bùi' }
tag: 'tech'
featuredImgUrl: 'https://i.imgur.com/PojPJTX.jpg'
featuredImgAlt: 'Memory leak illustration'
description: 'Warning message React thường cảnh báo chúng ta về memory leak này là gì? Vì sao có cảnh báo này và khắc phục như thế nào?'
---

**Note**: Bạn nhớ đọc từ đầu đến cuối nhé!

Đã không ít lần mình gặp phải (chắc các bạn cũng vậy) warning trong lúc dev một React app như sau:

> Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.

Quéo queo, gì mà memory leak đồ thấy ghê quá đây!?

## 1. Phân tích warning.

Đầu tiên ta đi tìm hiểu định nghĩa **memory leak** là gì?

Memory leak là hiện tượng xảy ra khi một chương trình/ứng dụng quản lý bộ nhớ không đúng cách, ví dụ như giữ lại các vùng bộ nhớ chứa các biến **không dùng nữa** thay vì **release** nó đi và để dùng vào công việc khác.

Quay lại với warning trên, React nói rằng:
- **Can't perform a React state update on an unmounted component** - Không thể update state trên một **unmounted component**: Hợp lý, component đã unmounted, không còn xuất hiện trên màn hình một cách có chủ đích nữa, thì update state làm gì!?
- **This is a no-op** - Bebavihor này là no - operation: Tức là không có action nào xảy ra hết. React hiểu vấn đề và không đi updated unmounted component đâu.
- **But it indicates a memory leak in your application**- Nhưng dường như điều này là biểu hiện của việc có memory leak trong ứng dụng của bạn.

Chúng ta thường gặp phải warning như trên khi thực hiện fetch data từ một component. Cụ thể, chúng ta fetch data ở lần **mount** đầu tiên của một component. Ví dụ api này chạy mất 2s để fetch được data, nhưng mới vừa bắt đầu fetch được 1s, chúng ta chuyển trang, hoặc thực hiện hành động liên quan để làm cho component bị **unmounted**, lúc này data trả về từ api, theo logic code sẽ được dùng để **update state** cho component đó, nhưng rất tiếc component đã bị unmounted, nên việc update đó là không hợp lý và vô ích. Dẫn đến React cảnh báo chúng ta với nội dung như bên trên.

Đoạn code liên quan với ví dụ trên như sau:

```jsx
const SomeComponent = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    someAsyncFunction().then(() => {
      setIsVisible(false);
    }, []);

    return (
      <div style={{visibility: isVisible ? 'visible' : 'hidden'}}>
        This is a component!
      </div>
    )
}

export default SomeComponent
}, []);
```

Một đoạn code hết sức bình thường đúng không nào các bạn? Component mounted, chúng ta thực hiện fetch data hay làm một tác vụ bất đồng bộ nào đó bằng cách sử dụng Promise; **subscribe** to Promise đó một callback nằm trong `.then()` method, rằng khi nào Promise resolve, anh chạy dùm tôi callback handler này. Ok!

Vấn đề là đang trong lúc `someAsyncFunction` chạy, bất thình lình component bị unmounted (như ví dụ chuyển page mình nêu bên trên), mà bản chất của **Promise** thì nó không thể bị **huỷ bỏ**, **canceled** được. Promise/api đã được chạy rồi, thì đợi đến lúc nó **settled** mà thôi (resolve hoặc reject). Khi Promise resolve, callback được thực thi, hàm set state `setIsVisible` chạy, nhưng component đã **unmounted** rồi, lúc này một phần bộ nhớ đã được "để dành" cho việc lưu trữ kết quả trả về từ api, để thực hiện tác vụ `setIsVisible` state là vô ích, thừa thãi -> React hiện lên warning về memory leak.

## 2. Khắc phục warning.

<span class='solution-label'>Ứng với functional component</span>

**- Asynchronous task in a Promise handler**: như việc fetch data chúng ta thường làm hay như ví dụ phía trên.

Code giải pháp:
```jsx
const [isVisible, setIsVisible] = useState(true);

useEffect(() => {
  // 1
  let cancel = false;

  someAsyncFunction().then(() => {
    // 3
    if (cancel) return;
    setIsVisible(false);
  });

  // 2
  return () => { 
    cancel = true;
  }
}, []);
```

Để giải quyết cái warning trên, chúng ta lợi dụng đặc tính **closure** của javascript và **cleanup function** của `useEffect` React hook. Cụ thể, ban đầu ở `// 1`, chúng ta khởi tạo một "flag" là biến `cancel = false`. Biến cancel này thể hiện rằng chúng ta có còn muốn dùng data trả về từ api để update state hay không? Nếu `cancel = true`, tức là effect này đã được "huỷ bỏ" rồi, tôi không cần set state nữa.

Như chúng ta đã biết, returned function trong một `useEffect` tạm được gọi là cleanup function, hàm này sẽ được chạy trước mỗi lần next effect được chạy, và nếu được dùng với list dependencies rỗng `[]` như trên thì cũng tương ứng với việc hàm này được thực thi ở `componentWillUnmount`.

Khi component bất thình lình bị unmounted, cleanup function trong useEffect `// 2` sẽ được chạy và set `cancel = true`. Sau đó, nhờ vào đặc tính của closure, async promise sau khi chạy xong vẫn có thể tham chiếu đến giá trị `cancel`, lúc này nhận thấy "cờ cancel = true, component đã bị unmount" nên `return`, và không thực hiện set state nữa.

Bùm! Warning biến mất.

<span class='solution-label'>Ứng với class component</span>

Khác với functional component, class component không có useEffect API, không có cleanup function, vậy chúng ta làm như thế nào?

Chúng ta lợi dụng **instance variable**, khởi tạo một biến/cờ trong class component để check xem component đã bị unmounted hay chưa? Nếu đã bị unmounted rồi, thì không set state nữa.

Code như sau:

```jsx
class SomeComponent extends Component {

  state = {
    isVisible: fase,
  }
  _isMounted: false

  componentDidMount() {
    someAsyncFunction().then(() => {
      if (!this._isMounted) return;
      this.setState({isVisible: true})
    });
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    return (
      <div style={{visibility: this.state.isVisible ? 'visible' : 'hidden'}}>
        This is a component!
      </div>
    )
  }
}

export default SomeComponent
```

Gần giống với cách sử dụng closure như ở functional component. Với class component, nếu bất thình lình component bị unmounted trong lúc fetch data hay đang call api, chúng ta set lại giá trị cho `this._isMounted = false`, thể hiện rằng component đã bị unmounted. Kể từ thời điểm này trở về sau, mặc cho promise chạy xong và kết quả trả về, khi xem xét giá trị `if (!this._isMounted) return;` và nhận thấy `this._isMounted` đã bằng `false`, chúng ta không thực hiện `setState` nữa.

<span class='solution-label'>Bonus</span>

Ngoài ví dụ về việc fetch data như trên, còn có nhiều trường hợp khác có thể gây nên memory leak, và cần phải được handle một cách hợp lý. Ví dụ:

**- Asynchronous task in a setTimeout handler**:

```jsx
useEffect(() => {
  const timerId = setTimeout(() => {
    setIsVisible(false);
  });
  return () => {
    clearTimeout(timerId);
  }
}, []);
```

Bằng cách dùng cleanup function, chúng ta có thể `clearTimeout`. Cụ thể, trong trường hợp component unmount xảy đến trước, timer sẽ bị clear đi, kéo theo callback set state không bị chạy sau khi umnount.

**- Asynchronous task in an event handler**:

```jsx
const onChange = ({ screen }) => {
  setDimensions(screen);
};

useEffect(() => {
  const domElement = document.querySelector('.some-name')
  domElement.addEventListener('click', onChange);
  return () => {
    domElement.removeEventListener('click', onChange);
  };
}, []);
```

Cuối cùng, đừng quên clean up eventListener ở cleanup function trong mỗi useEffect như trên.

## 3. Và cái kết:

Huray, cuối cùng cũng đã đến lúc mình lộn cái bàn :))

Thú thực với các bạn, ngoại trừ 2 solution clean up liên quan đến **Timer** khi chúng ta dùng `setTimeout` hoặc `setInterval`, hay `removeEventListernal` là **must do** (giả dụ bạn add một `setTimer` mà không có action clean up tương ứng, thì dẫn đến cái timer luôn được chạy không kiểm soát), thì bản thân cái solution add cờ nhớ `clear` hay `_isMounted` kia thì... nói sao nhỉ? Nó là vô ích.

Thứ nhất, với vấn đề update state cho unmounted component, hmm... không có "leak" gì ở đây cả. Vì bản chất 1 Promise không thể bị cancel, một khi Promise đã được invoke, nó sẽ chạy đến lúc đạt state settled (hoặc fulfilled hoặc rejected). Promise resolve, callback setState chạy -> nhận thấy component đã được unmounted rồi -> thì không update -> garbage collector work và dọn dẹp bộ nhớ cho kết quả trả về từ cái fetch API đó (nếu có). Việc **ghi nhớ** và **chạy** cái callback sau khi component đã được unmounted là một bước **dư thừa**/chậm một nhịp/"leak" rất ngắn thì đúng hơn. Túm lại, việc này là hoàn toàn OK, không có gì đáng lo ngại.

Thứ hai, việc áp dụng các cờ, instance variables, mutate các biến này thực chất chỉ để tránh call hàm set state cho unmounted component mà thôi (trong khi React hoàn toàn biết và không thực hiện update cho unmounted component), ngẫm nghĩ rộng ra thì thực chất chúng ta chỉ đang cố tình **làm cho cái warning kia không xuất hiện nữa**, chứ về bản chất, không hề đi giải quyết được vấn đề cancel Promise, api call,... Vì thực chất, chúng ta không cancle được Promise. Chỉ vì để tránh không show cái warning kia, chúng ta đã vô tình add một mớ code khá khó đọc, khó hiểu và có thể được xem là bad practice.

Và cuối cùng để củng cố cho những điều trên... Anh Dan của chúng ta trong team Facebook **thực sự** đã có 1 pull request (đã được merged) để xoá đi cái warning được đề cập từ đầu. Các bạn có thể tham khảo [tại đây](https://github.com/facebook/react/pull/22114). Trong PR này, Dan có giải thích lý do tại sao bỏ đi warning, những lầm tưởng mà warning này gây ra,...

Có thể việc loại bỏ các warning này sẽ xuất hiện ở React version mới. (tính tới thời điểm mình viết bài này thì cái PR phía trên mới chỉ được merge 18 ngày - khá mới).

Nhưng chắc hẳn với các bạn đi làm thì phần lớn sẽ làm việc với React version cũ hơn và có khả năng gặp phải warning như phía trên và không ít người phải bối rối (giống như mình đã từng).

Tất nhiên có nhiều yếu tố gây ra [memory leak](https://blog.sessionstack.com/how-javascript-works-memory-management-how-to-handle-4-common-memory-leaks-3f28b94cfbec), nhưng nếu chỉ là vì update state ở unmounted component thì bạn không cần quá lo nữa rồi hen.

Chúc các bạn học tập, làm việc tốt. Mến chào các bạn!

## 4. Nguồn và bài viết hay liên quan:
- [How JavaScript works: memory management + how to handle 4 common memory leaks](https://blog.sessionstack.com/how-javascript-works-memory-management-how-to-handle-4-common-memory-leaks-3f28b94cfbec). Tác giả: **Jonathan Experton**
- [React State Update Memory Leak](https://blog.devgenius.io/react-state-update-memory-leak-8e84a45e1695). Tác giả: **Ben Aron Davis**
- [Remove the warning for setState on unmounted components #22114](https://github.com/facebook/react/pull/22114). Tác giả: **Dan Abramov**
- [https://dev.to/jexperton/how-to-fix-the-react-memory-leak-warning-d4i](https://dev.to/jexperton/how-to-fix-the-react-memory-leak-warning-d4i). Tác giả: **Jonathan Experton**