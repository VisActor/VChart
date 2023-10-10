import type { IZoomTrigger } from './interface';
export declare class DeskTopTrigger implements IZoomTrigger {
  pointerId: number;
  parserScrollEvent(e: any): any;
  parserZoomEvent(e: any): any;
  clearZoom(): void;
  clearScroll(): void;
  parserDragEvent(): boolean;
}
