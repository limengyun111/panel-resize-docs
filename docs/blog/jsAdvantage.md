# 原生JS实现拖拽面板的优势分析
对于拖拽面板功能，使用React或Vue框架都可以实现，但最终选择使用原生js实现，是基于以下几点。

### 一、性能优势

##### <font style="color:rgb(64, 64, 64);">无虚拟DOM开销</font>
+ **<font style="color:rgb(64, 64, 64);">直接DOM操作</font>**<font style="color:rgb(64, 64, 64);">：省去了React的虚拟DOM比较和diff算法过程</font>
+ **<font style="color:rgb(64, 64, 64);">精准更新</font>**<font style="color:rgb(64, 64, 64);">：只修改必要的DOM属性，避免React可能的重渲染</font>
+ **<font style="color:rgb(64, 64, 64);">内存占用低</font>**<font style="color:rgb(64, 64, 64);">：不需要维护虚拟DOM树，减少内存使用</font>

```jsx
// 初始化设置宽度
this.panelsEle = this.panelsEle.map((ele, index) => {
      ele.style.flexGrow = panelsFlexRatio[index] / 100 * this.totalFlex;
      this.panelsFlex[index] = panelsFlexRatio[index] / 100 * this.totalFlex;
      ele.style.flexBasis = 0;
      return ele;
})
// 更新面板宽度
panel.style.flexGrow = curFlex + adjustAmount;
```

##### <font style="color:rgb(64, 64, 64);">高频事件处理优化</font>
+ **<font style="color:rgb(64, 64, 64);">裸事件监听</font>**<font style="color:rgb(64, 64, 64);">：直接使用addEventListener，没有React合成事件系统的中间层</font>
+ **<font style="color:rgb(64, 64, 64);">手动节流/防抖</font>**<font style="color:rgb(64, 64, 64);">：可以根据拖拽特性定制优化策略</font>

### 二、架构层面的优势
##### 无框架耦合
+ **<font style="color:rgb(64, 64, 64);">零依赖</font>**<font style="color:rgb(64, 64, 64);">：不依赖React版本和生态</font>
+ **<font style="color:rgb(64, 64, 64);">迁移成本低</font>**<font style="color:rgb(64, 64, 64);">：可轻松集成到任何技术栈</font>
+ **<font style="color:rgb(64, 64, 64);">长期稳定</font>**<font style="color:rgb(64, 64, 64);">：不受框架breaking changes影响</font>

##### 更小的运行时开销
+ **<font style="color:rgb(64, 64, 64);">无runtime</font>**<font style="color:rgb(64, 64, 64);">：不需要加载React的运行时代码(约40KB gzip)</font>
+ **<font style="color:rgb(64, 64, 64);">启动更快</font>**<font style="color:rgb(64, 64, 64);">：特别是对于简单页面，TTI(可交互时间)更短</font>

## <font style="color:rgb(64, 64, 64);">总结</font>
<font style="color:rgb(64, 64, 64);">原生JavaScript提供了最高级别的性能和控制力，适合对执行效率要求极高的场景。React则在开发效率和可维护性方面具有明显优势，适合快速迭代的复杂应用。技术选型应综合考虑项目规模、性能需求、团队技能和长期维护成本等因素。</font>

