import { RenderModeEnum } from '../typings/spec/common';

export const defaultInteractionConfig = {
  [RenderModeEnum['desktop-miniApp']]: {
    hover: {
      enable: true,
      trigger: 'pointermove',
      triggerOff: ['pointermove', 'pointerleave']
    },
    select: {
      enable: true,
      trigger: 'pointertap'
    }
  },
  [RenderModeEnum['desktop-browser']]: {
    hover: {
      enable: true,
      trigger: 'pointermove',
      triggerOff: ['pointermove', 'pointerleave']
    },
    select: {
      enable: true,
      trigger: 'pointertap'
    }
  },
  [RenderModeEnum['mobile-browser']]: {
    hover: {
      enable: true,
      trigger: ['pointerdown', 'pointermove'],
      triggerOff: ['pointermove', 'pointerleave']
    },
    select: {
      enable: true,
      trigger: 'tap'
    }
  },
  [RenderModeEnum.miniApp]: {
    hover: {
      enable: true,
      trigger: ['pointerdown', 'pointermove'],
      triggerOff: ['pointermove', 'pointerleave']
    },
    select: {
      enable: true,
      trigger: 'tap'
    }
  },
  [RenderModeEnum.lynx]: {
    hover: {
      enable: true,
      trigger: ['pointerdown', 'pointermove'],
      triggerOff: ['pointermove', 'pointerleave']
    },
    select: {
      enable: true,
      trigger: 'tap'
    }
  }
};
