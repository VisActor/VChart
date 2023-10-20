/**
 * @description 均值线
 * 1. 保存位置 & 更新 spec
 * 2. 双击出现编辑框
 */
import type { IGroup, INode } from '@visactor/vrender-core';
import { createRect, type IGraphic, createGroup, vglobal } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../core/interface';
import { BaseEditorElement, CommonChartEditorElement } from './base-editor-element';
import { merge } from '@visactor/vutils';
import type { MarkLine as MarkLineComponent } from '@visactor/vrender-components';
import { Segment } from '@visactor/vrender-components';
import type { EventParams, MarkLine, IComponent } from '@visactor/vchart';
import type { Point } from './types';
import { MarkerTypeEnum } from '../interface';
import type { ICartesianSeries } from '@visactor/vchart';

export class AvgMarkLineEditor extends BaseEditorElement {
  private _model: MarkLine;
  private _element: MarkLineComponent;
  private _orient: string;

  private _editComponent: IGroup;
  private _selected: boolean = false;
  private _prePos!: number;
  private _preOffset: number = 0;

  initWithVChart(): void {
    const vchart = this._chart.vchart;
    vchart.on('pointermove', { level: 'model', type: 'markLine', consume: true }, this._onHover);
    vchart.on('pointerdown', { level: 'model', type: 'markLine', consume: true }, this._onDragStart);
  }

  private _checkEventEnable(e: any) {
    const markerComponent = e.model.getVRenderComponents()[0];
    return (
      markerComponent?.name === MarkerTypeEnum.horizontalLine || markerComponent?.name === MarkerTypeEnum.verticalLine
    );
  }

  private _onHover = (e: any) => {
    if (!this._checkEventEnable(e)) {
      return;
    }
    const el = this._getEditorElement(e);
    this.showOverGraphic(el, el?.id + `${this._layer.id}`, e);
  };

  private _onDragStart = (e: any) => {
    if (!this._checkEventEnable(e)) {
      return;
    }
    this._element = e.model.getVRenderComponents()[0];
    this._model = e.model;
    this._orient = this._element.name === MarkerTypeEnum.verticalLine ? 'vertical' : 'horizontal';

    // Important: 拖拽过程中，关闭对应 markLine 的交互
    this._element.setAttributes({
      pickable: false,
      childrenPickable: false
    });

    this._selected = true;

    const el = this._getEditorElement(e);
    if (e) {
      this.startEditor(el, e);
    }

    this._prePos = this._orient === 'horizontal' ? e.event.clientY : e.event.clientX;
    this._editComponent.setAttributes({
      cursor: this._orient === 'horizontal' ? 'ns-resize' : 'ew-resize'
    });
    this._preOffset = this._editComponent.attribute[this._orient === 'horizontal' ? 'dy' : 'dx'] ?? 0;
    vglobal.addEventListener('pointermove', this._onDrag);
    vglobal.addEventListener('pointerup', this._onDragEnd);
  };

  private _onDrag = (e: any) => {
    e.stopPropagation();

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
    this._editComponent.setAttribute(updateField, this._preOffset + delta);
  };

  private _onDragEnd = (e: any) => {
    e.preventDefault();
    this._editComponent.hideAll();

    const offset = (this._editComponent.attribute[this._orient === 'horizontal' ? 'dy' : 'dx'] ?? 0) - this._preOffset;
    const points = this._element.attribute.points as Point[];
    const field = this._orient === 'horizontal' ? 'y' : 'x';
    const newPoints = points.map(point => {
      const newPoint = { ...point };
      newPoint[field] = point[field] + offset;
      return newPoint;
    });

    // 计算新的 label 值
    let newText;
    if (this._orient === 'horizontal') {
      const series = this._model.getRelativeSeries() as ICartesianSeries;
      const convertPosition = newPoints[0].y - series.getLayoutStartPoint().y;
      const isContinuousYAxis = series.getYAxisHelper().isContinuous;
      if (isContinuousYAxis) {
        newText = parseInt(series.positionToDataY(convertPosition), 10);
      } else {
        newText = series.positionToDataY(convertPosition);
      }
    } else {
      const series = this._model.getRelativeSeries();
      const convertPosition = newPoints[0].x - series.getLayoutStartPoint().x;
      const isContinuousXAxis = series.getXAxisHelper().isContinuous;
      if (isContinuousXAxis) {
        newText = parseInt(series.positionToDataX(convertPosition), 10);
      } else {
        newText = series.positionToDataX(convertPosition);
      }
    }

    // 更新 markLine
    // 1. 生成新的 markLine spec，用于存储
    // TODO: 如果是对应离散轴的话需要变成坐标，或者加上 dx/dy 属性
    const newSpec = merge({}, this._model.getSpec(), {
      label: {
        text: newText
      },
      positions: newPoints // TODO：需要支持相对 region 区域内的坐标
    });
    delete newSpec.x;
    delete newSpec.y;
    delete newSpec.coordinates;

    // 2. 计算新的 label 值，同时释放事件
    this._element.setAttributes({
      points: newPoints as Point[],
      label: {
        text: newText
      },
      pickable: true,
      childrenPickable: true
    });
    vglobal.removeEventListener('pointermove', this._onDrag);
    vglobal.removeEventListener('pointerup', this._onDragEnd);

    this._currentEl.updateAttribute({
      markLine: {
        spec: newSpec
      }
    });
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

  protected _getEditorElement(eventParams: EventParams): IEditorElement {
    const model = eventParams.model;
    const element: IEditorElement = new CommonChartEditorElement(this, {
      model,
      id: this._chart.vchart.id + '-markLine-' + model.id + (this._selected ? '-selected' : '')
    });
    return element;
  }

  protected startEditor(el: IEditorElement, e?: PointerEvent): boolean {
    if (!super.startEditor(el, e)) {
      return false;
    }
    this._createEditorGraphic(el, e);
    return true;
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

  releaseLast() {
    super.releaseLast();
    if (this._editComponent) {
      this._layer.editorGroup.removeChild(this._editComponent as unknown as IGraphic);
      this._editComponent = null;
    }
  }

  release(): void {
    const vchart = this._chart.vchart;

    vchart.off('pointermove', this._onHover);
    vchart.off('pointerdown', this._onDragStart);
    super.release();
  }
}
