import type { VRenderPointerEvent } from './../interface';
import type { IGraphic, IText } from '@visactor/vrender-core';
import { createRect, createWrapText } from '@visactor/vrender-core';
import type { IEditorElement, ILayoutLine, IUpdateAttributeParam } from './../../core/interface';
/* eslint-disable no-console */

import { isString, type IBoundsLike } from '@visactor/vutils';
import type { IRect, IPoint, ILayoutAttribute } from '../../typings/space';
import { BaseElement } from '../base-element';
import type { IElementOption } from '../interface';
import { LayoutEditorComponent } from '../../component/layout-component';
import { MinSize } from '../../core/const';
import { getLayoutLine } from '../../utils/space';

export class EditorText extends BaseElement {
  type = 'text';
  protected _attribute: any;
  protected _container: HTMLElement;
  protected _textGraphic: IText;
  protected _layoutComponent: LayoutEditorComponent;
  protected _tempKey: string;

  constructor(opt: IElementOption) {
    super(opt);
    this.initRender();
    if (this._mode === 'editor') {
      this.initEvent();
    }
    this._tempKey = this.type + this._id;
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
    console.log('text', '_pointerDown');
    if (this._opt.controller.currentEditorElement?.id === this._id) {
      return;
    }
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
      graphicsType: this.type,
      model: undefined,
      color: [],
      rect,
      editProperties,
      updateAttribute: (attr: IUpdateAttributeParam) => {
        if (attr.spec) {
          this._textGraphic.setAttributes(this._transformTextAttribute(attr.spec));
          el.originSpec = this._textGraphic.attribute;
          this._layoutComponent?.updateBounds(this._textGraphic.AABBBounds);
        }
        return false;
      },
      editorFinish: () => {
        // do nothing
      },
      updateElement: () => {
        el.originSpec = this._textGraphic.attribute;
      }
    };
    this._opt.controller.setEditorElements(el, e);
    this._createEditorGraphic(el, e);
  };
  private _pointerOver = (e: VRenderPointerEvent) => {
    this._opt.controller.setOverGraphic(this._getOverGraphic(), this._id, e);
    console.log('text', '_pointerOver');
  };
  private _pointerOut = (e: VRenderPointerEvent) => {
    this._opt.controller.setOverGraphic(null, this._id, e);
    console.log('text', '_pointerOut');
  };

  removeEvent() {
    this._opt.layer.getStage().removeEventListener('pointerdown', this._checkUnPick as any);
  }

  release() {
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
        ...{
          text: '文本',
          fontSize: 16
        },
        ...this.option.attribute
      })
    );
    this.option.layer.editorGroup.add(this._textGraphic);
  }

  moveBy(offsetX: number, offsetY: number) {
    this.clearLayoutEditorBox();
    this._textGraphic.setAttributes({
      x: this._textGraphic.attribute.x + offsetX,
      y: this._textGraphic.attribute.y + offsetY
    });
  }

  protected _createEditorGraphic(el: IEditorElement, e: any): IGraphic {
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
      editorGroup: this._opt.layer.editorGroup,
      stage: this._opt.layer.getStage(),
      startHandler: () => {
        // do nothing
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
        this._updateLayout(data);
        this._layoutComponent?.updateBounds(this._textGraphic.AABBBounds);
        this._opt.controller.setOverGraphic(null, null, null);
      },
      event: e
    });

    return this._layoutComponent.editorBox as unknown as IGraphic;
  }

  private _updateLayout(layoutData: ILayoutAttribute) {
    this._textGraphic.setAttributes({
      x: layoutData.x - (this._textGraphic.AABBBounds.x1 - this._textGraphic.attribute.x),
      y: layoutData.y - (this._textGraphic.AABBBounds.y1 - this._textGraphic.attribute.y),
      maxLineWidth: layoutData.width,
      // vRender type error
      // @ts-ignore
      heightLimit: layoutData.height
    });
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
      stroke: 'blue',
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
}
