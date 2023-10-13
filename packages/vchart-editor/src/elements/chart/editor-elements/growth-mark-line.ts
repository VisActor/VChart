/**
 * @description 复合增长标注标记交互
 * 1. 保存位置 & 更新 spec，直接更新 spec
 * 2. 双击出现编辑框
 */
import type { IGroup, ILine } from '@visactor/vrender-core';
import { type IGraphic, createGroup, vglobal, createLine, createSymbol } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../core/interface';
import { BaseEditorElement, CommonChartEditorElement } from './base-editor-element';
import { IPointLike, array, has, merge } from '@visactor/vutils';
import type { MarkLine as MarkLineComponent } from '@visactor/vrender-components';
import { Segment } from '@visactor/vrender-components';
import type { EventParams, MarkLine, ISeries, ICartesianSeries, IComponent } from '@visactor/vchart';
import { STACK_FIELD_TOTAL_TOP } from '@visactor/vchart';
import type { Point } from '@visactor/vrender-components/es/core/type';
import { findClosestPoint } from '../utils/math';

type DataPoint = {
  x: number;
  y: number;
  data: any[];
};

const START_LINK_HANDLER = 'overlay-growth-mark-line-start-handler';
const END_LINK_HANDLER = 'overlay-growth-mark-line-end-handler';

export class GrowthMarkLineEditor extends BaseEditorElement {
  private _model: MarkLine;
  private _element: MarkLineComponent;

  private _editComponent: IGroup;
  private _overlayLine: ILine;
  private _overlayStartHandler: Segment;
  private _overlayEndHandler: Segment;
  private _currentHandler: Segment;
  private _fixedHandler: Segment;
  private _dataAnchors: IGroup;

  private _selected: boolean = false;

  private _dataPoints: DataPoint[];

  initWithVChart(): void {
    const vchart = this._chart.vchart;
    vchart.on('pointermove', { level: 'model', type: 'markLine', consume: true }, this._onHover);
    vchart.on('pointerdown', { level: 'model', type: 'markLine', consume: true }, this._onDown);
  }

  private _checkEventEnable(e) {
    const markerComponent = e.model.getVRenderComponents()[0];
    return markerComponent?.name === 'growthMarkLine';
  }

  private _onHover = (e: any) => {
    if (!this._checkEventEnable(e)) {
      return;
    }
    const el = this._getEditorElement(e);
    this.showOverGraphic(el, el?.id + `${this._layer.id}`, e);
  };

  private _onDown = (e: any) => {
    if (!this._checkEventEnable(e)) {
      return;
    }
    this._element = e.model.getVRenderComponents()[0] as MarkLineComponent;
    this._model = e.model;
    this._selected = true;

    const el = this._getEditorElement(e);
    if (e) {
      this.startEditor(el, e);
    }
  };

  protected _getOverGraphic(el: IEditorElement): IGraphic {
    const model = el.model;
    const markLine = (model as IComponent).getVRenderComponents()[0];
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
    overlayLine.name = 'overlay-growth-mark-line-line';

    return overlayLine as unknown as IGraphic;
  }

  protected _getEditorElement(eventParams: EventParams): IEditorElement {
    const model = eventParams.model;
    const element: IEditorElement = new CommonChartEditorElement(this, {
      model,
      id: this._chart.vchart.id + '-growth-markLine-' + model.id + (this._selected ? '-selected' : '')
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
    const dataPoints = this._getAllDataPoints();
    const lineShape = this._element.getLine();

    const editComponent = createGroup({
      pickable: false
    });
    editComponent.name = 'overlay-growth-mark-line';
    const overlayLine = createLine({
      points: lineShape.attribute.points as IPointLike[],
      lineDash: [0],
      lineWidth: 3,
      stroke: '#3073F2',
      dx: model.getSpec().offsetX ?? 0,
      dy: model.getSpec().offsetY ?? 0,
      pickable: false
    });
    overlayLine.name = 'overlay-growth-mark-line-line';
    this._overlayLine = overlayLine;
    editComponent.add(overlayLine);

    const relativeDataPoints = (lineShape.attribute.points as Point[]).map(point => {
      return dataPoints.find((dataPoint: DataPoint) => dataPoint.x === point.x && dataPoint.y === point.y);
    });

    const startLinkLine = new Segment({
      points: [
        relativeDataPoints[0],
        {
          x: relativeDataPoints[0].x + (model.getSpec().offsetX ?? 0),
          y: relativeDataPoints[0].y + (model.getSpec().offsetY ?? 0)
        }
      ],
      startSymbol: {
        visible: true,
        symbolType: 'circle',
        size: 10,
        style: {
          fill: '#fff',
          stroke: '#3073F2',
          lineWidth: 1,
          shadowBlur: 4,
          shadowOffsetX: 0,
          shadowOffsetY: 4,
          shadowColor: 'rgba(0, 0, 0, 0.25)'
        }
      },
      endSymbol: { visible: false },
      lineStyle: {
        stroke: '#89909D',
        lineWidth: 1
      },
      childrenPickable: false
    });
    startLinkLine.name = START_LINK_HANDLER;
    this._overlayStartHandler = startLinkLine;
    editComponent.add(startLinkLine as unknown as IGraphic);

    const endLinkLine = new Segment({
      points: [
        relativeDataPoints[1],
        {
          x: relativeDataPoints[1].x + (model.getSpec().offsetX ?? 0),
          y: relativeDataPoints[1].y + (model.getSpec().offsetY ?? 0)
        }
      ],
      startSymbol: {
        visible: true,
        symbolType: 'circle',
        size: 10,
        style: {
          fill: '#fff',
          stroke: '#3073F2',
          lineWidth: 1,
          shadowBlur: 4,
          shadowOffsetX: 0,
          shadowOffsetY: 4,
          shadowColor: 'rgba(0, 0, 0, 0.25)'
        }
      },
      endSymbol: { visible: false },
      lineStyle: {
        stroke: '#89909D',
        lineWidth: 1
      },
      childrenPickable: false
    });
    endLinkLine.name = END_LINK_HANDLER;
    this._overlayEndHandler = endLinkLine;
    editComponent.add(endLinkLine as unknown as IGraphic);

    this._layer.editorGroup.add(editComponent as unknown as IGraphic);
    this._editComponent = editComponent;

    startLinkLine.addEventListener('pointerdown', this._onHandlerDragStart as EventListenerOrEventListenerObject);
    endLinkLine.addEventListener('pointerdown', this._onHandlerDragStart as EventListenerOrEventListenerObject);

    const dataAnchors = createGroup({
      pickable: false,
      childrenPickable: false
    });
    this._getAllDataPoints().forEach((point: DataPoint) => {
      const anchor = createSymbol({
        ...point,
        symbolType: 'circle',
        size: 10,
        fill: '#fff',
        stroke: '#FFC528',
        lineWidth: 1,
        shadowBlur: 4,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        visible: false
      });
      anchor.data = point.data;
      dataAnchors.add(anchor);
    });
    editComponent.add(dataAnchors as unknown as IGraphic);
    this._dataAnchors = dataAnchors;

    return this._editComponent as unknown as IGraphic;
  }

  // 交互描述：拖拽过程中，根据当前的鼠标垫查找最近的数据点，然后更新图形位置
  private _onHandlerDragStart = (e: any) => {
    e.stopPropagation();
    const handler = e.target;
    this._currentHandler = handler as unknown as Segment;
    this._fixedHandler = handler.name === START_LINK_HANDLER ? this._overlayEndHandler : this._overlayStartHandler;

    vglobal.addEventListener('pointermove', this._onHandlerDrag);
    vglobal.addEventListener('pointerup', this._onHandlerDragEnd);
  };

  private _onHandlerDrag = (e: any) => {
    e.stopPropagation();

    // Important: 拖拽过程中，关闭对应 markLine 的交互
    this._element.setAttributes({
      pickable: false,
      childrenPickable: false
    });

    // 展示可吸附的数据锚点
    // 对于数据锚点，不允许拖拽至另一个固定的锚点
    const enableDataPoints: any[] = [];
    const unenableDataPoint = this._fixedHandler.attribute.points[0] as Point;
    this._dataAnchors.getChildren().forEach((child: any) => {
      if (child.attribute.x === unenableDataPoint.x && child.attribute.y === unenableDataPoint.y) {
        child.setAttribute('visible', false);
        // @ts-ignore
        this._fixedHandler.data = child.data;
      } else {
        enableDataPoints.push({
          x: child.attribute.x,
          y: child.attribute.y,
          data: child.data
        });
        child.setAttribute('visible', true);
      }
    });

    // 转换为画布坐标
    const stage = this._chart.vchart.getStage();

    const currentPoint = stage.global.mapToCanvasPoint(e);
    const closestPoint = findClosestPoint(currentPoint, enableDataPoints);

    this._currentHandler.setAttributes({
      points: [
        closestPoint,
        {
          x: closestPoint.x + (this._model.getSpec().offsetX ?? 0),
          y: closestPoint.y + (this._model.getSpec().offsetY ?? 0)
        }
      ]
    });
    // @ts-ignore
    this._currentHandler.data = closestPoint.data;

    this._overlayLine.setAttributes({
      points: [
        closestPoint,
        {
          x: (this._fixedHandler.attribute.points[0] as Point).x,
          y: (this._fixedHandler.attribute.points[0] as Point).y
        }
      ]
    });
  };

  private _onHandlerDragEnd = (e: any) => {
    e.preventDefault();

    // 隐藏可吸附数据锚点
    this._dataAnchors?.hideAll();
    // 更新 markLine
    const model = this._model as MarkLine;
    const series = model.getRelativeSeries() as ICartesianSeries;
    const valueField = series.direction === 'horizontal' ? series.fieldX[0] : series.fieldY[0];
    const valueFieldInData = series.direction === 'horizontal' ? series.getSpec().xField : series.getSpec().yField;
    const startDatum = (this._overlayStartHandler as unknown as any).data;
    const endDatum = (this._overlayEndHandler as unknown as any).data;
    const labelText = `${(((endDatum[valueField] - startDatum[valueField]) / startDatum[valueField]) * 100).toFixed(
      0
    )}%`;
    // 1. 生成新的 markLine spec，用于存储
    const newMarkLineSpec = merge({}, model.getSpec(), {
      coordinates: [
        {
          ...startDatum,
          [valueFieldInData]: startDatum[valueField]
        },
        {
          ...endDatum,
          [valueFieldInData]: endDatum[valueField]
        }
      ],
      label: {
        text: labelText
      }
    });

    // 2. 更新当前 markLine 组件
    // Important: 拖拽结束，恢复 markLine 的交互
    this._element.setAttributes({
      pickable: true,
      childrenPickable: true,
      // @ts-ignore
      points: [this._overlayStartHandler.attribute.points[0], this._overlayEndHandler.attribute.points[0]],
      label: {
        text: labelText
      }
    });

    vglobal.removeEventListener('pointermove', this._onHandlerDrag);
    vglobal.removeEventListener('pointerup', this._onHandlerDragEnd);
  };

  releaseLast() {
    super.releaseLast();
    if (this._editComponent) {
      this._layer.editorGroup.removeChild(this._editComponent as unknown as IGraphic);
      this._editComponent = null;
    }
    this._dataPoints = null;
  }

  release(): void {
    const vchart = this._chart.vchart;

    vchart.off('pointermove', this._onHover);
    vchart.off('pointerdown', this._onDown);
    super.release();
  }

  private _getAllDataPoints() {
    if (this._dataPoints) {
      return this._dataPoints;
    }
    const model = this._model as MarkLine;
    const series = model.getRelativeSeries() as ISeries;
    const region = series.getRegion();
    const { x: regionStartX, y: regionStartY } = region.getLayoutStartPoint();
    // TODO: 需要根据不同的系列名称获取不同的图形节点
    const rectMark = series.getMarks().find((mark: any) => mark.type === 'rect');
    const vgrammarElements = rectMark.getProduct().elements;
    const dataPoints = vgrammarElements
      .filter((element: any) => {
        const data = array(element.data)[0];
        return has(data, STACK_FIELD_TOTAL_TOP) ? data[STACK_FIELD_TOTAL_TOP] : true;
      })
      .map((element: any) => {
        const graphItem = element.getGraphicItem();
        return {
          x:
            (series.direction === 'horizontal'
              ? graphItem.attribute.x + graphItem.attribute.width
              : graphItem.attribute.x + graphItem.attribute.width / 2) + regionStartX,
          y:
            (series.direction === 'horizontal'
              ? graphItem.attribute.y + graphItem.attribute.height / 2
              : graphItem.attribute.y) + regionStartY,
          data: array(element.data)[0]
        };
      });

    this._dataPoints = dataPoints;
    return dataPoints;
  }
}
