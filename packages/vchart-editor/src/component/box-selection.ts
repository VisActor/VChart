import type { IEditorElement, ILayoutLine } from './../core/interface';
import type { IGroup, IRect } from '@visactor/vrender-core';
import { createRect, createGroup, container } from '@visactor/vrender-core';
import type { VRenderPointerEvent } from './../elements/interface';
import type { EditorLayer } from '../core/editor-layer';
import type { IPoint, IRect as ILayoutRect } from '../typings/space';
import { OverGraphicAttribute } from '../core/const';
import { LayoutEditorComponent } from './layout-component';
import { isPointInBounds } from '../utils/space';
import type { BaseElement } from '../elements/base-element';

export class BoxSelection {
  protected _state: 'none' | 'start' | 'drag' | 'end' | 'editor' = 'none';

  protected _boxGraphics: IRect;
  protected _overGroup: IGroup;

  protected _startPos: IPoint;
  protected _currentBox: ILayoutRect;
  protected _layoutComponent: LayoutEditorComponent;

  constructor(public layer: EditorLayer) {
    this._boxGraphics = createRect({
      ...OverGraphicAttribute,
      fill: 'blue',
      fillOpacity: 0.3,
      zIndex: 999999,
      visible: false
    });
    this.layer.editorGroup.add(this._boxGraphics);
    this._overGroup = createGroup({
      pickable: false,
      zIndex: 999999 - 1
    });
    this.layer.editorGroup.add(this._overGroup);
    this._initEvent();
  }

  protected _initEvent() {
    this.layer.getStage().addEventListener('pointerdown', this._pointerDown as any);
    this.layer.getStage().addEventListener('pointerup', this._pointerUp as any);
    this.layer.getStage().addEventListener('pointermove', this._pointerMove as any);
  }

  protected _pointerDown = (e: VRenderPointerEvent) => {
    this._overGroup.removeAllChild();
    if (this._state === 'editor') {
      if (isPointInBounds(e.canvas, this._layoutComponent.editorBox.rect.AABBBounds)) {
        return;
      }
      this._clearLayoutComponent();
      this._state = 'none';
      return;
    }
    if (
      // @ts-ignore
      e.target === this.layer.getStage() ||
      e.target.name === 'root' ||
      e.target === this.layer.getStage().defaultLayer
    ) {
      // start
      this._state = 'start';
      this._startPos = { ...e.canvas };
      this._currentBox = { x: this._startPos.x, y: this._startPos.y, width: 0, height: 0 };
      this._boxGraphics.setAttributes({
        ...this._currentBox,
        visible: true
      });
    }
  };

  protected _pointerMove = (e: VRenderPointerEvent) => {
    if (this._state === 'start') {
      this._state = 'drag';
    }
    if (this._state !== 'drag') {
      return;
    }
    this._currentBox.x = Math.min(this._startPos.x, e.canvas.x);
    this._currentBox.y = Math.min(this._startPos.y, e.canvas.y);
    this._currentBox.width = Math.abs(this._startPos.x - e.canvas.x);
    this._currentBox.height = Math.abs(this._startPos.y - e.canvas.y);
    this._boxGraphics.setAttributes({
      ...this._currentBox
    });
    const mathEl = this._checkBoxSelected();
    this._showOverGraphics(mathEl);
  };

  protected _pointerUp = (e: VRenderPointerEvent) => {
    if (this._state === 'editor') {
      return;
    }
    this._overGroup.removeAllChild();
    this._boxGraphics.setAttributes({
      visible: false
    });
    if (this._state !== 'drag') {
      this._state = 'end';
      return;
    }
    this._state = 'end';
    const mathEl = this._checkBoxSelected();
    if (!mathEl || mathEl.length === 0) {
      this._state = 'none';
      return;
    } else if (mathEl.length === 1) {
      // 单独模块选中
      mathEl[0].e.startEditorElement(mathEl[0].el, e);
      this._state = 'none';
      return;
    }
    this._state = 'editor';
    // 正常触发框选
    this._createEditorGraphic(mathEl, e);
  };

  protected _checkBoxSelected() {
    if (this._currentBox.width <= 0) {
      return null;
    }
    if (this._currentBox.height <= 0) {
      return null;
    }
    const mathEl: { e: BaseElement; el: IEditorElement }[] = [];
    this.layer.elements.forEach(e => {
      e.getEditorElementsConnectBox(this._currentBox).forEach(el => {
        mathEl.push({
          e,
          el
        });
      });
    });
    return mathEl;
  }

  private _showOverGraphics(mathEl: { e: any; el: IEditorElement }[]) {
    this._overGroup.removeAllChild();
    if (!mathEl) {
      return;
    }
    mathEl.forEach(m => {
      const overRect = createRect({
        ...m.el.rect,
        ...OverGraphicAttribute
      });
      this._overGroup.add(overRect);
    });
  }

  protected _createEditorGraphic(mathEl: { e: any; el: IEditorElement }[], event: PointerEvent) {
    const layoutLines: ILayoutLine[] = [];
    const tempLine = this.layer.getLayoutLineInLayer();
    tempLine.forEach(line => {
      // @ts-ignore
      if (mathEl.find(m => m.el.id === line.id)) {
        return;
      }
      layoutLines.push(line);
    });
    const elList = mathEl.map(m => m.el);
    // groupEl
    let rect: ILayoutRect & { right: number; bottom: number };
    elList.forEach((_e, i) => {
      if (i === 0) {
        rect = { ..._e.rect, right: _e.rect.x + _e.rect.width, bottom: _e.rect.y + _e.rect.height };
      } else {
        rect.x = Math.min(rect.x, _e.rect.x);
        rect.y = Math.min(rect.y, _e.rect.y);
        rect.right = Math.max(rect.right, _e.rect.width + _e.rect.x);
        rect.bottom = Math.max(rect.bottom, _e.rect.height + _e.rect.y);
      }
    });
    rect.width = rect.right - rect.x;
    rect.height = rect.bottom - rect.y;
    const groupEl: IEditorElement = {
      type: 'group',
      id: '_editor_element_group',
      layer: this.layer,
      rect: { ...rect },
      model: null,
      editProperties: {
        move: true,
        rotate: false,
        resize: false
      },
      editorFinish: () => {
        // nothing
      },
      updateAttribute: attr => {
        return false;
      },
      updateElement: function (): void {
        // do nothing
      }
    };

    this._layoutComponent = new LayoutEditorComponent(groupEl, {
      container: this.layer.container,
      layoutLines,
      editorGroup: this.layer.editorGroup,
      swallowInteraction: true,
      stage: this.layer.getStage(),
      startHandler: () => {
        // do nothing
      },
      updateHandler: data => false,
      endHandler: data => {
        const dx = data.x - groupEl.rect.x;
        const dy = data.y - groupEl.rect.y;
        groupEl.rect.x = data.x;
        groupEl.rect.y = data.y;
        elList.forEach(el => {
          el.updateAttribute({
            layout: {
              dx,
              dy
            }
          });
        });
        // this._showOverGraphics(mathEl);
      },
      event
    });
  }
  protected _clearLayoutComponent() {
    this._layoutComponent?.release();
    this._layoutComponent = null;
  }
}
