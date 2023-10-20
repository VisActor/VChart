import type { BandScale } from '@visactor/vscale';
import type { IPoint } from './../../../typings/space';
/**
 * @description 层级差异标注交互
 * 1. 保存位置 & 更新 spec，直接更新 spec
 * 2. 双击出现编辑框
 */
import type { IGroup, ILine } from '@visactor/vrender-core';
import { type IGraphic, createGroup, vglobal, createLine, createSymbol } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../core/interface';
import { BaseEditorElement, CommonChartEditorElement } from './base-editor-element';
import { array, merge } from '@visactor/vutils';
import type { MarkLine as MarkLineComponent } from '@visactor/vrender-components';
import { Segment } from '@visactor/vrender-components';
import type { EventParams, MarkLine, IComponent, ICartesianSeries } from '@visactor/vchart';
import { STACK_FIELD_START } from '@visactor/vchart';
import { findClosestPoint } from '../utils/math';
import type { DataPoint, Point } from './types';
import { MarkerTypeEnum } from '../interface';

const START_LINK_HANDLER = 'overlay-hier-diff-mark-line-start-handler';
const MIDDLE_LINK_HANDLER = 'overlay-hier-diff-mark-line-middle-handler';
const END_LINK_HANDLER = 'overlay-hier-diff-mark-line-end-handler';

export class HierarchicalDiffMarkLineEditor extends BaseEditorElement {
  private _model: MarkLine;
  private _element: MarkLineComponent;

  private _editComponent: IGroup;
  private _overlayLine: ILine;
  private _overlayStartHandler: IGraphic;
  private _overlayEndHandler: IGraphic;
  private _currentAnchorHandler: IGraphic;
  private _fixedAnchorHandler: IGraphic;
  private _overlayMiddleHandler: ILine;

  private _selected: boolean = false;

  private _dataAnchors: IGroup;
  private _splitPoints: any[];
  private _splitAnchors: IGroup;
  private _spec: any;

  initWithVChart(): void {
    const vchart = this._chart.vchart;
    vchart.on('pointermove', { level: 'model', type: 'markLine', consume: true }, this._onHover);
    vchart.on('pointerdown', { level: 'model', type: 'markLine', consume: true }, this._onDown);
  }

  private _checkEventEnable(e) {
    const markerComponent = e.model.getVRenderComponents()[0];
    return markerComponent?.name === MarkerTypeEnum.hierarchyDiffLine;
  }

  private _onHover = (e: EventParams) => {
    if (!this._checkEventEnable(e)) {
      return;
    }
    const el = this._getEditorElement(e);
    this.showOverGraphic(el, el?.id + `${this._layer.id}`, e.event as PointerEvent);
  };

  private _onDown = (e: EventParams) => {
    if (!this._checkEventEnable(e)) {
      return;
    }
    this._element = (<MarkLine>e.model).getVRenderComponents()[0] as unknown as MarkLineComponent;
    this._model = <MarkLine>e.model;
    this._selected = true;
    this._spec = this._model.getSpec();

    const el = this._getEditorElement(e);
    if (e) {
      this.startEditor(el, e.event as PointerEvent);
    }
  };

  protected _getOverGraphic(el: IEditorElement): IGraphic {
    const model = el.model;
    const markLine = (model as IComponent).getVRenderComponents()[0];
    const lineShape = (markLine as unknown as MarkLineComponent).getLine();
    const overlayLine = new Segment(
      merge({}, lineShape.attribute, {
        lineStyle: [
          {
            lineDash: [0],
            stroke: '#3073F2',
            lineWidth: 2
          },
          {
            stroke: '#3073F2',
            lineWidth: 2
          },
          {
            lineDash: [0],
            stroke: '#3073F2',
            lineWidth: 2
          }
        ],
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
        dx: markLine.attribute.dx ?? 0,
        dy: markLine.attribute.dy ?? 0
      })
    );
    overlayLine.name = 'overlay-hierarchical-mark-line-line';

    return overlayLine as unknown as IGraphic;
  }

  protected _getEditorElement(eventParams: EventParams): IEditorElement {
    const model = eventParams.model;
    const element: IEditorElement = new CommonChartEditorElement(this, {
      model,
      id: this._chart.vchart.id + '-hierarchical-mark-line-' + model.id + (this._selected ? '-selected' : '')
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
    const editComponent = createGroup({
      pickable: false
    });
    const model = el.model;
    const markLine = (model as IComponent).getVRenderComponents()[0];
    const lineShape = markLine.getLine();
    const points = lineShape.attribute.points;
    const startHandler = createSymbol({
      ...points[0][0],
      symbolType: 'circle',
      size: 10,
      // fill: '#fff',
      stroke: '#3073F2',
      fill: 'red',
      lineWidth: 1,
      shadowBlur: 4,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      zIndex: 2
    });
    startHandler.name = START_LINK_HANDLER;
    this._overlayStartHandler = startHandler;
    editComponent.add(startHandler);

    const endHandler = createSymbol({
      ...points[points.length - 1][1],
      symbolType: 'circle',
      size: 10,
      // fill: '#fff',
      stroke: '#3073F2',
      fill: 'blue',
      lineWidth: 1,
      shadowBlur: 4,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      zIndex: 2
    });
    endHandler.name = END_LINK_HANDLER;
    this._overlayEndHandler = endHandler;
    editComponent.add(endHandler);

    const middleHandler = createLine({
      points: points[1],
      zIndex: 2,
      lineDash: [0],
      lineWidth: 2,
      stroke: '#3073F2'
    });
    middleHandler.name = MIDDLE_LINK_HANDLER;
    this._overlayMiddleHandler = middleHandler;
    editComponent.add(middleHandler);

    const overlayLine = createLine({
      points: [...points[0], ...points[points.length - 1]],
      zIndex: 0,
      lineDash: [0],
      lineWidth: 2,
      stroke: '#3073F2',
      pickable: false
    });
    this._overlayLine = overlayLine;
    editComponent.add(overlayLine);

    this._layer.editorGroup.add(editComponent as unknown as IGraphic);
    this._editComponent = editComponent;

    // 绑定事件
    this._overlayStartHandler.addEventListener('pointerdown', this._onAnchorHandlerDragStart);
    this._overlayEndHandler.addEventListener('pointerdown', this._onAnchorHandlerDragStart);
    this._overlayMiddleHandler.addEventListener('pointerdown', this._onMiddleHandlerDragStart);

    return this._editComponent;
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
    vchart.off('pointerdown', this._onDown);
    super.release();
  }

  private _onAnchorHandlerDragStart = (e: PointerEvent) => {
    e.stopPropagation();

    const handler = e.target as IGraphic;
    this._currentAnchorHandler = handler;
    this._fixedAnchorHandler =
      handler.name === START_LINK_HANDLER ? this._overlayEndHandler : this._overlayStartHandler;

    vglobal.addEventListener('pointermove', this._onAnchorHandlerDrag);
    vglobal.addEventListener('pointerup', this._onAnchorHandlerDragEnd);
  };

  private _onAnchorHandlerDrag = (e: PointerEvent) => {
    e.stopPropagation();

    // Important: 拖拽过程中，关闭对应 markLine 的交互
    this._element.setAttributes({
      pickable: false,
      childrenPickable: false
    });

    const dataAnchors = this._getDataAnchors();
    // 展示可吸附的数据锚点
    // 对于数据锚点，不允许拖拽至另一个固定的锚点
    const enableDataPoints: any[] = [];
    const unenableDataPoint = {
      x: this._fixedAnchorHandler.attribute.x,
      y: this._fixedAnchorHandler.attribute.y
    };
    dataAnchors.showAll();
    dataAnchors.getChildren().forEach((child: any) => {
      if (child.attribute.x === unenableDataPoint.x && child.attribute.y === unenableDataPoint.y) {
        child.setAttribute('visible', false);
        this._fixedAnchorHandler.data = child.data;
      } else {
        enableDataPoints.push(child.data);
        child.setAttribute('visible', true);
      }
    });

    // 寻找最近的数据锚点，更新编辑图形
    // 转换为画布坐标
    const stage = this._chart.vchart.getStage();
    // TODO: 修改为公共属性
    // @ts-ignore
    const currentPoint = stage.global.mapToCanvasPoint(e);
    const closestPoint = findClosestPoint(currentPoint, enableDataPoints) as DataPoint;

    // 1. 更新 _currentAnchorHandler
    this._currentAnchorHandler.setAttributes({
      x: closestPoint.x,
      y: closestPoint.y
    });
    this._currentAnchorHandler.data = closestPoint;

    // 2. 更新 _overlayMiddleHandler
    // series.direction === 'vertical' 下保持 x 刻度不变，除非 _overlayMiddleHandler 自己被拖拽
    // series.direction === 'horizontal' 下保持 y 刻度不变，除非 _overlayMiddleHandler 自己被拖拽
    const series = this._model.getRelativeSeries();
    const newOverlayMiddleHandlerPoints =
      series.direction === 'vertical'
        ? [
            {
              ...this._overlayMiddleHandler.attribute.points[0],
              y: this._overlayStartHandler.attribute.y
            },
            {
              ...this._overlayMiddleHandler.attribute.points[1],
              y: this._overlayEndHandler.attribute.y
            }
          ]
        : [
            {
              ...this._overlayMiddleHandler.attribute.points[0],
              x: this._overlayStartHandler.attribute.x
            },
            {
              ...this._overlayMiddleHandler.attribute.points[1],
              x: this._overlayEndHandler.attribute.x
            }
          ];
    this._overlayMiddleHandler.setAttribute('points', newOverlayMiddleHandlerPoints);

    // 3. 更新 _overlayLine
    this._overlayLine.setAttribute('points', [
      {
        x: this._overlayStartHandler.attribute.x,
        y: this._overlayStartHandler.attribute.y
      },
      ...newOverlayMiddleHandlerPoints,
      {
        x: this._overlayEndHandler.attribute.x,
        y: this._overlayEndHandler.attribute.y
      }
    ]);
  };

  private _onAnchorHandlerDragEnd = (e: any) => {
    e.preventDefault();

    // 隐藏可吸附数据锚点
    this._getDataAnchors()?.hideAll();
    const model = this._model as MarkLine;
    const series = model.getRelativeSeries() as ICartesianSeries;
    const startDatum = (this._overlayStartHandler as unknown as any).data;
    const endDatum = (this._overlayEndHandler as unknown as any).data;
    const valueField = series.direction === 'horizontal' ? series.fieldX[0] : series.fieldY[0];
    const valueFieldInData = series.direction === 'horizontal' ? series.getSpec().xField : series.getSpec().yField;

    const startValue = this._getValueFromAnchorHandler(startDatum, valueField);
    const endValue = this._getValueFromAnchorHandler(endDatum, valueField);
    const labelText =
      startValue === 0 ? '<超过 0 的百分比>' : `${(((endValue - startValue) / startValue) * 100).toFixed(0)}%`;

    // 更新真正的 markLine 组件
    //  Important: 拖拽结束，恢复对应 markLine 的交互
    this._element.setAttributes({
      points: [
        [
          { x: this._overlayStartHandler.attribute.x, y: this._overlayStartHandler.attribute.y },
          {
            ...this._overlayMiddleHandler.attribute.points[0]
          }
        ],
        [...this._overlayMiddleHandler.attribute.points],
        [
          {
            ...this._overlayMiddleHandler.attribute.points[1]
          },
          { x: this._overlayEndHandler.attribute.x, y: this._overlayEndHandler.attribute.y }
        ]
      ],
      label: {
        text: labelText
      },
      pickable: true,
      childrenPickable: true
    });
    // 生成新的 markLine spec
    const newMarkLineSpec = merge({}, this._spec, {
      coordinates: [
        {
          ...startDatum.data,
          [valueFieldInData]: startValue
        },
        {
          ...endDatum.data,
          [valueFieldInData]: endValue
        }
      ],
      label: {
        text: labelText
      },
      // TODO: 这里需要考虑 connectDirection 方向
      expandDistance:
        series.direction === 'vertical'
          ? this._overlayMiddleHandler.attribute.points[0].x -
            Math.max(this._overlayStartHandler.attribute.x, this._overlayEndHandler.attribute.x)
          : this._overlayMiddleHandler.attribute.points[0].y -
            Math.max(this._overlayStartHandler.attribute.y, this._overlayEndHandler.attribute.y)
    });
    this._spec = newMarkLineSpec;

    this._currentEl.updateAttribute({
      markLine: {
        spec: newMarkLineSpec
      }
    });
    vglobal.removeEventListener('pointermove', this._onAnchorHandlerDrag);
    vglobal.removeEventListener('pointerup', this._onAnchorHandlerDragEnd);
  };

  private _getDataAnchors(): IGroup {
    if (this._dataAnchors) {
      this._dataAnchors.removeAllChild();
    } else {
      this._dataAnchors = createGroup({
        zIndex: 1,
        pickable: false,
        childrenPickable: false
      });
      this._editComponent.add(this._dataAnchors as unknown as IGraphic);
    }

    // 创建数据锚点
    const dataPoints = this._getAllDataPoints();
    dataPoints.forEach(dataPoint => {
      const anchor = createSymbol({
        x: dataPoint.x,
        y: dataPoint.y,
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
      anchor.data = dataPoint;
      this._dataAnchors.add(anchor);
    });

    return this._dataAnchors;
  }

  // 获取所有的数据锚点
  private _getAllDataPoints() {
    const model = this._model as MarkLine;
    const series = model.getRelativeSeries() as ICartesianSeries;
    const region = series.getRegion();
    const { x: regionStartX, y: regionStartY } = region.getLayoutStartPoint();
    const isHorizontal = series.direction === 'horizontal';

    if (series.type === 'bar') {
      const rectMark = series.getMarks().find((mark: any) => mark.type === 'rect');
      const vgrammarElements = rectMark.getProduct().elements;
      const dataPoints: DataPoint[] = [];
      if (isHorizontal) {
        vgrammarElements.forEach((element: any) => {
          const graphItem = element.getGraphicItem();
          dataPoints.push({
            x: graphItem.attribute.x + graphItem.attribute.width + regionStartX,
            y: graphItem.attribute.y + graphItem.attribute.height / 2 + regionStartY,
            data: array(element.data)[0],
            top: true
          });
          dataPoints.push({
            x: graphItem.attribute.x + regionStartX,
            y: graphItem.attribute.y + graphItem.attribute.height / 2 + regionStartY,
            data: array(element.data)[0]
          });
        });
      } else {
        vgrammarElements.forEach((element: any) => {
          const graphItem = element.getGraphicItem();
          dataPoints.push({
            x: graphItem.attribute.x + graphItem.attribute.width / 2 + regionStartX,
            y: graphItem.attribute.y + regionStartY,
            data: array(element.data)[0],
            top: true
          });
          dataPoints.push({
            x: graphItem.attribute.x + graphItem.attribute.width / 2 + regionStartX,
            y: graphItem.attribute.y + graphItem.attribute.height + regionStartY,
            data: array(element.data)[0]
          });
        });
      }
      return dataPoints;
    }

    if (series.type === 'area' || series.type === 'line') {
      const dataPoints: DataPoint[] = [];
      const seriesData = series.getRawData().latestData;

      seriesData.forEach((data: any) => {
        const position = series.dataToPosition(data);
        dataPoints.push({
          x: position.x + regionStartX,
          y: position.y + regionStartY,
          data,
          top: true
        });
      });

      if (isHorizontal) {
        const regionWidth = region.getLayoutRect().width;
        const bandScale = series.getYAxisHelper().getScale(0);
        const bandWidth = series.getYAxisHelper().getBandwidth(0) * 0.5;
        const ticks = bandScale.ticks();
        const xField = array(series.getSpec().xField)[0];
        const yField = array(series.getSpec().yField)[0];
        const min = series.getXAxisHelper().getScale(0).domain()[0];
        ticks.forEach(tick => {
          const y = bandScale.scale(tick) + bandWidth;
          dataPoints.push({
            x: regionStartX + regionWidth,
            y: y + regionStartY,
            data: {
              [xField]: min,
              [yField]: tick
            },
            top: true
          });
        });
      } else {
        const regionHeight = region.getLayoutRect().height;
        const bandScale = series.getXAxisHelper().getScale(0);
        const bandWidth = series.getXAxisHelper().getBandwidth(0) * 0.5;

        const ticks = bandScale.ticks();
        const xField = array(series.getSpec().xField)[0];
        const yField = array(series.getSpec().yField)[0];
        const min = series.getYAxisHelper().getScale(0).domain()[0];
        ticks.forEach(tick => {
          const x = bandScale.scale(tick) + bandWidth;
          dataPoints.push({
            x: x + regionStartX,
            y: regionStartY + regionHeight,
            data: {
              [xField]: tick,
              [yField]: min
            },
            top: true
          });
        });
      }
      return dataPoints;
    }
  }

  private _onMiddleHandlerDragStart = (e: PointerEvent) => {
    e.stopPropagation();

    vglobal.addEventListener('pointermove', this._onMiddleHandlerDrag);
    vglobal.addEventListener('pointerup', this._onMiddleHandlerDragEnd);
  };

  private _onMiddleHandlerDrag = (e: PointerEvent) => {
    e.stopPropagation();

    // Important: 拖拽过程中，关闭对应 markLine 的交互
    this._element.setAttributes({
      pickable: false,
      childrenPickable: false
    });

    const splitGroup = this._getSplitGroup();
    splitGroup.showAll();

    // 寻找最近的数据锚点，更新编辑图形
    // 转换为画布坐标
    const currentPoint = vglobal.mapToCanvasPoint(e);
    const closestPoint = findClosestPoint(currentPoint, this._splitPoints) as DataPoint;

    // 1. 更新 _overlayMiddleHandler
    this._overlayMiddleHandler.setAttribute('points', closestPoint.points);

    // 2. 更新 _overlayLine
    const series = this._model.getRelativeSeries();
    if (series.direction === 'horizontal') {
      this._overlayLine.setAttribute('points', [
        {
          x: this._overlayStartHandler.attribute.x,
          y: this._overlayStartHandler.attribute.y
        },
        closestPoint.points.find((point: Point) => point.x === this._overlayStartHandler.attribute.x),
        closestPoint.points.find((point: Point) => point.x === this._overlayEndHandler.attribute.x),
        {
          x: this._overlayEndHandler.attribute.x,
          y: this._overlayEndHandler.attribute.y
        }
      ]);
    } else {
      this._overlayLine.setAttribute('points', [
        {
          x: this._overlayStartHandler.attribute.x,
          y: this._overlayStartHandler.attribute.y
        },
        closestPoint.points.find((point: Point) => point.y === this._overlayStartHandler.attribute.y),
        closestPoint.points.find((point: Point) => point.y === this._overlayEndHandler.attribute.y),
        {
          x: this._overlayEndHandler.attribute.x,
          y: this._overlayEndHandler.attribute.y
        }
      ]);
    }
  };

  private _onMiddleHandlerDragEnd = (e: any) => {
    e.preventDefault();

    this._splitAnchors.hideAll();
    const model = this._model;
    const series = model.getRelativeSeries();
    // 更新真正的 markLine 组件
    //  Important: 拖拽结束，恢复对应 markLine 的交互
    let startPoint;
    let endPoint;
    if (series.direction === 'vertical') {
      startPoint = this._overlayMiddleHandler.attribute.points.find(
        point => point.y === this._overlayStartHandler.attribute.y
      );
      endPoint = this._overlayMiddleHandler.attribute.points.find(
        point => point.y === this._overlayEndHandler.attribute.y
      );
    } else {
      startPoint = this._overlayMiddleHandler.attribute.points.find(
        point => point.x === this._overlayStartHandler.attribute.x
      );
      endPoint = this._overlayMiddleHandler.attribute.points.find(
        point => point.x === this._overlayEndHandler.attribute.x
      );
    }

    this._element.setAttributes({
      points: [
        [{ x: this._overlayStartHandler.attribute.x, y: this._overlayStartHandler.attribute.y }, startPoint],
        [startPoint, endPoint],
        [endPoint, { x: this._overlayEndHandler.attribute.x, y: this._overlayEndHandler.attribute.y }]
      ],
      pickable: true,
      childrenPickable: true
    });
    // 生成新的 markLine spec
    const newMarkLineSpec = merge({}, this._spec, {
      // TODO: 这里需要考虑 connectDirection 方向
      expandDistance:
        series.direction === 'vertical'
          ? this._overlayMiddleHandler.attribute.points[0].x -
            Math.max(this._overlayStartHandler.attribute.x, this._overlayEndHandler.attribute.x)
          : this._overlayMiddleHandler.attribute.points[0].y -
            Math.max(this._overlayStartHandler.attribute.y, this._overlayEndHandler.attribute.y)
    });
    this._spec = newMarkLineSpec;
    this._currentEl.updateAttribute({
      markLine: {
        spec: newMarkLineSpec
      }
    });
    vglobal.removeEventListener('pointermove', this._onMiddleHandlerDrag);
    vglobal.removeEventListener('pointerup', this._onMiddleHandlerDragEnd);
  };

  private _getSplitGroup() {
    if (this._splitAnchors) {
      this._splitAnchors.removeAllChild();
    } else {
      const dataAnchorsGroup = createGroup({
        zIndex: 1,
        pickable: false,
        childrenPickable: false
      });
      this._splitAnchors = dataAnchorsGroup;
      this._editComponent.add(this._splitAnchors as unknown as IGraphic);
    }

    // 创建数据锚点
    const dataPoints = this._getAllSplitPoints();

    dataPoints.forEach(dataPoint => {
      const anchor = createLine({
        points: dataPoint.points,
        stroke: '#FFC528',
        lineWidth: 2,
        zIndex: 1
      });
      this._splitAnchors.add(anchor);
    });

    return this._splitAnchors;
  }

  // 获取维度轴上的锚点
  private _getAllSplitPoints() {
    const series = this._model.getRelativeSeries();
    const region = series.getRegion();
    const { x: regionStartX, y: regionStartY } = region.getLayoutStartPoint();

    if (series.type === 'bar') {
      const rectMark = series.getMarks().find((mark: any) => mark.type === 'rect');
      const vgrammarElements = rectMark.getProduct().elements;
      // TODO: 完善类型定义
      const splitPoints: any[] = [];
      if (series.direction === 'vertical') {
        const startY = this._overlayMiddleHandler.attribute.points[0].y;
        const endY = this._overlayMiddleHandler.attribute.points[1].y;

        vgrammarElements.forEach((element: any) => {
          const graphItem = element.getGraphicItem();
          splitPoints.push({
            x: graphItem.attribute.x + graphItem.attribute.width / 2 + regionStartX,
            y: (startY + endY) / 2,
            points: [
              {
                x: graphItem.attribute.x + graphItem.attribute.width / 2 + regionStartX,
                y: startY
              },
              {
                x: graphItem.attribute.x + graphItem.attribute.width / 2 + regionStartX,
                y: endY
              }
            ]
          });
        });

        // 还要计算第一层
        const bandScale = series.getXAxisHelper().getScale(0);
        const bandWidth = series.getXAxisHelper().getBandwidth(0);
        // @ts-ignore
        const ticks = bandScale.ticks();
        for (let i = 1; i < ticks.length; i++) {
          const pre = ticks[i - 1];
          const curr = ticks[i];
          splitPoints.push({
            x: (bandScale.scale(pre) + bandScale.scale(curr)) / 2 + regionStartX + bandWidth / 2,
            y: (startY + endY) / 2,
            points: [
              {
                x: (bandScale.scale(pre) + bandScale.scale(curr)) / 2 + regionStartX + bandWidth / 2,
                y: startY
              },
              {
                x: (bandScale.scale(pre) + bandScale.scale(curr)) / 2 + regionStartX + bandWidth / 2,
                y: endY
              }
            ]
          });
        }

        // 添加首尾
        if (this._overlayMiddleHandler.attribute.points[0].x < regionStartX) {
          splitPoints.push({
            x: this._overlayMiddleHandler.attribute.points[0].x,
            y: (startY + endY) / 2,
            points: [
              {
                x: this._overlayMiddleHandler.attribute.points[0].x,
                y: startY
              },
              {
                x: this._overlayMiddleHandler.attribute.points[0].x,
                y: endY
              }
            ]
          });
        } else {
          splitPoints.push({
            x: regionStartX,
            y: (startY + endY) / 2,
            points: [
              {
                x: regionStartX,
                y: startY
              },
              {
                x: regionStartX,
                y: endY
              }
            ]
          });
        }
        if (this._overlayMiddleHandler.attribute.points[0].x > regionStartX + region.getLayoutRect().width) {
          splitPoints.push({
            x: this._overlayMiddleHandler.attribute.points[0].x,
            y: (startY + endY) / 2,
            points: [
              {
                x: this._overlayMiddleHandler.attribute.points[0].x,
                y: startY
              },
              {
                x: this._overlayMiddleHandler.attribute.points[0].x,
                y: endY
              }
            ]
          });
        } else {
          splitPoints.push({
            x: regionStartX + region.getLayoutRect().width,
            y: (startY + endY) / 2,
            points: [
              {
                x: regionStartX + region.getLayoutRect().width,
                y: startY
              },
              {
                x: regionStartX + region.getLayoutRect().width,
                y: endY
              }
            ]
          });
        }
      } else {
        const startX = this._overlayMiddleHandler.attribute.points[0].x;
        const endX = this._overlayMiddleHandler.attribute.points[1].x;

        vgrammarElements.forEach((element: any) => {
          const graphItem = element.getGraphicItem();
          splitPoints.push({
            x: (startX + endX) / 2,
            y: graphItem.attribute.y + graphItem.attribute.height / 2 + regionStartY,
            points: [
              {
                y: graphItem.attribute.y + graphItem.attribute.height / 2 + regionStartY,
                x: startX
              },
              {
                y: graphItem.attribute.y + graphItem.attribute.height / 2 + regionStartY,
                x: endX
              }
            ]
          });
        });

        // 还要计算第一层
        const bandScale = series.getYAxisHelper().getScale(0);
        const bandwidth = series.getYAxisHelper().getBandwidth(0);
        // @ts-ignore
        const ticks = bandScale.ticks();
        for (let i = 1; i < ticks.length; i++) {
          const pre = ticks[i - 1];
          const curr = ticks[i];
          splitPoints.push({
            y: (bandScale.scale(pre) + bandScale.scale(curr)) / 2 + regionStartY + bandwidth / 2,
            x: (startX + endX) / 2,
            points: [
              {
                y: (bandScale.scale(pre) + bandScale.scale(curr)) / 2 + regionStartY + bandwidth / 2,
                x: startX
              },
              {
                y: (bandScale.scale(pre) + bandScale.scale(curr)) / 2 + regionStartY + bandwidth / 2,
                x: endX
              }
            ]
          });
        }

        // 添加首尾
        if (this._overlayMiddleHandler.attribute.points[0].y < regionStartY) {
          splitPoints.push({
            y: this._overlayMiddleHandler.attribute.points[0].y,
            x: (startX + endX) / 2,
            points: [
              {
                y: this._overlayMiddleHandler.attribute.points[0].y,
                x: startX
              },
              {
                y: this._overlayMiddleHandler.attribute.points[0].y,
                x: endX
              }
            ]
          });
        } else {
          splitPoints.push({
            y: regionStartY,
            x: (startX + endX) / 2,
            points: [
              {
                y: regionStartY,
                x: startX
              },
              {
                y: regionStartY,
                x: endX
              }
            ]
          });
        }
        if (this._overlayMiddleHandler.attribute.points[0].y > regionStartY + region.getLayoutRect().height) {
          splitPoints.push({
            y: this._overlayMiddleHandler.attribute.points[0].y,
            x: (startX + endX) / 2,
            points: [
              {
                y: this._overlayMiddleHandler.attribute.points[0].y,
                x: startX
              },
              {
                y: this._overlayMiddleHandler.attribute.points[0].y,
                x: endX
              }
            ]
          });
        } else {
          splitPoints.push({
            y: regionStartY + region.getLayoutRect().height,
            x: (startX + endX) / 2,
            points: [
              {
                y: regionStartY + region.getLayoutRect().height,
                x: startX
              },
              {
                y: regionStartY + region.getLayoutRect().height,
                x: endX
              }
            ]
          });
        }
      }
      this._splitPoints = splitPoints;

      return this._splitPoints;
    }

    // TODO: 代码整理
    if (series.type === 'area' || series.type === 'line') {
      const splitPoints: any[] = [];
      if (series.direction === 'vertical') {
        const startY = this._overlayMiddleHandler.attribute.points[0].y;
        const endY = this._overlayMiddleHandler.attribute.points[1].y;
        const bandScale = series.getXAxisHelper().getScale(0);
        const bandWidth = series.getXAxisHelper().getBandwidth(0) * 0.5;
        // @ts-ignore
        const ticks = bandScale.ticks();
        splitPoints.push({
          x: bandScale.scale(ticks[0]) + regionStartX + bandWidth,
          y: (startY + endY) / 2,
          points: [
            {
              x: bandScale.scale(ticks[0]) + regionStartX + bandWidth,
              y: startY
            },
            {
              x: bandScale.scale(ticks[0]) + regionStartX + bandWidth,
              y: endY
            }
          ]
        });
        for (let i = 1; i < ticks.length; i++) {
          splitPoints.push({
            x: bandScale.scale(ticks[i]) + regionStartX + bandWidth,
            y: (startY + endY) / 2,
            points: [
              {
                x: bandScale.scale(ticks[i]) + regionStartX + bandWidth,
                y: startY
              },
              {
                x: bandScale.scale(ticks[i]) + regionStartX + bandWidth,
                y: endY
              }
            ]
          });
          if (bandWidth > 10) {
            const pre = ticks[i - 1];
            const curr = ticks[i];
            splitPoints.push({
              x: (bandScale.scale(pre) + bandScale.scale(curr)) / 2 + regionStartX + bandWidth,
              y: (startY + endY) / 2,
              points: [
                {
                  x: (bandScale.scale(pre) + bandScale.scale(curr)) / 2 + regionStartX + bandWidth,
                  y: startY
                },
                {
                  x: (bandScale.scale(pre) + bandScale.scale(curr)) / 2 + regionStartX + bandWidth,
                  y: endY
                }
              ]
            });
          }
        }

        // 添加首尾
        if (this._overlayMiddleHandler.attribute.points[0].x < regionStartX) {
          splitPoints.push({
            x: this._overlayMiddleHandler.attribute.points[0].x,
            y: (startY + endY) / 2,
            points: [
              {
                x: this._overlayMiddleHandler.attribute.points[0].x,
                y: startY
              },
              {
                x: this._overlayMiddleHandler.attribute.points[0].x,
                y: endY
              }
            ]
          });
        } else {
          splitPoints.push({
            x: regionStartX,
            y: (startY + endY) / 2,
            points: [
              {
                x: regionStartX,
                y: startY
              },
              {
                x: regionStartX,
                y: endY
              }
            ]
          });
        }
        if (this._overlayMiddleHandler.attribute.points[0].x > regionStartX + region.getLayoutRect().width) {
          splitPoints.push({
            x: this._overlayMiddleHandler.attribute.points[0].x,
            y: (startY + endY) / 2,
            points: [
              {
                x: this._overlayMiddleHandler.attribute.points[0].x,
                y: startY
              },
              {
                x: this._overlayMiddleHandler.attribute.points[0].x,
                y: endY
              }
            ]
          });
        } else {
          splitPoints.push({
            x: regionStartX + region.getLayoutRect().width,
            y: (startY + endY) / 2,
            points: [
              {
                x: regionStartX + region.getLayoutRect().width,
                y: startY
              },
              {
                x: regionStartX + region.getLayoutRect().width,
                y: endY
              }
            ]
          });
        }
      } else {
        const startX = this._overlayMiddleHandler.attribute.points[0].x;
        const endX = this._overlayMiddleHandler.attribute.points[1].x;

        const bandScale = series.getYAxisHelper().getScale(0);
        const bandwidth = series.getYAxisHelper().getBandwidth(0) * 0.5;
        // @ts-ignore
        const ticks = bandScale.ticks();
        splitPoints.push({
          y: bandScale.scale(ticks[0]) + regionStartY + bandwidth,
          x: (startX + endX) / 2,
          points: [
            {
              y: bandScale.scale(ticks[0]) + regionStartY + bandwidth,
              x: startX
            },
            {
              y: bandScale.scale(ticks[0]) + regionStartY + bandwidth,
              x: endX
            }
          ]
        });

        for (let i = 1; i < ticks.length; i++) {
          const pre = ticks[i - 1];
          const curr = ticks[i];

          splitPoints.push({
            y: bandScale.scale(curr) + regionStartY + bandwidth,
            x: (startX + endX) / 2,
            points: [
              {
                y: bandScale.scale(curr) + regionStartY + bandwidth,
                x: startX
              },
              {
                y: bandScale.scale(curr) + regionStartY + bandwidth,
                x: endX
              }
            ]
          });
          if (bandwidth > 10) {
            splitPoints.push({
              y: (bandScale.scale(pre) + bandScale.scale(curr)) / 2 + regionStartY + bandwidth,
              x: (startX + endX) / 2,
              points: [
                {
                  y: (bandScale.scale(pre) + bandScale.scale(curr)) / 2 + regionStartY + bandwidth,
                  x: startX
                },
                {
                  y: (bandScale.scale(pre) + bandScale.scale(curr)) / 2 + regionStartY + bandwidth,
                  x: endX
                }
              ]
            });
          }
        }

        // 添加首尾
        if (this._overlayMiddleHandler.attribute.points[0].y < regionStartY) {
          splitPoints.push({
            y: this._overlayMiddleHandler.attribute.points[0].y,
            x: (startX + endX) / 2,
            points: [
              {
                y: this._overlayMiddleHandler.attribute.points[0].y,
                x: startX
              },
              {
                y: this._overlayMiddleHandler.attribute.points[0].y,
                x: endX
              }
            ]
          });
        } else {
          splitPoints.push({
            y: regionStartY,
            x: (startX + endX) / 2,
            points: [
              {
                y: regionStartY,
                x: startX
              },
              {
                y: regionStartY,
                x: endX
              }
            ]
          });
        }
        if (this._overlayMiddleHandler.attribute.points[0].y > regionStartY + region.getLayoutRect().height) {
          splitPoints.push({
            y: this._overlayMiddleHandler.attribute.points[0].y,
            x: (startX + endX) / 2,
            points: [
              {
                y: this._overlayMiddleHandler.attribute.points[0].y,
                x: startX
              },
              {
                y: this._overlayMiddleHandler.attribute.points[0].y,
                x: endX
              }
            ]
          });
        } else {
          splitPoints.push({
            y: regionStartY + region.getLayoutRect().height,
            x: (startX + endX) / 2,
            points: [
              {
                y: regionStartY + region.getLayoutRect().height,
                x: startX
              },
              {
                y: regionStartY + region.getLayoutRect().height,
                x: endX
              }
            ]
          });
        }
      }

      this._splitPoints = splitPoints;

      return this._splitPoints;
    }
  }

  private _getValueFromAnchorHandler(data: DataPoint, valueField: string) {
    const series = this._model.getRelativeSeries();
    if (series.getStack()) {
      return data.top ? data.data[valueField] : data.data[STACK_FIELD_START];
    }

    return data.top ? data.data[valueField] : 0;
  }
}
