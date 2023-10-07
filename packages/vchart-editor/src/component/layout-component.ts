import { IContainPointMode, type IStage } from '@visactor/vrender-core';
import type { ILayoutAttribute } from './../typings/space';
import type { IEditorElement } from './../core/interface';
import { TransformComponent2 } from './transform-component2';
import type { IBoundsLike } from '@visactor/vutils';
import { DragComponent } from './transform-drag';
export class LayoutEditorComponent {
  protected _startHandler: () => void;
  protected _updateHandler: (data: ILayoutAttribute) => Partial<ILayoutAttribute> | false;
  protected _endHandler: (data: ILayoutAttribute) => void;

  protected _el: IEditorElement;
  protected _editorBox: TransformComponent2;
  get editorBox() {
    return this._editorBox;
  }

  protected _dragger: DragComponent;

  get isEditor() {
    return this._editorBox.isEditor;
  }

  private _opt;

  constructor(
    el: IEditorElement,
    opt: {
      container: HTMLElement;
      startHandler: () => void;
      updateHandler: (data: ILayoutAttribute) => Partial<ILayoutAttribute> | false;
      endHandler: (data: ILayoutAttribute) => void;
      event: PointerEvent;
      stage: IStage;
    }
  ) {
    this._el = el;
    this._opt = opt;
    this._startHandler = opt.startHandler;
    this._updateHandler = opt.updateHandler;
    this._endHandler = opt.endHandler;

    this.addDrag(opt.container, opt.event);
    this.addEditorBox();
    this.initEvent();
    this._startHandler();
  }

  initEvent() {
    this._opt.stage.addEventListener('pointerdown', this._dragStartCheck);
  }

  updateBounds(bounds: IBoundsLike) {
    this.editorBox.updateSubBounds(bounds);
  }

  _dragStartCheck = e => {
    if (this.editorBox.containsPoint(e.x, e.y, IContainPointMode.GLOBAL)) {
      // editor box
      if (e.target?.parent === this._editorBox) {
        return;
      }
      if (this._el.editProperties.move) {
        this._dragger.startDrag(e);
      }
    }
  };

  addEditorBox() {
    // const group = this._el.layer.editorGroup;
    // if (!group) {
    //   this.release();
    //   return;
    // }
    const bounds: IBoundsLike = {
      x1: this._el.rect.x,
      y1: this._el.rect.y,
      x2: this._el.rect.x + this._el.rect.width,
      y2: this._el.rect.y + this._el.rect.height
    };
    this._editorBox = new TransformComponent2(
      {
        childrenPickable: true,
        pickable: false,
        move: this._el.editProperties.move,
        rotate: this._el.editProperties.rotate,
        resize: this._el.editProperties.resize
      },
      bounds
    );

    this._editorBox.onEditorStart(() => {
      this._startHandler();
    });
    this._editorBox.onUnTransStart(e => {
      if (this._el.editProperties.move) {
        return this._dragger.startDrag(e);
      }
    });
    this._editorBox.onUpdate(data => {
      return this._updateHandler(data);
    });
    this._editorBox.onEditorEnd(this._editorEnd);
    // group.add(this._editorBox as any);
  }

  addDrag(container: HTMLElement, event: PointerEvent) {
    this._dragger = new DragComponent(container);
    this._dragger.dragHandler(this._dragElement);
    this._dragger.dragEndHandler(this._editorEnd);
    if (this._el.editProperties.move) {
      this._dragger.startDrag(event);
    }
  }

  protected _dragElement = (moveX: number, moveY: number) => {
    this._editorBox.moveBy(moveX, moveY);
  };

  protected _editorEnd = () => {
    this._endHandler(this._editorBox.getTransformAttribute());
    this._editorBox.isEditor = false;
  };

  release() {
    this._editorBox.release();
    this._dragger.release();
    this._dragger.release();
    this._opt.stage.removeEventListener('pointerdown', this._dragStartCheck);
    this._endHandler = this._startHandler = this._updateHandler = this._el = this._editorBox = this._dragger = null;
  }
}
