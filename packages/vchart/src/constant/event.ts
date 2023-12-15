export { HOOK_EVENT as VGRAMMAR_HOOK_EVENT } from '@visactor/vgrammar-core';

export const BASE_EVENTS = [
  'pointerdown',
  'pointerup',
  'pointerupoutside',
  'pointertap', // pointerEvent 下的 click 事件
  'pointerover',
  'pointermove',
  'pointerenter',
  'pointerleave',
  'pointerout',
  'mousedown',
  'mouseup',
  'mouseupoutside',
  'rightdown',
  'rightup',
  'rightupoutside',
  'click',
  'dblclick',
  'mousemove',
  'mouseover',
  'mouseout',
  'mouseenter',
  'mouseleave',
  'wheel',
  'touchstart',
  'touchend',
  'touchendoutside',
  'touchmove',
  'touchcancel',
  'tap',
  'dragstart',
  'drag',
  'dragenter',
  'dragleave',
  'dragover',
  'dragend',
  'drop',
  // 手势事件
  'pan',
  'panstart',
  'panend',
  'press',
  'pressup',
  'pressend',
  'pinch',
  'pinchstart',
  'pinchend',
  'swipe'
];

export enum ChartEvent {
  initialized = 'initialized', // 图表实例初始化完成
  rendered = 'rendered', // 图表渲染方法被调用时触发，表明图表已经执行过渲染逻辑，只会触发一次
  renderFinished = 'renderFinished', // 每次画布渲染完成触发的事件，不包含动画结束
  animationFinished = 'animationFinished', // 图表动画结束时触发的事件
  // region
  regionSeriesDataFilterOver = 'regionSeriesDataFilterOver',
  // series start
  // series.liftCircle
  afterInitData = 'afterInitData',
  afterInitEvent = 'afterInitEvent',
  afterInitMark = 'afterInitMark',
  // series.data
  rawDataUpdate = 'rawDataUpdate',
  viewDataFilterOver = 'viewDataFilterOver',
  viewDataUpdate = 'viewDataUpdate',
  viewDataStatisticsUpdate = 'viewDataStatisticsUpdate',
  // dot series
  markDeltaYUpdate = 'markDeltaYUpdate',
  // pie series
  viewDataLabelUpdate = 'viewDataLabelUpdate',
  /** series end */
  // scale
  scaleDomainUpdate = 'scaleDomainUpdate',
  scaleUpdate = 'scaleUpdate',
  // datazoom
  dataZoomChange = 'dataZoomChange',
  // Hierarchy
  drill = 'drill',
  layoutStart = 'layoutStart',
  layoutEnd = 'layoutEnd',
  layoutRectUpdate = 'layoutRectUpdate',

  // player
  playerPlay = 'playerPlay',
  playerPause = 'playerPause',
  playerEnd = 'playerEnd',
  playerChange = 'playerChange',
  playerForward = 'playerForward',
  playerBackward = 'playerBackward',
  // scrollBar
  scrollBarChange = 'scrollBarChange',
  // brush
  brushStart = 'brushStart',
  brushChange = 'brushChange',
  brushEnd = 'brushEnd',
  brushClear = 'brushClear',
  // legend
  legendSelectedDataChange = 'legendSelectedDataChange',
  legendFilter = 'legendFilter',
  legendItemClick = 'legendItemClick',
  legendItemHover = 'legendItemHover',
  legendItemUnHover = 'legendItemUnHover',
  // tooltip
  tooltipShow = 'tooltipShow',
  tooltipHide = 'tooltipHide',
  tooltipRelease = 'tooltipRelease',
  // resize
  afterResize = 'afterResize',
  afterRender = 'afterRender',
  // layout
  afterLayout = 'afterLayout'
}

export enum Event_Source_Type {
  chart = 'chart',
  window = 'window',
  canvas = 'canvas'
}

export enum Event_Bubble_Level {
  vchart = 'vchart',
  chart = 'chart',
  model = 'model',
  mark = 'mark'
}
