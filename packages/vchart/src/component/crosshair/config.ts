import { RenderModeEnum } from '../../typings/spec/common';

export const defaultCrosshairTriggerEvent = {
  [RenderModeEnum['desktop-browser']]: {
    click: 'pointertap',
    hover: 'pointermove',
    hoverOut: 'pointerleave',
    clickOut: 'pointerleave'
  },
  [RenderModeEnum['desktop-miniApp']]: {
    click: 'pointertap',
    hover: 'pointermove',
    hoverOut: 'pointerleave',
    clickOut: 'pointerleave'
  },
  [RenderModeEnum['mobile-browser']]: {
    click: 'tap',
    hover: ['pointerdown', 'pointermove'],
    hoverOut: 'pointerleave',
    clickOut: 'pointerleave'
  },
  [RenderModeEnum.miniApp]: {
    click: 'tap',
    hover: ['pointerdown', 'pointermove'],
    hoverOut: 'pointerleave',
    clickOut: 'pointerleave'
  },
  [RenderModeEnum.lynx]: {
    click: 'tap',
    hover: ['pointerdown', 'pointermove'],
    hoverOut: 'pointerleave',
    clickOut: 'pointerleave'
  }
};
