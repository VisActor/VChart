import type { IPoint } from '../typings/space';

export class DragComponent {
  protected _state: 'startDrag' | 'dragging' | 'stopDrag' | 'none' = 'none';
  get state() {
    return this._state;
  }

  private _lastPosX: number;
  private _lastPosY: number;
  protected _container: HTMLElement;

  constructor(container: HTMLElement) {
    this._container = container;
    window.addEventListener('pointermove', this.pointerMove);
    window.addEventListener('pointerup', this.stopDrag);
  }

  protected _dragHandler: (moveX: number, moveY: number) => void;
  protected _dragEndHandler: () => void;

  pointerMove = (event: PointerEvent) => {
    if (!(this._state === 'startDrag' || this._state === 'dragging')) {
      return;
    }
    if (this._state !== 'dragging') {
      this._state = 'dragging';
    }
    this._dragHandler?.(event.clientX - this._lastPosX, event.clientY - this._lastPosY);
    this._lastPosX = event.clientX;
    this._lastPosY = event.clientY;
  };

  dragHandler(handler: (moveX: number, moveY: number) => void) {
    this._dragHandler = handler;
  }
  dragEndHandler(handler: () => void) {
    this._dragEndHandler = handler;
  }

  startDrag(event: PointerEvent) {
    this._state = 'startDrag';
    this._lastPosX = event.clientX;
    this._lastPosY = event.clientY;
  }

  stopDrag = (event: PointerEvent) => {
    if (event.target !== this._container) {
      return;
    }
    this._state = 'stopDrag';
    this._dragEndHandler?.();
  };

  release() {
    window.removeEventListener('pointermove', this.pointerMove);
    window.removeEventListener('pointerup', this.stopDrag);
  }
}
