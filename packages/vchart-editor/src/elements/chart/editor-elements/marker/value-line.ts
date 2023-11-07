/**
 * @description 均值线
 * 2. 双击出现编辑框
 */
import type { INode } from '@visactor/vrender-core';
import { createRect, type IGraphic, createGroup, vglobal } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../../core/interface';
import { clamp, merge } from '@visactor/vutils';
import type { MarkLine as MarkLineComponent } from '@visactor/vrender-components';
import { Segment } from '@visactor/vrender-components';
import type { EventParams, MarkLine, IComponent } from '@visactor/vchart';
import type { Point } from '../types';
import { MarkerTypeEnum } from '../../interface';
import type { ICartesianSeries } from '@visactor/vchart';
import { BaseMarkerEditor } from './base';

export class ValueLineEditor extends BaseMarkerEditor<MarkLine, MarkLineComponent> {
  readonly type = 'markLine';

  private _orient: string;
  private _prePos!: number;
  private _preOffset: number = 0;
  private _limitRange: [number, number];

  protected _getEnableMarkerTypes(): string[] {
    return [MarkerTypeEnum.horizontalLine, MarkerTypeEnum.verticalLine];
  }

  protected _handlePointerDown(e: EventParams): void {
    this._orient = this._element.name === MarkerTypeEnum.verticalLine ? 'vertical' : 'horizontal';
    const el = this._getEditorElement(e);
    this.startEditor(el, e.event as PointerEvent);

    const isHorizontal = this._orient === 'horizontal';

    const region = this._model.getRelativeSeries().getRegion();
    const { x: regionStartX, y: regionStartY } = region.getLayoutStartPoint();
    const { width: regionWidth, height: regionHeight } = region.getLayoutRect();
    if (isHorizontal) {
      const currentY = (this._element.attribute.points[0] as Point).y;
      this._limitRange = [regionStartY - currentY, regionStartY + regionHeight - currentY];
      this._prePos = e.event.clientY;
      this._editComponent.setAttributes({
        cursor: 'ns-resize'
      });
      this._preOffset = this._editComponent.attribute.dy ?? 0;
    } else {
      const currentX = (this._element.attribute.points[0] as Point).x;
      this._limitRange = [regionStartX - currentX, regionStartX + regionWidth - currentX];
      this._prePos = e.event.clientX;
      this._editComponent.setAttributes({
        cursor: 'ew-resize'
      });
      this._preOffset = this._editComponent.attribute.dx ?? 0;
    }

    vglobal.addEventListener('pointermove', this._onDrag);
    vglobal.addEventListener('pointerup', this._onDragEnd);
  }

  private _onDrag = (e: any) => {
    e.stopPropagation();

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
    this._editComponent.hideAll();
    this._activeAllMarkers();

    const offset = (this._editComponent.attribute[this._orient === 'horizontal' ? 'dy' : 'dx'] ?? 0) - this._preOffset;
    const points = this._element.attribute.points as Point[];
    const field = this._orient === 'horizontal' ? 'y' : 'x';
    const newPoints = points.map(point => {
      const newPoint = { ...point };
      newPoint[field] = point[field] + offset;
      return newPoint;
    });
    const series = this._model.getRelativeSeries() as ICartesianSeries;
    // 计算新的 label 值
    let newText;
    let fieldValue;
    if (this._orient === 'horizontal') {
      const convertPosition = newPoints[0].y - series.getRegion().getLayoutStartPoint().y;
      const isContinuousYAxis = series.getYAxisHelper().isContinuous;
      if (isContinuousYAxis) {
        newText = parseInt(series.positionToDataY(convertPosition), 10);
      } else {
        newText = series.positionToDataY(convertPosition);
      }
      fieldValue = `${(convertPosition / series.getRegion().getLayoutRect().height) * 100}%`;
    } else {
      const convertPosition = newPoints[0].x - series.getRegion().getLayoutStartPoint().x;
      const isContinuousXAxis = series.getXAxisHelper().isContinuous;
      if (isContinuousXAxis) {
        newText = parseInt(series.positionToDataX(convertPosition), 10);
      } else {
        newText = series.positionToDataX(convertPosition);
      }

      fieldValue = `${(convertPosition / series.getRegion().getLayoutRect().width) * 100}%`;
    }
    // 更新 markLine
    // 1. 生成新的 markLine spec，用于存储
    const newSpec = merge({}, this._model.getSpec(), {
      label: {
        text: newText,
        formatMethod: null
      },
      [field]: fieldValue
    });

    // 2. 计算新的 label 值，同时释放事件
    this._element.setAttributes({
      points: newPoints as Point[],
      label: {
        text: newText
      }
    });
    vglobal.removeEventListener('pointermove', this._onDrag);
    vglobal.removeEventListener('pointerup', this._onDragEnd);

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
