# 拖拽组件
### 一、元素位置变化的基础原理
<font style="color:rgb(64, 64, 64);">元素移动的核心在于改变其在坐标系中的位置，大致思路是鼠标移动后的位置-鼠标移动前的位置 + 元素移动前的位置 = 元素移动后的位置，CSS 提供了多种改变位置的方式，以下是transform、position、margin</font>这几种位置变化的方式、可能出现的问题以及使用比较

#### 使用transform:translate
```javascript
 const handleEle = document.getElementById('handler');
    let isDragging = false;
    let offsetX, offsetY;
    let mouseBegin = {
      x: undefined,
      y: undefined
    }
    let eleBegin = {
      x: undefined,
      y: undefined
    }
    // 鼠标移动后的位置-鼠标移动前的位置 + 元素移动前的位置 = 元素移动后的位置
    // 错误写法
    handleEle.addEventListener('mousedown', (e) => {
      isDragging = true;
      const rect = handleEle.getBoundingClientRect();
      mouseBegin.x = e.x;
      mouseBegin.y = e.y;
      eleBegin.x = rect.left;
      eleBegin.y = rect.top;
      console.log(eleBegin.x, eleBegin.y, mouseBegin);

    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      offsetX = e.x - mouseBegin.x;
      offsetY = e.y - mouseBegin.y;
  
      handleEle.style.transform = `translate(${eleBegin.x + offsetX}px, ${eleBegin.y + offsetY}px)`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
```

**<font style="color:rgb(64, 64, 64);">可能出现的问题：</font>**

鼠标放上去后元素会向下抖动，如果增加一个元素效果更明显

```javascript
<div id="handler1">handler ele1</div>
<div id="handler2">handler ele2</div>
```

**<font style="color:rgb(64, 64, 64);">问题原因：</font>**

<font style="color:rgb(64, 64, 64);">CSS对象模型视图是连接CSS样式与JavaScript交互的核心接口，它定义了如何通过JavaScript访问和操作元素的视觉呈现属性，该模型包含多层次的坐标系体系。在元素拖拽移动中，坐标系是元素可以移动的基础，定义了translate变换的元素会创建一个新的局部坐标系，这个坐标系和原始坐标系在坐标系原点和定位基准等有所不同</font>

+ `**<font style="color:rgb(64, 64, 64);background-color:rgb(236, 236, 236);">getBoundingClientRect().left/top</font>**`<font style="color:rgb(64, 64, 64);"> 获取的是元素在</font>**<font style="color:rgb(64, 64, 64);">原始坐标系</font>**<font style="color:rgb(64, 64, 64);">中的位置，不能获取在translate局部坐标系的位置</font>
+ `**<font style="color:rgb(64, 64, 64);background-color:rgb(236, 236, 236);">translate()</font>**`<font style="color:rgb(64, 64, 64);"> 变换是相对于元素自身</font>**<font style="color:rgb(64, 64, 64);">局部坐标系</font>**<font style="color:rgb(64, 64, 64);">的位移，不是相对于文档左上角</font>



正确实现方案eleBegin = { x: matrix.m41, y: matrix.m42 }

```javascript
   handleEle.addEventListener('mousedown', (e) => {
      isDragging = true;
      const rect = handleEle.getBoundingClientRect();
      mouseBegin.x = e.x;
      mouseBegin.y = e.y;
      const style = window.getComputedStyle(handleEle);
      const matrix = new DOMMatrix(style.transform);
     // 重点是这里
      eleBegin = { x: matrix.m41, y: matrix.m42 };

    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      offsetX = e.x - mouseBegin.x;
      offsetY = e.y - mouseBegin.y;

      handleEle.style.transform = `translate(${eleBegin.x + offsetX}px, ${eleBegin.y + offsetY}px)`;
    });
 document.addEventListener('mouseup', () => {
      isDragging = false;
    });
```

**<font style="color:rgb(64, 64, 64);">使用translate的特点：</font>**

+ <font style="color:rgb(64, 64, 64);">不会触发重排(reflow)，只引发重绘(repaint)</font>
+ <font style="color:rgb(64, 64, 64);">不影响文档流和其他元素布局</font>
+ <font style="color:rgb(64, 64, 64);">GPU加速，性能最佳</font>
+ <font style="color:rgb(64, 64, 64);">坐标计算相对简单</font>

#### 使用position:absolute
```javascript
 handleEle.addEventListener('mousedown', (e) => {
      isDragging = true;
      const pos = handleEle.getBoundingClientRect();
      mouseBegin = { x: e.x, y: e.y };
      eleBegin = {x: pos.left, y: pos.top };
      console.log('eleBegin', eleBegin);
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      offsetX = e.x - mouseBegin.x;
      offsetY = e.y - mouseBegin.y;
      handleEle.style.left = `${eleBegin.x + offsetX}px`;
      handleEle.style.top = `${eleBegin.y + offsetY}px`;
    });
```

同理，positon为absolute时，他的坐标系是基于最近的定位元素来计算的，而不是基于浏览器视口的位置，解决办法可以是通过offsetLeft和offsetTop来获取定位元素的位置

```javascript
// CSS 需要预先设置
// .draggable { position: absolute; }

  handleEle.addEventListener('mousedown', (e) => {
      isDragging = true;
      mouseBegin = { x: e.x, y: e.y };
      // 关键步骤
      eleBegin = {x: handleEle.offsetLeft, y: handleEle.offsetTop };
      console.log('eleBegin', eleBegin);
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      offsetX = e.x - mouseBegin.x;
      offsetY = e.y - mouseBegin.y;
      handleEle.style.left = `${eleBegin.x + offsetX}px`;
      handleEle.style.top = `${eleBegin.y + offsetY}px`;
    });
```

**<font style="color:rgb(64, 64, 64);">使用absolute特点：</font>**

+ <font style="color:rgb(64, 64, 64);">从文档流中脱离</font>
+ <font style="color:rgb(64, 64, 64);">需要父元素有定位上下文(非static)</font>
+ <font style="color:rgb(64, 64, 64);">会触发重排，性能中等</font>
+ <font style="color:rgb(64, 64, 64);">坐标计算需要考虑offsetParent</font>

#### 使用margin
```html
<div id="handler1">handle1</div>
<div id="handler2">handle2</div>
<div>other ele</div>

```

```javascript


let isDragging = false;
let startX, startY, startMarginLeft, startMarginTop;

element.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  startMarginLeft = parseInt(getComputedStyle(element).marginLeft) || 0;
  startMarginTop = parseInt(getComputedStyle(element).marginTop) || 0;
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  element.style.marginLeft = `${startMarginLeft + e.clientX - startX}px`;
  element.style.marginTop = `${startMarginTop + e.clientY - startY}px`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
```

**<font style="color:rgb(64, 64, 64);">特点：</font>**

+ <font style="color:rgb(64, 64, 64);">保持在文档流中</font>
+ <font style="color:rgb(64, 64, 64);">会影响周围元素布局</font>
+ <font style="color:rgb(64, 64, 64);">性能最差(触发完整重排)</font>
+ <font style="color:rgb(64, 64, 64);">实际项目中很少用于拖拽实现</font>
4. 布局流变化
+ <font style="color:rgb(64, 64, 64);">父元素尺寸变化</font>

```css
.parent {
  width: 80%; /* 视口变化时影响子元素 */
}
```

+ 兄弟元素增删/尺寸变化
5. 布局模式变化
+ display属性修改

```css
.element {
  display: inline-block; /* 从block切换会改变文档流 */
}
```

+ float浮动

<font style="color:rgb(64, 64, 64);">脱离常规流但仍影响周围元素</font>

```css
.element {
  float: left; /* 导致后续元素环绕 */
}
```

5. 高级布局影响
+ flex/grid容器调整，<font style="color:rgb(64, 64, 64);">容器属性变化导致子项重新分配空间</font>

```css
.container {
  justify-content: space-between; /* 修改后子项位置重计算 */
}
```

+ order属性改变

```css
.element {
  order: 2; /* 改变在Flex容器中的显示顺序 */
}
```

### <font style="color:rgb(64, 64, 64);">2.4 三种方法对比</font>
| **<font style="color:rgb(64, 64, 64);">特性</font>** | **<font style="color:rgb(64, 64, 64);">transform: translate</font>** | **<font style="color:rgb(64, 64, 64);">position: absolute</font>** | **<font style="color:rgb(64, 64, 64);">margin</font>** |
| --- | --- | --- | --- |
| <font style="color:rgb(64, 64, 64);">文档流影响</font> | <font style="color:rgb(64, 64, 64);">无</font> | <font style="color:rgb(64, 64, 64);">脱离</font> | <font style="color:rgb(64, 64, 64);">保持</font> |
| <font style="color:rgb(64, 64, 64);">性能</font> | <font style="color:rgb(64, 64, 64);">最佳(GPU加速)</font> | <font style="color:rgb(64, 64, 64);">中等</font> | <font style="color:rgb(64, 64, 64);">最差</font> |
| <font style="color:rgb(64, 64, 64);">坐标计算复杂度</font> | <font style="color:rgb(64, 64, 64);">中等</font> | <font style="color:rgb(64, 64, 64);">中等</font> | <font style="color:rgb(64, 64, 64);">简单</font> |
| <font style="color:rgb(64, 64, 64);">适用场景</font> | <font style="color:rgb(64, 64, 64);">现代UI、动画</font> | <font style="color:rgb(64, 64, 64);">传统拖拽</font> | <font style="color:rgb(64, 64, 64);">不推荐</font> |
| <font style="color:rgb(64, 64, 64);">层叠上下文</font> | <font style="color:rgb(64, 64, 64);">创建</font> | <font style="color:rgb(64, 64, 64);">可能创建</font> | <font style="color:rgb(64, 64, 64);">不创建</font> |
| <font style="color:rgb(64, 64, 64);">响应式布局兼容性</font> | <font style="color:rgb(64, 64, 64);">好</font> | <font style="color:rgb(64, 64, 64);">一般</font> | <font style="color:rgb(64, 64, 64);">差</font> |


## <font style="color:rgb(64, 64, 64);">结论</font>
<font style="color:rgb(64, 64, 64);">理解CSS坐标系是实现元素拖拽的基础，在改变元素位置时，要考虑是否在同一个坐标系。而</font>`**<font style="color:rgb(64, 64, 64);background-color:rgb(236, 236, 236);">transform: translate</font>**`<font style="color:rgb(64, 64, 64);">因其优异的性能和简洁的实现方式，已成为现代Web开发中实现拖拽功能的首选方案。对于需要精确控制层叠上下文或兼容旧浏览器的场景，可考虑使用</font>`**<font style="color:rgb(64, 64, 64);background-color:rgb(236, 236, 236);">position: absolute</font>**`<font style="color:rgb(64, 64, 64);">方案，而margin方案由于其性能缺陷，在实际开发中应避免用于拖拽实现。</font>

