# 一些小问题
#### 1. 初始化时构造函数被调用了两次
在修改面板所占父元素比例后没有生效，一直是初始化的值不是最新值。排查时发现在init中的adjustFlexOnResize函数中，获取到两次面板比例，一次是最新的，一次是初始化时设置的值。初始值是在constructor中设置的，按理说只会触发一次，触发了两次说明PanelResize重新初始化了。找到调用PanelResize的地方，在useEffect中发现PanelResize会调用两次

```javascript
export default class PanelResize {
  constructor() {
    this.init()
  }
  init() {
    
    this.resizeObserver = new ResizeObserver(this.adjustFlexOnResize)
    this.resizeObserver.observe(this.parentEle);
  }
  
}

```

```javascript
function PanelGroup(props) {
  const parentEle = useRef(null);
  const { direction, children, customCursor, panelRef, autoSaveId } = props;
  useEffect(() => {
    const sizes = Array.from(children).map((child) => {
      const { defaultSize, minSize, maxSize } = child.props;
      return {
        minSize, defaultSize, maxSize
      }
    });

    const panelSizeData = sizes.filter((it) => it.minSize || it.defaultSize);
    new PanelResize(parentEle.current, panelSizeData, direction, customCursor, autoSaveId);
  }, []);


  return <div ref={parentEle} className='wrapper'>{children}</div>
}
```

解决思路是已经初始化后的直接返回，未初始化的再初始化

##### 解决方式一：使用initialRef判断是否初始化过，如果初始化过，直接返回
```jsx
const initialRef = useRef(null);

useEffect(() => {
  if(initialRef.current) return;
  const sizes = Array.from(children).map((child) => {
    const { defaultSize, minSize, maxSize } = child.props;
    return {
      minSize, defaultSize, maxSize
    }
  });
  const panelSizeData = sizes.filter((it) => it.minSize || it.defaultSize);
  new PanelResize(parentEle.current, panelSizeData, direction, customCursor, autoSaveId);
  initialRef.current = true;
}, []);
```

##### 解决方式二：在PanelResize中增加静态属性，用于存储已经实例化的元素，这种方式可以处理的更彻底一点，上述方式只能解决在React中的问题，因此最终选择这种方式
```jsx
export default class PanelResize {
  static panelResizeEleHistory = new Set();
  static cache = new Map();

  constructor(parentEle, options = {}) {
    const existingInstance = PanelResize.cache.get(parentEle);
    if (existingInstance) {
      return existingInstance;
    }
    PanelResize.cache.set(parentEle, this);
}
```

##### 结论：在初始化过程中，如果构造函数被调用了两次，那么init就会执行两次。要看一个函数为什么执行的次数不对，需要一直看到顶层调用栈，不能只看当前当前调用栈。
#### 2. 对拖拽条上背景图标的思考
这个图标可以选择png、svg格式，也可以选择svg代码。最终选择的是svg代码，因为png、svg格式的图片需要托管到静态服务器上。对于第三方库图片的加载，如果配置了绝对路径会从绝对路径中请求，例如静态服务器地址。如果配置了相对路径，会从用户本地的文件目录请求，这样就会请求失败。选择svg代码就不需要进行http请求

```javascript
this.dragIconMap = {
  hori: '<svg t="1754444587728" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39031" width="12" height="12"><path d="M661.333333 725.333333a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-298.666666 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m298.666666-298.666666a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-298.666666 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m298.666666-298.666667a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-298.666666 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z" p-id="39032" fill="#8a8a8a"></path></svg>',
  horiActive: '<svg t="1754444587728" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39031" width="12" height="12"><path d="M661.333333 725.333333a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-298.666666 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m298.666666-298.666666a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-298.666666 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m298.666666-298.666667a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-298.666666 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z" p-id="39032" fill="#dbdbdb"></path></svg>',
  verit: '<svg t="1754448960404" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39643" width="12" height="12"><path d="M298.666667 661.333333a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m0-298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m298.666666 298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m0-298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m298.666667 298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m0-298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z" p-id="39644" fill="#8a8a8a"></path></svg>',
  veritActive: '<svg t="1754445813297" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39337" width="12" height="12"><path d="M298.666667 661.333333a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m0-298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m298.666666 298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m0-298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m298.666667 298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m0-298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z" p-id="39338" fill="#dbdbdb"></path></svg>',
}
this.dragEle.innerHTML = this.isHorizontal ? this.dragIconMap['hori'] : this.dragIconMap['verit']
```

#### 3. 发包中的问题
+ 发布一个包，是否可以用脚手架创建项目用于验证

   完全可以。即使只发一个简单的包，也可以用脚手架创建一个项目。之前会担心这个脚手架发布上去会有点重，但是在发布的时候，只有package.json的files字段列出的文件会被发布。在发包的时候，npm会默认自动包含package.json、readme、main字段指定的文件、bin字段指定的文件，也会自动排除一些文件，比如node_modules文件。

用户在使用npm安装时，只会安装package.json中dependencies和peerDependencies，不会安装devDependencies。

+ 发布源码还是构建后的代码

如果只是一个简单的库的话，最好发布源码。因为如果发布构建后代码，需要提供多个构建版本，而且项目中使用的构建工具可能和用户的构建工具有冲突。发布源码，用户可以自己决定构建方式，并且也会对代码进行优化。

+ 什么是monorepo包

monorepo（单一代码仓库），是一种将多个相关项目或包存储在同一个<font style="color:rgb(64, 64, 64);">版本控制仓库中的代码管理策略。多个项目/包共享同一个 git 仓库。这里面的包基本是在项目内部使用的，所以发布的时候就不需要创建脚手架。</font>

#### 4. useEffect依赖空数组的话，会执行一次还是两次
除了useEffect，useLayout、useMemo、useCallback等状态初始化函数都是开发环境会执行一次，生产环境在严格模式（默认）下会执行两次。react团队通过这种<font style="color:rgb(64, 64, 64);">设计强制开发者编写幂等的副作用代码。这种设计也是为了并发模式作准备，React 18 的并发特性意味着，组件可能"渲染"多次但只提交一次结果。</font>

在react 18严格模式下，组件可能会进行三次渲染，两次卸载。有一个模拟卸载，模拟再次挂载的流程

```jsx
// React 内部的模拟行为
function invokeEffect(effect) {
  if (__DEV__) {
    effect(); // 第一次调用（可能被丢弃）
    effect(); // 第二次调用（实际应用）
  } else {
    effect(); // 生产环境单次调用
  }
}
```

##### <font style="color:rgb(64, 64, 64);">如果不想执行多次，正确的应对策略是</font>
<font style="color:rgb(64, 64, 64);">添加清理函数</font>

```javascript
useEffect(() => {
  const timer = setTimeout(() => {}, 1000);
  return () => clearTimeout(timer);
}, []);
```

使用ref标记

```javascript
const executedRef = useRef(false);
useEffect(() => {
  if (executedRef.current) return;
  executedRef.current = true;
  // 一次性逻辑
}, []);
```

#### 5. 什么是幂等/非幂等代码
###### 幂等代码
```javascript
// 示例1：每次执行都会创建新定时器，但清理函数会清除前一个，即使多次执行，也只有一个有效定时器存在
useEffect(() => {
  const timer = setTimeout(() => {}, 1000);
  return () => clearTimeout(timer);
}, []);
// 示例2：安全的DOM操作
useEffect(() => {
  document.title = '新标题'; // 多次设置结果相同
  return () => { document.title = ''; };
}, []);

// 示例3：幂等的事件监听
useEffect(() => {
  const handler = () => {};
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

###### 非幂等代码
```javascript
// 示例1：重复数据提交
useEffect(() => {
  fetch('/api/submit', { method: 'POST' }); // 多次调用会产生多条记录
}, []);

// 示例2：累积操作
useEffect(() => {
  counter++; // 每次执行都会递增，结果取决于执行次数
}, []);

// 示例3：未清理的订阅
useEffect(() => {
  socket.connect(); // 多次调用创建多个连接
}, []);
```

#### 6. key值引发的渲染问题
在引入并使用PanelGroup和Panel组件时，发现为Panel设置的flex-grow没有生效。在log的时候发现，panel组件中的key值log了两次，而库中使用的是第一次，究其原因是因为key值不是确定的。如果Panel组件渲染两次的话，会产生两个key值。当key值变化时，react会销毁并重建组件实例，同时丢弃所有dom状态。因此会产生设置了属性不生效的问题

###### 修改前
```jsx
function Panel (props) {
  const { children } = props;
  
  const id = `panel-${Math.random().toString(36).substring(2, 9)}`;
  // key不是确定的
  return <div className={id} key={id}>{children}</div>
}
export default Panel;
```

![](https://cdn.nlark.com/yuque/0/2025/png/745200/1755222918209-c846eaae-b22e-43e9-be8d-787377767fcb.png)

###### 修改后
```jsx
function Panel (props) {
  const { children } = props;
  // 给一个确定的key值，或者去掉。这里key不是必须的
  return <div className="panel-resize">{children}</div>
}
export default Panel;
```

#### 7. localStorage存储的内容在组件切换后失效
在实现保存页面样式时，切换左侧菜单后，之前保存的样式没有了。原因是保存的是组件中的样式比例，当切换菜单后，组件就被销毁了，这个状态也变为了初始状态。

解决办法是，在设置localStorage时，先检查样式比例是否有值，有的话就设置上，没有的话就说明组件是销毁状态，不需要重新设置，只需要保存之前的状态。

```jsx
  saveLayoutInLocal = () => {
    // 增加判断
    const flexRatio = this.panelFlexInParent?.filter(it => it);
    if (this.autoSaveId && flexRatio?.length) {
      const newLayout = [...flexRatio];
      const item = {
        value: newLayout,
        expiry: Date.now() + 3600 * 1000
      };
      localStorage.setItem(`layout-${this.autoSaveId}`, JSON.stringify(item));
    }
  }
```





