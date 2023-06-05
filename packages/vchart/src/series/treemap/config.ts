import { DeskTopTrigger } from '../../component/common/trigger/desktop';
import { MobileTrigger } from '../../component/common/trigger/mobile';
import { RenderModeEnum } from '../../typings/spec/common';

export const TreemapRoamTriggerEvent = {
  [RenderModeEnum['desktop-browser']]: {
    start: 'pointerdown',
    move: 'pointermove',
    end: 'pointerup',
    zoom: 'wheel',
    zoomEnd: 'pointerup',
    trigger: DeskTopTrigger
  },
  [RenderModeEnum['desktop-miniApp']]: {
    start: 'pointerdown',
    move: 'pointermove',
    end: 'pointerup',
    zoom: 'wheel',
    zoomEnd: 'pointerup',
    trigger: DeskTopTrigger
  },
  [RenderModeEnum['mobile-browser']]: {
    start: 'pointerdown',
    move: 'pointermove',
    end: 'pointerup',
    zoom: 'pinch',
    zoomEnd: 'pinchend',
    trigger: MobileTrigger
  },
  [RenderModeEnum.miniApp]: {
    start: 'pointerdown',
    move: 'pointermove',
    end: 'pointerup',
    zoom: 'pinch',
    zoomEnd: 'pinchend',
    trigger: MobileTrigger
  },
  [RenderModeEnum.lynx]: {
    start: 'pointerdown',
    move: 'pointermove',
    end: 'pointerup',
    zoom: 'pinch',
    zoomEnd: 'pinchend',
    trigger: MobileTrigger
  }
};
