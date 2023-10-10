import { DeskTopTrigger } from './desktop';
import { MobileTrigger } from './mobile';
export declare const defaultTriggerEvent: {
  'desktop-browser': {
    start: string;
    move: string;
    end: string;
    zoom: string;
    zoomEnd: string;
    scroll: string;
    trigger: typeof DeskTopTrigger;
  };
  'desktop-miniApp': {
    start: string;
    move: string;
    end: string;
    zoom: string;
    zoomEnd: string;
    scroll: string;
    trigger: typeof DeskTopTrigger;
  };
  'mobile-browser': {
    start: string;
    move: string;
    end: string;
    zoom: string;
    zoomEnd: string;
    scroll: string;
    scrollEnd: string;
    trigger: typeof MobileTrigger;
  };
  miniApp: {
    start: string;
    move: string;
    end: string;
    zoom: string;
    zoomEnd: string;
    scroll: string;
    scrollEnd: string;
    trigger: typeof MobileTrigger;
  };
  lynx: {
    start: string;
    move: string;
    end: string;
    zoom: string;
    zoomEnd: string;
    scroll: string;
    scrollEnd: string;
    trigger: typeof MobileTrigger;
  };
};
