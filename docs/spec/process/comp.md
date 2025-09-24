# 组件化
### 封装React组件
封装组件的目的是可以以组件化的方式使用PanelResize，但是所有的状态依然托管在原生js类中，不需要React的状态管理

#### 父组件
在useEffect中初始化PanelResize类，并传递参数

```jsx
//父组件
function PanelGroup(props) {
  const parentEle = useRef(null);
  const { direction, children, customCursor, panelRef = { current: undefined }, autoSaveId, className } = props;

  useEffect(() => {
    const panelEles = Array.from(children).filter(child => {
      return child?.type === Panel;
    });
    const panelSizeData = Array.from(panelEles).map((child) => {
      const { defaultSize, minSize, maxSize } = child.props;
      return {
        minSize, defaultSize, maxSize
      }
    });

    panelRef.current = new PanelResize(parentEle.current, { sizeData: panelSizeData, direction, customCursor, autoSaveId });
  }, []);
```

#### panel组件
```jsx
function Panel (props) {
  const { children, className } = props;
  return <div className={`panel-resize ${className}`}>{children}</div>

}
export default Panel;
```

#### 拖拽条组件
```jsx
function PanelResizeHandle(props) {
  const { className } = props;
  return <div className={`handle-resize ${className}`}>

  </div>
}
export default PanelResizeHandle;
```

