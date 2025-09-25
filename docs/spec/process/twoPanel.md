# 两个面板
### 初步方案：基于translate偏移量的控制方式
1. 实现思路

通过监听主控元素的translate位移变化，将位移量按比例转换为目标元素的宽高值。这种方案保持主控元素的位置属性不变，仅通过视觉位移实现控制。

1. 可能的写法

```css
#wrapper {
  display: flex;
  height: 300px;
  border: 1px solid;
}
#handler {
  width: 10px;
  border: 1px solid;
  background-color: aqua;
  cursor: pointer;
}
[id^=panel] {
  width: 200px;
  height: 300px;
  border: 1px solid;
  background-color: bisque;
}

```

```javascript
const wrapperEle = document.getElementById('wrapper');
    const handleEle = document.getElementById('handler');
    const panelLeftEle = document.getElementById('panel-left');
    const panelRightEle = document.getElementById('panel-right');


    let isDragging = false;
    let offsetX, offsetY;

    const containerWidth = wrapperEle.offsetWidth;
    const dragBarWidth = handleEle.offsetWidth;

    const leftWidth = (containerWidth / 2) - (dragBarWidth / 2);
    const rightWidth = containerWidth - leftWidth - dragBarWidth;
    // 初始化面板宽度
    panelLeftEle.style.width = leftWidth;
    panelRightEle.style.width = rightWidth;

    // 获取当前translateX值
    function getTranslateX(element) {
      const style = window.getComputedStyle(element);
      const matrix = new DOMMatrix(style.transform);
      return matrix.m41;
    }

    handleEle.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startTranslateX = getTranslateX(handleEle);
      isDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const newTranslateX = startTranslateX + dx;

      const containerWidth = wrapperEle.offsetWidth;
      const dragBarWidth = handleEle.offsetWidth;

      const leftWidth = (containerWidth / 2) + newTranslateX - (dragBarWidth / 2);
      const rightWidth = containerWidth - leftWidth - dragBarWidth;

      handleEle.style.transform = `translateX(${newTranslateX}px)`;
      panelLeftEle.style.width = `${leftWidth}px`;
      panelRightEle.style.width = `${rightWidth}px`;


    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });


```

3. <font style="color:rgb(64, 64, 64);">出现的问题：</font>

拖拽条的位置和预期位置不一致

<font style="color:rgb(64, 64, 64);">产生问题的原因是面板宽度变化触发Flex容器重新计算项目位置，会与主动应用translate产生位移量叠加</font>

，导致移动速度翻倍，出现拖拽条位置和预期不一致的问题

![](https://cdn.nlark.com/yuque/0/2025/png/745200/1755093111676-e781cf62-47ba-47d8-b3cc-ca2b4745951d.png)

### 最终方案：使用flex布局驱动
这个问题的解决办法比较简单的是采用纯flex布局驱动，<font style="color:rgb(64, 64, 64);">通过动态调整相邻面板的width或者flex-grow实现拖拽效果</font>，无需手动改变拖拽条位置

```javascript
 document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const newTranslateX = startTranslateX + dx;

      const containerWidth = wrapperEle.offsetWidth;
      const dragBarWidth = handleEle.offsetWidth;

      const leftWidth = (containerWidth / 2) + newTranslateX - (dragBarWidth / 2);
      const rightWidth = containerWidth - leftWidth - dragBarWidth;

      // handleEle.style.transform = `translateX(${newTranslateX}px)`;
      panelLeftEle.style.width = `${leftWidth}px`;
      panelRightEle.style.width = `${rightWidth}px`;


    });
```

### <font style="color:rgb(64, 64, 64);">结论</font>
<font style="color:rgb(64, 64, 64);">在双面需求中，可以利用Flex容器的弹性分配特性，通过直接修改width/flex-grow值实现尺寸控制，主控元素位置会自动适应布局变化。</font>



