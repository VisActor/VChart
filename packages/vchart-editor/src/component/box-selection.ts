import type { IEditorElement, IEditorLayer, ILayoutLine } from './../core/interface';
import type { IGroup, IRect } from '@visactor/vrender-core';
import { createRect, createGroup } from '@visactor/vrender-core';
import type { IElement, VRenderPointerEvent } from './../elements/interface';
import type { IPoint, IRect as ILayoutRect } from '../typings/space';
import { BoxSelectionMaskName, OverGraphicAttribute } from '../core/const';
import { LayoutEditorComponent } from './layout-component';
import { isPointInBounds } from '../utils/space';
import type { EditorEvent } from '../core/editor-event';

export class BoxSelection {
  protected _state: 'none' | 'start' | 'drag' | 'end' | 'editor' = 'none';
  protected _stateInEditor: 'down' | 'move' | 'none' = 'none';

  protected _boxGraphic: IRect;
  protected _overGroup: IGroup;

  protected _startPos: IPoint;
  protected _currentBox: ILayoutRect = { x: 0, y: 0, width: 0, height: 0 };
  protected _layoutComponent: LayoutEditorComponent;

  protected _currentMatchElements: { e: IElement; el: IEditorElement }[] = null;

  constructor(public layer: IEditorLayer, public context: EditorEvent) {
    this.setLayer(layer);
    this.context.editor.editorController.addStartHandler(() => {
      if (this._state === 'editor') {
        this._outBoxSelection();
      }
    });
    document.addEventListener('keydown', this._keyEvent);
  }

  protected _keyEvent = (ev: KeyboardEvent) => {
    if ((ev.ctrlKey && ev.code === 'KeyA') || (ev.metaKey && ev.code === 'KeyA')) {
      this._inBoxSelection();
      //  全选
      this._currentBox.x = 0;
      this._currentBox.y = 0;
      this._currentBox.width = Number.MAX_SAFE_INTEGER;
      this._currentBox.height = Number.MAX_SAFE_INTEGER;
      this._checkEditorWithBox(null);
    }
  };

  setLayer(layer: IEditorLayer) {
    if (layer === this.layer) {
      return;
    }
    if (this.layer) {
      this._removeEvent();
      this._removeGraphic();
    }
    this.layer = layer;
    if (layer) {
      this._initGraphic();
      this._initEvent();
    }
  }

  protected _initGraphic() {
    this._boxGraphic = createRect({
      ...OverGraphicAttribute,
      fill: 'blue',
      fillOpacity: 0.3,
      zIndex: 999999,
      visible: false,
      pickable: false
    });
    this._boxGraphic.name = BoxSelectionMaskName;
    this.layer.editorGroup.add(this._boxGraphic);
    this._overGroup = createGroup({
      pickable: false,
      zIndex: 999999 - 1
    });
    this.layer.editorGroup.add(this._overGroup);
  }

  protected _removeGraphic() {
    this.layer.editorGroup?.removeChild(this._boxGraphic);
    this.layer.editorGroup?.removeChild(this._overGroup);
    this._boxGraphic = this._overGroup = null;
  }

  protected _initEvent() {
    this.layer.getStage().addEventListener('pointerdown', this._pointerDown as any);
    this.layer.getStage().addEventListener('pointerup', this._pointerUp as any);
    this.layer.getStage().addEventListener('pointermove', this._pointerMove as any);
  }
  protected _removeEvent() {
    this.layer?.getStage()?.removeEventListener('pointerdown', this._pointerDown as any);
    this.layer?.getStage()?.removeEventListener('pointerup', this._pointerUp as any);
    this.layer?.getStage()?.removeEventListener('pointermove', this._pointerMove as any);
  }

  protected _pointerDown = (e: VRenderPointerEvent) => {
    this._overGroup.removeAllChild();
    const lastLayoutEditorBox = this._layoutComponent?.editorBox;
    if (this._state === 'editor') {
      if (this._editorPointerDown(e)) {
        return;
      }
    }
    if (
      // @ts-ignore
      e.target === this.layer.getStage() ||
      e.target.name === 'root' ||
      e.target === this.layer.getStage().defaultLayer ||
      // @ts-ignore
      (lastLayoutEditorBox && e.target === lastLayoutEditorBox) ||
      (e.target === this._boxGraphic && !this._boxGraphic.attribute.visible)
    ) {
      // start
      this._inBoxSelection();
      this._startPos = { ...e.canvas };
      this._currentBox = { x: this._startPos.x, y: this._startPos.y, width: 0, height: 0 };
      this._boxGraphic.setAttributes({
        ...this._currentBox,
        visible: true
      });
    }
  };

  protected _pointerMove = (e: VRenderPointerEvent) => {
    if (this._state === 'start') {
      this._state = 'drag';
    }
    if (this._state === 'editor') {
      this._editorDrag(e);
      return;
    }
    if (this._state !== 'drag') {
      return;
    }
    this._currentBox.x = Math.min(this._startPos.x, e.canvas.x);
    this._currentBox.y = Math.min(this._startPos.y, e.canvas.y);
    this._currentBox.width = Math.abs(this._startPos.x - e.canvas.x);
    this._currentBox.height = Math.abs(this._startPos.y - e.canvas.y);
    this._boxGraphic.setAttributes({
      ...this._currentBox
    });
    const mathEl = this._checkBoxSelected();
    this._showOverGraphic(mathEl);
  };

  protected _pointerUp = (e: VRenderPointerEvent) => {
    // up
    this.context.setElementPickable(true);
    this.context.setElementsOverAble(true);

    if (this._state === 'editor') {
      this._editorPointerUp(e);
      return;
    }
    this._overGroup.removeAllChild();
    this._boxGraphic.setAttributes({
      visible: false
    });
    if (this._state !== 'drag') {
      this._state = 'end';
      return;
    }
    this._state = 'end';
    this._checkEditorWithBox(e);
  };

  private _checkEditorWithBox(e: VRenderPointerEvent) {
    const matchEl = this._checkBoxSelected();
    if (!matchEl || matchEl.length === 0) {
      this._outBoxSelection();
      return;
    } else if (matchEl.length === 1) {
      // 单独模块选中
      matchEl[0].e.startEditorElement(matchEl[0].el, e);
      this._outBoxSelection();
      return;
    }
    this._currentMatchElements = matchEl;
    this._startBoxEditor(e);
  }

  protected _checkBoxSelected() {
    if (this._currentBox.width <= 0) {
      return null;
    }
    if (this._currentBox.height <= 0) {
      return null;
    }
    const mathEl: { e: IElement; el: IEditorElement }[] = [];
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

  private _showOverGraphic(mathEl: { e: any; el: IEditorElement }[]) {
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
      container: this.context.editor.editorController.container,
      layoutLines,
      editorGroup: this.layer.editorGroup,
      stage: this.layer.getStage(),
      startHandler: () => {
        // do nothing
      },
      updateHandler: data => false,
      endHandler: data => {
        const dx = data.x - groupEl.rect.x;
        const dy = data.y - groupEl.rect.y;
        if (dx === 0 && dy === 0) {
          return;
        }
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
      },
      event
    });
  }
  protected _clearLayoutComponent() {
    this._layoutComponent?.release();
    this._layoutComponent = null;
  }

  protected _outBoxSelection() {
    this._clearLayoutComponent();
    this._state = 'none';
    this.context.setElementPickable(true);
  }

  protected _inBoxSelection() {
    this._state = 'start';
    this.context.editor.layers.forEach(l => {
      l.elements.forEach(e => {
        e.clearCurrentEditorElement();
        e.pickable = false;
      });
    });
    this.context.editor.editorController.setEditorElements(null, null);
  }

  protected _startBoxEditor(e: PointerEvent) {
    // 允许元素交互
    this.context.editor.layers.forEach(l => {
      l.elements.forEach(e => {
        e.pickable = true;
        e.clearCurrentEditorElement();
      });
    });
    this._state = 'editor';
    this._stateInEditor = 'none';
    // clear chart overGraphic
    this.context.editor.editorController.setOverGraphic(null, null, null);
    this.context.editor.editorController.editorRun('boxSelection');
    // 正常触发框选
    this._createEditorGraphic(this._currentMatchElements, e);
    // 关闭框选中的元素pick能力
    this._currentMatchElements.forEach(m => {
      m.e.pickable = false;
    });
  }

  protected _editorPointerDown(e: VRenderPointerEvent) {
    this._stateInEditor = 'down';
    if (isPointInBounds(e.canvas, this._layoutComponent.editorBox.rect.AABBBounds)) {
      return true;
    }
    this._outBoxSelection();
    return false;
  }

  protected _editorDrag(e: VRenderPointerEvent) {
    if (this._stateInEditor !== 'down') {
      return;
    }
    this._stateInEditor = 'move';
    // remove over
    this.context.editor.editorController.setOverGraphic(null, null, null);
    // disable over
    this.context.setElementsOverAble(false);
  }

  protected _editorPointerUp(e: VRenderPointerEvent) {
    this._currentMatchElements?.forEach(m => {
      m.e.pickable = true;
    });
    // click
    if (this._stateInEditor === 'down') {
      this._editorClick(e);
    } else {
      this._editorDragEnd(e);
    }
  }

  protected _editorDragEnd(e: VRenderPointerEvent) {
    // do nothing
    // this.context.editor.editorController.setOverGraphic(null, null, null);
  }

  protected _editorClick(e: VRenderPointerEvent) {
    // 框选中的元素尝试pick
    this._currentMatchElements?.forEach(m => {
      m.e.tryPick(e);
    });
    //after try pick && pick success
    if (this._state !== 'editor') {
      this.context.setElementPickable(true);
    }
  }
}
