export interface IZoomTrigger {
  pointerId: number;
  parserZoomEvent: (e: any) => any;
  parserDragEvent: (event: any) => boolean;
  parserScrollEvent: (event: any) => any;
  clearZoom: () => void;
  clearScroll: () => void;
}
