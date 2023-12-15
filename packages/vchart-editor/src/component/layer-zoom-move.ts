import { debounce, type EventEmitter } from '@visactor/vutils';
import type { ILayer } from '@visactor/vrender-core';
import { DragComponent } from './transform-drag';
import type { IPoint } from '../typings/space';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 3;

export class LayerZoomMove {
  private _layer: ILayer;
  private _dragger: DragComponent;
  private _container: HTMLElement;

  private _wheelState: 'none' | 'pre' | 'wheel' = 'none';
  get wheelState() {
    return this._wheelState;
  }

  private _dragState: 'none' | 'pre' | 'drag' | 'mouseDrag' = 'none';
  get dragState() {
    return this._dragState;
  }

  private _isAltDown: boolean = false;
  private _isCtrlDown: boolean = false;

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
      const zoom = Math.pow(1.005, -e.deltaY * Math.pow(16, e.deltaMode));
      // const zoom = Math.pow(1.0005, -e.deltaY * Math.pow(16, e.deltaMode));
      const center = { x: e.offsetX, y: e.offsetY };
      // this._layer.scale(zoom, zoom, center);
      this.zoom(zoom, center);
      if (this._wheelState === 'none' || this._wheelState === 'pre') {
        this.emitter.emit('onLayerWheelStart', { zoom, center, globalZoom: this._layer.globalTransMatrix.a });
      } else {
        this.emitter.emit('onLayerWheel', { zoom, center, globalZoom: this._layer.globalTransMatrix.a });
      }
      this._wheelState = 'wheel';
    } else {
      // drag
      this._layer.translate(-e.deltaX, -e.deltaY);
      if (this._dragState === 'none' || this._dragState === 'pre') {
        this.emitter.emit('onLayerDragStart');
      } else {
        this.emitter.emit('onLayerDrag');
      }
      this._dragState = 'drag';
    }
    this._checkWheelOver();
  };

  private _checkWheelOver = debounce(() => {
    this._callDragOver();
    this._callWheelOver();
  }, 400);

  private _onTouchDown = (event: PointerEvent) => {
    if (this._isAltDown) {
      this._dragState = 'mouseDrag';
      this._dragger.startDrag(event);
      this.emitter.emit('onLayerDragStart');
    }
  };

  private _onTouchUp = (event: PointerEvent) => {
    this._callDragOver();
  };

  private _checkDrag = (event: KeyboardEvent) => {
    if (this._isAltDown !== event.altKey) {
      this._isAltDown = event.altKey;
      if (this._isAltDown) {
        this._dragState = 'pre';
        this.emitter.emit('perLayerDrag');
      } else {
        if (this._dragState !== 'mouseDrag') {
          this._callDragOver();
        }
      }
    }
    if (this._isCtrlDown !== event.ctrlKey) {
      this._isCtrlDown = event.ctrlKey;
      if (this._isCtrlDown) {
        this._wheelState = 'pre';
        this.emitter.emit('perLayerWheel');
      } else {
        this._callWheelOver();
      }
    }
  };

  protected _dragElement = (moveX: number, moveY: number) => {
    this.emitter.emit('onLayerDrag');
    this._layer.translate(moveX, moveY);
  };
  private _dragEnd = () => {
    //do nothing
  };
  private _unDragEnd = () => {
    //do nothing
  };

  private _callDragOver() {
    if (this._isAltDown) {
      this._dragState = 'pre';
    } else if (this._dragState !== 'none') {
      this._dragState = 'none';
      this.emitter.emit('onLayerDragOver');
    }
  }

  private _callWheelOver() {
    if (this._isCtrlDown) {
      this._wheelState = 'pre';
    } else if (this._wheelState !== 'none') {
      this._wheelState = 'none';
      this.emitter.emit('onLayerWheelOver');
    }
  }

  release() {
    this._releaseEvent();
    this._dragger.release();
  }

  zoomTo(_zoom: number, center?: IPoint) {
    const zoom = _zoom / this._layer.globalTransMatrix.a;
    this._layer.scale(
      zoom,
      zoom,
      center ?? { x: this._container.clientWidth * 0.5, y: this._container.clientHeight * 0.5 }
    );
  }

  zoom(zoom: number, center?: IPoint) {
    if (
      (this._layer.globalTransMatrix.a <= MIN_ZOOM && zoom < 1) ||
      (this._layer.globalTransMatrix.a >= MAX_ZOOM && zoom > 1)
    ) {
      return;
    }
    const finalZoom = zoom * this._layer.globalTransMatrix.a;
    if (finalZoom <= MIN_ZOOM) {
      zoom = MIN_ZOOM / this._layer.globalTransMatrix.a;
    }
    if (finalZoom >= MAX_ZOOM && zoom > 1) {
      zoom = MAX_ZOOM / this._layer.globalTransMatrix.a;
    }
    this._layer.scale(
      zoom,
      zoom,
      center ?? { x: this._container.clientWidth * 0.5, y: this._container.clientHeight * 0.5 }
    );
  }

  moveTo(startPos: IPoint) {
    this._layer.translate(startPos.x - this._layer.globalTransMatrix.e, startPos.y - this._layer.globalTransMatrix.f);
  }
}
