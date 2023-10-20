import type { IGroup, IStage, ILine, IRect, IGraphic } from '@visactor/vrender-core';
import { IContainPointMode, createLine, createRect } from '@visactor/vrender-core';
import type { ILayoutAttribute } from './../typings/space';
import type { IEditorElement, ILayoutLine } from './../core/interface';
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

  private _snapTargetLineX: ILayoutLine[] = [];
  private _snapTargetLineY: ILayoutLine[] = [];

  // graphic
  private _snapLineX: ILine;
  private _snapLineY: ILine;
  private _snapTargetBoxX: IRect;
  private _snapTargetBoxY: IRect;

  private _snapTempX: number = Infinity;
  protected _snapMatchResultX: { source: ILayoutLine; target: ILayoutLine; dis: number } = null;
  private _snapTempY: number = Infinity;
  protected _snapMatchResultY: { source: ILayoutLine; target: ILayoutLine; dis: number } = null;

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

    this.addDrag(opt.container, opt.event);
    this.addEditorBox();
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
  }

  addDrag(container: HTMLElement, event: PointerEvent) {
    this._dragger = new DragComponent(container);
    this._dragger.dragHandler(this._dragElement);
    this._dragger.dragEndHandler(this._editorEnd);
    if (this._el.editProperties.move) {
      this._dragger.startDrag(event);
    }
  }

  private _getEditorBoxLayoutLine(moveX: number, moveY: number) {
    const result: { x: ILayoutLine[]; y: ILayoutLine[] } = {
      x: [],
      y: []
    };
    if (!this._editorBox?.rect) {
      return result;
    }
    const bounds = this._editorBox.rect.AABBBounds.clone().translate(moveX, moveY);
    const commonInX: Omit<ILayoutLine, 'value'> = {
      orient: 'x',
      start: bounds.y1,
      end: bounds.y2,
      rect: { x: bounds.x1, y: bounds.y1, width: bounds.x2 - bounds.x1, height: bounds.y2 - bounds.y1 }
    };
    // left
    result.x.push({
      value: bounds.x1,
      ...commonInX
    });
    // right
    result.x.push({
      value: bounds.x2,
      ...commonInX
    });
    // middle
    result.x.push({
      value: (bounds.x1 + bounds.x2) / 2,
      ...commonInX
    });

    const commonInY: Omit<ILayoutLine, 'value'> = {
      orient: 'y',
      start: bounds.x1,
      end: bounds.x2,
      rect: { x: bounds.x1, y: bounds.y1, width: bounds.x2 - bounds.x1, height: bounds.y2 - bounds.y1 }
    };
    // top
    result.y.push({
      value: bounds.y1,
      ...commonInY
    });
    // bottom
    result.y.push({
      value: bounds.y2,
      ...commonInY
    });
    // middle
    result.y.push({
      value: (bounds.y1 + bounds.y2) / 2,
      ...commonInY
    });
    return result;
  }

  protected _dragElement = (moveX: number, moveY: number) => {
    if (this._snapTargetLineX.length || this._snapTargetLineY.length) {
      // 吸附
      // 移动后的 box line
      const tempX = Number.isFinite(this._snapTempX) ? this._snapTempX : 0;
      const tempY = Number.isFinite(this._snapTempY) ? this._snapTempY : 0;
      const lineAfterMove = this._getEditorBoxLayoutLine(moveX + tempX, moveY + tempY);
      moveX = this._snapCheck(moveX, 'x', lineAfterMove.x, this._snapTargetLineX);
      moveY = this._snapCheck(moveY, 'y', lineAfterMove.y, this._snapTargetLineY);
    }
    this._editorBox.moveBy(moveX, moveY);
  };

  private _matchLine(source: ILayoutLine[], target: ILayoutLine[], minDistance: number) {
    const result: { source: ILayoutLine; target: ILayoutLine; dis: number } = {
      source: null,
      target: null,
      dis: minDistance + 1
    };
    let tempDistance = result.dis;
    source.forEach(s => {
      target.forEach(t => {
        const dis = Math.abs(t.value - s.value);
        if (dis < minDistance && dis < tempDistance) {
          tempDistance = dis;
          result.source = s;
          result.target = t;
          result.dis = t.value - s.value;
        }
      });
    });
    return result;
  }

  private _snapCheck(move: number, key: 'x' | 'y', source: ILayoutLine[], target: ILayoutLine[]) {
    const snapTempKey = `_snapTemp${key.toUpperCase()}`;
    const snapLineKey = `_snapLine${key.toUpperCase()}`;
    const snapTargetBoxKey = `_snapTargetBox${key.toUpperCase()}`;
    const revertKey = key === 'x' ? 'y' : 'x';
    const lastMatchResultKey = `_snapMatchResult${key.toUpperCase()}`;
    const lastMatchResult = this[lastMatchResultKey];
    const temp = Number.isFinite(this[snapTempKey]) ? this[snapTempKey] : 0;
    // match line
    const match = this._matchLine(source, target, 5);
    if (match.target) {
      let matchNewTarget = false;
      if (this[snapTempKey] === Infinity) {
        this[snapTempKey] = -match.dis;
        this[lastMatchResultKey] = match;
      } else {
        if (lastMatchResult && lastMatchResult !== match.target) {
          this[lastMatchResultKey] = match;
          matchNewTarget = true;
        }
        this[snapTempKey] += move;
      }
      move = move + match.dis + temp;
      if (matchNewTarget) {
        this[snapTempKey] -= move;
      }
      this[snapLineKey].setAttributes({
        points: [
          {
            [key]: match.target.value,
            [revertKey]: Math.min(match.source.start, match.source.end, match.target.start, match.target.end)
          },
          {
            [key]: match.target.value,
            [revertKey]: Math.max(match.source.start, match.source.end, match.target.start, match.target.end)
          }
        ],
        visible: true
      });
      this[snapTargetBoxKey].setAttributes({
        ...match.target.rect,
        visible: true
      });
    } else {
      move += temp;
      this[snapTempKey] = Infinity;
      this[snapLineKey].setAttributes({
        visible: false
      });
      this[snapTargetBoxKey].setAttributes({
        visible: false
      });
    }
    return move;
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
  }

  release() {
    this._opt.editorGroup.removeChild(this._snapLineX);
    this._opt.editorGroup.removeChild(this._snapLineY);
    this._opt.editorGroup.removeChild(this._snapTargetBoxX);
    this._opt.editorGroup.removeChild(this._snapTargetBoxY);

    this._editorBox.release();
    this._dragger.release();
    this._dragger.release();
    this._opt.stage.removeEventListener('pointerdown', this._dragStartCheck);
    this._endHandler = this._startHandler = this._updateHandler = this._el = this._editorBox = this._dragger = null;
  }
}
