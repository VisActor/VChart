import type { IZoomTrigger } from './interface';
export class MobileTrigger implements IZoomTrigger {
  private _lastScale = 0;
  pointerId: number;

  clearZoom(): void {
    this._lastScale = 0;
    this.pointerId = null;
  }

  parserDragEvent(event: any): boolean {
    if (this.pointerId) {
      return this.pointerId === event.pointerId;
    }
    this.pointerId = event.pointerId;
    return true;
  }

  parserZoomEvent(event: any) {
    const scale = event.scale;
    if (this._lastScale === 0) {
      this._lastScale = scale;
      return event;
    }
    event.zoomDelta = scale / this._lastScale;

    const center = event.center;
    event.zoomX = center.x;
    event.zoomY = center.y;
    this._lastScale = scale;

    return event;
  }

  parserScrollEvent(event: any) {
    // todo
    return event;
  }

  clearScroll(): void {
    // do nothing
  }

  clearDrag(): void {
    // do nothing
  }
}
