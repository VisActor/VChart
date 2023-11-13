import type { RenderMode } from '../../typings/spec';
import { RenderModeEnum } from '../../typings/spec';
import { isMiniAppLikeMode, isMobileLikeMode } from '../../util';

export function getDefaultCrosshairTriggerEventByMode(mode: RenderMode) {
  if (mode === RenderModeEnum['desktop-browser'] || mode === RenderModeEnum['desktop-miniApp']) {
    return {
      click: 'pointertap',
      hover: 'pointermove',
      hoverOut: 'pointerleave',
      clickOut: 'pointerleave'
    };
  }

  if (isMobileLikeMode(mode) || isMiniAppLikeMode(mode)) {
    return {
      click: 'tap',
      hover: ['pointerdown', 'pointermove'],
      hoverOut: 'pointerleave',
      clickOut: 'pointerleave'
    };
  }

  return null;
}
