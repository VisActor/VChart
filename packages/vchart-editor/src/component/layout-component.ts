import type { IGroup, IStage, ILine, IRect, IGraphic } from '@visactor/vrender-core';
import { IContainPointMode, createLine, createRect } from '@visactor/vrender-core';
import type { ILayoutAttribute } from './../typings/space';
import type { IEditorElement, ILayoutLine } from './../core/interface';
import type { IUpdateParams } from './transform-component2';
import { TransformComponent2 } from './transform-component2';
import type { IBoundsLike } from '@visactor/vutils';
import { DragComponent } from './transform-drag';
import { getLayoutLine } from '../utils/space';
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

  private _tempRect: Partial<IUpdateParams>;
  private _lastCurrentRect: Partial<IUpdateParams>;

  private _snapTargetLineX: ILayoutLine[] = [];
  private _snapTargetLineY: ILayoutLine[] = [];

  // graphic
  private _snapLineX: ILine;
  private _snapLineY: ILine;
  private _snapTargetBoxX: IRect;
  private _snapTargetBoxY: IRect;

  // private _tempBox: IRect;
  // private _currentBox: IRect;

  constructor(
    el: IEditorElement,
    opt: {
      container: HTMLElement;
      startHandler: () => void;
      updateHandler: (data: ILayoutAttribute) => Partial<ILayoutAttribute> | false;
      endHandler: (data: ILayoutAttribute) => void;
      event: PointerEvent;
      stage: IStage;
      layoutLines: ILayoutLine[];
      editorGroup: IGroup;
    }
  ) {
    this._el = el;
    this._opt = opt;
    this._startHandler = opt.startHandler;
    this._updateHandler = opt.updateHandler;
    this._endHandler = opt.endHandler;

    this.addEditorBox();
    this.addDrag(opt.container, opt.event);
    this.initEvent();
    this._startHandler();
    // 吸附线
    this._initMatchLine();
    if (opt.layoutLines?.length) {
      this._snapTargetLineX = opt.layoutLines.filter(l => l.orient === 'x');
      this._snapTargetLineY = opt.layoutLines.filter(l => l.orient === 'y');
    }
    this._opt.editorGroup.add(this._editorBox as unknown as IGraphic);
    this._editorBox.initEvent();
  }

  initEvent() {
    this._opt.stage.addEventListener('pointerdown', this._dragStartCheck);
  }

  updateBounds(bounds: IBoundsLike) {
    this.editorBox.updateSubBounds(bounds);
  }

  _dragStartCheck = (e: PointerEvent) => {
    if (!this.editorBox) {
      return;
    }
    if (this.editorBox.containsPoint(e.x, e.y, IContainPointMode.GLOBAL)) {
      // editor box
      if ((<any>e.target)?.parent === this._editorBox) {
        return;
      }
      if (this._el.editProperties.move) {
        this._reSetSnap();
        this._dragger.startDrag(e);
      }
    }
  };

  private _reSetSnap() {
    const rectAttribute = this._editorBox.rect.attribute;
    this._tempRect = {
      x: rectAttribute.x,
      y: rectAttribute.y,
      width: rectAttribute.width,
      height: rectAttribute.height
    };
    this._lastCurrentRect = { ...this._tempRect };
  }

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
      this._reSetSnap();
      this._startHandler();
    });
    this._editorBox.onUnTransStart(e => {
      if (this._el.editProperties.move) {
        this._reSetSnap();
        return this._dragger.startDrag(e);
      }
    });
    this._editorBox.onUpdate(data => {
      const result = this._checkSnap(data);
      if (result) {
        this._lastCurrentRect = { ...result };
      }
      const handlerResult = this._updateHandler(data);
      if (handlerResult) {
        this._lastCurrentRect = { ...handlerResult };
      }
      if (!result && !handlerResult) {
        return false;
      }
      return this._lastCurrentRect;
    });
    this._editorBox.onEditorEnd(this._editorEnd);
  }

  private _checkSnap(data: IUpdateParams) {
    const diff = {
      x: data.x - this._lastCurrentRect.x,
      y: data.y - this._lastCurrentRect.y,
      width: data.width - this._lastCurrentRect.width,
      height: data.height - this._lastCurrentRect.height
    };
    if (diff.x === 0 && diff.y === 0 && diff.width === 0 && diff.height === 0) {
      return false;
    }
    // new temp
    this._tempRect.x += diff.x;
    this._tempRect.y += diff.y;
    this._tempRect.width += diff.width;
    this._tempRect.height += diff.height;
    // snap temp
    this._snap('x', 'width', this._snapTargetLineX, diff as any, data);
    this._snap('y', 'height', this._snapTargetLineY, diff as any, data);
    return data;
  }

  private _snap(
    orient: 'x' | 'y',
    orientSize: 'width' | 'height',
    target: ILayoutLine[],
    diff: IUpdateParams,
    source: IUpdateParams
  ) {
    if (diff[orient] === 0 && diff[orientSize] === 0) {
      return false;
    }
    const revertOrient = orient === 'x' ? 'y' : 'x';
    const snapLineKey = `_snapLine${orient.toUpperCase()}`;
    const snapTargetBoxKey = `_snapTargetBox${orient.toUpperCase()}`;
    // snap temp
    const currentLine = getLayoutLine(this._tempRect as any, {}, orient);
    // match line
    const match = this._matchLine(currentLine, target, 5);
    // resize current to temp
    source[orient] = this._tempRect[orient];
    source[orientSize] = this._tempRect[orientSize];
    // if no math
    if (!match.start.target && !match.middle.target && !match.end.target) {
      this[snapLineKey].setAttributes({
        visible: false
      });
      this[snapTargetBoxKey].setAttributes({
        visible: false
      });
      return source;
    }
    let targetLine: { target: ILayoutLine; source: ILayoutLine; dis: number };
    // temp => snap transform  => current
    // update type
    if (diff[orient] !== 0 && diff[orientSize] !== 0) {
      // resize with start
      if (match.start.target) {
        // start match
        source[orient] += match.start.dis;
        source[orientSize] -= match.start.dis;
        targetLine = match.start;
      } else if (match.middle.target) {
        // middle match
        source[orient] += match.middle.dis * 2;
        source[orientSize] -= match.middle.dis * 2;
        targetLine = match.middle;
      }
      // ignore end match
    } else if (diff[orient] === 0) {
      // resize with end
      if (match.end.target) {
        // end match
        source[orient] += match.end.dis;
        source[orientSize] -= match.end.dis;
        targetLine = match.end;
      } else if (match.middle.target) {
        // middle match
        source[orient] += match.middle.dis * 2;
        source[orientSize] += match.middle.dis * 2;
        targetLine = match.middle;
      }
    } else if (diff[orientSize] === 0) {
      // move
      const dis = Math.min(match.start.dis, match.middle.dis, match.end.dis);
      source[orient] += dis;
      if (dis === match.start.dis) {
        targetLine = match.start;
      } else if (dis === match.middle.dis) {
        targetLine = match.middle;
      } else {
        targetLine = match.end;
      }
    }

    this[snapLineKey].setAttributes({
      points: [
        {
          [orient]: targetLine.target.value,
          [revertOrient]: Math.min(
            targetLine.source.start,
            targetLine.source.end,
            targetLine.target.start,
            targetLine.target.end
          )
        },
        {
          [orient]: targetLine.target.value,
          [revertOrient]: Math.max(
            targetLine.source.start,
            targetLine.source.end,
            targetLine.target.start,
            targetLine.target.end
          )
        }
      ],
      visible: true
    });
    this[snapTargetBoxKey].setAttributes({
      ...targetLine.target.rect,
      visible: true
    });
    return source;
  }

  addDrag(container: HTMLElement, event: PointerEvent) {
    this._dragger = new DragComponent(container);
    this._dragger.dragHandler(this._dragElement);
    this._dragger.dragEndHandler(this._editorEnd);
    if (this._el.editProperties.move) {
      this._reSetSnap();
      this._dragger.startDrag(event);
    }
  }

  protected _dragElement = (moveX: number, moveY: number) => {
    this._editorBox.moveBy(moveX, moveY);
  };

  private _matchLine(source: ILayoutLine[], target: ILayoutLine[], minDistance: number) {
    const result: { [key in ILayoutLine['type']]: { source: ILayoutLine; target: ILayoutLine; dis: number } } = {
      start: {
        source: null,
        target: null,
        dis: minDistance + 1
      },
      middle: {
        source: null,
        target: null,
        dis: minDistance + 1
      },
      end: {
        source: null,
        target: null,
        dis: minDistance + 1
      }
    };
    source.forEach(s => {
      target.forEach(t => {
        if ((s.type === 'middle' && t.type === 'middle') || (s.type !== 'middle' && t.type !== 'middle')) {
          const dis = Math.abs(t.value - s.value);
          if (dis < minDistance && dis < result[s.type].dis) {
            result[s.type].source = s;
            result[s.type].target = t;
            result[s.type].dis = t.value - s.value;
          }
        }
      });
    });
    return result;
  }

  protected _editorEnd = () => {
    this._endHandler(this._editorBox.getTransformAttribute());
    this._editorBox.isEditor = false;
    this._snapLineX.setAttributes({ visible: false });
    this._snapLineY.setAttributes({ visible: false });

    this._snapTargetBoxX.setAttributes({ visible: false });
    this._snapTargetBoxY.setAttributes({ visible: false });
  };

  _initMatchLine() {
    const commonAttribute = {
      stroke: 'blue',
      pickable: false,
      lineWidth: 2,
      strokeOpacity: 0.4,
      visible: false
    };
    this._snapLineX = createLine({
      ...commonAttribute
    });
    this._opt.editorGroup.add(this._snapLineX);
    this._snapTargetBoxX = createRect({
      ...commonAttribute
    });
    this._opt.editorGroup.add(this._snapTargetBoxX);

    this._snapLineY = createLine({
      ...commonAttribute
    });
    this._opt.editorGroup.add(this._snapLineY);
    this._snapTargetBoxY = createRect({
      ...commonAttribute
    });
    this._opt.editorGroup.add(this._snapTargetBoxY);

    // this._tempBox = createRect({
    //   ...commonAttribute
    // });
    // this._opt.editorGroup.add(this._tempBox);

    // this._currentBox = createRect({
    //   ...commonAttribute,
    //   stroke: 'red'
    // });
    // this._opt.editorGroup.add(this._currentBox);
  }

  release() {
    this._opt.editorGroup.removeChild(this._snapLineX);
    this._opt.editorGroup.removeChild(this._snapLineY);
    this._opt.editorGroup.removeChild(this._snapTargetBoxX);
    this._opt.editorGroup.removeChild(this._snapTargetBoxY);
    // this._opt.editorGroup.removeChild(this._tempBox);
    // this._opt.editorGroup.removeChild(this._currentBox);

    this._editorBox.release();
    this._dragger.release();
    this._dragger.release();
    this._opt.stage.removeEventListener('pointerdown', this._dragStartCheck);
    this._endHandler = this._startHandler = this._updateHandler = this._el = this._editorBox = this._dragger = null;
  }
}
