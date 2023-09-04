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

  'click',
  'dblclick'
];

export const TriggerEvent: { [key in keyof HTMLElementEventMap]?: true } = {
  // mousedown: true,
  pointerdown: true
};
