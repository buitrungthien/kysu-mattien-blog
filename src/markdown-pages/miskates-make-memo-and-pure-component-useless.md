---
title: 'Các lỗi dễ mắc khiến việc sử dụng PureComponent, memo thành công cốc'
date: '2020-08-19'
author: { name: 'Thiên Bùi' }
tag: 'tech'
featuredImgUrl: 'https://i.imgur.com/k4rpYSa.png'
featuredImgAlt: 'Các lỗi dễ mắc khiến việc sử dụng PureComponent, memo thành công cốc'
description: 'Các lỗi sai sau đây sẽ khiến việc sử dụng PureComponent và memo trở thành công cốc. Cùng xem bạn có mắc lỗi nào không nhé!'
---

Mến chào các bạn đã quay trở lại với **Kỹ sư mặt tiền**.

Như đã nhắc đến ở bài trước, khi giới thiệu về <a href='https://kysumattien.com/react-purre-component-and-react-memo/' target='_blank' rel='noopener noreferrer'>PureComponent và memo trong React để tối ưu hóa performance</a>, có các lỗi sai khá phổ biến khiến việc sử dụng **memo** hay **PureComponent** không còn hiệu quả.

Bật mí luôn cho các bạn rằng các lỗi này sẽ xoay quanh đến việc **so sánh nông** (mình cũng đã có đề cập đến trong bài viết trên).

Ok, nếu tới đây bạn vẫn chưa biết tại sao, thì cùng mình tìm hiểu các lỗi dưới đây nào.

## 1. Dùng Anonymous function (hàm ẩn danh).

Đặc điểm của các hàm ẩn danh này là viết trực tiếp, không cần khai báo một biến cụ thể nắm giữ khai báo hàm (const/var/let).

Và cụ thể thì dev chúng ta thường hay sử dụng các hàm mũi tiên như là hàm ẩn danh, truyền trực tiếp vào các **event handlers** hay **callback** như <span class='inline-code'>onClick</span>, <span class='inline-code'>onSubmit</span>, … Vì nó nhanh chóng, tiện lợi, khỏi phải mắc công lăn lăn chuột lên trên tìm chỗ để khai báo hàm mới đúng không nào.

<span class='problem-label'>Ví dụ:</span>

```jsx
class Button extends React.PureComponent {
  render() {
    console.log('re-render Button');
    return (
      <button onClick={this.props.onBtnClick} className="beautiful-button">
        {this.props.children}
      </button>
    );
  }
}

export default class ParentComponent extends React.Component {
  state = {
    counter: 0,
  };

  render() {
    return (
      <div>
        <p>{`Số lần click: ${this.state.counter}`}</p>

        <Button
  onBtnClick={() => {
  	this.setState(prevState => ({ counter: prevState.counter + 1 }));
  }}
>
          Button đẹp
        </Button>
      </div>
    );
  }
}
```

Tại ví dụ này, Component cha **ParentComponent** đang render component con là **Button**. Vốn dĩ sau khi nắm được vấn đề performance về re-render cà cách khắc phục, mình đã cẩn thận dùng <span class='inline-code'>PureComponent</span> thay thì <span class='inline-code'>Component</span> khi khởi tạo component **Button**.

**Button** chỉ nhận vào một prop là một function, có tên là <span class='inline-code'>onBtnClick</span>. Component này không hề cần sử dụng biến state <span class='inline-code'>counter</span> từ component cha, và cũng không có nhu cầu re-render mỗi khi biến state này tăng lên. Đó là lý do mình dùng <span class='inline-code'>PureComponent</span>.

Nhưng vì callback function pass vào <span class='inline-code'>onBtnClick</span> đang được viết dưới dạng **Anonymous function**, nên vô tình mỗi lần bấm nút tăng biến đếm <span class='inline-code'>counter</span> -> component cha **ParentComponent** re-render -> hàm <span class='inline-code'>render()</span> chạy -> callback anonymous function kia được tạo mới.

Trong JS, function cũng là object, object được tạo mới thì khi PureComponent thực hiện cơ chế so sánh nông trên prop cũ và mới <span class='inline-code'>onBtnClick</span> sẽ cho là đã có sự thay đổi (again, nếu bạn vẫn chưa nắm cơ chế so sánh nông thì xem lại <a href="https://kysumattien.com/react-purre-component-and-react-memo/" target="_blank">bài này</a> nhé).

PureComponent thấy rằng prop truyền vào đã change và **tưởng nhầm** rằng bạn muốn update component **Button**, dẫn đến một loạt console.log() hiện ra - thể hiện quá trình re-render diễn ra bên trong **Button**.

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/6YY04mi.png' alt='Button bị re-render mặc dù đã sử dụng PureComponent' />
  </div>

  <p class='image-description'>Button bị re-render mặc dù đã sử dụng PureComponent</p>
</div>

<span class='solution-label'>Giải pháp:</span>

```jsx
export default class ParentComponent extends React.Component {
  state = {
    counter: 0
  };

  btnClickHandler = () => {
    this.setState(prevState => ({ counter: prevState.counter + 1 }));
  }

  render() {
    return (
      <div>
        <p>{`Số lần click: ${this.state.counter}`}</p>
        <Button
  onClick={this.btnClickHandler}
>
          Button đẹp
        </Button>
      </div>
    );
  }
}
```

Tạo một **method** có tên <span class='inline-code'>btnClickHandler</span> nắm giữ callback cần truyền vào **Button**.

Ứng với cách viết class thì các method chỉ được khởi tạo một lần -> ở mỗi lần component cha re-render, callback function sẽ là duy nhất 
-> PureComponent trong **Button** so sánh thấy object prop cũ và mới là giống nhau -> không re-render.

<div class='image-description-wrapper'>
  <div class='image-wrapper'>
    <img src='https://i.imgur.com/hz5fQ30.png' alt='Giờ thì dù cho click 5 lần, Button vẫn chỉ render 1 lần' />
  </div>

  <p class='image-description'>Giờ thì dù cho click 5 lần, Button vẫn chỉ render 1 lần</p>
</div>

## 2. Lại là Object

Tương tự như ví dụ về **Anonymous function** trên. Object literals (Ví dụ: {name: 'a', age: 25}), hay nói chung mọi thứ trong JS mà là object (Object, Aray, Function) khi được khai báo trực tiếp trong hàm render, thì cũng đồng nghĩa với việc object đó sẽ được tạo mới ứng với mỗi lần re-render. Một lần nữa, làm cho việc sử dụng <span class='inline-code'>memo</span> hay <span class='inline-code'>PureComponent</span> trở nên vô tác dụng.

<span class='problem-label'>Ví dụ:</span>

```jsx
class ComponentA extends React.Component {
  render () {
    return (
      <div>
        CHA NÈ CON
        <ComponentB myStyle={{
  color: 'blue',
  background: 'gold'
}}/>
      </div>
    );
  }
}

class ComponentB extends React.PureComponent {
  render () {
    return (
      <div style={this.props.myStyle}>
        CON NÈ CHA
      </div>
    );
  }
}
```

Ở dòng code thứ 6, mình đã vô tình truyền một **object literal** vào prop **style**, pass vào component con (**ComponentB**).

Mỗi lần **ComponentA** re-render, một object được tạo mới trong vùng nhớ Heap. PureComponent trong **ComponentB** dùng cơ chế so sánh nông nhận thấy đây là object mới -> re-render **ComponentB**.

<span class='solution-label'>Giải pháp:</span>

Dùng một biến nắm giữ object này. Thay vì liên tục tạo mới ở mỗi lần re-render, mình sử dụng một class field <span class='inline-code'>myStyle</span> (class fields chỉ được khởi tạo một lần lúc khởi tạo class component đó mà thôi).

```jsx
class ComponentA extends React.Component {
  constructor(props) {
    this.myStyle = {
      color: 'blue',
      background: 'gold'
    };
  }

  render () {
    return (
      <div>
        CHA NÈ CON
        <ComponentB myStyle={this.myStyle}/>
      </div>
    );
  }
}

class ComponentB extends React.PureComponent {
  render () {
    return (
      <div style={this.props.myStyle}>
        CON NÈ CHA
      </div>
    );
  }
}

```

## 3. Không move các stable data, function, config, objects ra khỏi render body khi dùng functional component

Có thể bạn đã để ý các ví dụ trên mình đang cố gắng dùng toàn là **Class Component** :D. Vì mình muốn tách riêng **Functional Component** cho mục này đấy.

Với constructor hay quá trình khởi tạo một class, chắc bạn đã biết rằng các cycle này chỉ chạy một lần.

Hàm constructor của một class chỉ chạy một lần, các method hay properties (thứ được viết bên ngoài hàm <span class='inline-code'>render()</span>) của một class cũng sẽ chỉ được khởi tạo một lần.

Lợi dụng điều này chúng ta sẽ đạt được mục đích tạo các biến nắm giữ các object, các biến này không bị khởi tạo lại xuyên suốt quá trình re-render nên có thể an toàn pass xuống component con, kết hợp thêm với memo hoặc PureComponent là khỏi lo bị re-render.

Khác với **Class Component**, các **Functional Component** không có các life cycle như constructor.

Mọi thứ nằm bên trong "ruột" của một **Functional component** chính là **body** của hàm render ứng với người anh em **Class component**.

Vì thế, ứng với ví dụ trên, mà viết lại bằng functional component, thì:

<span class='problem-label'>Ví dụ:</span>

```jsx
const ComponentA = (props) => {
  const myStyle = {
    color: 'blue',
    background: 'gold'
  };
  return (
    <div>
      CHA NÈ CON
      <ComponentB myStyle={myStyle}/>
    </div>
  );
}

const ComponentB = memo((props) => {
  return (
    <div style={props.myStyle}>
      CON NÈ CHA
    </div>
  );
});

```

Thì dù có cẩn thận khai báo một biến object <span class='inline-code'>myStyle</span> ở **ComponentA** (dòng thứ 2), thì xin "chúc mừng"... memo lại không ngăn được việc re-render ở **ComponentB**.

Bởi vì mỗi với mỗi lần re-render ở ComponentA, mọi thứ nằm bên trong khai báo hàm cũng tương tự như mọi thứ nằm trong ruột của hàm <span class='inline-code'>render()</span> -> object <span class='inline-code'>myStyle</span> vẫn được tạo mới như thường.

Để giải quyết vấn đề này, ta sẽ move dòng khai báo object <span class='inline-code'>myStyle</span> ra khỏi hẳn scope của functional ComponentA.

<span class='solution-label'>Giải pháp:</span>

```jsx
const myStyle = {
  color: 'blue',
  background: 'gold'
};

const ComponentA = (props) => {
  return (
    <div>
      CHA NÈ CON
      <ComponentB myStyle={myStyle}/>
    </div>
  );
}

const ComponentB = memo((props) => {
  return (
    <div style={props.myStyle}>
      CON NÈ CHA
    </div>
  );
});
```

Theo cá nhân mình đây là một practice bạn nên dùng nhiều. Áp dụng với các object config, array, hoặc các hàm, logic tính toán chỉ cần khởi tạo một lần và không thay đổi.

Tuy nhiên, cách viết trên vô tình đem các logic hay các biến ra khỏi phạm vi component, về mặt tính đóng gói thì không hay lắm. Để giải quyết vấn đề này, phương án tối ưu thường được sử dụng hiện nay là dùng React hook <span class='inline-code'>useMemo</span> và <span class='inline-code'>useCallback</span>. 

Trong tương lai, khi đến post về hai hook này, mình sẽ giải thích cách dùng nha.

## 4. Bonus: biết đến và cẩn thận hơn với mapStateToProps với connect HOC khi dùng react-redux

Có thể bạn chưa/đã biết rằng react-redux mặc định đã implement PureComponent để ngăn re-render cho các component con mà nó nhận vào.

Và nếu bạn vẫn có thói quen sử dụng thao tác, chế biến, khởi tạo và trả về các object, array ngay bên trong <span class='inline-code'>mapStateToProps</span>

<span class='problem-label'>Ví dụ:</span>

```jsx
mapStateToProps = (state) => ({
  currentUser: {
    id: state.currentUserId, role: state.currentRole
  }
})
```

Thì cũng tương tự như vấn đề gặp phải ở các section trên. Object luôn được tạo mới, và PureComponent sẽ không ngăn được việc re-render.

Tiếp nữa, khi làm việc với redux, thường object **store** tổng sẽ là kết hợp của rất nhiều **sub-states** (dùng <span class='inline-code'>combineReducer</span>).

Và nếu bạn chưa biết, thì **mapStateToProps** sẽ chạy khi bất cứ thành phần nào của store tổng bị thay đổi, không cần biết thành phần thay đổi đó có liên quan gì đến component này hay không.

Ngoài việc tạo mới object như mình mới đề cập ở trên, thì việc đặt các **logic tính toán nặng** bên trong mapStateToProps cũng sẽ gây ảnh hưởng đến performance của app. (Vì nó chạy rất thường xuyên)

>Whenever the store changes, all of the mapStateToProps functions of all of the connected components will run. Because of this, your mapStateToProps functions should run as fast as possible. This also means that a slow mapStateToProps function can be a potential bottleneck for your application. - Trích "react-redux" documentation

>Bất cứ khi nào store thay đổi, **tất cả** các hàm mapStateToProps dùng trong các component sẽ được chạy. Vì vậy, tốt hơn hết là các hàm mapStateToProps kia nên chạy nhanh nhất có thể. Nếu không, nó sẽ làm app của bạn bị chậm, thuật ngữ là nghẽn cổ chai - tui dịch

Để tránh các tình trạng trên thì bạn nên tập thói quen không tạo object mới, không đặt các logic tính toán nặng trong các hàm mapStateToProps, và sau cùng là nên sử dụng một library cung cấp các cơ chế memoization để tối ưu hóa performance, điển hình như là **reselect**.

Ngay trong document của react-redux cũng có đề cập đến:

>We highly encourage the use of "selector" functions to help encapsulate the process of extracting values from specific locations in the state tree. Memoized selector functions also play a key role in improving application performance (see the following sections in this page and the Advanced Usage: Computing Derived Data page for more details on why and how to use selectors.) - Trích "react-redux" documentation

## 5. Kết luận

Như vậy là mình đã cùng các bạn điểm qua các lỗi sai khiến cho việc sử dụng memo hay PureComponent không còn hiệu quả, và khiến app không cải thiện performance rồi.

Nhìn chung các lỗi này xoay quanh đến chủ đề object và cơ chế so sánh nông.

Một khi đã biết đến các vấn đề này rồi thì việc tránh và dùng đúng cách các kỹ thuật khi code cũng không quá khó đúng không các bạn.

Hẹn gặp các bạn trong các bài viết lần sau. Mến chào các bạn!