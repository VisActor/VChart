export const MouseEvents: (keyof HTMLElementEventMap)[] = [
  // 'mousedown',
  // 'mouseenter',
  // 'mouseleave',
  // 'mousemove',
  // 'mouseout',
  // 'mouseover',
  // 'mouseup',

  'pointercancel',
  'pointerdown',
  'pointerenter',
  'pointerleave',
  'pointermove',
  'pointerout',
  'pointerover',
  'pointerup',

  // 'touchcancel',
  // 'touchend',
  // 'touchmove',
  // 'touchstart',

  'click',
  'dblclick',

  'wheel',
  'scroll'
];

export const TriggerEvent: { [key in keyof HTMLElementEventMap]?: true } = {
  // mousedown: true,
  pointerdown: true
};

export const IgnoreEvent: { [key in keyof HTMLElementEventMap]?: true } = {
  // mousedown: true,
  click: true,
  dblclick: true
};

export const MinSize = 5;

export const DeleteElementKeyCode = {
  Delete: true
};

export const OverGraphicAttribute = {
  fill: false,
  // stroke: 'blue',
  stroke: '#4284FF',
  lineWidth: 2,
  // shadowBlur: 4,
  // shadowColor: 'blue',
  pickable: false
};

export const BoxSelectionMaskName = '_editor_box_selection_mask';
export const TransformComponentName = 'TransformComponent2';

export const ChartComponentKeys = [
  'axes',
  'title',
  'legends',
  'crosshair',
  'tooltip',
  'player',
  'dataZoom',
  'scrollBar'
];

export const MAX_HISTORY_COUNT = 100;
