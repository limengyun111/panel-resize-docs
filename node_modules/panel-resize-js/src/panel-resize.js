// 接受一个可拖拽dom元素和拖拽限制，提供事件反馈。可实现元素拖拽或自定义拖拽功能
/* eslint-disable */
import './index.css';
class DragElement {
  static paramEleHistory = new Set();
  constructor(dragEle, options = {}) {
    if (DragElement.paramEleHistory.has(dragEle)) {
      return [...DragElement.paramEleHistory].find(item => item === dragEle);
    }
    DragElement.paramEleHistory.add(dragEle);

    const {
      customDragMove, direction = 'horizontal', customCursor
    } = options;

    this.dragEle = dragEle;
    this.direction = direction;
    this.isHorizontal = direction === 'horizontal';
    this.customCursor = customCursor;
    if (this.customCursor) {
      this.updateGlobalCursor({ isPointerDown: false })
    }


    this.dragIconMap = {
      hori: '<svg t="1754444587728" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39031" width="12" height="12"><path d="M661.333333 725.333333a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-298.666666 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m298.666666-298.666666a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-298.666666 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m298.666666-298.666667a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-298.666666 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z" p-id="39032" fill="#8a8a8a"></path></svg>',
      horiActive: '<svg t="1754444587728" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39031" width="12" height="12"><path d="M661.333333 725.333333a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-298.666666 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m298.666666-298.666666a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-298.666666 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m298.666666-298.666667a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-298.666666 0a64 64 0 1 1 0 128 64 64 0 0 1 0-128z" p-id="39032" fill="#dbdbdb"></path></svg>',
      verit: '<svg t="1754448960404" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39643" width="12" height="12"><path d="M298.666667 661.333333a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m0-298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m298.666666 298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m0-298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m298.666667 298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m0-298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z" p-id="39644" fill="#8a8a8a"></path></svg>',
      veritActive: '<svg t="1754445813297" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39337" width="12" height="12"><path d="M298.666667 661.333333a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m0-298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m298.666666 298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m0-298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m298.666667 298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z m0-298.666666a64 64 0 1 1-128 0 64 64 0 0 1 128 0z" p-id="39338" fill="#dbdbdb"></path></svg>',
    }
    this.dragEle.innerHTML = this.isHorizontal ? this.dragIconMap['hori'] : this.dragIconMap['verit']


    // 可以只接受鼠标位置坐标，元素本身不发生偏移（自定义拖拽功能）
    this.customDragMove = customDragMove;
    // 记录鼠标是否开始移动，以及移动位置
    this.isBeginMove = false;
    this.mouseBeginPos = undefined;
    // 被拖拽元素初始位置
    this.dragEleBeginPos = undefined;

    // 外部限制拖拽条件 以及 鼠标样式，因为使用的时候需要 // todo
    this.isEnabled = true;
    this.disabledDir = undefined;
    // 初始化
    this.init();
  }
  // mouse事件回调
  onMoveDown(x, y) {
    // todo 等待外部传入
  }
  onMouseMove(x, y, offSetX, offsetX,) {
    // todo 等待外部传入
  }
  // 鼠标位置结束
  onMouseUp(x, y) {
    // todo 等待外部传入
  }
  onMouseLeave(x, y) {
    // todo 等待外部传入
  }
  onMouseEnter(x, y) {
    // todo 等待外部传入
  }

  // 工具函数
  getTranslatePos() {
    const style = window.getComputedStyle(this.dragEle);
    const transform = style.transform;
    if (!transform || transform === 'none') {
      return { x: 0, y: 0, z: 0 };
    }
    const matrix = new DOMMatrix(transform);
    return {
      x: matrix.m41,
      y: matrix.m42,
      z: matrix.m43
    };
  }

  getDragElePos = () => {
    const eleRect = this.dragEle.getBoundingClientRect();
    return {
      left: eleRect.left,
      top: eleRect.top,
      right: eleRect.right,
      bottom: eleRect.bottom
    }
  };

  isMouseInRange = (mousePos) => {
    const elePos = this.getDragElePos();
    const isMouseInRange = mousePos.x - elePos.left > 0 && mousePos.y - elePos.top && elePos.right - mousePos.x > 0 && elePos.bottom - mousePos.y > 0
    return isMouseInRange;
  };

  onMouseDownHandler = (posX, posY) => {
    const elePos = this.getDragElePos();
    this.isBeginMove = true;
    if (this.customCursor) {
      this.updateGlobalCursor({ isPointerDown: true })
    }
    this.dragEle.innerHTML = this.isHorizontal ? this.dragIconMap['horiActive'] : this.dragIconMap['veritActive']

    this.mouseBeginPos = {
      x: posX,
      y: posY,
    };
    this.dragEleBeginPos = {
      left: elePos.left,
      right: elePos.right,
      top: elePos.top,
      bottom: elePos.bottom
    };
    this.onMoveDown && this.onMoveDown(posX, posY);
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
  };
  setDisabledDir(dir) {
    this.disabledDir = dir;
  }

  updateGlobalCursor(isPointerDown) {
    const val = this.customCursor(isPointerDown);
    this.dragEle.style.cursor = val;
  }

  // 主要函数，鼠标移动过程中给外部函数传入 最新和上一次的偏移量
  setDragElePos = (mouseCurX, mouseCurY) => {
    const { x, y } = this.getTranslatePos();
    const offSetX = mouseCurX - this.mouseBeginPos.x;
    const offSetY = mouseCurY - this.mouseBeginPos.y;

    const eleCurX = x + offSetX;
    const eleCurY = y + offSetY;
    // 改变鼠标样式
    if (!this.customCursor) {
      if (this.disabledDir) {
        // 移除所有可能的方向类
        document.body.classList.remove("ew-resize", "ns-resize", "w-resize", "e-resize", "n-resize", "s-resize");
        if (this.isHorizontal) {
          document.body.classList.add(this.disabledDir === 'left' ? "e-resize" : "w-resize");
        } else {
          document.body.classList.add(this.disabledDir === 'top' ? "s-resize" : "n-resize");
        }
      }
    }

    if (this.customDragMove) {
      this.customDragMove(mouseCurX, mouseCurY, offSetX, offSetY)
    } else {
      this.dragEle.style.transform = `translate(${eleCurX}px, ${eleCurY}px)`;
    }
    this.mouseBeginPos.x = mouseCurX;
    this.mouseBeginPos.y = mouseCurY;
  }

  init = () => {
    this.dragEle.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      this.onMouseDownHandler(touch.clientX, touch.clientY);
    });
    this.dragEle.addEventListener('mousedown', (event) => {
      this.onMouseDownHandler(event.x, event.y);
    });

    document.addEventListener('mousemove', (event) => {
      if (!this.customCursor) {
        this.dragEle.classList.add(this.isHorizontal ? "ew-resize" : "ns-resize");
      }
      event.preventDefault();
      if (this.isBeginMove) {
        this.setDragElePos(event.x, event.y);
      }
    });
    document.addEventListener('touchmove', (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      if (this.isBeginMove) {
        this.setDragElePos(touch.clientX, touch.clientY);
      }
    }, { passive: false });

    document.addEventListener('mouseup', (event) => {
      this.isBeginMove = false;
      if (this.customCursor) {
        this.updateGlobalCursor({ isPointerDown: false });
        this.dragEle.style.cursor = 'default';

      }
      document.body.classList.remove("ew-resize", "ns-resize", "w-resize", "e-resize", "n-resize", "s-resize");
      this.onMouseUp && this.onMouseUp(event.x, event.y);
      this.dragEle.innerHTML = this.isHorizontal ? this.dragIconMap['hori'] : this.dragIconMap['verit']
    });
    this.dragEle.addEventListener('touchend', (event) => {
      this.isBeginMove = false;
      this.dragEle.innerHTML = this.isHorizontal ? this.dragIconMap['horiActive'] : this.dragIconMap['veritActive']

      const touch = event.touches[0];
      document.body.classList.remove("ew-resize", "ns-resize", "w-resize", "e-resize", "n-resize", "s-resize");
      this.onMouseUp && this.onMouseUp(touch.clientX, touch.clientY);
    });

  }
}


// 可伸缩面板，接受dom元素作为父元素，根据子元素分别生成面板和拖拽元素
// 可设置面板初始值，最大值和最小值，目前支持百分比。如果支持像素的话需要考虑超出或不足的表现
export default class PanelResize {
  static panelResizeEleHistory = new Set();
  static cache = new Map();

  constructor(parentEle, options = {}) {

    const existingInstance = PanelResize.cache.get(parentEle);
    if (existingInstance) {
      return existingInstance;
    }

    this.parentEle = parentEle;
    PanelResize.cache.set(parentEle, this);

    const { sizeData, direction = 'horizontal', customCursor, autoSaveId, panelOnResize } = options;

    this.sizeData = sizeData;
    this.direction = direction;
    this.isHorizontal = direction === 'horizontal';

    this.customCursor = customCursor;
    this.autoSaveId = autoSaveId;
    // 面板和拖拽dom元素集合
    this.panelsEle = [];
    this.handlesEle = [];
    // 根据拖拽dom元素生成的可拖拽class
    this.handlers = [];
    // 保存面板默认值和最小值
    this.resizeRangeMap = new Map();
    this.DEFAULT_PANEL_RATIO = 30;
    this.DEFAULT_PANEL_MIN_RATIO = 10;
    this.DEFAULT_PANEL_MAX_RATIO = Number.MAX_SAFE_INTEGER;
    // 用于计算面板可用宽度
    this.totalFlex = 0;
    this.remainingSpace = 0;
    this.handlesDimension = 0;
    this.remainingOffset = 0;


    // 保存当前拖拽元素，和当前左右面板
    this.curLeftPanel;
    this.curRightPanel;
    this.curTopPanel;
    this.curBottomPanel;
    this.curHandler;
    this.handlerBeginPos;

    this.startPanelsFlex = [];
    this.panelsFlex = [];

    this.panelOnResize = panelOnResize;

    // 鼠标超出限制后需要判断是否重新移动
    this.mouseInRange = true;
    this.disabledDir;
    this.init();

  }
  init() {

    this.parentEle.classList.add(this.isHorizontal ? 'horiz-wrapper' : 'verti-wrapper');

    const children = Array.from(this.parentEle.children);

    children.forEach(child => {
      if (child.className.includes('panel')) {
        this.panelsEle.push(child);
      } else if (child.className.includes('handle')) {
        child.classList.add(this.isHorizontal ? 'horiz-handle' : 'verti-handle');
        this.handlesEle.push(child);
      }
    });

    this.handlesDimension = this.handlesEle.reduce((res, ele) => {
      res += this.isHorizontal ? this.getElePos(ele).width : this.getElePos(ele).height;
      return res;
    }, 0);

    this.setPanelFlex();


    this.handlesEle.forEach(handle => {
      const handler = new DragElement(handle, { customDragMove: this.handleMove, direction: this.direction, customCursor: this.customCursor });
      handler.onMoveDown = (x, y) => {
        this.curHandler = handler;
        this.handlerBeginPos = {
          x,
          y,
        };
        this.startPanelsFlex = [...this.panelsFlex];
        this.curLeftPanel = this.getCurPanelByHandler(handler, 'left');
        this.curRightPanel = this.getCurPanelByHandler(handler, 'right');
        this.curTopPanel = this.getCurPanelByHandler(handler, 'top');
        this.curBottomPanel = this.getCurPanelByHandler(handler, 'bottom');
      }


      handler.onMouseUp = this.handleMouseUp;

      this.handlers.push(handler);
    });


    // 父元素宽度改变后，重新设置面板flex
    this.resizeObserver = new ResizeObserver(this.adjustFlexOnResize)
    this.resizeObserver.observe(this.parentEle);

  }
  handleMouseUp = () => {
    this.saveLayoutInLocal();
  }
  saveLayoutInLocal = () => {
    const flexRatio = this.panelsFlex?.filter(it => it);
    if (this.autoSaveId && flexRatio?.length) {
      const newLayout = this.panelsFlex.map((it, idx) => {
        return {
          value: it,
          type: this.normalized[idx].type
        }
      });
      localStorage.setItem(`layout-${this.autoSaveId}`, JSON.stringify(newLayout));
    }
  }

  setPanelFlex = () => {
    this.normalized = this.panelsEle.map(p => this.normalizePanel(p));
    this.fixedPanels = this.normalized.filter(p => p.type === 'fixed');
    this.flexPanels = this.normalized.filter(p => p.type === 'flex');
    this.fixedRatio = this.fixedPanels.reduce((sum, p) => sum + this.parsePixelValue(p.computedSize), 0);

    this.totalFlex = this.isHorizontal ? this.getTotalWidthFlex() : this.getTotalHeightFlex();
    this.remainingSpace = this.totalFlex - this.fixedRatio;

    const { panelsFlexRatio, panelsFixed } = this.distributeSize();
    const flexTotalRatio = panelsFlexRatio.reduce((sum, panel) => sum + parseFloat(panel), 0);

    this.flexPanels.map((ele, index) => {
      const { panel } = ele;
      this.isHorizontal ? panel.style.width = '' : panel.style.height = '';
      panel.style.flex = ''
      panel.style.flexGrow = panelsFlexRatio[index] / flexTotalRatio * this.remainingSpace;
      panel.style.flexBasis = 0;
      return ele;
    })

    this.fixedPanels.map((ele, index) => {
      const { panel } = ele;
      panel.style.flex = '';
      this.isHorizontal ? panel.style.width = panelsFixed[index] + 'px' : panel.style.height = panelsFixed[index] + 'px';;

      return ele;
    });
    this.panelsFlex = this.normalized.map(ele => {
      if (ele.type === 'fixed') {
        return this.parsePixelValue(ele.computedSize);
      } else {
        return parseFloat(ele.panel.style.flexGrow)

      }
    })


  }
  // 设置面板宽度
  adjustFlexOnResize = ([entry]) => {
    this.totalFlex = this.isHorizontal ? this.getTotalWidthFlex(entry?.target) : this.getTotalHeightFlex(entry?.target);
    const panelsFixed = this.fixedPanels.map(it => it.computedSize).reduce((res, ele) => res += ele, 0);
    const newTotalFlex = this.totalFlex - panelsFixed;
    this.normalized.forEach((ele, index) => {
      const curGrow = this.panelsFlex[index];
      const nextGrow = curGrow / this.remainingSpace * newTotalFlex;
      const { panel } = ele;
      if (ele.type === 'fixed') {
        this.isHorizontal ? panel.style.width = ele.computedSize + 'px' : panel.style.height = ele.computedSize + 'px';
        this.panelsFlex[index] = ele.computedSize;
        this.startPanelsFlex[index] = ele.computedSize;
      } else {
        panel.style.flexGrow = nextGrow;
        this.panelsFlex[index] = nextGrow;
        this.startPanelsFlex[index] = nextGrow;
      }
    });

    this.remainingSpace = newTotalFlex;

    this.saveLayoutInLocal();

  }

  getTotalWidthFlex = (ele) => {
    const parentEle = ele || this.parentEle
    const parentStyle = window.getComputedStyle(parentEle);
    const parentContentWidth = parentEle.clientWidth - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight);
    return parentContentWidth - this.handlesDimension;
  }
  getTotalHeightFlex = (ele) => {
    const parentEle = ele || this.parentEle
    const parentStyle = window.getComputedStyle(parentEle);
    const parentContentHeight = parentEle.clientHeight - parseFloat(parentStyle.paddingTop) - parseFloat(parentStyle.paddingBottom);
    return parentContentHeight - this.handlesDimension;
  }

  getElePos = (ele) => {
    const eleRect = ele.getBoundingClientRect();
    return {
      height: eleRect.height,
      width: eleRect.width,
      left: eleRect.left,
      right: eleRect.right,
      top: eleRect.top,
      bottom: eleRect.bottom,
    }
  };


  getPanelRatioRanges = (panel) => {
    const idx = this.panelsEle.indexOf(panel);
    const data = this.sizeData[idx];
    return {
      minSize: (this.parsePixelValue(data?.minSize) || this.DEFAULT_PANEL_MIN_RATIO),
      defaultSize: (this.parsePixelValue(data?.defaultSize) || this.DEFAULT_PANEL_RATIO),
      maxSize: (this.parsePixelValue(data?.maxSize) || this.DEFAULT_PANEL_MAX_RATIO)
    }
  }

  parsePixelValue(value) {
    if (typeof value === 'string' && value.endsWith('px')) {
      return parseFloat(value);
    }
    return typeof value === 'number' ? value : 0;
  }

  normalizePanel(panel) {
    const idx = this.panelsEle.indexOf(panel);
    const data = this.sizeData[idx];
    const isFixed = typeof data.defaultSize === 'string' && data.defaultSize.endsWith('px');
    return {
      panel,
      type: isFixed ? 'fixed' : 'flex',
      computedSize: isFixed ? this.parsePixelValue(data.defaultSize) : this.getPanelRatioRanges(panel),
      computedRatio: this.getPanelRatioRanges(panel)
    };
  }

  distributeSize() {

    this.fixedRatio = this.fixedPanels.reduce((sum, p) => sum + this.parsePixelValue(p.computedSize), 0);
    const remainingRatio = (this.totalFlex - this.fixedRatio) / this.totalFlex * 100;

    const panelsFixed = this.fixedPanels.map(it => it.computedSize);
    const savedLayout = localStorage.getItem(`layout-${this.autoSaveId}`);
    if (savedLayout && this.autoSaveId) {
      let savedLayoutItem;
      try {
        savedLayoutItem = JSON.parse(savedLayout);
      } catch (e) {
        console.log('json error', e);
      }

      let fixed = [];
      let flexd = [];
      savedLayoutItem.forEach((ele, idx) => {
        const type = ele.type;
        if (type === 'fixed') {
          fixed.push(ele.value)
        } else {
          flexd.push(ele.value)
        }
      });
      return { panelsFixed: fixed, panelsFlexRatio: flexd }

    }

    const totalDefault = this.flexPanels.reduce((sum, item) => sum + item.computedRatio.defaultSize, 0);
    const scale = remainingRatio / totalDefault;

    // 第一轮分配：按比例计算并四舍五入
    let result = this.flexPanels.map(item => Math.round(item.computedRatio.defaultSize * scale));
    // 计算当前总和和差值
    let currentTotal = result.reduce((sum, size) => sum + size, 0);
    let remaining = remainingRatio - currentTotal;

    // 分配剩余值（确保为整数）
    if (remaining !== 0) {
      // 按defaultSize比例分配剩余值
      const totalDefault = this.flexPanels.reduce((sum, item) => sum + item.computedRatio.defaultSize, 0);

      // 计算每个元素应分配的剩余值（带小数）
      const adjustments = this.flexPanels.map(item =>
        remaining * (item.computedRatio.defaultSize / totalDefault)
      );


      adjustments.forEach((adj, i) => {
        const integerPart = Math.trunc(adj);
        result[i] += integerPart;
        remaining -= integerPart;
      });


      // 分配剩余的小数部分（四舍五入）
      if (remaining !== 0) {
        // 找出调整量最大的几个元素分配剩余的1
        adjustments.forEach((adj, i) => {
          const decimalPart = adj - Math.trunc(adj);
          adjustments[i] = decimalPart;
        });

        // 按小数部分从大到小排序索引
        const sortedIndices = [...adjustments.keys()]
          .sort((a, b) => adjustments[b] - adjustments[a]);

        // 分配剩余的1
        for (let i = 0; i < Math.abs(remaining); i++) {
          const idx = sortedIndices[i];
          result[idx] += remaining > 0 ? 1 : -1;
        }
      }
    }

    return { panelsFixed, panelsFlexRatio: result }
  };



  getCurPanelByHandler = (handle, direction) => {
    const index = this.handlers.indexOf(handle);
    if (index === -1) return null;
    const offsetMap = {
      left: 0,
      top: 0,
      right: 1,
      bottom: 1
    };
    const panelIndex = index + offsetMap[direction];
    return this.panelsEle[panelIndex] || null;
  }
  isPanelMove(offset, panel, direction) {
    const idx = this.panelsEle.indexOf(panel);

    const isLeftOrTop = direction === 'left' || direction === 'top';
    const panels = isLeftOrTop
      ? this.normalized.slice(0, idx + 1)  // 左/上：取当前及左侧/上方面板
      : this.normalized.slice(idx);
    return panels.reduce((res, p, i) => {
      const { panel, type } = p;
      const { minSize, maxSize } = this.getPanelRatioRanges(panel);
      let minFlex, maxFlex, curFlex;
      if (type === 'fixed') {
        minFlex = this.startPanelsFlex[isLeftOrTop ? i : idx + i];
        maxFlex = this.startPanelsFlex[isLeftOrTop ? i : idx + i];
        curFlex = this.startPanelsFlex[isLeftOrTop ? i : idx + i];

      } else {
        minFlex = minSize / 100 * this.totalFlex;
        maxFlex = maxSize / 100 * this.totalFlex;
        curFlex = this.startPanelsFlex[isLeftOrTop ? i : idx + i];
      }

      // 左/上：offset > 0 → 检查 maxFlex - curFlex；否则 curFlex - minFlex
      // 右/下：offset > 0 → 检查 curFlex - minFlex；否则 maxFlex - curFlex
      const delta = isLeftOrTop
        ? offset > 0 ? maxFlex - curFlex : curFlex - minFlex
        : offset > 0 ? curFlex - minFlex : maxFlex - curFlex;

      res += delta;
      return res;
    }, 0);

  }
  // 左边面板是否还能伸缩
  isLeftMove(offSetX) {
    return this.isPanelMove(offSetX, this.curLeftPanel, 'left');
  }

  isTopMove(offSetY) {
    return this.isPanelMove(offSetY, this.curTopPanel, 'top');
  }

  // 右边面板是否还能伸缩
  isRightMove(offSetX) {
    return this.isPanelMove(offSetX, this.curRightPanel, 'right');
  }
  isBottomMove(offSetY) {
    return this.isPanelMove(offSetY, this.curBottomPanel, 'bottom');
  }

  getPanelAllRatioFlex(pIndex) {
    const newPanel = [...this.panelsEle];
    const panel = newPanel[pIndex];
    const { minSize, maxSize } = this.getPanelRatioRanges(panel);
    let minFlex, maxFlex, curFlex;
    if (panel.type === 'fixed') {
      minFlex = this.startPanelsFlex[pIndex];
      maxFlex = this.startPanelsFlex[pIndex];
      curFlex = this.startPanelsFlex[pIndex]
    } else {
      minFlex = (minSize / 100 * this.totalFlex);
      maxFlex = maxSize / 100 * this.totalFlex;
      curFlex = this.startPanelsFlex[pIndex];
    }

    return { minFlex, maxFlex, curFlex }
  };

  movePanel(offset, direction) {
    const panelMap = {
      left: this.curLeftPanel,
      right: this.curRightPanel,
      top: this.curTopPanel,
      bottom: this.curBottomPanel,
    }
    const idx = this.panelsEle.indexOf(panelMap[direction]);
    const panelsLen = this.panelsEle.length;
    let remainingOffset = offset;
    const isLeftOrTop = direction === 'left' || direction === 'top';
    const isRightOrBottom = direction === 'right' || direction === 'bottom';
    if (isLeftOrTop) {
      for (let i = idx; i >= 0 && remainingOffset !== 0; i--) {
        const panel = this.panelsEle[i];
        const normalizedPanel = this.normalizePanel(panel);
        const { curFlex, minFlex, maxFlex } = this.getPanelAllRatioFlex(i);
        let adjustAmount;
        if (remainingOffset > 0) {
          adjustAmount = Math.min(remainingOffset, maxFlex - curFlex);
        } else {
          adjustAmount = Math.max(remainingOffset, minFlex - curFlex);
        }
        if (normalizedPanel.type === 'fixed') {
          this.isHorizontal ? panel.style.width = curFlex + adjustAmount : panel.style.height = curFlex + adjustAmount;
        } else {
          panel.style.flexGrow = curFlex + adjustAmount;
        }
        remainingOffset -= adjustAmount;

      }
    } else if (isRightOrBottom) {
      for (let i = idx; i <= panelsLen - 1 && remainingOffset !== 0; i++) {
        const panel = this.panelsEle[i];
        const { curFlex, minFlex, maxFlex } = this.getPanelAllRatioFlex(i);
        let adjustAmount;
        if (remainingOffset > 0) {
          adjustAmount = Math.min(remainingOffset, curFlex - minFlex);
        } else {
          adjustAmount = -Math.min(-remainingOffset, maxFlex - curFlex);
        }
        if (panel.type === 'fixed') {
          this.isHorizontal ? panel.style.width = curFlex - adjustAmount : panel.style.height = curFlex - adjustAmount;
        } else {
          panel.style.flexGrow = curFlex - adjustAmount;
        }

        remainingOffset -= adjustAmount;

      }
    }

  }
  // 单独移动左边
  moveLeftPanel(offSetX) {
    this.movePanel(offSetX, 'left')
  }
  // 单独移动右边
  moveRightPanel(offSetX) {
    this.movePanel(offSetX, 'right');
  }
  moveTopPanel(offSetY) {
    this.movePanel(offSetY, 'top')
  }
  moveBottomPanel(offSetY) {
    this.movePanel(offSetY, 'bottom')
  }
  // 主要函数，在拖拽元素拖拽时触发
  handleMove = (x, y) => {
    const offSetX = x - this.handlerBeginPos.x;
    const offSetY = y - this.handlerBeginPos.y;
    const offset = this.isHorizontal ? offSetX : offSetY;
    const directions = this.isHorizontal
      ? { pos: 'left', neg: 'right', movePos: (v) => this.moveLeftPanel(v), moveNeg: (v) => this.moveRightPanel(v) }
      : { pos: 'top', neg: 'bottom', movePos: (v) => this.moveTopPanel(v), moveNeg: (v) => this.moveBottomPanel(v) };
    const posMoveNumber = this.isHorizontal ? this.isLeftMove(offset) : this.isTopMove(offset);
    const negMoveNumber = this.isHorizontal ? this.isRightMove(offset) : this.isBottomMove(offset);
    if (posMoveNumber <= Math.abs(offset) || negMoveNumber <= Math.abs(offset)) {
      this.disabledDir = posMoveNumber <= Math.abs(offset) ? directions.pos : directions.neg;
      this.curHandler.setDisabledDir(this.disabledDir);
      return;
    }

    const minMoveNumber = offset > 0
      ? Math.min(offset, posMoveNumber, negMoveNumber)
      : Math.max(offset, -posMoveNumber, -negMoveNumber);
    directions.movePos(minMoveNumber);
    directions.moveNeg(minMoveNumber);

    this.panelsFlex = this.normalized.map(ele => {
      const { panel, type } = ele;
      return type === 'fixed' ? parseFloat(this.getElePos(panel).width) : parseFloat(panel.style.flexGrow);
    });
  }


  setLayout(layouts) {
    Array.isArray(layouts) ? this.sizeData = layouts : undefined;
    this.setPanelFlex();

  }

}
