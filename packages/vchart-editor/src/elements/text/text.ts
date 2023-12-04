import type { VRenderPointerEvent } from './../interface';
import type { IGraphic, IText, INode, IGroup } from '@visactor/vrender-core';
import { createRect, createWrapText } from '@visactor/vrender-core';
import type {
  IEditorElement,
  IElementPath,
  IElementPathEnd,
  IElementPathRoot,
  ILayoutLine,
  IUpdateAttributeParam
} from './../../core/interface';
/* eslint-disable no-console */

import type { IBoundsLike } from '@visactor/vutils';
import { isString, isValid } from '@visactor/vutils';
import type { IRect, IPoint, ILayoutAttribute } from '../../typings/space';
import { BaseElement } from '../base-element';
import type { IElementOption } from '../interface';
import { LayoutEditorComponent } from '../../component/layout-component';
import { MinSize } from '../../core/const';
import { getLayoutLine, isPointInBounds, isRectConnectRect, transformPointWithMatrix } from '../../utils/space';
import { diffSpec } from '../../utils/spec';
import { addRectToPathElement, getElementPath, getEndPathWithNode, getPosInClient } from '../../utils/element';

export class EditorText extends BaseElement {
  type = 'text';
  protected _attribute: any;
  protected _container: HTMLElement;
  protected _textGraphic: IText;
  protected _layoutComponent: LayoutEditorComponent;
  protected _tempKey: string;
  protected _currentEl: IEditorElement;

  constructor(opt: IElementOption) {
    super(opt);
    this.initRender();
    if (this._mode === 'editor') {
      this.initEvent();
    }
    this._tempKey = this.type + this._id;
    this._afterRender();
  }

  /**
   * init editors
   */
  initEvent() {
    this._textGraphic.addEventListener('pointerdown', this._pointerDown as any);
    this._textGraphic.addEventListener('pointerover', this._pointerOver as any);
    this._textGraphic.addEventListener('pointerout', this._pointerOut as any);

    this._opt.layer.getStage().addEventListener('pointerdown', this._checkUnPick as any);
  }

  private _checkUnPick = (e: VRenderPointerEvent) => {
    if (e.target !== this._textGraphic && !this._touchEditorBox(e)) {
      this.clearLayoutEditorBox();
      if (this._opt.controller.currentEditorElement?.id === this._tempKey) {
        this._opt.controller.setEditorElements(null, e);
      }
    }
  };

  private _touchEditorBox(e: VRenderPointerEvent) {
    if (!this._layoutComponent) {
      return false;
    }
    let node = e.target;
    while (node && node !== this._opt.layer.getStage().defaultLayer) {
      if (node === (this._layoutComponent.editorBox as any)) {
        return true;
      }
      node = node.parent;
    }
    return false;
  }

  private _pointerDown = (e: VRenderPointerEvent) => {
    if (!this.pickable) {
      return;
    }
    if (e.target !== this._textGraphic) {
      return;
    }
    if (this._opt.controller.currentEditorElement?.id === this._id) {
      return;
    }
    const el: IEditorElement = this._getEditorElement();
    this._currentEl = el;
    this._opt.controller.setEditorElements(el, e);
    this._createEditorGraphic(el, e);
  };
  private _pointerOver = (e: VRenderPointerEvent) => {
    if (!this.overAble) {
      return false;
    }
    this._opt.controller.setOverGraphic(this._getOverGraphic(), this._id, e);
    return true;
  };
  private _pointerOut = (e: VRenderPointerEvent) => {
    this._opt.controller.setOverGraphic(null, this._id, e);
  };

  tryPick = (e: VRenderPointerEvent) => {
    const lastPickable = this.pickable;
    this.pickable = true;
    this._pointerDown(e);
    this.pickable = lastPickable;
  };

  removeEvent() {
    this._opt.layer.getStage().removeEventListener('pointerdown', this._checkUnPick as any);
  }

  release() {
    this._currentEl = null;
    this.clearLayoutEditorBox();
    this.removeEvent();
    this._textGraphic.parent.removeChild(this._textGraphic);
    super.release();
  }

  resize(rect: IRect): void {
    throw new Error('Method not implemented.');
  }
  move(pos: IPoint): void {
    throw new Error('Method not implemented.');
  }
  getBounds(): IBoundsLike {
    throw new Error('Method not implemented.');
  }

  private _getEditorElement() {
    const bounds = this._textGraphic.AABBBounds;
    const rect = {
      x: bounds.x1,
      y: bounds.y1,
      width: bounds.width(),
      height: bounds.height()
    };
    const editProperties: IEditorElement['editProperties'] = {
      move: true,
      rotate: false,
      resize: true
    };
    const el: IEditorElement = {
      type: 'graphics',
      layer: this._opt.layer,
      id: this._id,
      elementId: this._id,
      graphicsType: this.type,
      modelInfo: null,
      model: undefined,
      color: [],
      rect,
      updateRect: () => {
        // nothing
      },
      editProperties,
      originSpec: { ...this._textGraphic.attribute },
      updateAttribute: (attr: IUpdateAttributeParam) => {
        this.saveSnapshot();
        if (attr.spec) {
          this._textGraphic.setAttributes(this._transformTextAttribute(attr.spec));
          el.originSpec = this._textGraphic.attribute;
          this._layoutComponent?.updateBounds(this._textGraphic.AABBBounds);
          this._updateLayout({
            x: this._textGraphic.AABBBounds.x1,
            y: this._textGraphic.AABBBounds.y1,
            width: 9999,
            height: 9999
          } as any);
        }
        if (attr.layout) {
          this._updateLayout(attr.layout as ILayoutAttribute);
        }
        this.pushHistory();
        return false;
      },
      editorFinish: () => {
        // do nothing
      },
      updateElement: () => {
        el.originSpec = this._textGraphic.attribute;
      }
    };
    return el;
  }

  getLayoutGuideLine(): ILayoutLine[] {
    const bounds = this._textGraphic.AABBBounds;
    const rect = {
      x: bounds.x1,
      y: bounds.y1,
      width: bounds.width(),
      height: bounds.height()
    };
    return getLayoutLine(rect, {
      id: this._id,
      specKey: this._tempKey,
      specIndex: 0
    });
  }

  getData() {
    const data = super.getData();
    data.attribute = { ...this._textGraphic.attribute };
    return data;
  }

  _changeModel() {
    if (this._mode === 'editor') {
      this.initEvent();
    } else {
      this.removeEvent();
    }
  }

  initRender() {
    this._textGraphic = createWrapText(
      this._transformTextAttribute({
        textAlign: 'left',
        textBaseline: 'top',
        ...{
          text: '文本',
          fontSize: 16
        },
        ...this.option.attribute
      })
    );
    this.option.layer.elementGroup.add(this._textGraphic);
  }

  moveBy(offsetX: number, offsetY: number) {
    this.clearLayoutEditorBox();
    this.saveSnapshot();
    this._textGraphic.setAttributes({
      x: this._textGraphic.attribute.x + offsetX,
      y: this._textGraphic.attribute.y + offsetY
    });
    this.pushHistory();
  }

  protected _createEditorGraphic(el: IEditorElement, e: any): IGraphic {
    this.clearLayoutEditorBox();
    const allLayers = this.option.getAllLayers();
    const layoutLines = allLayers.reduce((pre, l) => {
      const tempLine = l.getLayoutLineInLayer();
      if (l === this._opt.layer) {
        tempLine.forEach(line => {
          // @ts-ignore
          if (line.id === this._id && line.specKey === this._tempKey) {
            return;
          }
          pre.push(line);
        });
      } else {
        pre.push(...tempLine);
      }
      return pre;
    }, []) as ILayoutLine[];
    this._layoutComponent = new LayoutEditorComponent(el, {
      container: this._opt.controller.container,
      layoutLines,
      editorEvent: this._opt.editorEvent,
      editorGroup: this._opt.layer.editorGroup,
      stage: this._opt.layer.getStage(),
      startHandler: () => {
        // do nothing
        this._opt.controller.editorRun('layout');

        // disable over
        this._opt.getAllLayers().forEach(l => {
          l.elements.forEach(e => (e.overAble = false));
        });
        this.option.controller.setOverGraphic(null, null, null);
      },
      updateHandler: data => {
        let hasChange = false;
        if (data.width < (this._textGraphic.attribute.fontSize ?? 12) * 1.5) {
          data.width = (this._textGraphic.attribute.fontSize ?? 12) * 1.5;
          hasChange = true;
        }
        if (data.height < MinSize) {
          data.height = MinSize;
          hasChange = true;
        }
        if (hasChange) {
          return data;
        }
        return false;
      },
      endHandler: data => {
        this.saveSnapshot();
        this._updateLayout(data);
        this._layoutComponent?.updateBounds(this._textGraphic.AABBBounds);
        this._opt.controller.setOverGraphic(null, null, null);
        this._opt.controller.editorEnd();
        this.pushHistory();

        // enable over
        this._opt.getAllLayers().forEach(l => {
          l.elements.forEach(e => (e.overAble = true));
        });
      },
      event: e
    });

    return this._layoutComponent.editorBox as unknown as IGraphic;
  }

  private _updateLayout(layoutData: ILayoutAttribute) {
    if (isValid(layoutData.dy)) {
      this._textGraphic.setAttributes({
        x: layoutData.dx + this._textGraphic.attribute.x
      });
    }
    if (isValid(layoutData.dy)) {
      this._textGraphic.setAttributes({
        y: layoutData.dy + this._textGraphic.attribute.y
      });
    }
    if (isValid(layoutData.x) && isValid(layoutData.y) && isValid(layoutData.width) && isValid(layoutData.height)) {
      this._textGraphic.setAttributes({
        x: layoutData.x - (this._textGraphic.AABBBounds.x1 - this._textGraphic.attribute.x),
        y: layoutData.y - (this._textGraphic.AABBBounds.y1 - this._textGraphic.attribute.y),
        maxLineWidth: layoutData.width,
        // vRender type error
        // @ts-ignore
        heightLimit: layoutData.height
      });
    }

    this._updateEditorBox();
  }

  clearLayoutEditorBox() {
    this._layoutComponent?.release();
    this._layoutComponent = null;
  }

  protected _getOverGraphic(): IGraphic {
    const bounds = this._textGraphic.AABBBounds;
    return createRect({
      x: bounds.x1,
      y: bounds.y1,
      width: bounds.width(),
      height: bounds.height(),
      fill: false,
      stroke: 'rgb(174 216 230 / 60%)',
      lineWidth: 2,
      pickable: false
    });
  }

  private _transformTextAttribute(attr: any) {
    if (isString(attr.text)) {
      attr.text = [attr.text];
    }
    return attr;
  }

  getEditorElementsConnectBox(rect: IRect): IEditorElement[] {
    const bounds = this._textGraphic.AABBBounds;
    if (
      isRectConnectRect(rect, {
        x: bounds.x1,
        y: bounds.y1,
        width: bounds.width(),
        height: bounds.height()
      })
    ) {
      return [this._getEditorElement()];
    }
    return [];
  }

  startEditorElement(el: IEditorElement, e: PointerEvent) {
    this._currentEl = el;
    this._opt.controller.setEditorElements(el, e);
    this._createEditorGraphic(el, e);
  }

  clearCurrentEditorElement() {
    this._currentEl = null;
    this.clearLayoutEditorBox();
  }

  protected _snapShot: any = null;
  saveSnapshot() {
    this._snapShot = { attribute: { ...this._textGraphic.attribute } };
  }

  pushHistory() {
    const { from, to } = diffSpec(this._snapShot, { attribute: { ...this._textGraphic.attribute } });
    if (Object.keys(from).length === Object.keys(to).length && Object.keys(from).length === 0) {
      return;
    }
    this._opt.editorData.pushHistoryNextTick({
      element: this.getElementInfo(),
      from,
      to,
      use: this._opt.commonHistoryUse
    });
  }

  updateAttributeFromHistory(att: any) {
    this._textGraphic.setAttributes(
      this._transformTextAttribute({
        ...att.attribute
      })
    );
    this._updateEditorBox();
  }

  private _updateEditorBox() {
    if (this._currentEl) {
      const bounds = this._textGraphic.AABBBounds;
      this._currentEl.rect.x = bounds.x1;
      this._currentEl.rect.y = bounds.y1;
      this._currentEl.rect.width = bounds.width();
      this._currentEl.rect.height = bounds.height();

      if (this._layoutComponent) {
        this._layoutComponent.editorBox.rect.setAttributes({
          ...this._currentEl.rect
        });
      }
    }
  }

  getTargetWithPos(pos: IPoint): IElementPathRoot {
    if (isPointInBounds(this._opt.layer.transformPosToLayer(pos), this._textGraphic.AABBBounds)) {
      const endPath = getEndPathWithNode(pos, this._textGraphic);
      const result = getElementPath(
        this._textGraphic,
        this._opt.layer.getStage().defaultLayer,
        endPath
      ) as IElementPathRoot;
      result.elementId = this._id;
      result.rect = addRectToPathElement(this._textGraphic);
      return result;
    }
    return null;
  }

  getPosWithPath(path: IElementPathRoot) {
    let end = path as IElementPathEnd | IElementPath;
    while (!isValid((<IElementPathEnd>end).percentX)) {
      end = (<IElementPath>end).child;
    }
    return getPosInClient(end as IElementPathEnd, this._textGraphic);
  }
}
