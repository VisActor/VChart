import { EditorActionMode } from '../core/enum';
import type { VChartEditor } from '../core/vchart-editor';

export class DragComponent {
  protected _state: 'startDrag' | 'dragging' | 'stopDrag' | 'none' = 'none';
  get state() {
    return this._state;
  }

  private _lastPosX: number;
  private _lastPosY: number;
  protected _container: HTMLElement;
  protected _editor: VChartEditor;

  constructor(container: HTMLElement, editor: VChartEditor) {
    this._container = container;
    this._editor = editor;
    window.addEventListener('pointermove', this.pointerMove, true);
    window.addEventListener('pointerup', this.stopDrag, true);
  }

  protected _dragHandler: (moveX: number, moveY: number) => void;
  protected _dragEndHandler: () => void;
  protected _unDragEndHandler: () => void;

  private _checkEditorStateEnable() {
    return this._editor.state.actionMode !== EditorActionMode.addTool;
  }

  pointerMove = (event: PointerEvent) => {
    if (!this._checkEditorStateEnable()) {
      return;
    }
    if (event.target !== this._container) {
      return;
    }
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
  unDragEndHandler(handler: () => void) {
    this._unDragEndHandler = handler;
  }

  startDrag(event: PointerEvent) {
    this._state = 'startDrag';
    this._lastPosX = event.clientX;
    this._lastPosY = event.clientY;
  }

  stopDrag = (event: PointerEvent) => {
    if (!this._checkEditorStateEnable()) {
      return;
    }
    if (event.target !== this._container) {
      return;
    }
    if (this._state !== 'dragging' && this._state !== 'startDrag') {
      this._unDragEndHandler?.();
      return;
    }
    // const lastState = this._state;
    this._state = 'stopDrag';
    // if (lastState !== 'dragging') {
    //   return;
    // }
    this._state = 'stopDrag';
    this._dragEndHandler?.();
  };

  release() {
    window.removeEventListener('pointermove', this.pointerMove, true);
    window.removeEventListener('pointerup', this.stopDrag, true);
    this._dragHandler = null;
    this._dragEndHandler = null;
  }
}
