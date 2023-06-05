export { HOOK_EVENT as VGRAMMAR_HOOK_EVENT } from '@visactor/vgrammar';

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
  initialized = 'initialized',
  rendered = 'rendered',
  // region
  regionSeriesDataFilterOver = 'regionSeriesDataFilterOver',
  // series start
  // series.liftCircle
  afterInitData = 'afterInitData',
  afterInitEvent = 'afterInitEvent',
  afterInitMark = 'afterInitMark',
  // series.data
  rawDataUpdate = 'rawDataUpdate',
  rawDataStatisticsUpdate = 'rawDataStatisticsUpdate',
  viewDataFilterOver = 'viewDataFilterOver',
  viewDataUpdate = 'viewDataUpdate',
  viewDataStatisticsUpdate = 'viewDataStatisticsUpdate',
  // dot series
  markDeltaYUpdate = 'markDeltaYUpdate',
  // pie series
  viewDataLabelUpdate = 'viewDataLabelUpdate',
  /** series end */
  // scale
  scaleUpdate = 'scaleUpdate',
  // datazoom
  dataZoomChange = 'dataZoomChange',
  // Hierarchy
  drill = 'drill',
  layoutStart = 'layoutStart',
  layoutEnd = 'layoutEnd',

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
  brushChange = 'brushChange',
  // legend
  legendSelectedDataChange = 'legendSelectedDataChange',
  legendFilter = 'legendFilter',
  legendItemClick = 'legendItemClick',
  legendItemHover = 'legendItemHover',
  legendItemUnHover = 'legendItemUnHover'
}

export enum Event_Source_Type {
  chart = 'chart',
  window = 'window'
}

export enum Event_Bubble_Level {
  vchart = 'vchart',
  chart = 'chart',
  model = 'model',
  mark = 'mark'
}
