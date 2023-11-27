/**
 * @description 均值线
 * 2. 双击出现编辑框
 */
import type { INode } from '@visactor/vrender-core';
import { createRect, type IGraphic, createGroup, vglobal } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../../core/interface';
import { PointService, clamp, merge } from '@visactor/vutils';
import type { MarkLine as MarkLineComponent } from '@visactor/vrender-components';
import { Segment } from '@visactor/vrender-components';
import type { EventParams, MarkLine, IComponent } from '@visactor/vchart';
import type { Point } from '../types';
import { MarkerTypeEnum } from '../../interface';
import { BaseMarkerEditor } from './base';

export class ValueLineEditor extends BaseMarkerEditor<MarkLine, MarkLineComponent> {
  readonly type = 'markLine';

  private _orient: string;
  private _prePos!: number;
  private _prePoint: Point;
  private _preOffset: number = 0;
  private _limitRange: [number, number];

  protected _getEnableMarkerTypes(): string[] {
    return [MarkerTypeEnum.horizontalLine, MarkerTypeEnum.verticalLine];
  }

  protected _setCursor(e: EventParams): void {
    const orient = this._element.name === MarkerTypeEnum.verticalLine ? 'vertical' : 'horizontal';
    this._chart.option.editorEvent.setCursor(orient === 'horizontal' ? 'ns-resize' : 'ew-resize');
  }

  protected _handlePointerDown(e: EventParams): void {
    this._prePoint = {
      x: e.event.clientX,
      y: e.event.clientY
    };
    this._orient = this._element.name === MarkerTypeEnum.verticalLine ? 'vertical' : 'horizontal';
    const el = this._getEditorElement(e);
    this.startEditor(el, e.event as PointerEvent);
    this._controller.editorRun('layout');

    const isHorizontal = this._orient === 'horizontal';

    const series = this._getSeries();
    const region = series.getRegion();
    const { x: regionStartX, y: regionStartY } = region.getLayoutStartPoint();
    const { width: regionWidth, height: regionHeight } = region.getLayoutRect();
    if (isHorizontal) {
      const currentY = (this._element.attribute.points[0] as Point).y;
      this._limitRange = [regionStartY - currentY, regionStartY + regionHeight - currentY];
      this._prePos = e.event.clientY;
      this._preOffset = this._editComponent.attribute.dy ?? 0;
    } else {
      const currentX = (this._element.attribute.points[0] as Point).x;
      this._limitRange = [regionStartX - currentX, regionStartX + regionWidth - currentX];
      this._prePos = e.event.clientX;
      this._preOffset = this._editComponent.attribute.dx ?? 0;
    }

    vglobal.addEventListener('pointermove', this._onDrag);
    vglobal.addEventListener('pointerup', this._onDragEnd);
  }

  private _onDrag = (e: any) => {
    e.stopPropagation();
    this._setCursor(e);
    this._silentAllMarkers();
    this._editComponent.showAll();
    let currentPos;
    let delta = 0;
    let updateField;
    if (this._orient === 'horizontal') {
      currentPos = e.clientY;
      delta = currentPos - this._prePos;
      updateField = 'dy';
    } else {
      currentPos = e.clientX;
      delta = currentPos - this._prePos;
      updateField = 'dx';
    }
    this._editComponent.setAttribute(
      updateField,
      this._preOffset + clamp(delta, this._limitRange[0], this._limitRange[1])
    );
  };

  private _onDragEnd = (e: any) => {
    e.preventDefault();

    vglobal.removeEventListener('pointermove', this._onDrag);
    vglobal.removeEventListener('pointerup', this._onDragEnd);
    this._activeAllMarkers();

    // 恢复 cursor
    this._chart.option.editorEvent.setCursorSyncToTriggerLayer();
    this._editComponent?.hideAll();

    if (PointService.distancePP(this._prePoint, { x: e.clientX, y: e.clientY }) <= 1) {
      this._controller.editorEnd();
      return;
    }

    const offset = (this._editComponent.attribute[this._orient === 'horizontal' ? 'dy' : 'dx'] ?? 0) - this._preOffset;
    const points = this._element.attribute.points as Point[];
    const field = this._orient === 'horizontal' ? 'y' : 'x';
    const newPoints = points.map(point => {
      const newPoint = { ...point };
      newPoint[field] = point[field] + offset;
      return newPoint;
    });
    const series = this._getSeries();
    const isPercent = series.getPercent();
    // 计算新的 label 值
    let newText;
    let fieldValue;
    let originValue;
    if (this._orient === 'horizontal') {
      const convertPosition = newPoints[0].y - series.getRegion().getLayoutStartPoint().y;
      const isContinuousYAxis = series.getYAxisHelper().isContinuous;
      originValue = series.positionToDataY(convertPosition);

      if (isContinuousYAxis) {
        newText = isPercent ? `${(originValue * 100).toFixed(0)}%` : parseInt(originValue, 10);
      } else {
        newText = originValue;
      }
      fieldValue = `${(convertPosition / series.getRegion().getLayoutRect().height) * 100}%`;
    } else {
      const convertPosition = newPoints[0].x - series.getRegion().getLayoutStartPoint().x;
      const isContinuousXAxis = series.getXAxisHelper().isContinuous;
      originValue = series.positionToDataX(convertPosition);
      if (isContinuousXAxis) {
        newText = isPercent ? `${(originValue * 100).toFixed(0)}%` : parseInt(originValue, 10);
      } else {
        newText = originValue;
      }

      fieldValue = `${(convertPosition / series.getRegion().getLayoutRect().width) * 100}%`;
    }
    // 更新 markLine
    // 生成新的 markLine spec，用于存储
    const newSpec = merge({}, this._model.getSpec(), {
      label: {
        text: newText,
        formatMethod: null
      },
      [field]: fieldValue,
      _originValue_: originValue // 用于保存当前对应的原始数据
    });

    // 更新
    this._updateAndSave(newSpec, 'markLine');
  };

  protected _getOverGraphic(el: IEditorElement): IGraphic {
    const model = el.model;
    const markLine = (model as unknown as IComponent).getVRenderComponents()[0];
    const lineShape = (markLine as unknown as MarkLineComponent).getLine();
    const overlayLine = new Segment(
      merge({}, lineShape.attribute, {
        lineStyle: {
          stroke: '#3073F2'
        },
        startSymbol: {
          style: {
            fill: '#3073F2'
          }
        },
        endSymbol: {
          style: {
            fill: '#3073F2'
          }
        },
        pickable: false,
        childrenPickable: false,
        dx: model.getSpec().offsetX ?? 0,
        dy: model.getSpec().offsetY ?? 0
      })
    );
    overlayLine.name = 'overlay-mark-line-line';

    return overlayLine as unknown as IGraphic;
  }

  protected _createEditorGraphic(el: IEditorElement, e: any): IGraphic {
    if (this._editComponent) {
      return this._editComponent;
    }
    const model = el.model;
    const markLine = (model as unknown as IComponent).getVRenderComponents()[0];
    const lineShape = (markLine as unknown as MarkLineComponent).getLine();
    const labelShape = (markLine as unknown as MarkLineComponent).getLabel();

    const overlayGraphic = createGroup({
      pickable: false,
      childrenPickable: false
    });

    const overlayLine = new Segment(
      merge({}, lineShape.attribute, {
        lineStyle: {
          stroke: '#3073F2'
        },
        startSymbol: {
          style: {
            fill: '#3073F2'
          }
        },
        endSymbol: {
          style: {
            fill: '#3073F2'
          }
        }
      })
    );
    overlayLine.name = 'overlay-mark-line-line';
    overlayGraphic.add(overlayLine as unknown as INode);

    const overlayLabel = createRect({
      x: labelShape.AABBBounds.x1 + (this._orient === 'horizontal' ? 2 : 0),
      y: labelShape.AABBBounds.y1 + (this._orient === 'horizontal' ? 0 : -2),
      width: labelShape.AABBBounds.width(),
      height: labelShape.AABBBounds.height(),
      fill: '#3073F2',
      fillOpacity: 0.3,
      visible: false
    });
    overlayLabel.name = 'overlay-mark-line-label';
    overlayGraphic.add(overlayLabel);

    this._layer.editorGroup.add(overlayGraphic as unknown as IGraphic);
    this._editComponent = overlayGraphic;

    return this._editComponent as unknown as IGraphic;
  }
}
