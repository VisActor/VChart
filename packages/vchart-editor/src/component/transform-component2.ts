import { isArray } from '@visactor/vutils';
/**
 * @description PopTip组件
 */
import {
  type IGraphic,
  type IGroupGraphicAttribute,
  type IRect,
  type IRectGraphicAttribute,
  type ILineGraphicAttribute,
  createRect
} from '@visactor/vrender-core';
import type { IAABBBounds, IAABBBoundsLike } from '@visactor/vutils';
import { AABBBounds, merge, normalizePadding, pi } from '@visactor/vutils';
import { AbstractComponent } from '@visactor/vrender-components';
import { transformPointWithMatrix } from '../utils/space';
import type { VChartEditor } from '../core/vchart-editor';
import { EditorActionMode } from '../core/enum';

type ResizeType = [boolean, ...boolean[]] & { length: 8 };

type TransformAttributes = {
  padding: number | [number, number, number, number];
  bbox: Partial<IRectGraphicAttribute>;
  cornerRect: Partial<IRectGraphicAttribute>;
  handlerLine: Partial<ILineGraphicAttribute> & { size: number };
  move?: boolean;
  rotate?: boolean;
  resize?: boolean | ResizeType;
  setCursor?: (c: string) => void;
} & IGroupGraphicAttribute;

export type IUpdateParams = {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  anchor: [number | string, number | string];
};

export class TransformComponent2 extends AbstractComponent<Required<TransformAttributes>> {
  name = 'TransformComponent2';
  rectB: IAABBBounds;
  isDragging: boolean = false;
  dragOffsetX: number;
  dragOffsetY: number;
  activeGraphic: IGraphic | null;
  horizontalResizble: number;
  verticalResizble: number;
  rotatable: number;
  rect: IRect;
  editBorder: IRect;
  // 是否正在执行addChildUpdateBoundTag，避免循环调用
  runningAddChildUpdateBoundTag: boolean;

  updateCbs: Array<(data: IUpdateParams) => Partial<IUpdateParams> | false>;
  editEndCbs: Array<() => void>;
  editStartCbs: Array<() => void>;
  unTransStartCbs: Array<(event: PointerEvent) => void>;

  isEditor: boolean = false;

  _editorConfig: {
    move: boolean;
    rotate: boolean;
    resize: ResizeType;
  };

  _setCursor: (c: string) => void = null;

  static defaultAttributes: Partial<TransformAttributes> = {
    padding: 2,
    bbox: {
      stroke: '#4284FF',
      lineWidth: 1
    },
    cornerRect: {
      fill: 'white',
      stroke: '#4284FF',
      lineWidth: 1,
      width: 10,
      height: 10
    },
    handlerLine: {
      stroke: '#4284FF',
      lineWidth: 1,
      size: 30
    }
  };

  private _editor: VChartEditor;
  setEditor(editor: VChartEditor) {
    this._editor = editor;
  }

  constructor(attributes: Partial<TransformAttributes>, bounds: IAABBBoundsLike) {
    super(
      merge(
        {
          shadowRootIdx: 1
        },
        TransformComponent2.defaultAttributes,
        attributes
      )
    );
    this._editorConfig = {
      move: attributes.move !== false,
      rotate: attributes.rotate !== false,
      resize: (isArray(attributes.resize)
        ? attributes.resize
        : new Array(8).fill(attributes.resize !== false)) as ResizeType
    };
    this.rectB = new AABBBounds();
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.activeGraphic = null;
    this.horizontalResizble = 0;
    this.verticalResizble = 0;
    this.rotatable = 0;
    this.runningAddChildUpdateBoundTag = false;
    this.rect = createRect({
      fill: false,
      stroke: false,
      pickable: false
    });
    // this.rect.attachShadow();
    this.editBorder = createRect({
      fill: false,
      stroke: false
    });
    this.editBorder.attachShadow();
    this.add(this.rect);
    this.add(this.editBorder);
    this.updateSubBounds(bounds);
    this.editStartCbs = [];
    this.unTransStartCbs = [];
    this.updateCbs = [];
    this.editEndCbs = [];
  }

  updateSubBounds(bounds: IAABBBoundsLike) {
    this.rect.setAttributes({
      x: bounds.x1,
      y: bounds.y1,
      width: bounds.x2 - bounds.x1,
      height: bounds.y2 - bounds.y1
    });
  }

  initEvent() {
    // curser
    this.editBorder.addEventListener('mousemove', this.handleMouseMove);
    this.addEventListener('pointerout', this.handleMouseOut);

    // drag
    this.addEventListener('pointerdown', this.handleDragMouseDown);
    // this.addEventListener('drag', this.onDrag);

    this.stage.addEventListener('pointermove', this.handleDragMouseMove);
    this.stage.addEventListener('pointerup', this.handleDragMouseUp);
  }

  private _checkEditorStateEnable() {
    return this._editor.state.actionMode !== EditorActionMode.addTool;
  }

  protected handleMouseMove = (e: any) => {
    if (!this._checkEditorStateEnable()) {
      return;
    }
    if (e.pickParams) {
      const { shadowTarget } = e.pickParams;
      this.setCursor(shadowTarget.attribute.cursor);
    } else {
      this.setCursor();
    }
  };

  protected handleMouseOut = (e: any) => {
    if (!this._checkEditorStateEnable()) {
      return;
    }
    this.setCursor();
  };

  protected handleDragMouseDown = (e: any) => {
    if (!this._checkEditorStateEnable()) {
      return;
    }
    this.isEditor = true;
    this.editStartCbs.forEach(cb => cb());
    const layerPos = transformPointWithMatrix(this.layer.globalTransMatrix.getInverse(), e.offset);
    this.dragOffsetX = layerPos.x;
    this.dragOffsetY = layerPos.y;

    // 开启move
    if (e.pickParams && this.stage) {
      const { shadowTarget } = e.pickParams || {};
      this.setActiveGraphic(shadowTarget);
      this.isDragging = true;
    } else {
      this.unTransStartCbs.forEach(cb => cb(e));
    }
  };

  protected handleDragMouseMove = (e: any) => {
    if (!this._checkEditorStateEnable()) {
      return;
    }
    if (!this.isDragging) {
      return;
    }
    const layerPos = transformPointWithMatrix(this.layer.globalTransMatrix.getInverse(), e.offset);

    const dx = layerPos.x - this.dragOffsetX;
    const dy = layerPos.y - this.dragOffsetY;

    if (dx === 0 && dy === 0) {
      return;
    }

    if (this.rotatable) {
      this.handleRotate(dx, dy);
      this.dispatchUpdate();
    } else {
      this.handleScale(dx, dy);
      this.dispatchUpdate();
    }

    this.dragOffsetX = layerPos.x;
    this.dragOffsetY = layerPos.y;
  };

  protected handleDragMouseUp = (e: any) => {
    if (!this._checkEditorStateEnable()) {
      return;
    }
    if (!this.isDragging) {
      return;
    }
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.setActiveGraphic(null);
    this.editEndCbs?.forEach(cb => cb());
    this.isEditor = false;
    this.isDragging = false;
  };

  protected setCursor(c?: string) {
    if (this.stage) {
      this.stage.setCursor(c);
      this._setCursor?.(c);
    }
  }

  protected setActiveGraphic(g: IGraphic | null) {
    this.activeGraphic = g;

    // 设置resize的方向
    let reset = true;
    if (g && g.name) {
      reset = false;
      const name = g.name;
      const dirList = name.split('-');
      const type = dirList.shift();
      if (type === 'scale') {
        if (dirList.length === 2) {
          this.horizontalResizble = dirList[0] === 'left' ? -1 : 1;
          this.verticalResizble = dirList[1] === 'top' ? -1 : 1;
        } else {
          const dir = dirList[0];
          const h = dir === 'left' || dir === 'right';
          this.horizontalResizble = h ? (dirList[0] === 'left' ? -1 : 1) : 0;
          this.verticalResizble = h ? 0 : dirList[0] === 'top' ? -1 : 1;
        }
        this.rotatable = 0;
      } else if (type === 'rotate') {
        this.rotatable = 1;
        this.horizontalResizble = 0;
        this.verticalResizble = 0;
      } else {
        reset = true;
      }
    }
    if (reset) {
      this.horizontalResizble = 0;
      this.verticalResizble = 0;
      this.rotatable = 0;
    }
  }

  protected handleScale(dx: number, dy: number) {
    // dx = 10;
    // dy = -10;
    // 投影得到旋转前的dx和dy
    const angle = this.getAngle();
    const _dx = dx;
    const _dy = dy;
    dx = Math.cos(angle) * _dx + Math.sin(angle) * _dy;
    dy = Math.cos(angle + pi / 2) * _dx + Math.sin(angle + pi / 2) * _dy;

    dx *= this.horizontalResizble;
    dy *= this.verticalResizble;

    // console.log(dx, dy);

    const { x, y, width, height } = this.rect.attribute;

    const m = this.transMatrix;
    // 原始的x和y位置
    const nextP1 = {
      x: m.a * x + m.c * y + m.e,
      y: m.b * x + m.d * y + m.f
    };
    const nextP2 = {
      x: m.a * (x + width) + m.c * (y + height) + m.e,
      y: m.b * (x + width) + m.d * (y + height) + m.f
    };
    if (this.horizontalResizble < 0) {
      nextP1.x -= Math.cos(angle) * dx;
      nextP1.y -= Math.sin(angle) * dx;
    } else if (this.horizontalResizble > 0) {
      nextP2.x += Math.cos(angle) * dx;
      nextP2.y += Math.sin(angle) * dx;
    }

    if (this.verticalResizble < 0) {
      nextP1.x -= Math.cos(angle + pi / 2) * dy;
      nextP1.y -= Math.sin(angle + pi / 2) * dy;
    } else if (this.verticalResizble > 0) {
      nextP2.x += Math.cos(angle + pi / 2) * dy;
      nextP2.y += Math.sin(angle + pi / 2) * dy;
    }
    // if (this.verticalResizble < 0) {
    //   nextP1.x -= Math.cos(angle) * dy;
    //   nextP1.y -= Math.sin(angle) * dy;
    // }
    // if (this.horizontalResizble < 0) {
    //   nextP1.x -= dx;
    //   nextP1.y += dy;
    // }
    // if (this.horizontalResizble > 0) {
    //   nextP1.x -= dx;
    // } else if (this.horizontalResizble < 0) {
    //   nextP2.x -= dx;
    // }

    // if (this.verticalResizble > 0) {
    //   nextP1.y += dy;
    // } else if (this.verticalResizble < 0) {
    //   nextP2.y -= dy;
    // }

    const center = {
      x: (nextP1.x + nextP2.x) / 2,
      y: (nextP1.y + nextP2.y) / 2
    };

    const tw = width + dx;
    const th = height + dy;

    // this.rect.setAttributes({
    //   width: tw,
    //   height: th,
    //   x: x + (this.horizontalResizble > 0 ? 0 : -1) * dx,
    //   y: y + (this.verticalResizble > 0 ? 0 : -1) * dy
    // });
    this.rect.setAttributes({
      width: tw,
      height: th,
      x: center.x - tw / 2,
      y: center.y - th / 2
    });
    this.setAttributes({
      anchor: [center.x, center.y]
    });
  }

  protected handleRotate(dx: number, dy: number) {
    const dir1 = [0, -1];
    const m = this.transMatrix;
    dir1[0] = -m.c;
    dir1[1] = -m.d;
    let len = Math.sqrt(dir1[0] * dir1[0] + dir1[1] * dir1[1]);
    dir1[0] /= len;
    dir1[1] /= len;
    const dir1v = [-dir1[1], dir1[0]];

    const dir2 = [dx, dy];
    len = Math.sqrt(dx * dx + dy * dy);
    dir2[0] /= len;
    dir2[1] /= len;
    // 点积算delta
    const deltaAngle = dir1v[0] * dir2[0] + dir1v[1] * dir2[1];

    const a = deltaAngle * 0.03;
    const originB = this.rectB;
    const cx = (originB.x1 + originB.x2) / 2;
    const cy = (originB.y1 + originB.y2) / 2;

    const { angle = 0 } = this.attribute;
    this.setAttributes({
      angle: angle + a,
      anchor: [cx, cy]
    });
  }

  getAngle(): number {
    if (!this.attribute.postMatrix) {
      return this.attribute.angle ?? 0;
    }
    const m = this.transMatrix;
    return Math.atan2(m.b, m.a);
  }

  static cornerRect: Array<[number, number, string]> = [
    [0, 0, 'left-top'],
    [0.5, 0, 'top'],
    [1, 0, 'right-top'],
    [0, 0.5, 'left'],
    [1, 0.5, 'right'],
    [0, 1, 'left-bottom'],
    [0.5, 1, 'bottom'],
    [1, 1, 'right-bottom']
  ];
  static cursor: string[] = [
    'nw-resize',
    'n-resize',
    'ne-resize',
    'w-resize',
    'e-resize',
    'sw-resize',
    's-resize',
    'se-resize'
  ];

  protected render() {
    const { bbox, padding, cornerRect, handlerLine } = this.attribute as TransformAttributes;

    const root = this.editBorder.shadowRoot;
    if (!root || this.count === 1) {
      return;
    }

    const parsedPadding = normalizePadding(padding as any);
    const { x = 0, y = 0, width: w = 0, height: h = 0 } = this.rect.attribute;
    this.rectB.setValue(x, y, x + w, y + h);

    const minX = x - parsedPadding[3];
    const minY = y - parsedPadding[0];
    const width = w + parsedPadding[1] + parsedPadding[3];
    const height = h + parsedPadding[0] + parsedPadding[2];

    root.createOrUpdateChild(
      'stroke-rect',
      {
        x: minX,
        y: minY,
        width,
        height,
        ...bbox
      },
      'rect'
    );

    if (this._editorConfig.rotate) {
      // 添加顶部
      root.createOrUpdateChild(
        'top-handler-line',
        {
          x: minX + width / 2,
          y: minY,
          points: [
            { x: 0, y: 0 },
            { x: 0, y: -handlerLine.size }
          ],
          ...handlerLine
        },
        'line'
      );

      root.createOrUpdateChild(
        `rotate-all`,
        {
          x: minX + width / 2 - cornerRect.width! / 2,
          y: minY - handlerLine.size - cornerRect.height! / 2,
          cursor: 'crosshair',
          ...cornerRect
        },
        'rect'
      );
    }

    // 添加8个角
    TransformComponent2.cornerRect.forEach((item, i) => {
      if (this._editorConfig.resize[i]) {
        root.createOrUpdateChild(
          `scale-${item[2]}`,
          {
            x: minX + item[0] * width - cornerRect.width! / 2,
            y: minY + item[1] * height - cornerRect.height! / 2,
            cursor: TransformComponent2.cursor[i] as any,
            ...cornerRect
          },
          'rect'
        );
      }
    });
  }

  moveBy(dx: number, dy: number): this {
    const { x, y, width, height } = this.rect.attribute;
    this.rect.setAttributes({
      width: width,
      height: height,
      x: x + dx,
      y: y + dy
    });
    this.setAttributes({
      anchor: [x + dx + width / 2, y + dy + height / 2]
    });
    this.dispatchUpdate();
    return this;
  }

  dispatchUpdate() {
    const out = this.getTransformAttribute();
    this.updateCbs.forEach(cb => {
      const data = cb(out);
      if (data) {
        // console.log('设置宽高', data);
        const { x, y, width, height, anchor, angle } = data;
        Number.isFinite(x) && this.rect.setAttribute('x', x);
        Number.isFinite(y) && this.rect.setAttribute('y', y);
        Number.isFinite(width) && this.rect.setAttribute('width', width);
        Number.isFinite(height) && this.rect.setAttribute('height', height);
        anchor && this.setAttribute('anchor', anchor);
        Number.isFinite(angle) && this.setAttribute('angle', angle);
      }
    });
  }

  onUpdate(cb: (data: IUpdateParams) => Partial<IUpdateParams> | false) {
    this.updateCbs.push(cb);
  }

  onEditorEnd(cb: () => void) {
    this.editEndCbs.push(cb);
  }
  onEditorStart(cb: () => void) {
    this.editStartCbs.push(cb);
  }
  onUnTransStart(cb: (event: PointerEvent) => void) {
    this.unTransStartCbs.push(cb);
  }

  addChildUpdateBoundTag() {
    super.addChildUpdateBoundTag();

    // 如果wrap内的内容bounds变化，那就需要重新调用render
    if (this.runningAddChildUpdateBoundTag) {
      return;
    }
    this.runningAddChildUpdateBoundTag = true;

    this.render();

    this.runningAddChildUpdateBoundTag = false;
  }

  getTransformAttribute() {
    const { x, y, width, height } = this.rect.attribute;
    const { angle, anchor } = this.attribute;
    return {
      x,
      y,
      width,
      height,
      angle,
      anchor
    };
  }

  release(): void {
    // event
    this.editBorder.removeEventListener('mousemove', this.handleMouseMove);
    this.stage.removeEventListener('pointermove', this.handleDragMouseMove);
    this.stage.removeEventListener('pointerup', this.handleDragMouseUp);
    this.removeEventListener('pointerout', this.handleMouseOut);
    this.removeEventListener('pointerdown', this.handleDragMouseDown);

    this.parent.removeChild(this);
    this.editBorder = null;
    this.updateCbs = null;
    this.editEndCbs = null;
    this.unTransStartCbs = null;
    super.release();
  }
}
