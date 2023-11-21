import type { RenderMode } from '../typings/spec/common';
import { RenderModeEnum } from '../typings/spec/common';
import { isMiniAppLikeMode, isMobileLikeMode } from '../util';

export function getDefaultInteractionConfigByMode(mode: RenderMode) {
  if (mode === RenderModeEnum['desktop-browser'] || mode === RenderModeEnum['desktop-miniApp']) {
    return {
      hover: {
        enable: true,
        trigger: 'pointermove',
        triggerOff: 'pointerleave'
      },
      select: {
        enable: true,
        trigger: 'pointertap'
      }
    };
  }

  if (isMobileLikeMode(mode) || isMiniAppLikeMode(mode)) {
    return {
      hover: {
        enable: true,
        trigger: ['pointerdown', 'pointermove'],
        triggerOff: 'pointerleave'
      },
      select: {
        enable: true,
        trigger: 'tap'
      }
    };
  }

  return null;
}
