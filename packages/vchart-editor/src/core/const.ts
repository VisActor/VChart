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

export const MinSize = 5;
