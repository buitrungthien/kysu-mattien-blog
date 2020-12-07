---
title: 'Re-use logic giữa các component - HOC - Custom hooks - Quát, quai èn quen?'
date: '2020-10-17'
author: { name: 'Thiên Bùi' }
tag: 'tech'
featuredImgUrl: 'https://i.imgur.com/M8hd7pS.png?1'
featuredImgAlt: 'Re-use logic giữa các component - HOC - Custom hooks - Quát, quai èn quen?'
description: 'React custom hooks là gì? Và khi nào thì nên sử dụng'
---

Ở <a href="https://kysumattien.com/mot-so-loi-thuong-gap-khi-lam-voi-react-hook/" target="_blank" rel="noopener noreferrer">post trước đây</a> khi nói về React hooks, mình đã có đề cập về lợi ích "tách bạch" code xử lý logic theo từng hook riêng biệt, không phụ thuộc vào component life cycle.

Hôm nay, mình sẽ cùng các bạn tìm hiểu về "React Custom hooks", giúp các bạn tự tạo các custom hook cho mình. Cụ thể custom hook cho phép việc tách bạch logic code nói trên đạt đến một tầm cao mới, đồng thời giúp dev chúng ta tiếp cận gần hơn đến với phong cách lập trình "Functional Programming".

Tò mò rồi đúng không nào? Chúng ta bắt đầu thôi.

## 1. Ví dụ về logic fetch dữ liệu trong một component

**Chú ý:** Ví dụ được lấy từ section <a href="https://reactjs.org/docs/hooks-custom.html" rel="noopener noreferrer" target="_blank">Building Your Own Hooks</a> trang chủ ReactJS

<span class="problem-label">Bài toán</span>

Bạn có một component "FriendStatus" hiển thị trạng thái online của bạn bè (ví dụ tương ứng là cái chấm xanh hay chấm xám thể hiện người bạn đang online hay là offline trong facebook).

**Functional Component**:

```jsx
function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

Ở ví dụ trên, chúng ta đi tạo một Functional Component "FriendStatus". Component này đơn giản render ra một trong ba string: "Loading...", "Online" và "Offline", tùy thuộc vào trạng thái hoạt động của người bạn đó (props.friend.id)

Ở lần đầu load component, biến state `isOnline` = null, chúng ta render text: "Loading...", thể hiện API get status đang chạy và pending.

Bằng cách sử dụng hook `useEffect`, chúng ta "subsribe" - đăng ký, nói với service bên thứ ba (giả sử ở đây có tên là chatAPI) rằng: "Đây là id của user, bất cứ khi nào user thay đổi trạng thái hoạt động online hay offline, vui lòng chạy hàm callback `handleStatusChange` này". `ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);`

Bất cứ khi nào trạng thái user ở phía server thay đổi, service ChatAPI sẽ chạy callback `handleStatusChange` mà chúng ta pass vào. `handleStatusChange` chạy -> `setIsOnline` chạy -> biến state `isOnline` thay đổi -> **trạng thái hoạt động của user được cập nhật "tự động", cảm giác khá "real-time"** (Cơ chế Observable).

Ngoài ra, để "clean up" memory phía đầu service ChatAPI (khi component unmounted hoặc id của user mới được pass vào - tức chúng ta không còn quan tâm đến trạng thái hoạt động của user cũ nữa) và ngăn việc thực thi callback không cần thiết, chúng ta cũng thực hiện thao tác "unsubscribe" bằng cách return ra một function ở cuối hook `useEffect`.

**Class Componnet**:

Tương tự như trên nhưng lần này mình viết lại component `FriendStatus` dưới dạng Class Component:

```jsx
import React, { Component } from 'react';

class FriendStatus extends Component {
  this.state = {
    isOnline: false,
  };

  this.handleStatusChange(status) {
    this.setState({ isOnline: status.isOnline });
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(props.friend.id, this.handleStatusChange);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.friend.id !== this.props.friend.id) {
      chatAPI.unsubscribeFromFriendStatus(prevProps.friend.id, this.handleStatusChange)
      ChatAPI.subscribeToFriendStatus(props.friend.id, this.handleStatusChange);
    }
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, this.handleStatusChange);
  }

  render() {
    if (isOnline === null) {
      return 'Loading...';
    }
    return isOnline ? 'Online' : 'Offline';
  }
}
```

## 2. Nhu cầu chia sẻ, re-use logic giữa các component

Ở phần trên chúng ta đã đi xây dựng được một Component `FriendStatus` thể hiện trạng thái hoạt động của một "người bạn" nào đó. Và phần xử lý logic nhằm "get" được trạng thái hoạt động chính là thứ logic chúng ta đặt trong `useEffect` - ứng với ví dụ về **Functional Component** hay cũng chính là đống bùi nhùi logic đặt trong các **life cycle method** - ứng với ví dụ về **Class Component** phía trên.

Giả sử nếu bây giờ chúng ta lại tiếp tục có một component tên là **ListFriend**, component này render một mảng các component con **ListFriendItem**. Trong mỗi component **ListFriendItem** sẽ hiện tên của mỗi người bạn, đi kèm trạng thái hoạt động của họ. Màu xanh lá cây ứng với đang online, màu xám thể hiện đang offline. (Ví dụ này giống với danh sach bạn bè ở khung chat của FaceBook đúng không các bạn).

Có vẻ như component **ListFriendItem** sẽ được implement như sau:

**Functional Component**

```jsx
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return (
    <li style={{ color: isOnline ? 'green' : 'gray' }}>{props.friend.name}</li>
  );
}
```

**Class Component**

```jsx
import React, { Component } from 'react';

class FriendStatus extends Component {
  this.state = {
    isOnline: false,
  };

  this.handleStatusChange(status) {
    this.setState({ isOnline: status.isOnline });
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(props.friend.id, this.handleStatusChange);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.friend.id !== this.props.friend.id) {
      chatAPI.unsubscribeFromFriendStatus(prevProps.friend.id, this.handleStatusChange)
      ChatAPI.subscribeToFriendStatus(props.friend.id, this.handleStatusChange);
    }
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, this.handleStatusChange);
  }

  render() {
    <li style={{ color: isOnline ? 'green' : 'gray' }}>
      {props.friend.name}
    </li>
  }
}
```

Hừm,... ta bắt đầu thấy có sự lặp đi lặp lại với cái logic "subscribe" và "unsubscribe" để "get" trạng thái hoạt động của user rồi này.

Cứ mỗi lần có một Component nào đó cần get được thông tin về trạng thái hoạt động của một user, chúng ta lại phải đi copy, past lại đoạn logic kia, thật phiền toái và không tối đúng không nào?!

Phần logic kia lẽ ra nên được re-use một cách tối đa.

## 3. Re-use logic ứng với Class Component - Sử dụng Higher-Order-Function

Trong những năm về trước, khi chưa có sự xuất hiện của React hooks. Mỗi khi cần giải quyết vấn đề re-use logic giữa các component được nêu trên, người ta sẽ ngay lập tức nghĩ đến sử dụng **Higher-Order-Component (HOC)**.

Bằng cách sử dụng HOC, chúng ta có thể tách riêng các logic xử lý, tính toán biến state, hay như việc "subscribe" và "unsubscribe" status của user như các ví dụ trên.

Cụ thể chúng ta sẽ đi tạo ra 2 component riêng biệt. Một là **smart component** hay **container** - nơi khai báo các biến state, handle các tác vụ, logic ứng với các life cycle. Component còn lại là **dumb** component, nơi chỉ có nhiệm vụ nhận vào props và render kết quả tương ứng. Đây cũng chính là triết lý của **Container Pattern**

Chúng ta thử bắt tay viết HOC xử lý logic subscribe và unsubscribe kia thử nào:

```jsx
import React, { Component } from 'react';

const withUserStatus = (WrappedComponent) => {

  return class extends Component {
    this.state = {
      isOnline: false,
    };

    this.handleStatusChange(status) {
      this.setState({ isOnline: status.isOnline });
    }

    componentDidMount() {
      ChatAPI.subscribeToFriendStatus(props.friend.id, this.handleStatusChange);
    }

    componentDidUpdate(prevProps) {
      if (prevProps.friend.id !== this.props.friend.id) {
        chatAPI.unsubscribeFromFriendStatus(prevProps.friend.id, this.handleStatusChange)
        ChatAPI.subscribeToFriendStatus(props.friend.id, this.handleStatusChange);
      }
    }

    componentWillUnmount() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, this.handleStatusChange);
    }

    render() {
      return <WrappedComponent isOnline={this.state.isOnline} {...this.props}/>;
    }
  }
};
```

HOC `withUserStatus` nhận vào một component và trả ra một compoennt mới - chính là component nhận vào đó, đính kèm với thông tin `isOnline` của user tương ứng.

Giờ đây, compoennt `FriendStatus` và `FriendListItem` có thể được viết gọn lại thành:

```jsx
function FriendStatus(props) {

  if (props.isOnline === null) {
    return 'Loading...';
  }
  return props.isOnline ? 'Online' : 'Offline';
}
```

```jsx
function FriendListItem(props) {

  return (
    <li style={{ color: props.isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

Sau đó, sử dụng với HOC `withUserStatus` vừa được tạo bên trên như sau:

```jsx
withUserStatus(FriendStatus);
withUserStatus(FriendListItem);
```

Như vậy, logic đã được tách ra khỏi component, giúp component trở nên ngắn gọn hơn, đồng thời có thể đem đi tái sử dụng ở nhiều nơi.

Bằng cách sử dụng HOC phía trên, chúng ta đã giải quyết được bài toán reuse logic hay nói chính xác hơn là tách logic xử lý ra khỏi React component. Khá là tuyệt!

Tuy nhiên cách sử dụng HOC kia vẫn có các mặt hạn chế:
- Thứ nhất, nó chỉ có thể áp dụng cho Class Component.
- Thứ hai, nó **sinh** ra thêm các Component trung gian trên cây DOM của chúng ta (sử dụng React extension để xem được Component tree) làm cho số lượng Component tăng lên, khá rối rắm.

## 4. Re-use logic ứng với Functional Component - sử dụng Custom Hooks

Cuối cùng, chúng ta sẽ đến với cách mà theo mình nghĩ là tối ưu nhất, đó là khởi tạo và sử dụng **custom hook**.

>A custom Hook is a JavaScript function whose name starts with ”use” and that may call other Hooks.

Một custom hook là một javascript function bình thường, tên có chữ "use" đầu tiên và **có thể gọi đến các hooks khác** (bao gồm các "native" React hooks - useEffect, useState,...).

Custom hook **là function** bình thường, và tuân theo các nguyên tắc <a href="https://reactjs.org/docs/hooks-rules.html#:~:text=Only%20Call%20Hooks%20at%20the%20Top%20Level&text=Instead%2C%20always%20use%20Hooks%20at,multiple%20useState%20and%20useEffect%20calls." rel="noopener noreferrer" target="_blank">Rule Of Hooks</a> là được.

Triết lý của custom hooks rất đơn giản, cũng giống như phong cách lập trình **Functional Programming**.

Khi muốn share logic giữa hai function javascript bình thường, chúng ta tách phần cần share đó ra thành function thứ 3, và dùng ngược lại trong cả hai hàm ban đầu.

Tương tự, React functional compoennt cũng chính là function. Khi muốn share logic giữa hai functional components (hai functions), chúng ta tách phần logic cần share ra thành một **custome hooks** (function thứ 3), rồi mang đi dùng ngược lại cho hai component (hoặc nhiều hơn) kia.

Bây giờ, chúng ta đi viết lại custom hook `useFriendStatus` như sau:

```jsx
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

Và sử dụng custom hook này ở các component khác như sau:

```jsx
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```jsx
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

Một lần nữa, chúng ta đã có thể tái sử dụng lại logic thông dụng giữa các component. Bằng cách làm trên, thay vì phải lặp đi lặp lại việc khai báo state, xài useEffect đẻ subsccribe và unsubscribe, chúng ta đã tách hẳn ra thành một function - một hook riêng. Việc sử dụng logic kia đơn giản chỉ còn ngắn gọn bằng một dòng gọi hàm `useFriendStatus(props.friend.id);`

Để ý các functional component `FriendStatus` và `FriendListItem` vẫn có khả năng re-render compoent khi `isOnline` change, mặc dù không hề sử dụng biến state nào. Điều đó thực hiện được là nhờ việc bản thân custom hook `useFriendStatus` đã sử dụng `useState` đó, các bạn chú ý nhé.

Như vậy, với tính năng thoải mái xây dựng **Custom hook**, chúng ta có thể dễ dàng giải quyết được các bài toán được đặt ra từ đầu tới giờ. Chúng ta có thể tái sử dụng logic, tách logic xử lý, thao tác với data ra khỏi component, hoàn toàn sử dụng được với Functional Component, và không ép buộc chúng ta tạo ra các HOC trung gian nữa.

## 5. Kết luận

Như vậy, mình đã cùng các bạn điểm qua vấn đề cần chia sẻ logic hay nói đúng hơn là tách việc xử lý logic ra khỏi các component, từ đó đi tìm hiểu các kỹ thuật liên quan như là Higher-Order-Component và cuối cùng là custom hooks.

React đang ngày càng phát triển. Việc lập trình với React luôn mang lại cho chúng ta nhiều điều hay ho và mới mẻ, rất thú vị đúng không nào các bạn?

Hẹn gặp lại các bạn trong các bài viết sau. Mến chào các bạn!

## 6. Nguồn và bài viết hay liên quan

<a href="https://reactjs.org/docs/hooks-custom.html" rel="noopener noreferrer">Building Your Own Hooks</a> - ReactJS Document.