---
title: 'Các lỗi dễ mắc khiến nỗ lực sử dụng PureComponent và memo trở thành công cốc.'
date: '2020-08-19'
author: { name: 'Thiên Bùi' }
tag: 'tech'
image: 'https://wordsofayoungmind.files.wordpress.com/2015/02/i-want-to.jpg'
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

Trong JS, function cũng là object, object được tạo mới thì khi PureComponent thực hiện cơ chế so sánh nông trên prop cũ và mới <span class='inline-code'>onBtnClick</span> sẽ cho ra kết quả là **false** (again, nếu bạn vẫn chưa nắm cơ chế so sánh nông thì xem lại <a href="https://kysumattien.com/react-purre-component-and-react-memo/" target="_blank">bài này</a> nhé).

PureComponent thấy rằng prop truyền vào đã change và **tưởng nhầm** rằng bạn muốn update component **Button**, dẫn đến một loạt console.log() hiện ra - thể hiện quá trình re-render diễn ra bên trong **Button**

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

## 2. Object, object và object

## 3. Do not move stable or object config out of the render body of functional components

## 4. mapStateToProps in connect HOC
