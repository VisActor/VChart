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

export const IsWheelEvent: { [key in keyof HTMLElementEventMap]?: true } = {
  // mousedown: true,
  wheel: true
};

export const MinSize = 20;

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
export const MAX_HISTORY_COUNT = 100;

/**
 * EditorChart const
 */
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

export const ComponentBoundsNormal: { [key: string]: boolean } = {
  title: true,
  legends: true,
  player: true,
  discreteLegend: true
};

// 键盘事件
export const isDarwin = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
export const KEYS = {
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
  BACKSPACE: 'Backspace',
  ALT: 'Alt',
  CTRL_OR_CMD: isDarwin ? 'metaKey' : 'ctrlKey',
  DELETE: 'Delete',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  QUESTION_MARK: '?',
  SPACE: ' ',
  TAB: 'Tab',
  CHEVRON_LEFT: '<',
  CHEVRON_RIGHT: '>',
  PERIOD: '.',
  COMMA: ',',
  SUBTRACT: '-',

  A: 'a',
  C: 'c',
  D: 'd',
  E: 'e',
  F: 'f',
  G: 'g',
  H: 'h',
  I: 'i',
  L: 'l',
  O: 'o',
  P: 'p',
  Q: 'q',
  R: 'r',
  S: 's',
  T: 't',
  V: 'v',
  X: 'x',
  Y: 'y',
  Z: 'z',
  K: 'k',
  W: 'w',

  0: '0',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9'
} as const;
