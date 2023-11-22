/**
 * @description 区域标注交互
 */
import type { IGroup, IGraphic, IPolygon, IRect, FederatedPointerEvent } from '@visactor/vrender-core';
// eslint-disable-next-line no-duplicate-imports
import { createRect, createGroup, vglobal, createPolygon } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../../core/interface';
// eslint-disable-next-line no-duplicate-imports
import { PointService, clamp, merge } from '@visactor/vutils';
import type { MarkArea as MarkAreaComponent } from '@visactor/vrender-components';
import type { EventParams, MarkArea, IComponent, ICartesianSeries } from '@visactor/vchart';
import { MarkerTypeEnum } from '../../interface';
import { BaseMarkerEditor } from './base';
import type { Point } from '../types';

const handlerWidth = 9;
const handlerHeight = 40;

type PointLike = {
  x: number;
  y: number;
  [key: string]: any;
};

export class MarkAreaEditor extends BaseMarkerEditor<MarkArea, MarkAreaComponent> {
  readonly type: string = 'markArea';
  private _orient: string;

  private _overlayAreaGroup: IGroup;
  private _overlayArea: IPolygon;
  private _overlayLabel: IRect;
  private _topHandler: IRect;
  private _bottomHandler: IRect;
  private _rightHandler: IRect;
  private _leftHandler: IRect;
  private _currentHandler: IRect;
  private _limitRange: [number, number];
  private _areaLength: number;

  private _prePos: number = 0;
  private _prePoint: Point;

  protected _handlePointerUp(e: EventParams): void {
    super._handlePointerUp(e);
    this._editComponent?.setAttributes({
      pickable: true,
      childrenPickable: true
    });
  }

  protected _getEnableMarkerTypes(): string[] {
    return [MarkerTypeEnum.horizontalArea, MarkerTypeEnum.verticalArea];
  }

  protected _setCursor(e: EventParams): void {
    this._chart.option.editorEvent.setCursor('move');
  }

  protected _handlePointerDown(e: EventParams): void {
    this._orient = this._element.name === MarkerTypeEnum.verticalArea ? 'vertical' : 'horizontal';
    const el = this._getEditorElement(e);
    this.startEditor(el, e.event as PointerEvent);

    this._overlayAreaGroup?.showAll();

    const isHorizontal = this._orient === 'horizontal';
    const region = this._model.getRelativeSeries().getRegion();
    const { x: regionStartX, y: regionStartY } = region.getLayoutStartPoint();
    const { width: regionWidth, height: regionHeight } = region.getLayoutRect();
    if (isHorizontal) {
      this._limitRange = [regionStartY, regionStartY + regionHeight];
    } else {
      this._limitRange = [regionStartX, regionStartX + regionWidth];
    }

    this._prePoint = {
      x: e.event.clientX,
      y: e.event.clientY
    };

    this._prePos = this._orient === 'vertical' ? e.event.clientX : e.event.clientY;
    const overlayArea = this._overlayArea;
    this._areaLength =
      this._orient === 'vertical'
        ? Math.max(...overlayArea.attribute.points.map(point => point.x)) -
          Math.min(...overlayArea.attribute.points.map(point => point.x))
        : Math.max(...overlayArea.attribute.points.map(point => point.y)) -
          Math.min(...overlayArea.attribute.points.map(point => point.y));
    vglobal.addEventListener('pointermove', this._onAreaDrag);
    vglobal.addEventListener('pointerup', this._onAreaDragEnd);
    this._overlayAreaGroup.addEventListener('pointerdown', this._onAreaDragStart as EventListenerOrEventListenerObject);
  }

  // 创建 hover 浮层
  protected _getOverGraphic(el: IEditorElement): IGraphic {
    const model = el.model;
    const markArea = (model as unknown as IComponent).getVRenderComponents()[0];
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

  // 创建交互编辑框
  protected _createEditorGraphic(el: IEditorElement): IGraphic {
    const model = el.model;
    const overlayGraphic = createGroup({
      pickable: false,
      childrenPickable: false
    });
    const overlayAreaGroup = createGroup({
      x: 0,
      y: 0
    });
    overlayAreaGroup.name = 'overlay-mark-area-group';
    overlayGraphic.add(overlayAreaGroup);
    this._overlayAreaGroup = overlayAreaGroup;

    const markArea = (model as unknown as IComponent).getVRenderComponents()[0];
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
        stroke: '#3073F2',
        fill: '#005DFF',
        fillOpacity: 0.1
      })
    );
    overlayArea.name = 'overlay-mark-area-area';
    this._overlayArea = overlayArea;
    overlayAreaGroup.add(overlayArea);

    overlayArea.addEventListener('pointerenter', e => this._onHandlerHover('move'));
    overlayArea.addEventListener('pointerleave', this._onHandlerUnHover);

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
        zIndex: 1
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
        zIndex: 1
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

      this._rightHandler.addEventListener('pointerenter', e => this._onHandlerHover('ew-resize'));
      this._rightHandler.addEventListener('pointerleave', this._onHandlerUnHover);
      this._leftHandler.addEventListener('pointerenter', e => this._onHandlerHover('ew-resize'));
      this._leftHandler.addEventListener('pointerleave', this._onHandlerUnHover);
    } else {
      const topHandler = createRect({
        x: (areaBounds.x1 + areaBounds.x2) / 2 - handlerHeight / 2,
        y: areaBounds.y1 - handlerWidth / 2,
        width: handlerHeight,
        height: handlerWidth,
        fill: '#3073F2',
        fillOpacity: 0.6,
        cornerRadius: 9,
        zIndex: 1
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
        zIndex: 1
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

      this._topHandler.addEventListener('pointerenter', e => this._onHandlerHover('ns-resize'));
      this._topHandler.addEventListener('pointerleave', this._onHandlerUnHover);
      this._bottomHandler.addEventListener('pointerenter', e => this._onHandlerHover('ns-resize'));
      this._bottomHandler.addEventListener('pointerleave', this._onHandlerUnHover);
    }
    // overlayArea 添加事件
    this._layer.editorGroup.add(overlayGraphic as unknown as IGraphic);
    this._editComponent = overlayGraphic;
    return this._editComponent;
  }

  private _onHandlerDragStart = (e: FederatedPointerEvent) => {
    e.stopPropagation();
    this._prePoint = {
      x: e.clientX,
      y: e.clientY
    };

    const model = this._chart.vchart.getChart().getComponentByUserId(this._modelId) as unknown as MarkArea;
    this._element = model.getVRenderComponents()[0] as unknown as MarkAreaComponent;
    this._model = model;

    const handler = e.target;
    this._currentHandler = handler as unknown as IRect;

    this._prePos = this._orient === 'vertical' ? e.clientX : e.clientY;
    vglobal.addEventListener('pointermove', this._onHandlerDrag);
    vglobal.addEventListener('pointerup', this._onHandlerDragEnd);
  };

  private _onHandlerDrag = (e: any) => {
    e.stopPropagation();

    this._chart.option.editorEvent.setCursor(this._orient === 'horizontal' ? 'ns-resize' : 'ew-resize');

    this._silentAllMarkers();
    this._overlayAreaGroup.setAttributes({
      pickable: false,
      childrenPickable: false
    });
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
        point.x = clamp(point.x + delta, this._limitRange[0], this._limitRange[1]);
      });
    } else if (this._currentHandler.name === 'overlay-left-handler') {
      const changePoints = points.filter(point => (point as unknown as any).left);
      changePoints.forEach(point => {
        point.x = clamp(point.x + delta, this._limitRange[0], this._limitRange[1]);
      });
    } else if (this._currentHandler.name === 'overlay-top-handler') {
      const changePoints = points.filter(point => (point as unknown as any).top);

      changePoints.forEach(point => {
        point.y = clamp(point.y + delta, this._limitRange[0], this._limitRange[1]);
      });
    } else if (this._currentHandler.name === 'overlay-bottom-handler') {
      const changePoints = points.filter(point => (point as unknown as any).bottom);
      changePoints.forEach(point => {
        point.y = clamp(point.y + delta, this._limitRange[0], this._limitRange[1]);
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
    this._currentHandler.setAttribute(
      updateField,
      clamp(
        this._currentHandler.attribute[updateField] + delta,
        this._limitRange[0] - handlerWidth / 2,
        this._limitRange[1] - handlerWidth / 2
      )
    );
  };

  private _onHandlerDragEnd = (e: any) => {
    e.preventDefault();

    vglobal.removeEventListener('pointermove', this._onHandlerDrag);
    vglobal.removeEventListener('pointerup', this._onHandlerDragEnd);

    const overlayArea = this._overlayArea;
    const points = overlayArea.attribute.points;
    this._overlayLabel.setAttributes({
      visible: false,
      pickable: false
    });
    this._activeAllMarkers();
    this._overlayAreaGroup.setAttributes({
      pickable: true,
      childrenPickable: true
    });

    if (PointService.distancePP(this._prePoint, { x: e.clientX, y: e.clientY }) <= 1) {
      return;
    }

    // 更新当前图形以及保存 spec
    this._save(points);

    this._areaLength =
      this._orient === 'vertical'
        ? Math.max(...overlayArea.attribute.points.map(point => point.x)) -
          Math.min(...overlayArea.attribute.points.map(point => point.x))
        : Math.max(...overlayArea.attribute.points.map(point => point.y)) -
          Math.min(...overlayArea.attribute.points.map(point => point.y));
  };

  private _onAreaDragStart = (e: any) => {
    e.stopPropagation();

    this._prePoint = {
      x: e.clientX,
      y: e.clientY
    };

    const model = this._chart.vchart.getChart().getComponentByUserId(this._modelId) as unknown as MarkArea;
    this._element = model.getVRenderComponents()[0] as unknown as MarkAreaComponent;
    this._model = model;

    this._prePos = this._orient === 'vertical' ? e.clientX : e.clientY;

    vglobal.addEventListener('pointermove', this._onAreaDrag);
    vglobal.addEventListener('pointerup', this._onAreaDragEnd);
  };

  private _onAreaDrag = (e: any) => {
    e.stopPropagation();
    this._chart.option.editorEvent.setCursor('move');

    this._controller.removeOverGraphic();
    this._silentAllMarkers();
    this._editComponent.showAll();
    this._editComponent.setAttributes({
      pickable: true,
      childrenPickable: true
    });
    const overlayArea = this._overlayArea;
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
    const [limitStart, limitEnd] = this._limitRange;

    // 更新 area
    const points = overlayArea.attribute.points;

    if (delta < 0) {
      if (points[0][updateField] - points[2][updateField] > 0) {
        points[2][updateField] = clamp(points[2][updateField] + delta, limitStart, limitEnd);
        points[3][updateField] = clamp(points[3][updateField] + delta, limitStart, limitEnd);

        points[0][updateField] = points[2][updateField] + this._areaLength;
        points[1][updateField] = points[2][updateField] + this._areaLength;
      } else {
        points[0][updateField] = clamp(points[0][updateField] + delta, limitStart, limitEnd);
        points[1][updateField] = clamp(points[1][updateField] + delta, limitStart, limitEnd);

        points[2][updateField] = points[0][updateField] + this._areaLength;
        points[3][updateField] = points[0][updateField] + this._areaLength;
      }
    } else {
      if (points[0][updateField] - points[2][updateField] > 0) {
        points[0][updateField] = clamp(points[0][updateField] + delta, limitStart, limitEnd);
        points[1][updateField] = clamp(points[1][updateField] + delta, limitStart, limitEnd);

        points[2][updateField] = points[0][updateField] - this._areaLength;
        points[3][updateField] = points[0][updateField] - this._areaLength;
      } else {
        points[2][updateField] = clamp(points[2][updateField] + delta, limitStart, limitEnd);
        points[3][updateField] = clamp(points[2][updateField] + delta, limitStart, limitEnd);

        points[0][updateField] = points[2][updateField] - this._areaLength;
        points[1][updateField] = points[2][updateField] - this._areaLength;
      }
    }

    overlayArea.setAttribute('points', points);

    // 更新当前 label, handler
    const overlayLabel = this._overlayLabel;
    if (this._orient === 'vertical') {
      overlayLabel.setAttribute(
        updateField,
        (overlayArea.AABBBounds.x1 + overlayArea.AABBBounds.x2) / 2 - overlayLabel.attribute.width / 2
      );
      this._rightHandler.setAttribute(
        updateField,
        overlayArea.attribute.points.find((point: any) => point.right)[updateField] - handlerWidth / 2
      );
      this._leftHandler.setAttribute(
        updateField,
        overlayArea.attribute.points.find((point: any) => point.left)[updateField] - handlerWidth / 2
      );
    } else {
      overlayLabel.setAttribute(
        updateField,
        (overlayArea.AABBBounds.y1 + overlayArea.AABBBounds.y2) / 2 - overlayLabel.attribute.height / 2
      );
      this._topHandler.setAttribute(
        updateField,
        overlayArea.attribute.points.find((point: any) => point.top)[updateField] - handlerWidth / 2
      );
      this._bottomHandler.setAttribute(
        updateField,
        overlayArea.attribute.points.find((point: any) => point.bottom)[updateField] - handlerWidth / 2
      );
    }
  };

  private _onAreaDragEnd = (e: any) => {
    e.preventDefault();
    vglobal.removeEventListener('pointermove', this._onAreaDrag);
    vglobal.removeEventListener('pointerup', this._onAreaDragEnd);
    this._chart.option.editorEvent.setCursorSyncToTriggerLayer();
    const overlayArea = this._overlayArea;
    const points = overlayArea.attribute.points;
    this._editComponent.setAttribute('pickable', false);
    this._overlayLabel.setAttributes({
      visible: false,
      pickable: false
    });
    this._activeAllMarkers();

    // if (PointService.distancePP(this._prePoint, { x: e.clientX, y: e.clientY }) <= 0) {
    //   return;
    // }

    // 更新当前图形以及保存 spec
    this._save(points);
  };

  private _save(newPoints: PointLike[]) {
    // 更新真正的图形
    this._element?.setAttributes({
      points: newPoints.map(point => {
        return {
          x: point.x,
          y: point.y
        };
      })
    });

    // 更新 spec
    const series = this._model.getRelativeSeries() as ICartesianSeries;
    const isPercent = series.getPercent();
    const { x: regionStartX, y: regionStartY } = series.getRegion().getLayoutStartPoint();
    const { width: regionWidth, height: regionHeight } = series.getRegion().getLayoutRect();

    let positionSpec;
    let labelText;
    if (this._orient === 'horizontal') {
      const bottomY = newPoints.find(point => point.bottom).y;
      const topY = newPoints.find(point => point.top).y;

      const start = series.positionToDataY(Math.max(bottomY, topY) - regionStartY);
      const end = series.positionToDataY(Math.min(bottomY, topY) - regionStartY);
      if (series.getYAxisHelper().isContinuous) {
        labelText = isPercent
          ? `${(start * 100).toFixed(0)}% - ${(end * 100).toFixed(0)}%`
          : `${start.toFixed(0)} - ${end.toFixed(0)}`;
      } else {
        labelText = start === end ? start : `${start} - ${end}`;
      }

      positionSpec = {
        y: `${((bottomY - regionStartY) / regionHeight) * 100}%`,
        y1: `${((topY - regionStartY) / regionHeight) * 100}%`,
        label: {
          text: labelText
        },
        _originValue_: [start, end]
      };
    } else {
      const leftX = newPoints.find(point => point.left).x;
      const rightX = newPoints.find(point => point.right).x;
      const start = series.positionToDataX(Math.min(leftX, rightX) - regionStartX);
      const end = series.positionToDataX(Math.max(leftX, rightX) - regionStartX);

      if (series.getXAxisHelper().isContinuous) {
        labelText = isPercent
          ? `${(start * 100).toFixed(0)}% - ${(end * 100).toFixed(0)}%`
          : `${start.toFixed(0)} - ${end.toFixed(0)}`;
      } else {
        labelText = start === end ? start : `${start} - ${end}`;
      }
      positionSpec = {
        x: `${((leftX - regionStartX) / regionWidth) * 100}%`,
        x1: `${((rightX - regionStartX) / regionWidth) * 100}%`,
        label: {
          text: labelText
        },
        _originValue_: [start, end]
      };
    }

    const newMarkAreaSpec = merge({}, this._model.getSpec(), positionSpec);

    this._updateAndSave(newMarkAreaSpec, 'markArea');
  }

  private _onHandlerHover(cursor: string) {
    this._chart.option.editorEvent.setCursor(cursor);
  }

  private _onHandlerUnHover = () => {
    this._chart.option.editorEvent.setCursorSyncToTriggerLayer();
  };
}
