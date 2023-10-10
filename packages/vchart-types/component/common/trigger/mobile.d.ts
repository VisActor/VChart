import type { IZoomTrigger } from './interface';
export declare class MobileTrigger implements IZoomTrigger {
  private _lastScale;
  pointerId: number;
  clearZoom(): void;
  parserDragEvent(event: any): boolean;
  parserZoomEvent(event: any): any;
  parserScrollEvent(event: any): any;
  clearScroll(): void;
}
