import type { EventEmitter } from '@visactor/vutils';
import type { ILayer } from '@visactor/vrender-core';
import { DragComponent } from './transform-drag';
export class LayerZoomMove {
  private _layer: ILayer;
  private _dragger: DragComponent;
  private _container: HTMLElement;

  private _state: 'none' | 'drag' | 'zoom' = 'none';
  get state() {
    return this._state;
  }
  private _isAltDown: boolean = false;

  private emitter: EventEmitter;

  constructor(layer: ILayer, emitter: EventEmitter, container: HTMLElement) {
    this._layer = layer;
    this.emitter = emitter;
    this._container = container;
    this._dragger = new DragComponent(container);
    this._dragger.dragHandler(this._dragElement);
    this._dragger.dragEndHandler(this._dragEnd);
    this._dragger.unDragEndHandler(this._unDragEnd);
    this._initEvent();
  }

  private _initEvent() {
    this._container.addEventListener('wheel', this._onWheel);

    document.addEventListener('keydown', this._checkDrag);
    document.addEventListener('keyup', this._checkDrag);

    this._container.addEventListener('pointerdown', this._onTouchDown, true);
    this._container.addEventListener('pointerup', this._onTouchUp, true);
  }

  private _releaseEvent() {
    this._container.removeEventListener('wheel', this._onWheel);

    document.removeEventListener('keydown', this._checkDrag);
    document.removeEventListener('keyup', this._checkDrag);

    this._container.removeEventListener('pointerdown', this._onTouchDown);
    this._container.removeEventListener('pointerup', this._onTouchUp);
  }

  private _onWheel = (e: any) => {
    e.stopImmediatePropagation();
    e.preventDefault();
    if (e.ctrlKey) {
      // zoom
      const zoom = Math.pow(1.0005, -e.deltaY * Math.pow(16, e.deltaMode));
      const center = { x: e.offsetX, y: e.offsetY };
      this._layer.scale(zoom, zoom, center);
      this.emitter.emit('onLayerWheel', { zoom, center });
    } else {
      // drag
      this._layer.translate(-e.deltaX, -e.deltaY);
      this.emitter.emit('onLayerDrag');
    }
  };

  private _onTouchDown = (event: PointerEvent) => {
    if (this._isAltDown) {
      this._state = 'drag';
      this._dragger.startDrag(event);
      this.emitter.emit('onLayerDragStart');
    }
  };

  private _onTouchUp = (event: PointerEvent) => {
    if (!this._isAltDown) {
      this._dragOver();
      this.emitter.emit('onLayerDragOver');
    }
  };

  private _checkDrag = (event: KeyboardEvent) => {
    this._isAltDown = event.altKey;
    if (!this._isAltDown && (this._dragger.state === 'none' || this._dragger.state === 'stopDrag')) {
      this._dragOver();
    }
    if (this._isAltDown) {
      this._state = 'drag';
    }
  };

  private _dragOver() {
    this._state = 'none';
  }

  protected _dragElement = (moveX: number, moveY: number) => {
    this._layer.translate(moveX, moveY);
  };
  private _dragEnd = () => {
    //do nothing
  };
  private _unDragEnd = () => {
    //do nothing
  };

  release() {
    this._releaseEvent();
    this._dragger.release();
  }
}
