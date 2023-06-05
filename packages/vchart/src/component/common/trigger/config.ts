import { RenderModeEnum } from '../../../typings/spec';
import { DeskTopTrigger } from './desktop';
import { MobileTrigger } from './mobile';

export const defaultTriggerEvent = {
  [RenderModeEnum['desktop-browser']]: {
    start: 'pointerdown',
    move: 'pointermove',
    end: 'pointerup',
    zoom: 'wheel',
    zoomEnd: 'pointerup',
    scroll: 'wheel',
    scrollEnd: 'pointerup',
    trigger: DeskTopTrigger
  },
  [RenderModeEnum['desktop-miniApp']]: {
    start: 'pointerdown',
    move: 'pointermove',
    end: 'pointerup',
    zoom: 'wheel',
    zoomEnd: 'pointerup',
    scroll: 'wheel',
    scrollEnd: 'pointerup',
    trigger: DeskTopTrigger
  },
  [RenderModeEnum['mobile-browser']]: {
    start: 'pointerdown',
    move: 'pointermove',
    end: 'pointerup',
    zoom: 'pinch',
    zoomEnd: 'pinchend',
    scroll: 'pan',
    scrollEnd: 'panend',
    trigger: MobileTrigger
  },
  [RenderModeEnum.miniApp]: {
    start: 'pointerdown',
    move: 'pointermove',
    end: 'pointerup',
    zoom: 'pinch',
    zoomEnd: 'pinchend',
    scroll: 'pan',
    scrollEnd: 'panend',
    trigger: MobileTrigger
  },
  [RenderModeEnum.lynx]: {
    start: 'pointerdown',
    move: 'pointermove',
    end: 'pointerup',
    zoom: 'pinch',
    zoomEnd: 'pinchend',
    scroll: 'pan',
    scrollEnd: 'panend',
    trigger: MobileTrigger
  }
};
