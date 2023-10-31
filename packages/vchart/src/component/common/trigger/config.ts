import type { RenderMode } from '../../../typings/spec';
// eslint-disable-next-line no-duplicate-imports
import { RenderModeEnum } from '../../../typings/spec';
import { isMiniAppLikeMode, isMobileLikeMode } from '../../../util';
import { DeskTopTrigger } from './desktop';
import { MobileTrigger } from './mobile';

export function getDefaultTriggerEventByMode(mode: RenderMode) {
  if (mode === RenderModeEnum['desktop-browser'] || mode === RenderModeEnum['desktop-miniApp']) {
    return {
      start: 'pointerdown',
      move: 'pointermove',
      end: 'pointerup',
      zoom: 'wheel',
      zoomEnd: 'pointerup',
      scroll: 'wheel',
      // scrollEnd: 'pointerup',
      trigger: DeskTopTrigger
    };
  }

  if (isMobileLikeMode(mode) || isMiniAppLikeMode(mode)) {
    return {
      start: 'pointerdown',
      move: 'pointermove',
      end: 'pointerup',
      zoom: 'pinch',
      zoomEnd: 'pinchend',
      scroll: 'pan',
      scrollEnd: 'panend',
      trigger: MobileTrigger
    };
  }

  return null;
}
