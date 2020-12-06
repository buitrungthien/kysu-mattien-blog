---
title: 'Learn CSS: Bớt gặp bug về css z-index nếu bạn sớm biết những điều này'
date: '2020-11-28'
author: { name: 'Thiên Bùi' }
tag: 'tech'
featuredImgUrl: 'https://i.imgur.com/CanpOIF.jpg?1'
featuredImgAlt: 'CSS z-index'
description: 'z-index có vẻ khá dễ, khá trực quan. Chính vì thế developers chúng ta thường không quá chú tâm hay tìm hiểu kỹ về css z-index. Điều này vô tình khiến chúng ta gặp khó khăn khi các z-index element hoạt động không giống với cách chúng ta mong muốn và gây khó khăn trong việc debug.'
---

Hello các bạn đã lâu không gặp. hôm nay **kỹ sư mặt tiền** sẽ đề cập một chút về css, cụ thể là z-index trong css.

Chắc hẳn ỡ những ngày đầu học HTML và CSS, chúng ta đã được biết đến việc sử dụng thuộc tính `z-index` để xét thứ tự hiển thị, độ "che phủ" của một element so với các element còn lại. Nói ngắn gọn thì phần tử nào có thuộc tính z-index cao hơn thì sẽ "nằm trên" và "đè" lên các phần tử có z-index thấp hơn đúng không nào!?

Chính vì z-index khá trực quan và "dễ" nên dev chúng ta thường không mấy quan tâm chi tiết đến thuộc tính khá thú vị này... Cho đến một ngày đẹp trời bạn set z-index cho một vài element để các elemnt đè lên nhau theo một thứ tự nào đó cho giống với design, nhưng rốt cuộc cái bọn z-index này chẳng chịu hoạt động theo cách bạn nghĩ, hay thậm chí một số trường hợp còn gây ra các bug layout khá nghiêm trọng.

Để bớt gặp các bug như thế này thì các bạn đầu tiên hãy double check xem đã làm đúng theo 2 lưu ý dưới đây không nha.

## 1. Đảm bảo element đang được set z-index là một "position-ed element"

Như tựa đề, khi set z-index cho một element mà thấy element đó không hoạt động thì hãy "inspect element" và đảm bảo rằng element này là một "positioned elemnt".

Positioned element là gì? Là element có thuộc tính "position: relative", "position: absolute", "position: fixed",... hay nói cách khác: **một positioned element là một element có thuộc tính position khác với static**.

Position: static là giá trị mặc định mà browser set cho một element khi chúng ta không trực tiếp khai báo position cho element đó. Nên đây rất dễ là nguồn cơn của cái bug z-index mà bạn đang lay hoay. Vì **việc set z-index cho một element chỉ có tác dụng khi element đó là một positioned-element** (element có thuộc tính position khác **static**)

<span class="problem-label">Ví dụ:</span>

<p class="codepen" data-height="350" data-theme-id="light" data-default-tab="css,result" data-user="b-i-kim" data-slug-hash="dypPewM" style="height: 350px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="z-index without position">
  <span>See the Pen <a href="https://codepen.io/b-i-kim/pen/dypPewM">
  z-index without position</a> by Bùi Kiệm (<a href="https://codepen.io/b-i-kim">@b-i-kim</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Nhìn vào ví dụ codepen bên trên, chúng ta có 3 element: Xanh, đỏ, tím.

với element màu tím, mình cố tình set position fixed và top, left tương ứng để có thể "đè" lên được element xanh lá cây:

```css
.purple {
  position: fixed;
  top: 0;
  left: 25px;
}
```

Nhưng vì một lý do nào đó (ví dụ độ ưu tiên hiển thị) bây giờ mình muốn element màu xanh có độ ưu tiên cao hơn và nằm đè lên element màu tím thì làm sao? À, dễ ợt, chỉ cần set z-index cho ô màu xanh khác 0 là xong. Cái này mình học rồi. Default z-index của mỗi element là "auto" hay có thể coi là **bằng 0**, element nào mà có z-index lớn hơn thì sẽ nằm trên.

Ô tím đang có z-index default = 0 (vì không được set z-index cụ thể), vậy giờ mình set z-index = 1 cho ô màu xanh là xong.

```css
.green {
  background-color: green;
  z-index: 1;
}
```

Và... Nothing happened!

Ô màu xanh vẫn trơ trơ nằm im, không đè lên được ô màu tím.

Lý do là vì bạn đã quên set thêm `position` cho ô màu xanh, nên mặc định ô màu xanh vẫn là một "static position element" và việc set z-index cho element đó hoàn toàn không có tác dụng gì.

Cách fix đơn giản, chỉ việc set thêm position khác static cho ô màu xanh:

```css
.green {
  background-color: green;
  z-index: 1;
  position: relative;
}
```

Xem demo tiếp theo, bạn có thê tháy thuộc tính z-index đã có tác dụng trên "position-ed element" xanh lá cây.

<p class="codepen" data-height="320" data-theme-id="light" data-default-tab="css,result" data-user="b-i-kim" data-slug-hash="XWjJYWr" style="height: 320px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="z-index with position">
  <span>See the Pen <a href="https://codepen.io/b-i-kim/pen/XWjJYWr">
  z-index with position</a> by Bùi Kiệm (<a href="https://codepen.io/b-i-kim">@b-i-kim</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## 2. Đảm bảo các element con liên quan nằm trong cùng một "stacking context" cha

Tiếp đến, các bạn nên lưu ý về "stacking context" của các element được set z-index.

Bản thân định nghĩa ["stacking context"](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) bằng tiếng Anh khá mơ hồ.

Nôm na thì một element bình thường sẽ không có "stacking context", chúng sẽ "nằm phẳng" và "đồng cấp" với các element trên cây DOM khác. Nhưng khi chúng ta set z-index cho một element (nhớ kèm theo vụ positioned-element), thì chúng ta đã trực tiếp tạo nên "stacking context" cho element đó.

Nhìn chung "stacking context" (stacking: xếp chồng, context: ngữ cảnh) chính là yếu tố, giá trị của một element mà web broser nhìn vào đó và quyết định xem element nào sẽ "nằm trên", element nào nằm dưới.

Bằng việc set các giá trị z-index cho các element, chúng ta chính xác đang change các "stacking context" nói trên, bằng cách đó chúng ta nói với browser tôi muốn element này nằm trên, element kia nằm dưới, ...

**Lưu ý: (Ngoài việc set z-index, các action khác cũng sẽ tạo ra "stacking context" cho element tương ứng, ví dụ: các phần tử con của một flexbox container, phần tử con của một grid container, hay thậm chí chỉ đơn thuần set position: relative cho một element cũng là đang tạo ra "stacking context" cho một element. Tức là element đó có khả năng được browser sắp xếp độ ưu tiên hiển thị dựa vào stacking context của nó)**.

[Nguyên văn trên mozilla](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context).

Ok, giờ thì cùng xem tiếp ví dụ tiếp theo dưới đây nào:

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="b-i-kim" data-slug-hash="OJRPEmw" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="buggy div">
  <span>See the Pen <a href="https://codepen.io/b-i-kim/pen/OJRPEmw">
  buggy div</a> by Bùi Kiệm (<a href="https://codepen.io/b-i-kim">@b-i-kim</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Đây là một layout đơn giản, có header màu đỏ, main-content màu xám và bên trong main-content có một box màu xanh lá cây.

```css
header {
  width: 100%;
  height: 50px;
  background-color: red;
  position: fixed;
  top: 0;
  left: 0;
  color: white;
}

main {
  background-color: lightgray;
  padding: 5px;
  widht: 100%;
  height: 600px;
}

.buggy {
  width: 80px;
  height: 80px;
  background-color: green;
  position: relative;
  top: 100px;
}
```

Header mình đang set position fixed để luôn hiển thị trên màn hình. Nhưng có một vấn đề xảy đến, khi cuộn chuột trên content, khối div màu xanh vô tình nằm đè lên trên header màu đỏ.

Để giải quyết vấn đề này thường đại đa số chúng ta sẽ đi set z-index cho header cao hơn các phần tử còn lại là được. Thậm chí set bằng một biến SCSS `$highestZIndex: 100` chẳng hạn, sau đó khai báo cho header. Kể từ đó về sau, các element còn lại khi muốn set z-index, chỉ cần set giá trị thấp hơn giá trị 100 đó là được. Không còn bug các element con trong body content nằm đè lên header...

Nhưng thật ra cách trên vẫn chưa phải là tốt nhất. Đặc biệt trong quy mô dự án chạy lâu dài, dần dần các dev "thế hệ sau" khi được bàn giao source code sẽ không thể biết đến sự tồn tại của cái biến **highestZIndex** kia là gì trong lúc code.

Hoặc thậm chí nếu quy mô team được chia tách nhỏ, team bạn được đảm nhận làm một "page", gắn trong body-content trong layout kể trên. Sau đó đội team khác sẽ gắn đoạn code team bạn vào layout tổng thể của họ, thì hoàn toàn trong lúc dev, chúng ta có thể vô tình set z-index cho một vài component **lớn hơn giá trị z-index của header**, cụ thể ở ví dụ trên là lớn hơn 100. Biết làm sao được, lúc code chúng ta còn thậm khí không biết đến sự tồn tại của cái header kia mà đúng không nào.

May thay có một cách giải quyết khá nhanh gọn và dễ dàng, chúng ta thêm các dòng code css như sau:

```css
header {
  z-index: 10;
}

main {
  z-index: 1;
  position: relative;
}
```

Kết quả, header không còn bị đè bởi ô màu xanh. Mặc do ô màu xanh có z-index: 101 và header có z-index: 10

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="css,result" data-user="b-i-kim" data-slug-hash="dypPKqZ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="correct stacking context">
  <span>See the Pen <a href="https://codepen.io/b-i-kim/pen/dypPKqZ">
  correct stacking context</a> by Bùi Kiệm (<a href="https://codepen.io/b-i-kim">@b-i-kim</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Vấn đề đã được giải quyết, nhưng tại sao lại như vậy?

Thật ra, browser không đơn thuần nhìn vào giá trị z-index của một element và ngay lập tức cho phép các element có z-index cao hơn "nằm đè" lên các element có z-index thấp hơn mà các giá trị z-index của các element sẽ được đánh giá trong cùng "level" "stacking context" với nhau.

Ôi sao nghe mà nhức đầu quá. Thật ra túm cái quần lại thì bạn hình dung là z-index nó vẫn có tính "bao đóng", có quan hệ cha con. Tức là ở ví dụ trên: header có z-index: 10, main có z-index: 1, header luôn "đè" lên main. Vì body content **main** là **cha** của các element con, nằm bên trong main, nên dù cho các element con trong tương lai có z-index lớn hơn 10, bằng 100 đi chăng nữa, thì vẫn được bao đóng bởi body content **main**. Mà main (index = 1) so với header (index = 10) thì không có tuổi, nên con của main cũng không thể "đè" lên được header.

Như vậy, lúc khởi sự dàn layout cho một project, chỉ cần chúng ta biết đến khái niệm "bao đóng" như trên và cẩn thận set các giá trị z-index tương ứng một cách cẩn thận ngay từ đầu thì sẽ hạn chế được các bug css trong tương lai. Đặc biệt khi có nhiều team cùng do tính chất "chia nhỏ" của một dự án.

## 3. Kết luận

Bài hôm nay mình đã cùng các bạn tìm hiểu đến hai vấn đề cơ bản nhưng thường bị bỏ qua khi làm việc với z-index. Biết được những điều này sớm sẽ giúp chúng ta bớt gặp rắc rối về z-index rất nhiều.

Hẹn gặp các bạn trong bài viết lần sau. Mến chào các bạn!
