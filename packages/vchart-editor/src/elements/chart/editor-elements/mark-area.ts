/**
 * @description 区域标注交互
 * TODO: 保存位置 & 更新 spec
 */
import type { IGroup, IGraphic, IPolygon, IRect, FederatedPointerEvent } from '@visactor/vrender-core';
// eslint-disable-next-line no-duplicate-imports
import { createRect, createGroup, vglobal, createPolygon, point } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../core/interface';
import { BaseEditorElement } from './base-editor-element';
// eslint-disable-next-line no-duplicate-imports
import { cloneDeep, merge } from '@visactor/vutils';
import type { MarkArea as MarkAreaComponent } from '@visactor/vrender-components';
import type { EventParams, MarkArea } from '@visactor/vchart';
import type { IComponent } from '@visactor/vchart/esm/component/interface';

const handlerWidth = 9;
const handlerHeight = 40;
export class MarkAreaEditor extends BaseEditorElement {
  private _element: IGroup;
  private _model: MarkArea;
  private _orient: string;

  private _editComponent: IGroup;
  private _overlayAreaGroup: IGroup;
  private _overlayArea: IPolygon;
  private _overlayLabel: IRect;
  private _topHandler: IRect;
  private _bottomHandler: IRect;
  private _rightHandler: IRect;
  private _leftHandler: IRect;
  private _currentHandler: IRect;

  private _prePos: number = 0;
  private _selected: boolean = false;

  initWithVChart(): void {
    const vchart = this._chart.vchart;

    vchart.on('pointermove', { level: 'model', type: 'markArea', consume: true }, this._onHover);
    vchart.on('pointerdown', { level: 'model', type: 'markArea', consume: true }, this._onDown);
  }

  private _onHover = (e: any) => {
    const el = this._getEditorElement(e);
    this.showOverGraphic(el, el?.id + `${this._layer.id}`, e);
  };

  private _onDown = (e: any) => {
    const el = this._getEditorElement(e);
    this._element = e.model.getVRenderComponents()[0];
    this._model = e.model;
    this._selected = true;
    // TODO: hack
    this._orient = this._model.getSpec().x ? 'vertical' : 'horizontal';
    this.startEditor(el, e);
    this._activeEditComponent();
    this._overlayAreaGroup?.showAll();

    this._prePos = this._orient === 'vertical' ? e.event.clientX : e.event.clientY;
    vglobal.addEventListener('pointermove', this._onAreaDrag);
    vglobal.addEventListener('pointerup', this._onAreaDragEnd);

    this._overlayAreaGroup.addEventListener('pointerdown', this._onAreaDragStart as EventListenerOrEventListenerObject);
  };

  // 创建 hover 浮层
  protected _getOverGraphic(el: IEditorElement): IGraphic {
    const model = el.model;
    const markArea = (model as IComponent).getVRenderComponents()[0];
    const areaShape = (markArea as unknown as MarkAreaComponent).getArea();
    const overlayArea = createPolygon(
      merge({}, areaShape.attribute, {
        lineWidth: 1,
        stroke: '#3073F2',
        pickable: false
      })
    );
    overlayArea.name = 'overlay-mark-area-area';

    return overlayArea;
  }

  protected _getEditorElement(eventParams: EventParams): IEditorElement {
    const model = eventParams.model;
    const element: IEditorElement = {
      type: 'chart',
      layer: this._layer,
      id: this._chart.vchart.id + '-markArea-' + model.id,
      // rect: transformModelRect(model, LayoutRectToRect(layoutMeta.layout)),
      part: model.type,
      editProperties: {
        // move: true,
        // rotate: false,
        // resize: true
      },
      editorFinish: () => {
        if (this._currentEl === element) {
          this._releaseLast();
        }
      },
      updateAttribute: attr => {
        return false;
      },
      model
    };
    return element;
  }

  protected startEditor(el: IEditorElement, e?: PointerEvent): boolean {
    if (!super.startEditor(el, e)) {
      return false;
    }
    this._createEditorGraphic(el, e);
    return true;
  }

  // 创建交互编辑框
  protected _createEditorGraphic(el: IEditorElement, e: any): IGraphic {
    if (this._editComponent) {
      return this._editComponent;
    }

    const model = el.model;
    const overlayGraphic = createGroup({});
    const overlayAreaGroup = createGroup({
      x: 0,
      y: 0
    });
    overlayAreaGroup.name = 'overlay-mark-area-group';
    overlayGraphic.add(overlayAreaGroup);
    this._overlayAreaGroup = overlayAreaGroup;

    const markArea = (model as IComponent).getVRenderComponents()[0];
    const areaShape = (markArea as unknown as MarkAreaComponent).getArea();
    const points = areaShape.attribute.points;
    if (this._orient === 'vertical') {
      if (points[0].x <= points[2].x) {
        (points[0] as unknown as any).left = true;
        (points[1] as unknown as any).left = true;
        (points[2] as unknown as any).right = true;
        (points[3] as unknown as any).right = true;
      } else {
        (points[0] as unknown as any).right = true;
        (points[1] as unknown as any).right = true;
        (points[2] as unknown as any).left = true;
        (points[3] as unknown as any).left = true;
      }
    } else {
      if (points[0].y <= points[2].y) {
        (points[0] as unknown as any).top = true;
        (points[1] as unknown as any).top = true;
        (points[2] as unknown as any).bottom = true;
        (points[3] as unknown as any).bottom = true;
      } else {
        (points[0] as unknown as any).bottom = true;
        (points[1] as unknown as any).bottom = true;
        (points[2] as unknown as any).top = true;
        (points[3] as unknown as any).top = true;
      }
    }
    const overlayArea = createPolygon(
      merge({}, areaShape.attribute, {
        lineWidth: 1,
        stroke: '#3073F2'
      })
    );
    overlayArea.name = 'overlay-mark-area-area';
    this._overlayArea = overlayArea;
    overlayAreaGroup.add(overlayArea);

    const labelShape = (markArea as unknown as MarkAreaComponent).getLabel() as unknown as IGroup;
    const overlayLabel = createRect({
      x: labelShape.AABBBounds.x1,
      y: labelShape.AABBBounds.y1,
      width: labelShape.AABBBounds.width(),
      height: labelShape.AABBBounds.height(),
      fill: '#3073F2',
      fillOpacity: 0.3,
      visible: false
    });
    overlayLabel.name = 'overlay-mark-area-label';
    this._overlayLabel = overlayLabel;
    overlayGraphic.add(overlayLabel);

    // 绘制 resize 的手柄
    const areaBounds = areaShape.AABBBounds;
    if (this._orient === 'vertical') {
      const rightHandler = createRect({
        x: areaBounds.x2 - handlerWidth / 2,
        y: (areaBounds.y1 + areaBounds.y2) / 2 - handlerHeight / 2,
        width: handlerWidth,
        height: handlerHeight,
        fill: '#3073F2',
        fillOpacity: 0.6,
        cornerRadius: 9,
        cursor: 'ew-resize'
      });
      rightHandler.name = 'overlay-right-handler';
      overlayAreaGroup.add(rightHandler);
      this._rightHandler = rightHandler;

      const leftHandler = createRect({
        x: areaBounds.x1 - handlerWidth / 2,
        y: (areaBounds.y1 + areaBounds.y2) / 2 - handlerHeight / 2,
        width: handlerWidth,
        height: handlerHeight,
        fill: '#3073F2',
        fillOpacity: 0.6,
        cornerRadius: 9,
        cursor: 'ew-resize'
      });
      leftHandler.name = 'overlay-left-handler';
      overlayAreaGroup.add(leftHandler);
      this._leftHandler = leftHandler;

      // resize 手柄的事件监听
      this._rightHandler.addEventListener(
        'pointerdown',
        this._onHandlerDragStart as EventListenerOrEventListenerObject
      );
      this._leftHandler.addEventListener('pointerdown', this._onHandlerDragStart as EventListenerOrEventListenerObject);
    } else {
      const topHandler = createRect({
        x: (areaBounds.x1 + areaBounds.x2) / 2 - handlerHeight / 2,
        y: areaBounds.y1 - handlerWidth / 2,
        width: handlerHeight,
        height: handlerWidth,
        fill: '#3073F2',
        fillOpacity: 0.6,
        cornerRadius: 9,
        cursor: 'ns-resize'
      });
      topHandler.name = 'overlay-top-handler';
      overlayAreaGroup.add(topHandler);
      this._topHandler = topHandler;

      const bottomHandler = createRect({
        x: (areaBounds.x1 + areaBounds.x2) / 2 - handlerHeight / 2,
        y: areaBounds.y2 - handlerWidth / 2,
        width: handlerHeight,
        height: handlerWidth,
        fill: '#3073F2',
        fillOpacity: 0.6,
        cornerRadius: 9,
        cursor: 'ns-resize'
      });
      bottomHandler.name = 'overlay-bottom-handler';
      overlayAreaGroup.add(bottomHandler);
      this._bottomHandler = bottomHandler;

      // resize 手柄的事件监听
      this._topHandler.addEventListener('pointerdown', this._onHandlerDragStart as EventListenerOrEventListenerObject);
      this._bottomHandler.addEventListener(
        'pointerdown',
        this._onHandlerDragStart as EventListenerOrEventListenerObject
      );
    }
    // overlayGraphic.addEventListener('pointerleave', this._onUnHover as EventListenerOrEventListenerObject);
    // overlayArea 添加事件
    this._layer.editorGroup.add(overlayGraphic as unknown as IGraphic);
    this._editComponent = overlayGraphic;
    return this._editComponent;
  }

  protected _releaseLast() {
    super._releaseLast();

    if (this._editComponent) {
      this._layer.editorGroup.removeChild(this._editComponent as unknown as IGraphic);
      this._editComponent = null;
    }
  }

  release(): void {
    const vchart = this._chart.vchart;

    vchart.off('pointermove', this._onHover);
    super.release();
  }

  private _onHandlerDragStart = (e: FederatedPointerEvent) => {
    e.stopPropagation();
    const handler = e.target;
    this._currentHandler = handler as unknown as IRect;

    this._prePos = this._orient === 'vertical' ? e.clientX : e.clientY;
    vglobal.addEventListener('pointermove', this._onHandlerDrag);
    vglobal.addEventListener('pointerup', this._onHandlerDragEnd);
  };

  private _onHandlerDrag = (e: any) => {
    e.stopPropagation();
    this._editComponent.showAll();

    let currentPos;
    let delta = 0;
    let updateField;
    if (this._orient === 'horizontal') {
      currentPos = e.clientY;
      delta = currentPos - this._prePos;
      updateField = 'y';
    } else {
      currentPos = e.clientX;
      delta = currentPos - this._prePos;
      updateField = 'x';
    }
    this._prePos = currentPos;

    // 更新 area
    const overlayArea = this._overlayArea;
    const points = overlayArea.attribute.points;
    if (this._currentHandler.name === 'overlay-right-handler') {
      const changePoints = points.filter(point => (point as unknown as any).right);
      changePoints.forEach(point => {
        point.x += delta;
      });
    } else if (this._currentHandler.name === 'overlay-left-handler') {
      const changePoints = points.filter(point => (point as unknown as any).left);
      changePoints.forEach(point => {
        point.x += delta;
      });
    } else if (this._currentHandler.name === 'overlay-top-handler') {
      const changePoints = points.filter(point => (point as unknown as any).top);

      changePoints.forEach(point => {
        point.y += delta;
      });
    } else if (this._currentHandler.name === 'overlay-bottom-handler') {
      const changePoints = points.filter(point => (point as unknown as any).bottom);
      changePoints.forEach(point => {
        point.y += delta;
      });
    }
    overlayArea.setAttribute('points', points);

    // 更新 label
    const overlayLabel = this._overlayLabel;
    overlayLabel.setAttribute(
      updateField,
      this._orient === 'vertical'
        ? (overlayArea.AABBBounds.x1 + overlayArea.AABBBounds.x2) / 2 - overlayLabel.attribute.width / 2
        : (overlayArea.AABBBounds.y1 + overlayArea.AABBBounds.y2) / 2 - overlayLabel.attribute.height / 2
    );

    // 更新当前 handler
    this._currentHandler.setAttribute(updateField, this._currentHandler.attribute[updateField] + delta);
  };

  private _onHandlerDragEnd = (e: any) => {
    e.preventDefault();

    const overlayArea = this._overlayArea;
    const points = overlayArea.attribute.points;
    this._slientEditComponent();
    this._overlayLabel.setAttribute('visible', false);

    // 更新真正的图形
    const areaShape = (this._element as unknown as MarkAreaComponent).getArea();
    areaShape.setAttribute(
      'points',
      points.map(point => {
        return {
          x: point.x,
          y: point.y
        };
      })
    );
    const labelShape = (this._element as unknown as MarkAreaComponent).getLabel();
    if (this._orient === 'vertical') {
      labelShape.setAttribute('x', this._overlayLabel.attribute.x + this._overlayLabel.attribute.width / 2);
    } else {
      labelShape.setAttribute('y', this._overlayLabel.attribute.y + this._overlayLabel.attribute.height / 2);
    }

    vglobal.removeEventListener('pointermove', this._onHandlerDrag);
    vglobal.removeEventListener('pointerup', this._onHandlerDragEnd);
  };

  private _onAreaDragStart = (e: any) => {
    e.stopPropagation();
    this._prePos = this._orient === 'vertical' ? e.clientX : e.clientY;
    vglobal.addEventListener('pointermove', this._onAreaDrag);
    vglobal.addEventListener('pointerup', this._onAreaDragEnd);
  };

  private _onAreaDrag = (e: any) => {
    e.stopPropagation();

    this._editComponent.showAll();
    let currentPos;
    let delta = 0;
    let updateField: string;
    if (this._orient === 'horizontal') {
      currentPos = e.clientY;
      delta = currentPos - this._prePos;
      updateField = 'y';
    } else {
      currentPos = e.clientX;
      delta = currentPos - this._prePos;
      updateField = 'x';
    }
    this._prePos = currentPos;

    // 更新 area
    const overlayArea = this._overlayArea;
    const points = overlayArea.attribute.points;
    overlayArea.setAttribute(
      'points',
      points.map(point => {
        point[updateField] += delta;
        return point;
      })
    );

    // 更新当前 label, handler
    const overlayLabel = this._overlayLabel;
    if (this._orient === 'vertical') {
      overlayLabel.setAttribute(
        updateField,
        (overlayArea.AABBBounds.x1 + overlayArea.AABBBounds.x2) / 2 - overlayLabel.attribute.width / 2
      );
      this._rightHandler.setAttribute(updateField, this._rightHandler.attribute[updateField] + delta);
      this._leftHandler.setAttribute(updateField, this._leftHandler.attribute[updateField] + delta);
    } else {
      overlayLabel.setAttribute(
        updateField,
        (overlayArea.AABBBounds.y1 + overlayArea.AABBBounds.y2) / 2 - overlayLabel.attribute.height / 2
      );
      this._topHandler.setAttribute(updateField, this._topHandler.attribute[updateField] + delta);
      this._bottomHandler.setAttribute(updateField, this._bottomHandler.attribute[updateField] + delta);
    }
  };

  private _onAreaDragEnd = (e: any) => {
    e.preventDefault();

    const overlayArea = this._overlayArea;
    const points = overlayArea.attribute.points;
    this._overlayLabel.setAttribute('visible', false);

    // 更新真正的图形
    const areaShape = (this._element as unknown as MarkAreaComponent).getArea();
    areaShape.setAttribute(
      'points',
      points.map(point => {
        return {
          x: point.x,
          y: point.y
        };
      })
    );

    const labelShape = (this._element as unknown as MarkAreaComponent).getLabel();
    if (this._orient === 'vertical') {
      labelShape.setAttribute('x', this._overlayLabel.attribute.x + this._overlayLabel.attribute.width / 2);
    } else {
      labelShape.setAttribute('y', this._overlayLabel.attribute.y + this._overlayLabel.attribute.height / 2);
    }

    vglobal.removeEventListener('pointermove', this._onAreaDrag);
    vglobal.removeEventListener('pointerup', this._onAreaDragEnd);
  };

  private _slientEditComponent() {
    if (this._editComponent) {
      this._editComponent.setAttributes({
        pickable: false,
        childrenPickable: false
      });
    }
  }

  private _activeEditComponent() {
    if (this._editComponent) {
      this._editComponent.setAttributes({
        pickable: true,
        childrenPickable: true
      });
    }
  }
}
