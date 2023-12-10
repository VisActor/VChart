/**
 * @description 层级差异标注交互
 * 2. 双击出现编辑框
 */
import type { IGroup, ILine } from '@visactor/vrender-core';
import { type IGraphic, createGroup, vglobal, createLine, createSymbol } from '@visactor/vrender-core';
import type { IEditorElement } from '../../../../core/interface';
import { PointService, array, isValid, merge } from '@visactor/vutils';
import type { MarkLine as MarkLineComponent } from '@visactor/vrender-components';
import { Segment } from '@visactor/vrender-components';
import type { EventParams, MarkLine, IComponent } from '@visactor/vchart';
import { findClosestPoint } from '../../utils/math';
import type { DataPoint, Point } from '../types';
import { MarkerTypeEnum } from '../../interface';
import { BaseMarkerEditor } from './base';
import { SamePointApproximate, SameValueApproximate } from '../../../../utils/space';
import {
  STACK_FIELD_START_PERCENT,
  STACK_FIELD_END_PERCENT,
  STACK_FIELD_START,
  STACK_FIELD_END
} from '@visactor/vchart';

const START_LINK_HANDLER = 'overlay-hier-diff-mark-line-start-handler';
const MIDDLE_LINK_HANDLER = 'overlay-hier-diff-mark-line-middle-handler';
const END_LINK_HANDLER = 'overlay-hier-diff-mark-line-end-handler';

export class HierarchicalDiffLineEditor extends BaseMarkerEditor<MarkLine, MarkLineComponent> {
  readonly type = 'markLine';

  private _overlayLine: ILine;
  private _overlayStartHandler: IGraphic;
  private _overlayEndHandler: IGraphic;
  private _currentAnchorHandler: IGraphic;
  private _fixedAnchorHandler: IGraphic;
  private _overlayMiddleHandler: ILine;

  private _dataAnchors: IGroup;
  private _splitPoints: any[];
  private _splitAnchors: IGroup;
  private _spec: any;
  private _prePos: Point;

  protected _handlePointerUp(e: EventParams): void {
    super._handlePointerUp(e);
    this._editComponent.setAttribute('childrenPickable', true);
  }

  protected _getEnableMarkerTypes(): string[] {
    return [MarkerTypeEnum.hierarchyDiffLine];
  }

  protected _setCursor(e: EventParams): void {
    // no nothing
  }

  protected _handlePointerDown(e: EventParams): void {
    this._spec = this._model.getSpec();
    const el = this._getEditorElement(e);
    this.startEditor(el, e.event as PointerEvent);
  }

  protected _getOverGraphic(el: IEditorElement): IGraphic {
    const model = el.model;
    const markLine = (model as unknown as IComponent).getVRenderComponents()[0];
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

  protected _createEditorGraphic(el: IEditorElement, e: any): IGraphic {
    const editComponent = createGroup({
      pickable: false,
      childrenPickable: false
    });
    const model = el.model;
    const markLine = (model as unknown as IComponent).getVRenderComponents()[0];
    const lineShape = markLine.getLine();
    const points = lineShape.attribute.points;
    const startHandler = createSymbol({
      ...points[0][0],
      symbolType: 'circle',
      size: 10,
      fill: '#fff',
      stroke: '#3073F2',
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
      fill: '#fff',
      stroke: '#3073F2',
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

    const series = (model as unknown as MarkLine).getRelativeSeries();
    const middleHandler = createLine({
      points: points[1],
      zIndex: 2,
      lineDash: [0],
      lineWidth: 2,
      stroke: '#3073F2',
      pickStrokeBuffer: 16
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

    this._overlayStartHandler.addEventListener('pointerenter', () => this._onHandlerHover('move'));
    this._overlayEndHandler.addEventListener('pointerenter', () => this._onHandlerHover('move'));
    this._overlayMiddleHandler.addEventListener('pointerenter', () =>
      this._onHandlerHover(series.direction === 'horizontal' ? 'ns-resize' : 'ew-resize')
    );
    this._overlayStartHandler.addEventListener('pointerleave', this._onHandlerUnHover);
    this._overlayEndHandler.addEventListener('pointerleave', this._onHandlerUnHover);
    this._overlayMiddleHandler.addEventListener('pointerleave', this._onHandlerUnHover);

    return this._editComponent;
  }

  releaseLast() {
    super.releaseLast();
    this._dataAnchors = null;
    this._splitAnchors = null;
  }

  private _onAnchorHandlerDragStart = (e: PointerEvent) => {
    e.stopPropagation();
    const layerPos = this._layer.transformPosToLayer({ x: e.offsetX, y: e.offsetY });
    this._controller.editorRun('layout');
    this._prePos = layerPos;
    const model = this._chart.vchart.getChart().getComponentByUserId(this._modelId) as unknown as MarkLine;
    this._element = model.getVRenderComponents()[0] as unknown as MarkLineComponent;
    this._model = model;
    const handler = e.target as IGraphic;
    this._currentAnchorHandler = handler;
    this._fixedAnchorHandler =
      handler.name === START_LINK_HANDLER ? this._overlayEndHandler : this._overlayStartHandler;

    vglobal.addEventListener('pointermove', this._onAnchorHandlerDrag);
    vglobal.addEventListener('pointerup', this._onAnchorHandlerDragEnd);
  };

  private _onAnchorHandlerDrag = (e: PointerEvent) => {
    e.stopPropagation();

    this._chart.option.editorEvent.setCursor('move');

    // Important: 拖拽过程中，关闭对应 markLine 的交互
    this._silentAllMarkers();

    const dataAnchors = this._getDataAnchors();
    // 展示可吸附的数据锚点
    // 对于数据锚点，不允许拖拽至另一个固定的锚点
    const enableDataPoints: any[] = [];
    const unenableDataPoint = {
      x: this._fixedAnchorHandler.attribute.x,
      y: this._fixedAnchorHandler.attribute.y
    };
    dataAnchors.getChildren().forEach((child: any) => {
      if (SamePointApproximate(child.attribute, unenableDataPoint)) {
        child.setAttribute('visible', false);
        this._fixedAnchorHandler.data = child.data;
      } else {
        enableDataPoints.push(child.data);
        child.setAttribute('visible', true);
      }
    });

    // 寻找最近的数据锚点，更新编辑图形
    // 转换为画布坐标
    const currentPoint = this._layer.transformPosToLayer({ x: e.offsetX, y: e.offsetY });
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
    const series = this._getSeries();
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
    const layerPos = this._layer.transformPosToLayer({ x: e.offsetX, y: e.offsetY });

    vglobal.removeEventListener('pointermove', this._onAnchorHandlerDrag);
    vglobal.removeEventListener('pointerup', this._onAnchorHandlerDragEnd);

    this._chart.option.editorEvent.setCursorSyncToTriggerLayer();
    this._activeAllMarkers();
    // 隐藏可吸附数据锚点
    this._getDataAnchors()?.hideAll();

    if (PointService.distancePP(this._prePos, layerPos) <= 1) {
      this._controller.editorEnd();
      return;
    }

    const series = this._getSeries();
    const isPercent = series.getPercent();
    const startDatum = (this._overlayStartHandler as unknown as any).data;
    const endDatum = (this._overlayEndHandler as unknown as any).data;
    const valueField = series.direction === 'horizontal' ? series.fieldX[0] : series.fieldY[0];
    const valueFieldInData = series.direction === 'horizontal' ? series.getSpec().xField : series.getSpec().yField;
    const startValue = this._getValueFromAnchorHandler(startDatum, valueField);
    const endValue = this._getValueFromAnchorHandler(endDatum, valueField);
    const labelText = isPercent
      ? `${((endValue - startValue) * 100).toFixed(0)}%`
      : startValue === 0
      ? '<超过 0 的百分比>'
      : `${(((endValue - startValue) / startValue) * 100).toFixed(0)}%`;

    const region = series.getRegion();

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
      expandDistance:
        series.direction === 'vertical'
          ? `${
              ((this._overlayMiddleHandler.attribute.points[0].x -
                Math.max(this._overlayStartHandler.attribute.x, this._overlayEndHandler.attribute.x)) /
                region.getLayoutRect().width) *
              100
            }%`
          : `${
              ((Math.min(this._overlayStartHandler.attribute.y, this._overlayEndHandler.attribute.y) -
                this._overlayMiddleHandler.attribute.points[0].y) /
                region.getLayoutRect().height) *
              100
            }%`,
      _originValue_: [startValue, endValue]
    });
    this._spec = newMarkLineSpec;
    this._updateAndSave(newMarkLineSpec, 'markLine');
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

  // TODO: 代码优化
  // 获取所有的数据锚点
  private _getAllDataPoints() {
    const series = this._getSeries();
    const region = series.getRegion();
    const { x: regionStartX, y: regionStartY } = region.getLayoutStartPoint();
    const isHorizontal = series.direction === 'horizontal';

    if (series.type === 'bar') {
      const rectMark = series.getMarkInName('bar');
      const vgrammarElements = rectMark.getProduct().elements;
      const dataPoints: DataPoint[] = [];

      const isXInverse = series.getXAxisHelper().isInverse();
      const isYInverse = series.getYAxisHelper().isInverse();

      if (isHorizontal) {
        vgrammarElements.forEach((element: any) => {
          const graphItem = element.getGraphicItem();
          const elementData = array(element.data)[0];
          dataPoints.push({
            x: (isXInverse ? graphItem.attribute.x : graphItem.attribute.x + graphItem.attribute.width) + regionStartX,
            y: graphItem.attribute.y + graphItem.attribute.height / 2 + regionStartY,
            data: elementData,
            top: true
          });
          if (isValid(elementData[STACK_FIELD_START])) {
            if (elementData[STACK_FIELD_START] === 0) {
              dataPoints.push({
                x:
                  (isXInverse ? graphItem.attribute.x + graphItem.attribute.width : graphItem.attribute.x) +
                  regionStartX,
                y: graphItem.attribute.y + graphItem.attribute.height / 2 + regionStartY,
                data: elementData
              });
            }
          } else {
            dataPoints.push({
              x:
                (isXInverse ? graphItem.attribute.x + graphItem.attribute.width : graphItem.attribute.x) + regionStartX,
              y: graphItem.attribute.y + graphItem.attribute.height / 2 + regionStartY,
              data: elementData
            });
          }
        });
      } else {
        vgrammarElements.forEach((element: any) => {
          const graphItem = element.getGraphicItem();
          const elementData = array(element.data)[0];
          if (isValid(elementData[STACK_FIELD_START])) {
            dataPoints.push({
              x: graphItem.attribute.x + graphItem.attribute.width / 2 + regionStartX,
              y:
                (isYInverse ? graphItem.attribute.y + graphItem.attribute.height : graphItem.attribute.y) +
                regionStartY,
              data: elementData,
              top: true
            });
            if (elementData[STACK_FIELD_START] === 0) {
              dataPoints.push({
                x: graphItem.attribute.x + graphItem.attribute.width / 2 + regionStartX,
                y:
                  (isYInverse ? graphItem.attribute.y : graphItem.attribute.y + graphItem.attribute.height) +
                  regionStartY,
                data: elementData
              });
            }
          } else {
            dataPoints.push({
              x: graphItem.attribute.x + graphItem.attribute.width / 2 + regionStartX,
              y:
                (isYInverse ? graphItem.attribute.y + graphItem.attribute.height : graphItem.attribute.y) +
                regionStartY,
              data: elementData,
              top: true
            });
            dataPoints.push({
              x: graphItem.attribute.x + graphItem.attribute.width / 2 + regionStartX,
              y:
                (isYInverse ? graphItem.attribute.y : graphItem.attribute.y + graphItem.attribute.height) +
                regionStartY,
              data: elementData
            });
          }
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
        // @ts-ignore
        const ticks = bandScale.ticks();
        const xField = array(series.getSpec().xField)[0];
        const yField = array(series.getSpec().yField)[0];
        const min = series.getXAxisHelper().getScale(0).domain()[0];
        ticks.forEach((tick: any) => {
          const y = bandScale.scale(tick) + bandWidth;
          dataPoints.push({
            x: regionStartX + regionWidth,
            y: y + regionStartY,
            data: {
              [xField]: min,
              [yField]: tick
            }
          });
        });
      } else {
        const regionHeight = region.getLayoutRect().height;
        const bandScale = series.getXAxisHelper().getScale(0);
        const bandWidth = series.getXAxisHelper().getBandwidth(0) * 0.5;
        // @ts-ignore
        const ticks = bandScale.ticks();
        const xField = array(series.getSpec().xField)[0];
        const yField = array(series.getSpec().yField)[0];
        const min = series.getYAxisHelper().getScale(0).domain()[0];
        ticks.forEach((tick: any) => {
          const x = bandScale.scale(tick) + bandWidth;
          dataPoints.push({
            x: x + regionStartX,
            y: regionStartY + regionHeight,
            data: {
              [xField]: tick,
              [yField]: min
            }
          });
        });
      }
      return dataPoints;
    }

    return null;
  }

  private _onMiddleHandlerDragStart = (e: PointerEvent) => {
    e.stopPropagation();
    const layerPos = this._layer.transformPosToLayer({ x: e.offsetX, y: e.offsetY });
    this._controller.editorRun('layout');

    this._prePos = layerPos;

    const model = this._chart.vchart.getChart().getComponentByUserId(this._modelId) as unknown as MarkLine;
    this._element = model.getVRenderComponents()[0] as unknown as MarkLineComponent;
    this._model = model;
    vglobal.addEventListener('pointermove', this._onMiddleHandlerDrag);
    vglobal.addEventListener('pointerup', this._onMiddleHandlerDragEnd);
  };

  private _onMiddleHandlerDrag = (e: PointerEvent) => {
    e.stopPropagation();

    const series = this._getSeries();
    this._chart.option.editorEvent.setCursor(series.direction === 'horizontal' ? 'ns-resize' : 'ew-resize');

    // Important: 拖拽过程中，关闭对应 markLine 的交互
    this._silentAllMarkers();
    const splitGroup = this._getSplitGroup();
    splitGroup.showAll();

    // 寻找最近的数据锚点，更新编辑图形
    // 转换为画布坐标
    const currentPoint = this._layer.transformPosToLayer({ x: e.offsetX, y: e.offsetY });
    const closestPoint = findClosestPoint(currentPoint, this._splitPoints) as DataPoint;

    // 1. 更新 _overlayMiddleHandler
    this._overlayMiddleHandler.setAttribute('points', closestPoint.points);

    // 2. 更新 _overlayLine
    if (series.direction === 'horizontal') {
      this._overlayLine.setAttribute('points', [
        {
          x: this._overlayStartHandler.attribute.x,
          y: this._overlayStartHandler.attribute.y
        },
        closestPoint.points.find((point: Point) =>
          SameValueApproximate(point.x, this._overlayStartHandler.attribute.x)
        ),
        closestPoint.points.find((point: Point) => SameValueApproximate(point.x, this._overlayEndHandler.attribute.x)),
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
    const layerPos = this._layer.transformPosToLayer({ x: e.offsetX, y: e.offsetY });

    vglobal.removeEventListener('pointermove', this._onMiddleHandlerDrag);
    vglobal.removeEventListener('pointerup', this._onMiddleHandlerDragEnd);

    if (PointService.distancePP(this._prePos, layerPos) <= 1) {
      this._controller.editorEnd();
      return;
    }
    this._getSplitGroup().hideAll();
    this._activeAllMarkers();
    this._chart.option.editorEvent.setCursorSyncToTriggerLayer();

    const series = this._getSeries();
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
      startPoint = this._overlayMiddleHandler.attribute.points.find(point =>
        SameValueApproximate(point.x, this._overlayStartHandler.attribute.x)
      );
      endPoint = this._overlayMiddleHandler.attribute.points.find(point =>
        SameValueApproximate(point.x, this._overlayEndHandler.attribute.x)
      );
    }

    const region = series.getRegion();
    // 生成新的 markLine spec
    const newMarkLineSpec = merge({}, this._spec, {
      expandDistance:
        series.direction === 'vertical'
          ? `${
              ((this._overlayMiddleHandler.attribute.points[0].x -
                Math.max(this._overlayStartHandler.attribute.x, this._overlayEndHandler.attribute.x)) /
                region.getLayoutRect().width) *
              100
            }%`
          : `${
              ((Math.min(this._overlayStartHandler.attribute.y, this._overlayEndHandler.attribute.y) -
                this._overlayMiddleHandler.attribute.points[0].y) /
                region.getLayoutRect().height) *
              100
            }%`
    });
    this._spec = newMarkLineSpec;
    this._updateAndSave(newMarkLineSpec, 'markLine');
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

  // TODO: 代码优化
  // 获取维度轴上的锚点
  private _getAllSplitPoints() {
    const series = this._getSeries();
    const region = series.getRegion();
    const { x: regionStartX, y: regionStartY } = region.getLayoutStartPoint();

    if (series.type === 'bar') {
      const rectMark = series.getMarkInName('bar');
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

    return null;
  }

  private _getValueFromAnchorHandler(data: DataPoint, valueField: string) {
    const series = this._getSeries();
    const isPercent = series.getPercent();
    if (series.getStack()) {
      if (isPercent) {
        return data?.top ? data.data?.[STACK_FIELD_END_PERCENT] : data?.data?.[STACK_FIELD_START_PERCENT] ?? 0;
      }
      return data?.top ? data?.data?.[STACK_FIELD_END] : data?.data?.[STACK_FIELD_START] ?? 0;
    }

    return data?.top ? data?.data?.[valueField] : 0;
  }

  private _onHandlerHover(cursor: string) {
    this._chart.option.editorEvent.setCursor(cursor);
  }

  private _onHandlerUnHover = () => {
    this._chart.option.editorEvent.setCursorSyncToTriggerLayer();
  };
}
