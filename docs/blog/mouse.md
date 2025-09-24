# 鼠标相对位移与绝对位移
### 一、方式展示
以下两段代码都是在鼠标移动过程中改变元素宽度，不同之处是第一种在移动过程中更新初始位置和宽度，处理的是增量位移，第二种是只在鼠标按下时记录初始位置，处理的是绝对位移。

##### <font style="color:rgb(64, 64, 64);">第一种</font>
```jsx
    const getElePos = (ele) => {
      const pos = ele.getBoundingClientRect();
      return pos;
    }

    handleEle.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isDragging = true;

    });

    // 每次拖拽都更新鼠标位置和宽度

    document.addEventListener('mousemove', (e) => {
      
      if (!isDragging) return;
      const dx = e.clientX - startX;

      const containerWidth = wrapperEle.offsetWidth;
      const dragBarWidth = handleEle.offsetWidth;

      const leftPos = getElePos(panelLeftEle);
      const rightPos = getElePos(panelRightEle)

      console.log(leftPos.width, dx);
      const leftWidth = leftPos.width + dx;
      const rightWidth = rightPos.width - dx;

      panelLeftEle.style.width = `${leftWidth}px`;
      panelRightEle.style.width = `${rightWidth}px`;
      startX = e.clientX

    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
```

##### 第二种
```jsx
   handleEle.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isDragging = true;

      const leftPos = getElePos(panelLeftEle);
      const rightPos = getElePos(panelRightEle)
      // 只在鼠标按下时更新鼠标位置
      startLeftEleWidth = leftPos.width;
      startRightEleWidth = rightPos.width;

    });
   
  
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;

      const containerWidth = wrapperEle.offsetWidth;
      const dragBarWidth = handleEle.offsetWidth;

      const leftPos = getElePos(panelLeftEle);
      const rightPos = getElePos(panelRightEle)

      const leftWidth = startLeftEleWidth + dx;
      const rightWidth = startRightEleWidth - dx;

      panelLeftEle.style.width = `${leftWidth}px`;
      panelRightEle.style.width = `${rightWidth}px`;

    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
```

### 二、方式对比
第一种在鼠标移动过程中会出现<font style="color:rgb(64, 64, 64);">鼠标位置与拖拽条位置不匹配的问题原因主要有以下几点：</font>

1. 浏览器对小像素数的处理机制

<font style="color:rgb(64, 64, 64);">浏览器渲染时会对小数像素进行舍入处理，主要机制包含亚像素渲染，浏览器内部使用浮点数计算布局，但最终渲染时会将元素对齐到物理像素网格。增量位移中偏移量出现小数的可能性和频率更大，移动越久，误差累积越多。</font>

```jsx
// 假设：
leftPos.width = 100.4px → 实际可能渲染为100px
dx = 10.6px → 实际可能移动10px
leftWidth = 100.4 + 10.6 = 111px
但实际渲染：
100px + 10px = 110px → 出现1px偏差
```

```jsx
// 连续多次小位移计算示例
let width = 100;
width += 0.3; // 100.3 → 渲染为100px
width += 0.3; // 100.6 → 渲染为101px
width += 0.3; // 100.9 → 渲染为101px
// 实际总位移：0.9px → 渲染总变化：1px
```

2. 浏览器事件系统

<font style="color:rgb(64, 64, 64);">根据W3C标准，鼠标事件坐标通常返回整数（CSS像素单位），底层原因时硬件限制、性能优化以及历史兼容性。由于只返回整数，慢速移动时可能连续获取相同值，快速移动时会出现较大跳跃。</font>

```jsx
// 如果每次只捕获整数位移：
// 理论路径：0.3 + 0.3 + 0.3 = 0.9px
// 实际捕获：0 + 0 + 1 = 1px (误差10%)
```



### 总结
基于上述原因，建议始终使用 总位移 = currentX - initialX 绝对位移的方式计算

