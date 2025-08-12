# Panel Resize JS

一个轻量级的面板拖拽调整大小库，支持水平和垂直方向的拖拽调整。

## 安装

### 使用 npm 安装：

### npm install panel-resize-js

## 使用说明
### 基本用法
首先，确保你的 HTML 结构符合要求：

- 父元素需要有 wrapper 类名
- 子面板元素需要以 panel 为类名前缀
- 拖拽条需要以 handle 为类名前缀
### 初始化
```js
import PanelResize from 'panel-resize-js';

new PanelResize(
  document.getElementById('wrapper-element'), // 必填：拖拽容器元素
  [ // 面板尺寸配置（可选）
    { minSize: 10, defaultSize: 30, maxSize: 50 }, // minSize最小尺寸比例 defaultSize 默认尺寸比例 maxSize 最大尺寸比例
    { minSize: 20, defaultSize: 30 },
    { minSize: 20 }
  ],
  'horizontal' // 拖拽方向（可选，默认'horizontal'）
);
```


### PanelResize 参数说明

| 参数名       | 类型            | 必填 | 默认值     | 说明                                                                 |
|--------------|-----------------|------|------------|----------------------------------------------------------------------|
| `container`  | `HTMLElement`   | 是   | -          | 包含面板和拖拽条的容器元素，必须是一个有效的DOM元素                 |
| `sizeConfig` | `Array<{minSize?: number,defaultSize?: number,maxSize?: number}>` | 否   | `[]`       | 面板尺寸配置数组，每个元素为包含尺寸配置的对象                |
| `direction`  | `String`        | 否   | `'horizontal'` | 拖拽方向，可选值：`'horizontal'`（水平）或 `'vertical'`（垂直） |


### 完整示例
```jsx
import { useEffect } from 'react';
import PanelResize from 'panel-resize-js';

function App() {
  useEffect(() => {
    new PanelResize(
      document.getElementById('wrapper-resize'),
      [
        { minSize: 10, defaultSize: 30 },
        { minSize: 20, defaultSize: 30 },
        { minSize: 20, defaultSize: 40 }
      ],
      'vertical'
    );
  }, []);

  return (
    <div className="wrapper" id="wrapper-resize">
      <div className="panel-one">panel-one</div>
      <div className="handle-one"></div>
      <div className="panel-two">panel-two</div>
      <div className="handle-two"></div>
      <div className="panel-three">panel-three</div>
    </div>
  );
}

export default App;
```

