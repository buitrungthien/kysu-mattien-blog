---
title: 'Một số lỗi thường gặp khi làm việc với React hooks'
date: '2020-08-04'
author: { name: 'Thiên Bùi' }
tag: 'tech'
image: 'https://secureservercdn.net/198.71.233.138/kh4.9f9.myftpupload.com/wp-content/uploads/2017/12/management-mistakes-pic_678X381.jpg'
description: 'Bạn có mắc các lỗi sau khi làm việc với React hooks? Cùng tìm hiểu qua bài viết này nhé!'
---

Số là dạo này mình mới làm xong một dự án có sử dụng React hook apis. Có thể nói làm việc với hooks đem lại cho mình một cảm giác rất mới mẻ.

Mình đã học được rất nhiều thứ, cũng như mắc vô số lỗi.

Trong quá trình học và làm việc với hooks cũng như tìm đọc document, article của các developer giàu kinh nghiệm khác, mình đã tự đúc rút ra được vô vàn kinh nghiệm cho bản thân.

Bài viết sau đây là mình dịch lại từ bài gốc: https://www.lorenzweiss.de/common_mistakes_react_hooks/

**Chú ý:**
Trước khi bắt đầu với danh sách các “lỗi sai” dưới đây. Các bạn chú ý rằng hấu hết logic, cách nghĩ và quan điểm của bài viết chỉ thể hiện góc nhìn cá nhân của mình. Thoạt nhìn các ví dụ mà mình cho là “lỗi sai” dưới đây về mặt technical không hẳn là lỗi, cũng nhìn không có vẻ gì là “sai sai”.

##1. Dùng useSate khi không cần thiết - khi không cần re-render component:

Khái niệm state và xử lý state trong một component có thể nói là core concept của ReactJS. Control data flow, render component theo ý muốn dựa vào trạng thái, các giá trị khác nhau của state chính là một ý tưởng tuyệt vời.

Với ReactJS, mỗi lần component render, rất nhiều khả năng là biến state bên trong component đó đã được đổi giá trị. Chính việc đổi giá trị biến state đã làm cho component re-render.

Với **Class Component**, ta có <span class='inline-code'>this.setState()</span>.

Với **hook**, ta có <span class='inline-code'>useState()</span>. Nhưng …. có khi nào ta dùng useState hơi sai sai?

**Bài toán:** Có 2 cái nút, một nút là counter (bấm vào tăng giá trị biến đếm), nút còn lại là gọi api, gửi đi giá trị biến đếm đến một api endpoint nào đó.

<b class='should-not-label'>Đừng nên</b>

```jsx
function ClickButton(props) {
  const [count, setCount] = useState(0);

  const onClickCount = () => {
    setCount(count + 1);
  };

  const onClickRequest = () => {
    apiCall(count);
  };

  return (
    <div>
      <button onClick={onClickCount}>Counter</button>
      <button onClick={onClickRequest}>Submit</button>
    </div>
  );
}
```

<b class='problem-label'>Vấn đề</b>

Thoạt nhìn, bạn có thể nghĩ: “ủa có gì đâu ta, bình thường mà, xài state vậy ok rồi!”.

Ừm, đúng, đoạn code trên ok, và có thể nói, code của bạn sẽ chạy và chả có lỗi lầm gì.

Tuy nhiên, ở đây vẫn có một lưu ý có thể coi là improvement và best practice khi sử dụng với <span class='inline-code'>useState</span>, đó là: **Không sử dụng useState khi không cần đến re-render.**

Vì, trong ReactJS, mọi state change đều dẫn đến re-render component đó (và thậm chí là toàn bộ component con của nó). Điều này sẽ gây hao tốn performance một cách không cần thiết (thậm chí là lỗi UX, ví dụ khi làm multil banner sử dụng Swiper.js).

Trong đoạn code trên, biến state **count** không được dùng để render trên UI, nên dùng state là không cần thiết.

Nếu đã có kinh nghiệm làm việc với Class Component trong ReactJS, chắc bạn đã biết đến khái niệm **class field** hay **instance variables** đúng không nào.

Ta dùng các **field** này đạt được hai mục đích, vừa lưu được giá trị giữa các lần re-render (không bị clear, làm mới, …), vừa không gây re-render.

Với Functional Component hay react hooks, ta cũng có thể làm được điều này bằng việc sử dụng <span class='inline-code'>useRef</span> (bất ngờ đúng không các bạn, ref không chỉ đơn giản được sử dụng để trỏ đến DOM Element như ta thường dùng, mà nó còn dùng để implement các biến giống như **class fields** nữa).

Điều này đã được đề cập đến ngay trên trang chủ React: https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables

<b class='solution-label'>Giải pháp</b>

```jsx
function ClickButton(props) {
  const count = useRef(0);

  const onClickCount = () => {
    count.current++;
  };

  const onClickRequest = () => {
    apiCall(count.current);
  };

  return (
    <div>
      <button onClick={onClickCount}>Counter</button>
      <button onClick={onClickRequest}>Submit</button>
    </div>
  );
}
```

Bạn chỉ muốn một biến nằm trong component và có khả năng lưu hay change giá trị giữa các lần re-render mà không force component đó re-render, hãy dùng useRef bạn nhé.

Ở ví dụ trên, biến ref <span class='inline-code'>count</span> giữ, change giá trị giữa các lần re-render của component mà lại vừa tránh gây ra re-render không cần thiết. Tuyệt vời!

##2. Quen tay dùng router.push thay vì link

Về phần này thì không liên quan đến React, nhưng bản thân mình và có nhiều bạn thường viết như thế này trong các component React.

Lấy ví dụ bạn có một cái nút. Bấm vào nút này sẽ chuyển đến một trang khác.

Trong bối cảnh single page, việc điều hướng này được thực hiện ở phía client, hay nói cách khác nằm ở phía browser chúng ta. Và đặc biệt khi làm việc với React single page thì thư viện được sử dụng nhiều nhất đó chính là **react-router**.

Với phiên bản mới dạo gần đây thì package này đã hỗ trợ hook, thay vì phải wrap component của chúng ta với HOC withRouter để có thể sử dụng các property và methods của nó. Ok, và cách chúng ta có thể nghĩ tới sẽ là:

<b class='should-not-label'>Đừng nên</b>

```jsx
function ClickButton(props) {
  const history = useHistory();

  const handleClick = () => {
    history.push('next-page');
  };

  return <button onClick={handleClick}>Go to next page</button>;
}
```

<b class='problem-label'>Vấn đề</b>

Vấn đề nằm ở accessibility. Với cách viết như thế này, button của chúng ta không được xem như là một thẻ **link**, hậu quả là **screen readers** sẽ không xem đây là một thẻ link.

Một vấn đề nữa là nếu bạn có thói quen mở một trang mới trong tab mới như mình (bằng cách nhấn chuột giữa vào link đó, hoặc click chuột phải chọn “Open in new tab” thay vì thay đổi nội dung ở browser tab hiện tại), thì với cách viết này bạn sẽ không làm được (again, vì nút này không phải là link).

<b class='solution-label'>Giải pháp</b>

```jsx
function ClickButton(props) {
  return (
    <Link to="Go to next page">
      <span>Go to next page</span>
    </Link>
  );
}
```

Đơn giản là link chuyển giữa các trang? Dùng <Link> nhiều nhất có thể bạn nhé!
**Bonus:** Đồng thời code cũng ngắn và dễ đọc hơn đúng không nào?

##3. Chèn các actions vào hook useEffect

useEffect thật hữu dụng. Nó cho phép bạn thao tác với các action liên quan đến prop, state changes. Dùng nó để fetch data, xử lý side affects. Tuyệt vời là thế, nhưng lắm lúc có thể ta đang lạm dụng nó…

**Bài toán:**
Cho một component lấy dữ liệu từ api một list các items và render ra màn hình. Bên cạnh đó, nếu fetch thành công, ta đồng thời gọi action <span class='inline-code'>onSuccess</span> - onSuccess được pass vào component dưới dạng prop.

<b class='should-not-label'>Đừng nên</b>

```jsx
function DataList({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = () => {
    setLoading(true);
    callApi()
      .then(res => setData(res))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!onLoading && !error && data) {
      onSuccess();
    }
  }, [loading, error, data, onSuccess]);

  return <div>Data: {data}</div>;
}
```

<b class='problem-label'>Vấn đề</b>

Trong ví vụ trên có 2 lần sử dụng useEffect, lần đầu tiên là để call api sau khi render lần đàu (componentDidMount), lần thứ 2 là để handle logic gọi action onSuccess.

Cũng hợp lý chứ nhỉ.

```jsx
useEffect(() => {
  if (!onLoading && !error && data) {
    onSuccess();
  }
}, [loading, error, data, onSuccess]);
```

Khi đang không loading, không có lỗi và có data, thì gọi onSucess. Hợp lý mà ta.

Vấn đề ở đây là: với cách viết như trên, chúng ta đang làm mất đi tính liên kết giữa ý hàm onSucess và cái action mà thật sự thể hiện fetch data success.

Chúng ta đang tự dựa vào logic, trạng thái của các biến state khác để quyết định onSuccess có được chạy hay không?

Điều này dẫn đến chỉ cần 1 trong số các logic trong điều kiện if ở trên sai là hàm onSuccess cũng sẽ bị gọi sai với ý định ban đầu.

<b class='solution-label'>Giải pháp</b>

Đơn giản là chuyển câu lệnh gọi hàm onSucess vào ngay bên trong .then của Promise trả về từ api.

Với cách viết này, ta luôn đảm bảo được hàm onSuccess chỉ được gọi sau khi action gọi api thành công.

Hơn nữa lại rõ ràng, liền mạch và hợp logic.

```jsx
function DataList({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = () => {
    setLoading(true);
    callApi()
      .then(res => {
        setData(res);

        //HERE
        onSuccess();
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <div>Data: {data}</div>;
}
```

##4. Một useEffect làm tùm lum thứ

Nhớ ngày nào với React version cũ, ta chỉ có các life cycle tách biệt như componentWillReceiveProps hay componentDidUpdate,...

Trong một component, ta chỉ có thể implement 1 method “ComponentDidUpdate” và nếu component đó phức tạp, có nhiều side effect hay nhiều biến state, việc handle hàng tá logic bên trong 1 “componentDidUpdate” này là điều không thể tránh khỏi.

Vấn đề ở đây là các logic này không liên quan đến nhau, việc đặt tất tần tật các logic trong những life cycle, hay nói cách khác, business logic của app bị chia theo life cycle làm cho code rối, khó đọc, khó hiểu và khó re-use.

Với useEffect, bản thân từng useEffect có thể có cho mình ba life cycle là: componentDidMount, componentDidUpdate, componentWillUnmount, điều này giúp cho business logic code được tách bạch theo từng effect, code dễ đọc, dễ quản lý, dễ reuse, có thể mang đi khắp nơi.

Nhưng thi thoảng ta quên mất điều này và làm “nhiều điều không liên quan đến nhau” ngay trong một useffect, khiến nó đánh mất đi cái hay mà ta vừa đề cập đến ở trên.

Ví dụ, cho một component fetches data từ api, và đồng thời hiện breadcrums ứng với url hiện tại trên browser. (Again, giả sử chúng ta đang sử dụng package routing nổi tiếng là react-router để lấy được giá trị current location).

<b class='should-not-label'>Đừng nên</b>

```jsx
function Example(props) {
  const location = useLocation();

  const fetchData = () => {
    /* Calling the api */
  };

  const updateBreadcrumbs = () => {
    /* Updating the breadcrumbs */
  };

  useEffect(() => {
    fetchData();
    updateBreadcrumbs();
  }, [location.pathname]);

  return (
    <div>
      <Breadcrumbs />
    </div>
  );
}
```

<b class='problem-label'>Vấn đề</b>

Có 2 action **không liên quan đến nhau** là “get data từ api” và “hiển thị breadcrums” ứng với địa chỉ url tương ứng. Cả 2 action này đều được đặt trong cùng một useEffect. useEffect này sẽ chạy cả **fetchData** và **updateBreadcrumbs** khi location.pathname thay đổi.

Thứ nhất, với fetchData, chúng ta chỉ muốn chạy nó một lần, thay vì chạy các lần **không cần thiết** chỉ vì location.pathname thay đổi.

Thứ hai, việc gom nhóm các action không liên quan như thế này khiến cho việc reuse logic cho các component hay ví dụ copy qua dự án khác gặp khó khăn, ta phải manually loại bỏ các logic không cần thiết, lấy cái cần thiết,v.v… Trong khi nếu được handle tốt ngay từ đầu, logic code được viết tách rời, ta hoàn toàn có thể copy - bê nguyên useEffect đem đi nơi khác.

<b class='solution-label'>Giải pháp</b>

Tách nhỏ useEffect, vừa dễ đọc, dễ maintain, vừa đảm bảo list dependencies của mỗi effect không bị dư, các action, side-effects chỉ chạy khi cần thiết.

```jsx
function Example(props) {
  const location = useLocation();

  const updateBreadcrums = () => {
    /* Updating the breadcrumbs */
  };

  useEffect(() => {
    updateBreadcrums();
  }, [location.pathname]);

  const fetchData = () => {
    /* Calling the api */
  };

  uesEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Breadcrumbs />
    </div>
  );
}
```

##5. Kết luận

Sẽ còn rất nhiều lỗi mà mình vẫn đang mắc hàng ngày khi implement các React component. Tuy nhiên mình vẫn đang cố gắng hoàn thiện từng ngày để có thể tiến bộ hơn.

Đặc biệt trong bối cảnh hook và React Api đang ngày càng nhiều và hữu dụng, chúng ta phải liên tục update, xắn tay vào làm, mắc lỗi, sửa lỗi và tiến bộ.

Chia sẻ kinh nghiệm, tips hay best practices của các bạn để chúng ta cùng nhau học hỏi nhé. Hẹn gặp các bạn trong bài viết lần sau.
